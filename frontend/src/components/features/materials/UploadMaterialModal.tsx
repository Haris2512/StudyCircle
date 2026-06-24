// Komponen ini merupakan bagian dari antarmuka pengguna
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { FormInput } from '../../common/FormInput';
import { Button } from '../../common/Button';
import { isAllowedFileType, ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../../../utils/formatFileSize';
import { formatFileSize } from '../../../utils/formatFileSize';
import { useUploadMaterialMutation } from '../../../hooks/useMaterialsQuery';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onUploaded?: () => void;
}

export function UploadMaterialModal({ isOpen, onClose, groupId, onUploaded }: UploadMaterialModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMaterialMutation = useUploadMaterialMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }

    if (!isAllowedFileType(selected.name)) {
      setFileError(`File type not allowed. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`);
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE_BYTES)}`);
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      await uploadMaterialMutation.mutateAsync({ groupId, formData });
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploaded) onUploaded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload material');
    }
  };

  const acceptTypes = ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(',');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Material">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <FormInput
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter material title"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-card text-white placeholder-gray-500 border border-gray-700/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm resize-none"
          />
        </div>

        {/* File input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">
            File <span className="text-red-400 ml-1">*</span>
          </label>
          <div
            className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
            role="button"
            tabIndex={0}
            aria-label="Pilih file untuk diunggah"
          >
            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            {file ? (
              <p className="text-sm text-white">
                {file.name} <span className="text-gray-500">({formatFileSize(file.size)})</span>
              </p>
            ) : (
              <div>
                <p className="text-sm text-gray-400">Click to select a file</p>
                <p className="text-xs text-gray-500 mt-1">
                  {ALLOWED_FILE_EXTENSIONS.map((e) => `.${e}`).join(', ')} — Max {formatFileSize(MAX_FILE_SIZE_BYTES)}
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className="hidden"
          />
          {fileError && (
            <p className="text-xs text-red-400 mt-0.5">{fileError}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={uploadMaterialMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={uploadMaterialMutation.isPending} disabled={!file || !title.trim()}>
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
}
