// UI Components
export { CommentMarker } from './ui/comment-marker';
export { CommentPopup } from './ui/comment-popup';
export { CommentForm } from './ui/comment-form';
export { CommentThread } from './ui/comment-thread';

// Logic
export {
  useComments,
  useCommentStats,
  useCreateComment,
  useUpdateComment,
  useToggleCommentResolved,
  useDeleteComment,
  type UseCommentsOptions,
} from './logic';

// Methods
export {
  getWorldComments,
  getCommentStats,
  createComment,
  updateComment,
  toggleCommentResolved,
  deleteComment,
  type GetWorldCommentsInput,
  type CreateCommentInput,
  type UpdateCommentInput,
  type ToggleCommentResolvedInput,
  type DeleteCommentInput,
  type CommentWithUser,
} from './methods';
