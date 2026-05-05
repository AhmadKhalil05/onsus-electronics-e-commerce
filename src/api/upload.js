import { API_ROUTES } from "@/config/api";
import { apiRequest } from "./http";

function tryParseJson(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function unwrapApiBody(data) {
  const first = tryParseJson(data);
  if (first && typeof first === "object" && !Array.isArray(first)) {
    const rec = /** @type {Record<string, unknown>} */ (first);
    if ("body" in rec) {
      return tryParseJson(rec.body);
    }
  }
  return first;
}

function normalizeUploadResponse(data) {
  const unwrapped = unwrapApiBody(data);
  if (!unwrapped || typeof unwrapped !== "object" || Array.isArray(unwrapped)) {
    return { uploadUrl: "", fileUrl: "" };
  }

  const o = /** @type {Record<string, unknown>} */ (unwrapped);
  const uploadUrl =
    o.uploadUrl ??
    o.uploadURL ??
    o.presignedUrl ??
    o.presignedURL ??
    o.url ??
    "";
  const fileUrl = o.fileUrl ?? o.fileURL ?? o.publicUrl ?? o.publicURL ?? "";

  return {
    uploadUrl: String(uploadUrl || ""),
    fileUrl: String(fileUrl || ""),
  };
}

/**
 * Requests a presigned S3 upload URL and the public file URL.
 * @param {{ idToken?: string, contentType?: string, fileName?: string }} [options]
 * @returns {Promise<{ uploadUrl: string, fileUrl: string }>}
 */
export async function getUploadUrl(options = {}) {
  const { idToken, contentType, fileName } = options;
  const params = {};
  if (contentType) params.contentType = contentType;
  if (fileName) params.fileName = fileName;
  const data = await apiRequest("get", API_ROUTES.upload, {
    idToken,
    params,
  });
  return normalizeUploadResponse(data);
}

/**
 * Uploads a file directly to S3 using a presigned URL.
 * @param {string} uploadUrl
 * @param {File} file
 */
export async function uploadFileToPresignedUrl(uploadUrl, file) {
  const first = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });
  if (first.ok) return;

  const firstBody = await first.text();
  const isSignatureMismatch =
    first.status === 403 && /SignatureDoesNotMatch/i.test(firstBody);
  if (!isSignatureMismatch) {
    throw new Error(firstBody || `Upload failed with status ${first.status}`);
  }

  // Retry once without Content-Type. fetch will not auto-inject
  // application/x-www-form-urlencoded for File/Blob payloads.
  const second = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });
  if (!second.ok) {
    const secondBody = await second.text();
    throw new Error(secondBody || `Upload failed with status ${second.status}`);
  }
}
