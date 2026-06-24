/**
 * Fungsi utilitas untuk memformat ukuran file dari byte ke format yang mudah dibaca.
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${size} ${units[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isAllowedFileType(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_FILE_EXTENSIONS.includes(ext);
}

export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
