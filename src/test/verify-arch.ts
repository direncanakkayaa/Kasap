import fs from 'fs';
import path from 'path';

function checkFile(filePath: string) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${path.basename(filePath)}`);
  return exists;
}

console.log('--- Frontend Architecture Verification ---');

const filesToVerify = [
  'package.json',
  '.prettierrc',
  'sentry.client.config.ts',
  'sentry.server.config.ts',
  'sentry.edge.config.ts',
  'vitest.config.ts',
  'playwright.config.ts',
  'src/components/providers/QueryProvider.tsx',
  'src/app/layout.tsx'
];

let allPassed = true;
filesToVerify.forEach(f => {
  if (!checkFile(path.join(process.cwd(), f))) allPassed = false;
});

// Check layout content for providers
const layoutContent = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
const hasQuery = layoutContent.includes('QueryProvider');
const hasAuth = layoutContent.includes('AuthProvider');

console.log(`${hasQuery ? '✅' : '❌'} QueryProvider in layout.tsx`);
console.log(`${hasAuth ? '✅' : '❌'} AuthProvider in layout.tsx`);

if (allPassed && hasQuery && hasAuth) {
  console.log('\nMimari güçlendirme başarıyla tamamlandı.');
  process.exit(0);
} else {
  console.log('\nBazı dosyalar eksik veya hatalı yapılandırılmış.');
  process.exit(1);
}
