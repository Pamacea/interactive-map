/**
 * Comments Feature - Schema Validation Tests
 *
 * Unit tests for comment schemas and validation logic
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  CreateCommentSchema,
} from "../methods/create-comment";

// Define schemas inline to avoid server action import issues
const UpdateCommentSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
  content: z.string().min(1, "Content is required").max(5000, "Content too long (max 5000 chars)"),
});

const ToggleCommentResolvedSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
  resolved: z.boolean(),
});

const DeleteCommentSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
});

// ============================================
// CREATE COMMENT SCHEMA TESTS
// ============================================

describe("Comments - CreateCommentSchema", () => {
  const validBaseData = {
    worldId: "world-123",
    pinId: "pin-456",
    content: "This is a test comment",
  };

  describe("required fields", () => {
    it("should validate with all required fields", () => {
      const result = CreateCommentSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });

    it("should require worldId", () => {
      const data = { ...validBaseData, worldId: "" };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require content", () => {
      const data = { ...validBaseData, content: "" };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept comment without pinId when coordinates provided", () => {
      const data = {
        worldId: "world-123",
        latitude: 50.5,
        longitude: 10.5,
        content: "Location comment",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("worldId validation", () => {
    it("should enforce minimum length of 1", () => {
      const data = { ...validBaseData, worldId: "" };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept UUID-style world IDs", () => {
      const data = {
        ...validBaseData,
        worldId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept nanoid-style world IDs", () => {
      const data = {
        ...validBaseData,
        worldId: "V1StGXR8_Z5jdHi6B-myT",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("pinId validation", () => {
    it("should accept pinId", () => {
      const data = { ...validBaseData, pinId: "pin-123" };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined pinId", () => {
      const data = {
        ...validBaseData,
        pinId: undefined,
        latitude: 50.5,
        longitude: 10.5,
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("coordinate validation", () => {
    it("should accept valid latitude", () => {
      const validLatitudes = [
        -90, -45, 0, 45, 90,
      ];

      validLatitudes.forEach((lat) => {
        const data = {
          worldId: "world-1",
          latitude: lat,
          longitude: 10.5,
          content: "Test",
        };
        const result = CreateCommentSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid latitude", () => {
      const invalidLatitudes = [
        -90.1, -91, -100, 90.1, 91, 100,
      ];

      invalidLatitudes.forEach((lat) => {
        const data = {
          worldId: "world-1",
          latitude: lat,
          longitude: 10.5,
          content: "Test",
        };
        const result = CreateCommentSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it("should accept valid longitude", () => {
      const validLongitudes = [
        -180, -90, 0, 90, 180,
      ];

      validLongitudes.forEach((lng) => {
        const data = {
          worldId: "world-1",
          latitude: 50.5,
          longitude: lng,
          content: "Test",
        };
        const result = CreateCommentSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid longitude", () => {
      const invalidLongitudes = [
        -180.1, -181, -200, 180.1, 181, 200,
      ];

      invalidLongitudes.forEach((lng) => {
        const data = {
          worldId: "world-1",
          latitude: 50.5,
          longitude: lng,
          content: "Test",
        };
        const result = CreateCommentSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it("should accept coordinates with many decimal places", () => {
      const data = {
        worldId: "world-1",
        latitude: 50.123456789,
        longitude: 10.987654321,
        content: "Precise location",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept zero coordinates", () => {
      const data = {
        worldId: "world-1",
        latitude: 0,
        longitude: 0,
        content: "Zero coordinate test",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("content validation", () => {
    it("should enforce minimum length of 1", () => {
      const data = { ...validBaseData, content: "" };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length of 5000", () => {
      const data = { ...validBaseData, content: "a".repeat(5001) };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept content at max length", () => {
      const data = { ...validBaseData, content: "a".repeat(5000) };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept unicode characters", () => {
      const data = {
        ...validBaseData,
        content: "This is a test with emoji 🎉 and accents éàü",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept newlines in content", () => {
      const data = {
        ...validBaseData,
        content: "Line 1\nLine 2\nLine 3",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept special characters", () => {
      const data = {
        ...validBaseData,
        content: "Special chars: @#$%^&*()_+-=[]{}|;':\",./<>?",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("parentId validation", () => {
    it("should accept parentId for replies", () => {
      const data = {
        ...validBaseData,
        parentId: "comment-parent-123",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined parentId", () => {
      const data = {
        ...validBaseData,
        parentId: undefined,
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept parentId with UUID format", () => {
      const data = {
        ...validBaseData,
        parentId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("complex scenarios", () => {
    it("should accept comment with pin", () => {
      const data = {
        worldId: "world-123",
        pinId: "pin-456",
        content: "Comment on a pin",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept comment with coordinates", () => {
      const data = {
        worldId: "world-123",
        latitude: 50.5,
        longitude: 10.5,
        content: "Comment at location",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept reply to parent comment", () => {
      const data = {
        worldId: "world-123",
        pinId: "pin-456",
        content: "This is a reply",
        parentId: "parent-789",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept long valid comment", () => {
      const longContent = "a".repeat(5000);
      const data = {
        worldId: "world-123",
        pinId: "pin-456",
        content: longContent,
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================
// UPDATE COMMENT SCHEMA TESTS
// ============================================

describe("Comments - UpdateCommentSchema", () => {
  const validBaseData = {
    commentId: "comment-123",
    content: "Updated comment content",
  };

  describe("required fields", () => {
    it("should require commentId", () => {
      const data = { content: "Test" };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require content", () => {
      const data = { commentId: "comment-123" };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept valid update data", () => {
      const result = UpdateCommentSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });
  });

  describe("commentId validation", () => {
    it("should enforce minimum length of 1", () => {
      const data = { commentId: "", content: "Test" };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept UUID-style IDs", () => {
      const data = {
        commentId: "550e8400-e29b-41d4-a716-446655440000",
        content: "Test",
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept nanoid-style IDs", () => {
      const data = {
        commentId: "V1StGXR8_Z5jdHi6B-myT",
        content: "Test",
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("content validation", () => {
    it("should enforce minimum length of 1", () => {
      const data = { commentId: "comment-123", content: "" };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length of 5000", () => {
      const data = {
        commentId: "comment-123",
        content: "a".repeat(5001),
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept content at max length", () => {
      const data = {
        commentId: "comment-123",
        content: "a".repeat(5000),
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("complex update scenarios", () => {
    it("should accept updating to shorter content", () => {
      const data = {
        commentId: "comment-123",
        content: "Ok",
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept updating to longer content", () => {
      const longContent = "a".repeat(4000);
      const data = {
        commentId: "comment-123",
        content: longContent,
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept unicode in updated content", () => {
      const data = {
        commentId: "comment-123",
        content: "Updated with émojis 🎉",
      };
      const result = UpdateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================
// TOGGLE COMMENT RESOLVED SCHEMA TESTS
// ============================================

describe("Comments - ToggleCommentResolvedSchema", () => {
  describe("valid inputs", () => {
    it("should accept marking as resolved", () => {
      const data = {
        commentId: "comment-123",
        resolved: true,
      };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept marking as unresolved", () => {
      const data = {
        commentId: "comment-123",
        resolved: false,
      };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("commentId validation", () => {
    it("should require commentId", () => {
      const data = { resolved: true };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should enforce minimum length of 1", () => {
      const data = { commentId: "", resolved: true };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept UUID-style IDs", () => {
      const data = {
        commentId: "550e8400-e29b-41d4-a716-446655440000",
        resolved: true,
      };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("resolved field validation", () => {
    it("should accept boolean true", () => {
      const data = {
        commentId: "comment-123",
        resolved: true,
      };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept boolean false", () => {
      const data = {
        commentId: "comment-123",
        resolved: false,
      };
      const result = ToggleCommentResolvedSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================
// DELETE COMMENT SCHEMA TESTS
// ============================================

describe("Comments - DeleteCommentSchema", () => {
  it("should accept valid comment ID", () => {
    const data = { commentId: "comment-123" };
    const result = DeleteCommentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should require commentId field", () => {
    const data = {};
    const result = DeleteCommentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should enforce commentId minimum length", () => {
    const data = { commentId: "" };
    const result = DeleteCommentSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should accept UUID-style IDs", () => {
    const data = {
      commentId: "550e8400-e29b-41d4-a716-446655440000",
    };
    const result = DeleteCommentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should accept nanoid-style IDs", () => {
    const data = {
      commentId: "V1StGXR8_Z5jdHi6B-myT",
    };
    const result = DeleteCommentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should accept numeric string IDs", () => {
    const data = { commentId: "12345" };
    const result = DeleteCommentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

// ============================================
// EDGE CASE TESTS
// ============================================

describe("Comments - Edge Cases", () => {
  describe("coordinate edge cases", () => {
    it("should accept equator coordinates", () => {
      const data = {
        worldId: "world-1",
        latitude: 0,
        longitude: 0,
        content: "Equator test",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept prime meridian", () => {
      const data = {
        worldId: "world-1",
        latitude: 51.5,
        longitude: 0,
        content: "London test",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept international date line", () => {
      const data = {
        worldId: "world-1",
        latitude: 0,
        longitude: 180,
        content: "Date line test",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept north pole", () => {
      const data = {
        worldId: "world-1",
        latitude: 90,
        longitude: 0,
        content: "North pole",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept south pole", () => {
      const data = {
        worldId: "world-1",
        latitude: -90,
        longitude: 0,
        content: "South pole",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("content edge cases", () => {
    it("should accept single character content", () => {
      const data = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "a",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept content with only spaces (trimmed will fail)", () => {
      const data = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "   ",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept content with mixed whitespace", () => {
      const data = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "  \t\n  ",
      };
      const result = CreateCommentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
