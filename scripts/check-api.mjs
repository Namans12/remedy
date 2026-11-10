// Local, non-transactional checks. The server must already be running.
const base = 'http://127.0.0.1:3000';
const headers = {Origin: base, 'Content-Type': 'application/json'};
const cases = [
  ['unknown capture', '/api/capture', JSON.stringify({orderId: 'nonexistent'}), 400],
  ['unapproved refund', '/api/refund', JSON.stringify({orderId: 'nonexistent', approved: false}), 400],
  ['malformed JSON', '/api/analyze', '{', 400],
  ['oversized JSON', '/api/analyze', JSON.stringify({message: 'x'.repeat(21000)}), 413],
];
let failed = false;
for (const [name, path, body, expected] of cases) {
  try {
    const response = await fetch(base + path, {method: 'POST', headers, body});
    const ok = response.status === expected;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: expected ${expected}, got ${response.status}`);
    if (!ok) failed = true;
  } catch (error) {
    console.error(`FAIL ${name}: ${error.message}`);
    failed = true;
  }
}
try {
  const response = await fetch(base + '/api/refund', {
    method: 'POST',
    headers: {...headers, Origin: 'https://untrusted.example'},
    body: JSON.stringify({orderId: 'nonexistent', approved: false}),
  });
  const ok = response.status === 403;
  console.log(`${ok ? 'PASS' : 'FAIL'} cross-origin refund: expected 403, got ${response.status}`);
  if (!ok) failed = true;
} catch (error) {
  console.error(`FAIL cross-origin refund: ${error.message}`);
  failed = true;
}
if (failed) process.exitCode = 1;
