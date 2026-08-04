import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { PublicRateLimitError, publicNetworkKey, takePublicRateLimit } from "@/lib/server/public-rate-limit";
import { supabaseInsert, uploadPrivateObject } from "@/lib/server/supabase";

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const publicSlug = String(form.get("publicSlug") ?? "").trim();
    const category = String(form.get("category") ?? "CV or résumé").trim();
    const idempotencyKey = String(form.get("idempotencyKey") ?? "").trim();
    await takePublicRateLimit({ scope: "careers-file-upload-network", key: publicNetworkKey(request), windowSeconds: 3600, maxRequests: 20, blockSeconds: 3600 });
    if (!(file instanceof File) || !publicSlug || !idempotencyKey) {
      return NextResponse.json({ error: "File, role and application reference are required." }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Use PDF, DOC, DOCX, TXT, PNG, JPEG or WebP." }, { status: 400 });
    if (file.size <= 0 || file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "Files must be smaller than 15 MB." }, { status: 400 });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
    const objectPath = `${publicSlug}/${idempotencyKey}/${randomUUID()}-${safeName}`;
    const bucket = process.env.RECRUITMENT_STORAGE_BUCKET ?? "recruitment-candidate-files";
    await uploadPrivateObject({ bucket, path: objectPath, file });
    const fileReference = `candidate-file:${randomUUID()}`;
    await supabaseInsert("candidate_uploads", {
      upload_reference: fileReference,
      idempotency_key: idempotencyKey,
      public_slug: publicSlug,
      storage_bucket: bucket,
      storage_object_path: objectPath,
      file_name: safeName,
      file_category: category,
      mime_type: file.type,
      size_bytes: file.size,
      scan_state: "Pending",
      access_classification: "Recruitment Restricted",
      uploaded_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, fileReference, fileName: safeName, scanState: "Pending" }, { status: 201 });
  } catch (error) {
    if (error instanceof PublicRateLimitError) return NextResponse.json({ error: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    return NextResponse.json({ error: error instanceof Error ? error.message : "The file could not be uploaded." }, { status: 503 });
  }
}
