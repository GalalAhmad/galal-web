const fs = require('fs');
const crypto = require('crypto');

let secret = process.env.SESSION_SECRET;
if (!secret && fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('SESSION_SECRET=')) {
      secret = trimmed.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

if (!secret) {
  console.error('Missing SESSION_SECRET');
  process.exit(1);
}

function makeToken(user) {
  const payload = {
    v: 1,
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

const tokens = {
  counselor: makeToken({ id: 'counselor-galal', name: 'د. جلال أحمد', role: 'counselor', email: 'counselor@galalahmad.com' }),
  admin: makeToken({ id: 'admin-platform', name: 'مدير المنصة', role: 'admin', email: 'admin@galalahmad.com' }),
  clientA: makeToken({ id: 'client-test-01', name: 'المستفيد أ', role: 'client', phone: '01000000001', email: 'client-a@test.local' }),
  clientB: makeToken({ id: 'client-test-02', name: 'المستفيد ب', role: 'client', phone: '01000000002', email: 'client-b@test.local' }),
};

fs.writeFileSync('scripts/generated_tokens.json', JSON.stringify(tokens, null, 2), 'utf8');
console.log('Generated test tokens successfully:');
console.log(Object.keys(tokens));
