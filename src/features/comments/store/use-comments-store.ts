import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommentWithUser } from '@/features/comments/actions';

export interface CommentMarker {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  hasUnresolved: boolean;
}

interface CommentsState {
  // UI state
  selectedCommentId: string | null;
  replyingToId: string | null;
  editingId: string | null;
  showResolved: boolean;

  // Data
  comments: CommentWithUser[];
  markers: CommentMarker[];

  // Actions
  setSelectedComment: (id: string | null) => void;
  setReplyingTo: (id: string | null) => void;
  setEditing: (id: string | null) => void;
  toggleShowResolved: () => void;
  setComments: (comments: CommentWithUser[]) => void;
  addComment: (comment: CommentWithUser) => void;
  updateComment: (id: string, updates: Partial<CommentWithUser>) => void;
  removeComment: (id: string) => void;
  setMarkers: (markers: CommentMarker[]) => void;
  clear: () => void;
}

const initialState = {
  selectedCommentId: null,
  replyingToId: null,
  editingId: null,
  showResolved: false,
  comments: [],
  markers: [],
};

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedComment: (id) => set({ selectedCommentId: id }),

      setReplyingTo: (id) => set({ replyingToId: id, editingId: null }),

      setEditing: (id) => set({ editingId: id, replyingToId: null }),

      toggleShowResolved: () => set((state) => ({ showResolved: !state.showResolved })),

      setComments: (comments) => set({ comments }),

      addComment: (comment) => set((state) => ({
        comments: [comment, ...state.comments],
      })),

      updateComment: (id, updates) => set((state) => ({
        comments: state.comments.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      })),

      removeComment: (id) => set((state) => ({
        comments: state.comments.filter((c) => c.id !== id),
        selectedCommentId: state.selectedCommentId === id ? null : state.selectedCommentId,
      })),

      setMarkers: (markers) => set({ markers }),

      clear: () => set(initialState),
    }),
    {
      name: 'genesis-comments-storage',
      partialize: (state) => ({
        showResolved: state.showResolved,
      }),
    }
  )
);

// Selector hooks
export const useSelectedComment = () =>
  useCommentsStore((state) => state.selectedCommentId);

export const useReplyingTo = () =>
  useCommentsStore((state) => state.replyingToId);

export const useEditingComment = () =>
  useCommentsStore((state) => state.editingId);

export const useShowResolved = () =>
  useCommentsStore((state) => state.showResolved);

export const useComments = () =>
  useCommentsStore((state) => state.comments);

export const useCommentMarkers = () =>
  useCommentsStore((state) => state.markers);
