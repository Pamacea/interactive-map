'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateVersion } from '@/hooks/use-versions';
import { Loader2 } from 'lucide-react';

interface VersionCreateFormProps {
  worldId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function VersionCreateForm({ worldId, onCancel, onSuccess }: VersionCreateFormProps) {
  const { mutate: createVersion, isPending } = useCreateVersion();
  const [error, setError] = React.useState<string>();
  const [title, setTitle] = React.useState('');
  const [changelog, setChangelog] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const result = await createVersion({
        worldId,
        title,
        changelog,
        isAuto: false,
      });

      if (result.success) {
        onSuccess();
      } else if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create version');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-bone-dark/80 mb-1.5">
          Version Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Before major changes"
          disabled={isPending}
          className="bg-obsidian/60"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-bone-dark/80 mb-1.5">
          Changelog (optional)
        </label>
        <textarea
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
          placeholder="What changed in this version?"
          rows={3}
          disabled={isPending}
          className="flex w-full rounded-sm border border-iron bg-obsidian/60 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-gold disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-blood">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !title.trim()}
          className="min-w-[120px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Version'
          )}
        </Button>
      </div>
    </form>
  );
}
