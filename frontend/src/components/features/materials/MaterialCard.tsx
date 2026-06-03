import { Download, Trash2, FileText, FileSpreadsheet, Presentation } from 'lucide-react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { formatDate } from '../../../utils/formatDate';
import { formatFileSize } from '../../../utils/formatFileSize';
import type { Material } from '../../../types';

interface MaterialCardProps {
  material: Material;
  canDelete: boolean;
  onDownload: () => void;
  onDelete: () => void;
}

function getFileIcon(fileType?: string) {
  const type = fileType?.toLowerCase() || '';
  if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('xls'))
    return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
  if (type.includes('presentation') || type.includes('powerpoint') || type.includes('ppt'))
    return <Presentation className="w-8 h-8 text-orange-400" />;
  return <FileText className="w-8 h-8 text-indigo-400" />;
}

export function MaterialCard({ material, canDelete, onDownload, onDelete }: MaterialCardProps) {
  return (
    <Card className="p-5">
      <div className="flex gap-4">
        {/* File icon */}
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-white/5">
          {getFileIcon(material.fileType)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {material.title}
          </h3>
          {material.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {material.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{material.uploaderName}</span>
            <span>•</span>
            <span>{formatDate(material.uploadedAt)}</span>
            {material.fileSize != null && (
              <>
                <span>•</span>
                <span>{formatFileSize(material.fileSize)}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-start gap-2">
          <Button variant="secondary" size="sm" onClick={onDownload} aria-label={`Unduh ${material.title}`}>
            <Download className="w-4 h-4" />
          </Button>
          {canDelete && (
            <Button variant="danger" size="sm" onClick={onDelete} aria-label={`Hapus ${material.title}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
