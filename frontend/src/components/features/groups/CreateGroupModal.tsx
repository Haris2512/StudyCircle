import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { FormInput } from '../../common/FormInput';
import { Button } from '../../common/Button';
import { groupsApi } from '../../../api/groups.api';

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
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Study Group">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <FormInput
          label="Group Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subjectId" className="text-sm font-medium text-gray-300">
            Subject
          </label>
          <select
            id="subjectId"
            name="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a2035] text-white border border-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-sm"
            required
          >
            <option value="" disabled>Select a subject</option>
            <option value="3554f848-3771-40b1-927f-331f10f0726c">IF-101 Introduction to Programming</option>
            <option value="6ad1fbf5-2119-4a31-b831-2d1370a799ca">IF-102 Calculus I</option>
            <option value="f448423d-05d3-466f-bab4-364371b54b14">IF-201 Advanced Web Programming</option>
            <option value="68393244-fa3e-4ac9-b681-f03c91aa1e37">IF-202 Data Structures and Algorithms</option>
            <option value="4ae6b0db-ad36-4c60-a799-a287b5a1c6da">IF-301 Database Systems</option>
            <option value="9630f172-12c6-4052-b8a4-86a25e6451dc">IF-302 Software Engineering</option>
            <option value="0b162680-9606-4be0-970b-17ed99218048">IF-401 Artificial Intelligence</option>
            <option value="6ff639d9-7526-4c03-b9ac-a9899fc3f31f">IF-402 Computer Networks</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter group description (optional)"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a2035] text-white placeholder-gray-500 border border-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-sm resize-none"
          />
        </div>



        <FormInput
          label="Max Members"
          name="maxMembers"
          type="number"
          value={maxMembers}
          onChange={(e) => setMaxMembers(e.target.value)}
          placeholder="e.g. 10 (optional)"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!name.trim() || !subjectId.trim()}>
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
}
