const fs = require('fs');
const path = require('path');

// Files removed from the production About site during the v5 cleanup.
// This prebuild guard exists because copying a ZIP over an existing Git checkout
// overwrites changed files but cannot delete legacy files that no longer exist
// in the release archive. Removing them here keeps Vercel builds aligned with
// the current production source tree.
const legacyPaths = [
  'lib/content/previewNews.ts',
  'lib/content/careers.ts',
  'lib/integrations.ts',
  'components/FAQ.tsx',
  'app/accessibility/page.tsx',
  'app/legal/[document]/page.tsx',
  'app/trust-safety/page.tsx',
  'public/hero-discover-preview.png',
  'public/hero-studio-preview.png',
  '20260804_006_support_submission_pipeline_fix.sql',
  '20260804_007_support_ticket_creation_runtime_fix.sql',
  '20260804_008_enterprise_support_operations_and_resend.sql',
  '20260808_025_support_workspace_security_realtime.sql',
  '20260822_010_newsletter_subscriptions.sql',
  '20260822_011_newsletter_confirmation_unsubscribe.sql',
  'AUG22-HEADER-TRANSLATOR-BUTTON-FIX.md',
  'AUG22-QA-FOLLOWUP-V4.md',
  'AUG22-QA-WEBSITE-FIX.md',
  'ENTERPRISE-SUPPORT-SETUP.md',
  'POLICIES-DOCUMENTATION-UPDATE.md',
  'SUPABASE-INTEGRATION.md',
  'SUPABASE-POSTGREST-REFRESH.sql',
  'SUPPORT-025-DEPLOYMENT-GUIDE.md',
  'SUPPORT-025.2-UX-FIX.md',
  'SUPPORT-025.3-UI-CORRECTION.md',
  'SUPPORT-COMBINED-TICKET-EMAIL-UPDATE.md',
  'SUPPORT-ENTERPRISE-UPDATE.md',
  'SUPPORT-SUBMISSION-PIPELINE-FIX.md',
  'SUPPORT-TICKET-CREATION-RUNTIME-FIX.md',
  'SUPPORT-TICKET-VERIFICATION-AND-CEO-ACCESS-FIX.md',
  'SUPPORT-UPDATE-NOTES.md',
  'UPDATE-NOTES.md',
  'VERCEL-SUPPORT-CONNECTION.md',
  'VERCEL-TICKET-TYPE-FIX.md',
  'VERCEL-TYPE-FIX-V2.md',
  'supabase.sql',
];

const root = path.resolve(__dirname, '..');
let removed = 0;

for (const relativePath of legacyPaths) {
  const target = path.resolve(root, relativePath);
  if (!target.startsWith(root + path.sep)) {
    throw new Error(`Refusing to remove path outside project: ${relativePath}`);
  }
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    removed += 1;
    console.log(`[prebuild cleanup] removed legacy file: ${relativePath}`);
  }
}

console.log(`[prebuild cleanup] complete (${removed} legacy file${removed === 1 ? '' : 's'} removed)`);
