import 'server-only';

export class RequestInputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// Bound the stream itself: Content-Length can be absent or inaccurate.
export async function readJsonObject(req: Request): Promise<Record<string, unknown>> {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers.get('content-type') ?? '')) {
    throw new RequestInputError('Send a JSON request.', 415);
  }
  const body = await readUtf8Body(req, 20_000);
  let value: unknown;
  try { value = JSON.parse(body); }
  catch { throw new RequestInputError('Request must contain valid JSON.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new RequestInputError('Request must be a JSON object.');
  }
  return value as Record<string, unknown>;
}

export async function readUtf8Body(req: Request, maxBytes: number): Promise<string> {
  if (Number(req.headers.get('content-length')) > maxBytes) {
    throw new RequestInputError('Request is too large.', 413);
  }
  if (!req.body) throw new RequestInputError('Request body is required.');
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new RequestInputError('Request is too large.', 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return new TextDecoder('utf-8', {fatal: true}).decode(bytes); }
  catch { throw new RequestInputError('Request body must be valid UTF-8.'); }
}
