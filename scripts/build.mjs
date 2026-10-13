// ============================================================
// Ethaqa Platform — Build Script
// Document ID: ETH-PLAT-001
// Version: 1.0.0
//
// Builds the deployable site into dist/.
// Runs identically on Windows (local dev) and Linux (Cloudflare).
//
// Contents:
//   1. Corporate static files (allowlist)
//   2. Publishing Astro build output
//
// Anything not on the allowlist is never deployed.
// ============================================================

import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';

// ------------------------------------------------------------
// Config
// ------------------------------------------------------------

// Files that MUST exist. Build fails if any are missing.
const REQUIRED = [
  'index.html',
  'assets',
];

// Files that are copied if present. Build succeeds if missing.
const OPTIONAL = [
  'privacy.html',
  'terms.html',
  'cookies.html',
  'copyright.html',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  '_redirects',
  '404.html',
  'favicon.ico',
];

// Publishing build paths
const PUBLISHING_SRC = 'publishing-src';
const PUBLISHING_OUTPUT = 'publishing-src/dist';
const PUBLISHING_DEPLOY = 'dist/publishing';

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function run(cmd, cwd = '.') {
  console.log(`→ ${cwd === '.' ? '' : cwd + ': '}${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function log(msg) {
  console.log(msg);
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// ------------------------------------------------------------
// 1. Clean dist/
// ------------------------------------------------------------

log('');
log('============================================================');
log('  Ethaqa Platform Build');
log('============================================================');
log('');

log('▸ Cleaning dist/');
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
log('  ✓ dist/ is empty');
log('');

// ------------------------------------------------------------
// 2. Copy corporate files
// ------------------------------------------------------------

log('▸ Copying corporate files');

for (const item of REQUIRED) {
  if (!existsSync(item)) {
    fail(`Missing required file: ${item}`);
  }
  cpSync(item, `dist/${item}`, { recursive: true });
  log(`  ✓ ${item} (required)`);
}

for (const item of OPTIONAL) {
  if (existsSync(item)) {
    cpSync(item, `dist/${item}`, { recursive: true });
    log(`  ✓ ${item}`);
  } else {
    log(`  · ${item} (not present, skipping)`);
  }
}

log('');

// ------------------------------------------------------------
// 3. Build Publishing
// ------------------------------------------------------------

log('▸ Building Publishing');

if (!existsSync(PUBLISHING_SRC)) {
  fail(`Publishing source not found: ${PUBLISHING_SRC}`);
}

run('npm ci', PUBLISHING_SRC);
run('npm run build', PUBLISHING_SRC);

if (!existsSync(PUBLISHING_OUTPUT)) {
  fail(`Publishing build output missing: ${PUBLISHING_OUTPUT}`);
}

log('');
log('▸ Copying Publishing output to dist/publishing');

cpSync(PUBLISHING_OUTPUT, PUBLISHING_DEPLOY, { recursive: true });

if (!existsSync(`${PUBLISHING_DEPLOY}/index.html`)) {
  fail('Publishing homepage not found in build output');
}

log('  ✓ dist/publishing/ contains the built site');
log('');

// ------------------------------------------------------------
// 4. Summary
// ------------------------------------------------------------

log('============================================================');
log('  Build complete');
log('============================================================');
log('');
log('  dist/ is ready for deployment');
log('');
log('  Test locally:');
log('    npx serve dist');
log('    Open the URL shown, then visit / and /publishing/');
log('');