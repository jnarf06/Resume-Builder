import type { Resume } from "./types";
import { uid } from "./types";
import { migrate } from "./storage";

/**
 * Share a resume as a link, without a server.
 *
 * The payload rides in the URL *fragment* (`#r=…`). Fragments are never sent
 * in an HTTP request — not to the host, not to a CDN, not into server logs —
 * so a shared link keeps the same privacy promise as the rest of the app: the
 * data only ever exists in the browsers of the people holding the link.
 *
 * Format: a one-character version/codec marker, then base64url.
 *   "1" raw JSON            (fallback where CompressionStream is missing)
 *   "2" deflate-raw JSON    (everything current)
 */

const RAW = "1";
const DEFLATED = "2";

/* ---------------------------------------------------------------- base64url */

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  // Chunked so a large resume does not blow the argument limit on apply().
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

/* -------------------------------------------------------------- compression */

async function pump(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const blob = new Blob([bytes as BlobPart]);
  const piped = blob.stream().pipeThrough(stream as ReadableWritablePair<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(piped).arrayBuffer());
}

const canCompress = () => typeof CompressionStream !== "undefined";

/* -------------------------------------------------------------------- api   */

/**
 * A photo is a base64 data URL — typically 100–400KB, which is far past what a
 * URL can carry. Shared links always drop it; the recipient adds their own.
 */
export function stripForSharing(r: Resume): Resume {
  return { ...r, basics: { ...r.basics, photo: "" } };
}

export async function encodeResume(r: Resume): Promise<string> {
  const json = JSON.stringify(stripForSharing(r));
  const bytes = new TextEncoder().encode(json);
  if (!canCompress()) return RAW + bytesToBase64Url(bytes);
  const packed = await pump(bytes, new CompressionStream("deflate-raw"));
  return DEFLATED + bytesToBase64Url(packed);
}

export async function decodeResume(payload: string): Promise<Resume> {
  const codec = payload[0];
  const body = base64UrlToBytes(payload.slice(1));
  const bytes = codec === DEFLATED ? await pump(body, new DecompressionStream("deflate-raw")) : body;
  const data = JSON.parse(new TextDecoder().decode(bytes)) as Resume;
  if (!data || typeof data !== "object" || !data.basics) throw new Error("Not a resume link");
  // A shared resume becomes a new document in the recipient's library, and
  // may have been made by an older version of the app.
  return migrate({ ...data, id: uid(), updatedAt: Date.now() });
}

export async function buildShareLink(r: Resume): Promise<string> {
  const payload = await encodeResume(r);
  return `${window.location.origin}/editor#r=${payload}`;
}

/** Reads and clears a `#r=` payload, so a refresh does not re-import. */
export function takeSharePayload(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#r=(.+)$/);
  if (!match) return null;
  history.replaceState(null, "", window.location.pathname + window.location.search);
  return match[1];
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
