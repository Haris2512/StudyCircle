// Komponen ini merupakan bagian dari antarmuka pengguna
import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { FormInput } from '../../common/FormInput';
import { Button } from '../../common/Button';
import { useCreateSessionMutation } from '../../../hooks/useSessionsQuery';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onCreated?: () => void;
}

export function CreateSessionModal({ isOpen, onClose, groupId, onCreated }: CreateSessionModalProps) {
  const [title, setTitle] = useState('');
  const [scheduledStartTime, setScheduledStartTime] = useState('');
  const [scheduledEndTime, setScheduledEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const createSessionMutation = useCreateSessionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledStartTime || !scheduledEndTime) return;

    try {
      setError(null);
      await createSessionMutation.mutateAsync({
        groupId,
        payload: {
          title: title.trim(),
          scheduledStartTime: new Date(scheduledStartTime).toISOString(),
          scheduledEndTime: new Date(scheduledEndTime).toISOString(),
        },
      });
      // Reset form
      setTitle('');
      setScheduledStartTime('');
      setScheduledEndTime('');
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create session');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Study Session">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <FormInput
          label="Session Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter session title"
          required
        />

        <FormInput
          label="Start Time"
          name="scheduledStartTime"
          type="datetime-local"
          value={scheduledStartTime}
          onChange={(e) => setScheduledStartTime(e.target.value)}
          required
        />

        <FormInput
          label="End Time"
          name="scheduledEndTime"
          type="datetime-local"
          value={scheduledEndTime}
          onChange={(e) => setScheduledEndTime(e.target.value)}
          required
        />

        <div className="flex justify-start">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={isSuggesting}
            onClick={async () => {
              try {
                setIsSuggesting(true);
                const { axiosInstance } = await import('../../../api/axiosInstance');
                const res = await axiosInstance.get(`/sessions/groups/${groupId}/optimal-schedule`);
                if (res.data?.data && res.data.data.length > 0) {
                  const best = res.data.data[0];
                  // format to YYYY-MM-DDTHH:mm
                  const formatLocal = (d: string) => {
                    const date = new Date(d);
                    const pad = (n: number) => n.toString().padStart(2, '0');
                    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
                  };
                  setScheduledStartTime(formatLocal(best.scheduledStartTime));
                  setScheduledEndTime(formatLocal(best.scheduledEndTime));
                } else {
                  setError("Tidak dapat menemukan waktu optimal saat ini.");
                }
              } catch (err) {
                console.error("Failed to get optimal schedule", err);
                setError("Gagal mendapatkan rekomendasi waktu dari AI.");
              } finally {
                setIsSuggesting(false);
              }
            }}
          >
            AI Suggest Optimal Time
          </Button>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={createSessionMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createSessionMutation.isPending}
            disabled={!title.trim() || !scheduledStartTime || !scheduledEndTime}
          >
            Create Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}
