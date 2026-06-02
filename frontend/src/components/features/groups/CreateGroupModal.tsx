import { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { FormInput } from '../../common/FormInput';
import { Button } from '../../common/Button';
import { groupsApi } from '../../../api/groups.api';
import { subjectsApi, Subject } from '../../../api/subjects.api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreated }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchSubjects = async () => {
        try {
          setLoadingSubjects(true);
          const data = await subjectsApi.getSubjects();
          setSubjects(data);
        } catch (err) {
          console.error('Failed to load subjects', err);
        } finally {
          setLoadingSubjects(false);
        }
      };
      fetchSubjects();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subjectId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await groupsApi.createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        subjectId: subjectId.trim(),
        maxMembers: maxMembers ? parseInt(maxMembers, 10) : undefined,
      });
      // Reset form
      setName('');
      setDescription('');
      setSubjectId('');
      setMaxMembers('');
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat grup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Grup Belajar Baru">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <FormInput
          label="Nama Grup"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Misal: Aljabar Linear B"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subjectId" className="text-sm font-medium text-gray-300">
            Mata Kuliah
          </label>
          <select
            id="subjectId"
            name="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-bg text-white border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm"
            required
            disabled={loadingSubjects}
          >
            <option value="" disabled>
              {loadingSubjects ? 'Memuat mata kuliah...' : 'Pilih mata kuliah'}
            </option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">
            Deskripsi Grup
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan tujuan atau fokus belajar grup ini"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-bg text-white placeholder-gray-500 border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm resize-none"
          />
        </div>

        <FormInput
          label="Maksimal Anggota"
          name="maxMembers"
          type="number"
          value={maxMembers}
          onChange={(e) => setMaxMembers(e.target.value)}
          placeholder="Misal: 10 (opsional)"
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" loading={loading} disabled={!name.trim() || !subjectId.trim()}>
            Buat Grup
          </Button>
        </div>
      </form>
    </Modal>
  );
}
