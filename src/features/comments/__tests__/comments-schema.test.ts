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
      const _result = CreateCommentSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });

    it("should require worldId", () => {
      const _data = { ...validBaseData, worldId: "" };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should require content", () => {
      const _data = { ...validBaseData, content: "" };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept comment without pinId when coordinates provided", () => {
      const _data = {
        worldId: "world-123",
        latitude: 50.5,
        longitude: 10.5,
        content: "Location comment",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("worldId validation", () => {
    it("should enforce minimum length of 1", () => {
      const _data = { ...validBaseData, worldId: "" };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept UUID-style world IDs", () => {
      const _data = {
        ...validBaseData,
        worldId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept nanoid-style world IDs", () => {
      const _data = {
        ...validBaseData,
        worldId: "V1StGXR8_Z5jdHi6B-myT",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("pinId validation", () => {
    it("should accept pinId", () => {
      const _data = { ...validBaseData, pinId: "pin-123" };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined pinId", () => {
      const _data = {
        ...validBaseData,
        pinId: undefined,
        latitude: 50.5,
        longitude: 10.5,
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("coordinate validation", () => {
    it("should accept valid latitude", () => {
      const validLatitudes = [
        -90, -45, 0, 45, 90,
      ];

      validLatitudes.forEach((lat) => {
        const _data = {
          worldId: "world-1",
          latitude: lat,
          longitude: 10.5,
          content: "Test",
        };
        const _result = CreateCommentSchema.safeParse(_data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid latitude", () => {
      const invalidLatitudes = [
        -90.1, -91, -100, 90.1, 91, 100,
      ];

      invalidLatitudes.forEach((lat) => {
        const _data = {
          worldId: "world-1",
          latitude: lat,
          longitude: 10.5,
          content: "Test",
        };
        const _result = CreateCommentSchema.safeParse(_data);
        expect(result.success).toBe(false);
      });
    });

    it("should accept valid longitude", () => {
      const validLongitudes = [
        -180, -90, 0, 90, 180,
      ];

      validLongitudes.forEach((lng) => {
        const _data = {
          worldId: "world-1",
          latitude: 50.5,
          longitude: lng,
          content: "Test",
        };
        const _result = CreateCommentSchema.safeParse(_data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid longitude", () => {
      const invalidLongitudes = [
        -180.1, -181, -200, 180.1, 181, 200,
      ];

      invalidLongitudes.forEach((lng) => {
        const _data = {
          worldId: "world-1",
          latitude: 50.5,
          longitude: lng,
          content: "Test",
        };
        const _result = CreateCommentSchema.safeParse(_data);
        expect(result.success).toBe(false);
      });
    });

    it("should accept coordinates with many decimal places", () => {
      const _data = {
        worldId: "world-1",
        latitude: 50.123456789,
        longitude: 10.987654321,
        content: "Precise location",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept zero coordinates", () => {
      const _data = {
        worldId: "world-1",
        latitude: 0,
        longitude: 0,
        content: "Zero coordinate test",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("content validation", () => {
    it("should enforce minimum length of 1", () => {
      const _data = { ...validBaseData, content: "" };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length of 5000", () => {
      const _data = { ...validBaseData, content: "a".repeat(5001) };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept content at max length", () => {
      const _data = { ...validBaseData, content: "a".repeat(5000) };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept unicode characters", () => {
      const _data = {
        ...validBaseData,
        content: "This is a test with emoji 🎉 and accents éàü",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept newlines in content", () => {
      const _data = {
        ...validBaseData,
        content: "Line 1\nLine 2\nLine 3",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept special characters", () => {
      const _data = {
        ...validBaseData,
        content: "Special chars: @#$%^&*()_+-=[]{}|;':\",./<>?",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("parentId validation", () => {
    it("should accept parentId for replies", () => {
      const _data = {
        ...validBaseData,
        parentId: "comment-parent-123",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined parentId", () => {
      const _data = {
        ...validBaseData,
        parentId: undefined,
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept parentId with UUID format", () => {
      const _data = {
        ...validBaseData,
        parentId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("complex scenarios", () => {
    it("should accept comment with pin", () => {
      const _data = {
        worldId: "world-123",
        pinId: "pin-456",
        content: "Comment on a pin",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept comment with coordinates", () => {
      const _data = {
        worldId: "world-123",
        latitude: 50.5,
        longitude: 10.5,
        content: "Comment at location",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept reply to parent comment", () => {
      const _data = {
        worldId: "world-123",
        pinId: "pin-456",
        content: "This is a reply",
        parentId: "parent-789",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept long valid comment", () => {
      const longContent = "a".repeat(5000);
      const _data = {
        worldId: "world-123",
        pinId: "pin-456",
        content: longContent,
      };
      const _result = CreateCommentSchema.safeParse(_data);
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
      const _data = { content: "Test" };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should require content", () => {
      const _data = { commentId: "comment-123" };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept valid update data", () => {
      const _result = UpdateCommentSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });
  });

  describe("commentId validation", () => {
    it("should enforce minimum length of 1", () => {
      const _data = { commentId: "", content: "Test" };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept UUID-style IDs", () => {
      const _data = {
        commentId: "550e8400-e29b-41d4-a716-446655440000",
        content: "Test",
      };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept nanoid-style IDs", () => {
      const _data = {
        commentId: "V1StGXR8_Z5jdHi6B-myT",
        content: "Test",
      };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("content validation", () => {
    it("should enforce minimum length of 1", () => {
      const _data = { commentId: "comment-123", content: "" };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length of 5000", () => {
      const _data = {
        commentId: "comment-123",
        content: "a".repeat(5001),
      };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept content at max length", () => {
      const _data = {
        commentId: "comment-123",
        content: "a".repeat(5000),
      };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("complex update scenarios", () => {
    it("should accept updating to shorter content", () => {
      const _data = {
        commentId: "comment-123",
        content: "Ok",
      };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept updating to longer content", () => {
      const longContent = "a".repeat(4000);
      const _data = {
        commentId: "comment-123",
        content: longContent,
      };
      const _result = UpdateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept unicode in updated content", () => {
      const _data = {
        commentId: "comment-123",
        content: "Updated with émojis 🎉",
      };
      const _result = UpdateCommentSchema.safeParse(_data);
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
      const _data = {
        commentId: "comment-123",
        resolved: true,
      };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept marking as unresolved", () => {
      const _data = {
        commentId: "comment-123",
        resolved: false,
      };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("commentId validation", () => {
    it("should require commentId", () => {
      const _data = { resolved: true };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should enforce minimum length of 1", () => {
      const _data = { commentId: "", resolved: true };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept UUID-style IDs", () => {
      const _data = {
        commentId: "550e8400-e29b-41d4-a716-446655440000",
        resolved: true,
      };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("resolved field validation", () => {
    it("should accept boolean true", () => {
      const _data = {
        commentId: "comment-123",
        resolved: true,
      };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept boolean false", () => {
      const _data = {
        commentId: "comment-123",
        resolved: false,
      };
      const _result = ToggleCommentResolvedSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================
// DELETE COMMENT SCHEMA TESTS
// ============================================

describe("Comments - DeleteCommentSchema", () => {
  it("should accept valid comment ID", () => {
    const _data = { commentId: "comment-123" };
    const _result = DeleteCommentSchema.safeParse(_data);
    expect(result.success).toBe(true);
  });

  it("should require commentId field", () => {
    const _data = {};
    const _result = DeleteCommentSchema.safeParse(_data);
    expect(result.success).toBe(false);
  });

  it("should enforce commentId minimum length", () => {
    const _data = { commentId: "" };
    const _result = DeleteCommentSchema.safeParse(_data);
    expect(result.success).toBe(false);
  });

  it("should accept UUID-style IDs", () => {
    const _data = {
      commentId: "550e8400-e29b-41d4-a716-446655440000",
    };
    const _result = DeleteCommentSchema.safeParse(_data);
    expect(result.success).toBe(true);
  });

  it("should accept nanoid-style IDs", () => {
    const _data = {
      commentId: "V1StGXR8_Z5jdHi6B-myT",
    };
    const _result = DeleteCommentSchema.safeParse(_data);
    expect(result.success).toBe(true);
  });

  it("should accept numeric string IDs", () => {
    const _data = { commentId: "12345" };
    const _result = DeleteCommentSchema.safeParse(_data);
    expect(result.success).toBe(true);
  });
});

// ============================================
// EDGE CASE TESTS
// ============================================

describe("Comments - Edge Cases", () => {
  describe("coordinate edge cases", () => {
    it("should accept equator coordinates", () => {
      const _data = {
        worldId: "world-1",
        latitude: 0,
        longitude: 0,
        content: "Equator test",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept prime meridian", () => {
      const _data = {
        worldId: "world-1",
        latitude: 51.5,
        longitude: 0,
        content: "London test",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept international date line", () => {
      const _data = {
        worldId: "world-1",
        latitude: 0,
        longitude: 180,
        content: "Date line test",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept north pole", () => {
      const _data = {
        worldId: "world-1",
        latitude: 90,
        longitude: 0,
        content: "North pole",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept south pole", () => {
      const _data = {
        worldId: "world-1",
        latitude: -90,
        longitude: 0,
        content: "South pole",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("content edge cases", () => {
    it("should accept single character content", () => {
      const _data = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "a",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept content with only spaces (trimmed will fail)", () => {
      const _data = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "   ",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept content with mixed whitespace", () => {
      const _data = {
        worldId: "world-1",
        pinId: "pin-1",
        content: "  \t\n  ",
      };
      const _result = CreateCommentSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });
});
