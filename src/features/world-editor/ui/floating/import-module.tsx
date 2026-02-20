'use client';

import * as React from 'react';
import { Upload } from 'lucide-react';
import { FloatingPanel } from './floating-panel';
import { ImportDialog } from '@/features/import/ui/import-dialog';
import { ImportStatus } from '@/features/import/ui/import-status';
import { useImportJobs } from '@/shared/hooks/use-import';
import { usePanelState } from '@/features/world-editor/store/use-floating-panels-store';
import { Button } from '@/shared/ui';

interface ImportModuleProps {
  worldId: string;
  canModify: boolean;
}

/**
 * ImportModule - Floating panel for data import
 *
 * Features:
 * - Lazy loading (only fetches jobs when visible)
 * - Dialog for file import
 * - Status tracking
 */
export function ImportModule({ worldId, canModify }: ImportModuleProps) {
  const { isVisible } = usePanelState("import");
  const [showDialog, setShowDialog] = React.useState(false);

  // Only fetch jobs when panel is visible
  const { data: jobs, isLoading } = useImportJobs(worldId, {
    enabled: isVisible,
    refetchInterval: showDialog ? false : 5000, // Poll every 5s when visible
  });

  const handleDialogClose = React.useCallback(() => {
    setShowDialog(false);
  }, []);

  return (
    <>
      <FloatingPanel
        panelId="import"
        title="Import Data"
        icon={<Upload className="w-4 h-4" />}
      >
        {isVisible && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-3">
              {canModify && (
                <Button
                  onClick={() => setShowDialog(true)}
                  className="w-full mb-4"
                  variant="secondary"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Files
                </Button>
              )}

              <ImportStatus jobs={jobs || []} isLoading={isLoading} />
            </div>
          </div>
        )}
      </FloatingPanel>

      {showDialog && (
        <ImportDialog
          worldId={worldId}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
