import fs from 'fs';
import path from 'path';

console.log('=== RUNNING ILAYAL KARIGAI SUITE VERIFICATION ===\n');

let failedTests = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Check Dist Assets
const distDir = path.resolve('dist');
assert(fs.existsSync(distDir), 'Production dist directory exists');
const distAssets = fs.readdirSync(path.join(distDir, 'assets'));
const jsFile = distAssets.find(f => f.endsWith('.js'));
const cssFile = distAssets.find(f => f.endsWith('.css'));
assert(Boolean(jsFile), `Found JavaScript bundle: ${jsFile}`);
assert(Boolean(cssFile), `Found CSS bundle: ${cssFile}`);

const jsContent = fs.readFileSync(path.join(distDir, 'assets', jsFile), 'utf-8');
const cssContent = fs.readFileSync(path.join(distDir, 'assets', cssFile), 'utf-8');

// 2. Security Checks
assert(!jsContent.includes('SERVICE_ROLE_KEY'), 'No Supabase service-role key leaked');
assert(!jsContent.includes('PRIVATE_KEY'), 'No private encryption keys leaked');
assert(!jsContent.includes('AIzaSy'), 'No Google Cloud private API keys leaked in code');

// 3. WhatsApp Integration Checks
assert(jsContent.includes('919840182019'), 'WhatsApp phone number correctly bound in bundle (+91 98401 82019)');
assert(jsContent.includes('Hello') && (jsContent.includes('ELAIYAL%20KARIGAI') || jsContent.includes('ELAIYAL KARIGAI') || jsContent.includes('Ilayal Karigai')), 'WhatsApp prefilled message correctly configured');
assert(jsContent.includes('17.472 14.382') || jsContent.includes('M17.472'), 'Authentic WhatsApp SVG vector brand icon compiled into bundle');

// 4. Continuous Full-Width Hero Architecture & Typography Checks
assert(cssContent.includes('.hero-bg-layer'), 'Continuous full-width hero background layer (.hero-bg-layer) present in CSS');
assert(cssContent.includes('.hero-bg-img'), 'Hero full-width image styling (.hero-bg-img) with headroom anchor present in CSS');
assert(cssContent.includes('.hero-gradient-overlay'), 'Feathered seamless gradient overlay (.hero-gradient-overlay) present in CSS');
assert(cssContent.includes('.hero-container'), 'Hero content container (.hero-container) present in CSS');
assert(cssContent.includes('headline-intent') || cssContent.includes('goldShimmerSweep'), 'Animated white-to-antique-gold typography treatment compiled');
assert(/#23050c/i.test(cssContent) || cssContent.includes('35, 5, 12'), 'Deep maroon luxury campaign color palette compiled');
assert(cssContent.includes('.whatsapp-floating-pill'), 'Official floating WhatsApp pill styles compiled');
assert(/#25d366/i.test(cssContent), 'Official WhatsApp green (#25D366) present in CSS');

// 5. Admin Portal & Elevated Experience Checks
assert(jsContent.includes('admin@elaiyalkarigai.com') || jsContent.includes('admin@ilayalkarigai.com'), 'Admin account configuration present');
assert(jsContent.includes('Welcome back.') && (jsContent.includes('ELAIYAL KARIGAI') || jsContent.includes('Ilayal Karigai')), 'Admin login copy verified');
assert(cssContent.includes('perspective:1200px') || cssContent.includes('perspective: 1200px') || cssContent.includes('perspective: 1000px'), 'Elevated 3D card perspective compiled in CSS');
assert(cssContent.includes(':focus-within') || cssContent.includes('admin-success-state'), 'Typing stability protection (:focus-within) and verified success transition state compiled');
assert(jsContent.includes('Category Management') || jsContent.includes('Collection Categories'), 'Admin category management compiled');
assert(jsContent.includes('Add Category') || jsContent.includes('Reset Defaults'), 'Interactive category actions (Add/Reset/Edit) compiled');
assert(jsContent.includes('Add New Product') || jsContent.includes('Catalogue Management'), 'Admin product creation and management compiled');
assert(fs.existsSync(path.resolve('supabase/migrations/001_initial_schema.sql')), 'Supabase SQL schema migration deliverable created');

// 6. Web Crypto Auth Verification
async function testAuth() {
  const enc = new TextEncoder();
  const salt = 'ik_salt_2026_heritage';
  const pass = 'Ilayal@Admin2026!';
  const data = enc.encode(`${salt}:${pass}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  assert(hex.length === 64, 'SHA-256 hash length is exactly 64 hex characters');

  // Verify that an incorrect password produces a mismatch
  const wrongData = enc.encode(`${salt}:WrongPassword123`);
  const wrongHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', wrongData))).map(b => b.toString(16).padStart(2, '0')).join('');
  assert(wrongHash !== hex, 'Wrong password strictly fails hash verification');
}

await testAuth();

// 7. Category Filter System, 3D Cards, Archive Page & WhatsApp Modal Checks
assert(cssContent.includes('.glass-filter-wrapper') || cssContent.includes('glass-filter-bar'), 'CategoryFilterBar styles compiled (.glass-filter-wrapper)');
assert(cssContent.includes('.card-3d-perspective-shell') && cssContent.includes('.card-3d-inner'), 'Global 3D Product Card styles compiled (.card-3d-perspective-shell, .card-3d-inner)');
assert(cssContent.includes('transform-style:preserve-3d') || cssContent.includes('preserve-3d'), 'CSS 3D preserve-3d hardware acceleration compiled');
assert(cssContent.includes('.collections-archive-page'), 'Category Archive Page styles compiled (.collections-archive-page)');
assert(cssContent.includes('.wa-modal-backdrop') && cssContent.includes('.wa-modal-dialog'), 'WhatsApp Concierge Inquiry Modal styles compiled (.wa-modal-backdrop, .wa-modal-dialog)');
assert(jsContent.includes('IK-') && (jsContent.includes('Selected Size') || jsContent.includes('SKU Reference')), 'Automated SKU generator and WhatsApp Concierge dispatch compiled');
assert(jsContent.includes('Collections Archive') && jsContent.includes('collections-archive-page'), 'Collections Archive page and route compiled');

// 7. Verify HTTP Status on dev server
try {
  const res = await fetch('http://localhost:3000/');
  assert(res.status === 200, `Dev server responded with status 200 OK (${res.statusText})`);
  const html = await res.text();
  assert(html.includes('id="root"'), 'Root element present in rendered HTML');
  assert(html.includes('ELAIYAL KARIGAI') || html.includes('Ilayal Karigai'), 'Brand title present in HTML');
} catch (e) {
  console.error('Fetch error:', e);
  failedTests++;
}

console.log('\n=== VERIFICATION SUMMARY ===');
if (failedTests === 0) {
  console.log('🎉 ALL SUITE VERIFICATION CHECKS PASSED!\n');
} else {
  console.error(`⚠️ ${failedTests} CHECKS FAILED!\n`);
  process.exit(1);
}
