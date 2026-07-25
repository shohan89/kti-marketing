/** Shared limits and validation for user-supplied file uploads. */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_CV_BYTES = 5 * 1024 * 1024     // 5 MB

/** Media Library uploads: images, plus video for service overview clips. */
const MEDIA_TYPES: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
  'image/avif': ['avif'],
  'image/svg+xml': ['svg'],
  'video/mp4': ['mp4'],
  'video/webm': ['webm'],
}

/** CV uploads on job applications. */
const CV_TYPES: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
}

export interface ValidationError {
  error: string
  status: number
}

function extensionOf(filename: string): string {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

function validate(
  file: File,
  allowed: Record<string, string[]>,
  maxBytes: number,
  label: string,
): ValidationError | null {
  if (file.size === 0) {
    return { error: 'The uploaded file is empty.', status: 400 }
  }
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024))
    return { error: `File is too large. Maximum ${label} size is ${mb} MB.`, status: 413 }
  }

  const type = file.type.split(';')[0].trim().toLowerCase()
  const extensions = allowed[type]
  if (!extensions) {
    return {
      error: `Unsupported file type. Allowed: ${Object.keys(allowed).join(', ')}.`,
      status: 415,
    }
  }

  // Content-Type is client-supplied, so require the extension to agree with it.
  // This blocks e.g. "evil.html" declared as image/png.
  const ext = extensionOf(file.name)
  if (!extensions.includes(ext)) {
    return {
      error: `File extension ".${ext}" does not match its declared type "${type}".`,
      status: 415,
    }
  }

  return null
}

export function validateMediaUpload(file: File): ValidationError | null {
  return validate(file, MEDIA_TYPES, MAX_IMAGE_BYTES, 'upload')
}

export function validateCvUpload(file: File): ValidationError | null {
  return validate(file, CV_TYPES, MAX_CV_BYTES, 'CV')
}

/**
 * SVG can carry inline scripts, so it must never be served inline from a
 * bucket that shares an origin with the site. Callers force a download
 * disposition for these.
 */
export function isScriptableType(type: string): boolean {
  return type.split(';')[0].trim().toLowerCase() === 'image/svg+xml'
}
