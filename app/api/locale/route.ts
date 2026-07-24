import { NextRequest, NextResponse } from "next/server";

const countryLocales: Record<string, string> = {
  AD: "es", AR: "es", BO: "es", CL: "es", CO: "es", CR: "es", CU: "es", DO: "es", EC: "es", ES: "es", GQ: "es", GT: "es", HN: "es", MX: "es", NI: "es", PA: "es", PE: "es", PR: "es", PY: "es", SV: "es", UY: "es", VE: "es",
  BR: "pt-BR",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr",
  DE: "de", AT: "de", LI: "de", CH: "de",
  CN: "zh-CN", SG: "zh-CN",
  TW: "zh-TW", HK: "zh-TW", MO: "zh-TW",
  JP: "ja",
  KR: "ko",
  ID: "id",
  IN: "hi",
};

export function GET(request: NextRequest) {
  const country = (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    ""
  ).toUpperCase();

  return NextResponse.json({
    country: country || null,
    locale: countryLocales[country] || null,
  }, {
    headers: {
      "Cache-Control": "private, max-age=3600",
    },
  });
}
