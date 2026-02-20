/**
 * Comments Feature Test Suite
 *
 * Tests for comment CRUD operations, threading, permissions, and validations
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createComment,
  updateComment,
  toggleCommentResolved,
  deleteComment,
  type CreateCommentInput,
  type UpdateCommentInput,
  type ToggleCommentResolvedInput,
} from "../methods";
import { CreateCommentSchema, UpdateCommentSchema, ToggleCommentResolvedSchema } from "../methods/create-comment";

// ============================================
// MOCKS
// ============================================

const mockPrisma = {
  mapComment: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  worldMember: {
    findFirst: vi.fn(),
  },
};

const _mockAuth = {
  getAuthenticatedUser: vi.fn(),
  verifyWorldPermission: vi.fn(),
};

const mockRevalidatePath = vi.fn();
const mockLogCollaborationEvent = vi.fn();

// ============================================
// TEST DATA
// ============================================

const mockUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  image: null,
};

const mockWorld = {
  id: "world-1",
  title: "Test World",
  description: "A test world",
  userId: "user-1",
  isPublic: true,
  isPublished: true,
};

const mockComment = {
  id: "comment-1",
  content: "This is a test comment",
  latitude: 50.5,
  longitude: 10.5,
  isResolved: false,
  parentId: null,
  pinId: "pin-1",
  worldId: "world-1",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser,
  replies: [],
};

const mockParentComment = {
  id: "parent-1",
  content: "Parent comment",
  latitude: 50.5,
  longitude: 10.5,
  isResolved: false,
  parentId: null,
  pinId: "pin-1",
  worldId: "world-1",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockReplyComment = {
  id: "reply-1",
  content: "Reply to parent",
  latitude: null,
  longitude: null,
  isResolved: false,
  parentId: "parent-1",
  pinId: null,
  worldId: "world-1",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ============================================
// SETUP
// ============================================

beforeEach(() => {
  vi.clearAllMocks();

  // Setup default mock returns
  mockAuth.getAuthenticatedUser.mockResolvedValue(mockUser);
  mockAuth.verifyWorldPermission.mockResolvedValue(mockWorld);
  mockPrisma.mapComment.create.mockResolvedValue(mockComment);
  mockPrisma.mapComment.findUnique.mockResolvedValue({
    ...mockComment,
    world: mockWorld,
  });
  mockPrisma.mapComment.update.mockResolvedValue(mockComment);
  mockPrisma.mapComment.delete.mockResolvedValue(mockComment);
  mockLogCollaborationEvent.mockResolvedValue(undefined);
});

// ============================================
// SCHEMA VALIDATION TESTS
// ============================================

describe("Comments - Schema Validation", () => {
  describe("CreateCommentSchema", () => {
    it("should validate valid comment with pin", () => {
      const validData: CreateCommentInput = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "This is a comment",
      };

      const _result = CreateCommentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate valid comment with coordinates", () => {
      const validData: CreateCommentInput = {
        worldId: "world-1",
        latitude: 50.5,
        longitude: 10.5,
        content: "This is a comment",
      };

      const _result = CreateCommentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require content field", () => {
      const invalidData = {
        worldId: "world-1",
        pinId: "pin-1",
      };

      const _result = CreateCommentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should require worldId", () => {
      const invalidData = {
        pinId: "pin-1",
        content: "This is a comment",
      };

      const _result = CreateCommentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate content max length", () => {
      const invalidData = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "a".repeat(5001),
      };

      const _result = CreateCommentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate latitude range", () => {
      const validData = {
        worldId: "world-1",
        latitude: 50.5,
        longitude: 10.5,
        content: "Test",
      };

      expect(CreateCommentSchema.safeParse({ ...validData, latitude: 90 }).success).toBe(true);
      expect(CreateCommentSchema.safeParse({ ...validData, latitude: -90 }).success).toBe(true);
      expect(CreateCommentSchema.safeParse({ ...validData, latitude: 91 }).success).toBe(false);
      expect(CreateCommentSchema.safeParse({ ...validData, latitude: -91 }).success).toBe(false);
    });

    it("should validate longitude range", () => {
      const validData = {
        worldId: "world-1",
        latitude: 50.5,
        longitude: 10.5,
        content: "Test",
      };

      expect(CreateCommentSchema.safeParse({ ...validData, longitude: 180 }).success).toBe(true);
      expect(CreateCommentSchema.safeParse({ ...validData, longitude: -180 }).success).toBe(true);
      expect(CreateCommentSchema.safeParse({ ...validData, longitude: 181 }).success).toBe(false);
      expect(CreateCommentSchema.safeParse({ ...validData, longitude: -181 }).success).toBe(false);
    });

    it("should accept optional parentId", () => {
      const validData: CreateCommentInput = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "Reply",
        parentId: "parent-1",
      };

      const _result = CreateCommentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("UpdateCommentSchema", () => {
    it("should validate valid update", () => {
      const validData: UpdateCommentInput = {
        commentId: "comment-1",
        content: "Updated content",
      };

      const _result = UpdateCommentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require commentId", () => {
      const invalidData = {
        content: "Updated content",
      };

      const _result = UpdateCommentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate content length on update", () => {
      const invalidData = {
        commentId: "comment-1",
        content: "a".repeat(5001),
      };

      const _result = UpdateCommentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("ToggleCommentResolvedSchema", () => {
    it("should validate valid toggle", () => {
      const validData: ToggleCommentResolvedInput = {
        commentId: "comment-1",
        resolved: true,
      };

      const _result = ToggleCommentResolvedSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept boolean resolved", () => {
      const data1: ToggleCommentResolvedInput = {
        commentId: "comment-1",
        resolved: true,
      };

      const data2: ToggleCommentResolvedInput = {
        commentId: "comment-1",
        resolved: false,
      };

      expect(ToggleCommentResolvedSchema.safeParse(data1).success).toBe(true);
      expect(ToggleCommentResolvedSchema.safeParse(data2).success).toBe(true);
    });
  });
});

// ============================================
// COMMENT CREATION TESTS
// ============================================

describe("Comments - Creation", () => {
  it("should create comment with pin", async () => {
    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "This is a comment",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment).toBeDefined();
      expect(result.data.comment.content).toBe("This is a comment");
    }
  });

  it("should create comment with coordinates", async () => {
    const _result = await createComment({
      worldId: "world-1",
      latitude: 50.5,
      longitude: 10.5,
      content: "This is a location comment",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment.latitude).toBe(50.5);
      expect(result.data.comment.longitude).toBe(10.5);
    }
  });

  it("should trim content whitespace", async () => {
    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "  This is a comment  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment.content).toBe("This is a comment");
    }
  });

  it("should verify world permission before creation", async () => {
    mockAuth.verifyWorldPermission.mockRejectedValue(new Error("No permission"));

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Test",
    });

    expect(result.success).toBe(false);
  });

  it("should revalidate path after creation", async () => {
    await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Test",
    });

    expect(mockRevalidatePath).toHaveBeenCalledWith("/world/world-1");
  });

  it("should log collaboration event on creation", async () => {
    await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Test",
    });

    expect(mockLogCollaborationEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "COMMENT_CREATED",
      })
    );
  });
});

// ============================================
// COMMENT THREADING TESTS
// ============================================

describe("Comments - Threading", () => {
  it("should create reply to parent comment", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue(mockParentComment);

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "This is a reply",
      parentId: "parent-1",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment.parentId).toBe("parent-1");
    }
  });

  it("should validate parent comment exists", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue(null);

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Reply",
      parentId: "non-existent",
    });

    expect(result.success).toBe(false);
  });

  it("should validate parent belongs to same world", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue({
      ...mockParentComment,
      worldId: "different-world",
    });

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Reply",
      parentId: "parent-1",
    });

    expect(result.success).toBe(false);
  });

  it("should prevent replying to replies (max depth 1)", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue(mockReplyComment);

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Nested reply",
      parentId: "reply-1",
    });

    expect(result.success).toBe(false);
  });

  it("should require coordinates or pin for non-reply comments", async () => {
    const _result = await createComment({
      worldId: "world-1",
      content: "Comment without location",
    });

    expect(result.success).toBe(false);
  });
});

// ============================================
// COMMENT UPDATE TESTS
// ============================================

describe("Comments - Update", () => {
  it("should update comment content", async () => {
    const updatedComment = { ...mockComment, content: "Updated content" };
    mockPrisma.mapComment.update.mockResolvedValue(updatedComment);

    const _result = await updateComment({
      commentId: "comment-1",
      content: "Updated content",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment.content).toBe("Updated content");
    }
  });

  it("should trim updated content", async () => {
    const updatedComment = { ...mockComment, content: "Updated" };
    mockPrisma.mapComment.update.mockResolvedValue(updatedComment);

    const _result = await updateComment({
      commentId: "comment-1",
      content: "  Updated  ",
    });

    expect(result.success).toBe(true);
  });

  it("should allow comment author to update", async () => {
    const commentWithWorld = {
      ...mockComment,
      world: mockWorld,
      userId: "user-1",
    };
    mockPrisma.mapComment.findUnique.mockResolvedValue(commentWithWorld);

    const _result = await updateComment({
      commentId: "comment-1",
      content: "Updated",
    });

    expect(result.success).toBe(true);
  });

  it("should allow world owner to update any comment", async () => {
    const otherUsersComment = {
      ...mockComment,
      userId: "other-user",
      world: { ...mockWorld, userId: "user-1" },
    };
    mockPrisma.mapComment.findUnique.mockResolvedValue(otherUsersComment);

    const _result = await updateComment({
      commentId: "comment-1",
      content: "Updated",
    });

    expect(result.success).toBe(true);
  });

  it("should prevent non-author from updating comment", async () => {
    const otherUsersComment = {
      ...mockComment,
      userId: "other-user",
      world: { ...mockWorld, userId: "world-owner" },
    };
    mockPrisma.mapComment.findUnique.mockResolvedValue(otherUsersComment);

    const _result = await updateComment({
      commentId: "comment-1",
      content: "Updated",
    });

    expect(result.success).toBe(false);
  });

  it("should return error for non-existent comment", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue(null);

    const _result = await updateComment({
      commentId: "non-existent",
      content: "Updated",
    });

    expect(result.success).toBe(false);
  });

  it("should revalidate path after update", async () => {
    await updateComment({
      commentId: "comment-1",
      content: "Updated",
    });

    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it("should log collaboration event on update", async () => {
    await updateComment({
      commentId: "comment-1",
      content: "Updated",
    });

    expect(mockLogCollaborationEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "COMMENT_UPDATED",
      })
    );
  });
});

// ============================================
// COMMENT RESOLVE TOGGLE TESTS
// ============================================

describe("Comments - Toggle Resolved", () => {
  it("should mark comment as resolved", async () => {
    const resolvedComment = { ...mockComment, isResolved: true };
    mockPrisma.mapComment.update.mockResolvedValue(resolvedComment);

    const _result = await toggleCommentResolved({
      commentId: "comment-1",
      resolved: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment.isResolved).toBe(true);
    }
  });

  it("should mark comment as unresolved", async () => {
    mockPrisma.mapComment.update.mockResolvedValue(mockComment);

    const _result = await toggleCommentResolved({
      commentId: "comment-1",
      resolved: false,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment.isResolved).toBe(false);
    }
  });

  it("should verify editor permission before toggle", async () => {
    mockAuth.verifyWorldPermission.mockRejectedValue(new Error("No permission"));

    const _result = await toggleCommentResolved({
      commentId: "comment-1",
      resolved: true,
    });

    expect(result.success).toBe(false);
  });

  it("should return error for non-existent comment", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue(null);

    const _result = await toggleCommentResolved({
      commentId: "non-existent",
      resolved: true,
    });

    expect(result.success).toBe(false);
  });

  it("should log resolved event", async () => {
    await toggleCommentResolved({
      commentId: "comment-1",
      resolved: true,
    });

    expect(mockLogCollaborationEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "COMMENT_RESOLVED",
      })
    );
  });

  it("should log reopened event", async () => {
    await toggleCommentResolved({
      commentId: "comment-1",
      resolved: false,
    });

    expect(mockLogCollaborationEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "COMMENT_REOPENED",
      })
    );
  });
});

// ============================================
// COMMENT DELETION TESTS
// ============================================

describe("Comments - Deletion", () => {
  it("should delete comment", async () => {
    const _result = await deleteComment({
      commentId: "comment-1",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.success).toBe(true);
    }
  });

  it("should allow comment author to delete", async () => {
    const commentWithWorld = {
      ...mockComment,
      world: mockWorld,
      userId: "user-1",
    };
    mockPrisma.mapComment.findUnique.mockResolvedValue(commentWithWorld);

    const _result = await deleteComment({
      commentId: "comment-1",
    });

    expect(result.success).toBe(true);
  });

  it("should allow world owner to delete any comment", async () => {
    const otherUsersComment = {
      ...mockComment,
      userId: "other-user",
      world: { ...mockWorld, userId: "user-1" },
    };
    mockPrisma.mapComment.findUnique.mockResolvedValue(otherUsersComment);

    const _result = await deleteComment({
      commentId: "comment-1",
    });

    expect(result.success).toBe(true);
  });

  it("should prevent non-author from deleting comment", async () => {
    const otherUsersComment = {
      ...mockComment,
      userId: "other-user",
      world: { ...mockWorld, userId: "world-owner" },
    };
    mockPrisma.mapComment.findUnique.mockResolvedValue(otherUsersComment);

    const _result = await deleteComment({
      commentId: "comment-1",
    });

    expect(result.success).toBe(false);
  });

  it("should return error for non-existent comment", async () => {
    mockPrisma.mapComment.findUnique.mockResolvedValue(null);

    const _result = await deleteComment({
      commentId: "non-existent",
    });

    expect(result.success).toBe(false);
  });

  it("should revalidate path after deletion", async () => {
    await deleteComment({
      commentId: "comment-1",
    });

    expect(mockRevalidatePath).toHaveBeenCalled();
  });

  it("should log collaboration event on deletion", async () => {
    await deleteComment({
      commentId: "comment-1",
    });

    expect(mockLogCollaborationEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "COMMENT_DELETED",
      })
    );
  });
});

// ============================================
// ERROR HANDLING TESTS
// ============================================

describe("Comments - Error Handling", () => {
  it("should handle authentication errors", async () => {
    mockAuth.getAuthenticatedUser.mockRejectedValue(new Error("Not authenticated"));

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Test",
    });

    expect(result.success).toBe(false);
  });

  it("should handle authorization errors", async () => {
    mockAuth.verifyWorldPermission.mockRejectedValue(new Error("No permission"));

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Test",
    });

    expect(result.success).toBe(false);
  });

  it("should handle database errors during create", async () => {
    mockPrisma.mapComment.create.mockRejectedValue(new Error("Database error"));

    const _result = await createComment({
      worldId: "world-1",
      pinId: "pin-1",
      content: "Test",
    });

    expect(result.success).toBe(false);
  });

  it("should handle database errors during update", async () => {
    mockPrisma.mapComment.update.mockRejectedValue(new Error("Database error"));

    const _result = await updateComment({
      commentId: "comment-1",
      content: "Updated",
    });

    expect(result.success).toBe(false);
  });

  it("should handle database errors during delete", async () => {
    mockPrisma.mapComment.delete.mockRejectedValue(new Error("Database error"));

    const _result = await deleteComment({
      commentId: "comment-1",
    });

    expect(result.success).toBe(false);
  });
});
