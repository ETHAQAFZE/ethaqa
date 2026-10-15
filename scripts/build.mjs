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
import { rmSync, mkdirSync, cpSync, existsSync, writeFileSync } from 'node:fs';

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
// 2b. Generate root sitemap.xml (if not present as static file)
// ------------------------------------------------------------

if (!existsSync('dist/sitemap.xml')) {
  log('▸ Generating root sitemap.xml');

  const siteUrl = 'https://ethaqa.com';
  const today = new Date().toISOString().split('T')[0];

  const corporatePages = [
    { loc: '/',              priority: '1.0', changefreq: 'weekly'  },
    { loc: '/privacy.html',  priority: '0.3', changefreq: 'yearly'  },
    { loc: '/terms.html',    priority: '0.3', changefreq: 'yearly'  },
    { loc: '/cookies.html',  priority: '0.3', changefreq: 'yearly'  },
    { loc: '/copyright.html',priority: '0.3', changefreq: 'yearly'  },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corporatePages.map(p => `  <url>
    <loc>${siteUrl}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  writeFileSync('dist/sitemap.xml', xml, 'utf8');
  log('  ✓ dist/sitemap.xml (generated)');
  log('');
}
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
// Guard: ensure no source files leaked into the deployed output
for (const banned of [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'astro.config.mjs',
  '.env',
]) {
  if (existsSync(`dist/publishing/${banned}`)) {
    fail(`Source file leaked into output: ${banned}`);
  }
}

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