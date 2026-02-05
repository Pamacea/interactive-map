'use client';

import * as React from 'react';
import { Clock, Save, Loader2 } from 'lucide-react';
import { FloatingPanel } from '@/components/world/ui/floating/floating-panel';
import { VersionList } from '@/components/versions/ui/version-list';
import { VersionCreateForm } from '@/components/versions/ui/version-create-form';
import { VersionDetail } from '@/components/versions/ui/version-detail';
import { useVersions, useRestoreVersion, useDeleteVersion } from '@/hooks/use-versions';
import { useVersionsStore } from '@/store/use-versions-store';
import { Button } from '@/components/ui/button';

interface VersionsModuleProps {
  worldId: string;
  canModify: boolean;
}

export function VersionsModule({ worldId, canModify }: VersionsModuleProps) {
  const { data: versions, isLoading } = useVersions(worldId);
  const { mutate: restoreVersion, isPending: isRestoring } = useRestoreVersion();
  const { mutate: deleteVersion, isPending: isDeleting } = useDeleteVersion();

  const { closePanel, isCreating, setCreating, selectVersion } = useVersionsStore();
  const [selectedVersion, setSelectedVersion] = React.useState<typeof versions extends (infer T)[] ? T : null>(null);

  const handleRestore = async (versionId: string) => {
    if (confirm('Are you sure you want to restore this version? This will replace all current data.')) {
      await restoreVersion({ versionId });
      alert('World restored successfully!');
    }
  };

  const handleDelete = async (versionId: string) => {
    if (confirm('Are you sure you want to delete this version?')) {
      await deleteVersion({ versionId });
    }
  };

  const handleSelectVersion = (version: typeof versions extends (infer T)[] ? T : null) => {
    setSelectedVersion(version);
    selectVersion(version?.id ?? null);
  };

  return (
    <FloatingPanel
      panelId="versions"
      title="Version History"
      icon={<Clock className="w-4 h-4" />}
    >
      <div className="h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedVersion ? (
            <VersionDetail
              version={selectedVersion}
              onClose={() => handleSelectVersion(null)}
            />
          ) : isCreating ? (
            <div className="p-4">
              <VersionCreateForm
                worldId={worldId}
                onCancel={() => setCreating(false)}
                onSuccess={() => setCreating(false)}
              />
            </div>
          ) : (
            <>
              {canModify && (
                <div className="p-3 pb-2">
                  <Button
                    onClick={() => setCreating(true)}
                    className="w-full"
                    variant="secondary"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Version
                  </Button>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
                </div>
              ) : (
                <div className={canModify ? 'px-3 pb-3' : 'p-3'}>
                  <VersionList
                    versions={versions || []}
                    onSelect={handleSelectVersion}
                    onRestore={handleRestore}
                    onDelete={handleDelete}
                    canModify={canModify}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </FloatingPanel>
  );
}
