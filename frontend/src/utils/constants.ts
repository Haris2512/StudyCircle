/**
 * Kumpulan konstanta yang digunakan di seluruh aplikasi.
 */
// Mastery Level Thresholds (hours)
export const MASTERY_THRESHOLDS = {
  BEGINNER_MAX: 4,
  INTERMEDIATE_MAX: 14,
  // 15+ = Advanced
} as const;

// Session constraints
export const MAX_SESSION_DURATION_HOURS = 8;

// API Base URL
export const API_BASE_URL = 'http://localhost:5000/api/v1';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
} as const;

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
} as const;
