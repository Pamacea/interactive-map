import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useGallery,
  usePinGallery,
  useLoreGallery,
  useUploadGallery,
  useDeleteGallery,
  useUpdateGallery,
  galleryKeys,
} from "../use-gallery-query";

// Mock TanStack Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock server actions
vi.mock("@/actions/gallery", () => ({
  getGalleryItemsByWorld: vi.fn(),
  uploadGalleryImage: vi.fn(),
  deleteGalleryItem: vi.fn(),
  updateGalleryItem: vi.fn(),
}));

// Mock cache times
vi.mock("@/shared/lib/providers/query-provider", () => ({
  CACHE_TIMES: {
    WORLD: 1000 * 60 * 5, // 5 minutes
  },
}));

// Unused import - galleryKeys exported for use in other code
// import { galleryKeys } from "../use-gallery-query";

describe("galleryKeys", () => {
  describe("query key factories", () => {
    it("should create all key", () => {
      expect(galleryKeys.all).toEqual(["gallery"]);
    });

    it("should create worlds key", () => {
      expect(galleryKeys.worlds()).toEqual(["gallery", "worlds"]);
    });

    it("should create world-specific key", () => {
      expect(galleryKeys.world("world-123")).toEqual(["gallery", "worlds", "world-123"]);
    });

    it("should create pin-specific key", () => {
      expect(galleryKeys.pins("pin-456")).toEqual(["gallery", "pin", "pin-456"]);
    });

    it("should create lore-specific key", () => {
      expect(galleryKeys.lore("lore-789")).toEqual(["gallery", "lore", "lore-789"]);
    });
  });
});

describe("useGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery } = require("@tanstack/react-query");
    useQuery.mockImplementation(mockUseQuery);

    renderHook(() => useGallery("world-123"));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["gallery", "worlds", "world-123"],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
      enabled: true,
    });
  });

  it("should be disabled when worldId is empty", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery } = require("@tanstack/react-query");
    useQuery.mockImplementation(mockUseQuery);

    renderHook(() => useGallery(""));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });

  it("should be enabled when worldId is provided", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery } = require("@tanstack/react-query");
    useQuery.mockImplementation(mockUseQuery);

    renderHook(() => useGallery("world-123"));

    const call = mockUseQuery.mock.calls[0][0];
    expect(call.enabled).toBe(true);
  });
});

describe("usePinGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with pin-specific key", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery } = require("@tanstack/react-query");
    useQuery.mockImplementation(mockUseQuery);

    renderHook(() => usePinGallery("pin-456"));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["gallery", "pin", "pin-456"],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be disabled when pinId is empty", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery: _useQuery } = require("@tanstack/react-query");

    renderHook(() => usePinGallery(""));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});

describe("useLoreGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with lore-specific key", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery } = require("@tanstack/react-query");
    useQuery.mockImplementation(mockUseQuery);

    renderHook(() => useLoreGallery("lore-789"));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["gallery", "lore", "lore-789"],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be disabled when loreId is empty", () => {
    const mockUseQuery = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQuery } = require("@tanstack/react-query");
    useQuery.mockImplementation(mockUseQuery);

    renderHook(() => useLoreGallery(""));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});

describe("useUploadGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useMutation with uploadGalleryImage", () => {
    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(mockUseMutation);

    renderHook(() => useUploadGallery());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it("should invalidate world gallery query on successful upload", async () => {
    const mockInvalidateQueries = vi.fn();
    const mockQueryClient = { invalidateQueries: mockInvalidateQueries };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQueryClient } = require("@tanstack/react-query");
    useQueryClient.mockReturnValue(mockQueryClient);

    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(({ onSuccess }) => {
      return {
        mutate: async (_data) => {
          // Simulate successful upload
          const _result = {
            data: {
              galleryItem: {
                pin: { gameWorldId: "world-123" },
              },
            },
          };
          await onSuccess(result);
        },
      };
    });

    const { result } = renderHook(() => useUploadGallery());

    await act(async () => {
      await result.current.mutate({ file: new File([""], "test.jpg") });
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["gallery", "worlds", "world-123"],
    });
  });

  it("should extract worldId from loreEntry when pin is not present", async () => {
    const mockInvalidateQueries = vi.fn();
    const mockQueryClient = { invalidateQueries: mockInvalidateQueries };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQueryClient } = require("@tanstack/react-query");
    useQueryClient.mockReturnValue(mockQueryClient);

    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(({ onSuccess }) => {
      return {
        mutate: async (_data) => {
          // Simulate successful upload with lore entry
          const _result = {
            data: {
              galleryItem: {
                loreEntry: { gameWorldId: "world-456" },
              },
            },
          };
          await onSuccess(result);
        },
      };
    });

    const { result } = renderHook(() => useUploadGallery());

    await act(async () => {
      await result.current.mutate({ file: new File([""], "test.jpg") });
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["gallery", "worlds", "world-456"],
    });
  });

  it("should not invalidate when worldId is missing", async () => {
    const mockInvalidateQueries = vi.fn();
    const mockQueryClient = { invalidateQueries: mockInvalidateQueries };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQueryClient } = require("@tanstack/react-query");
    useQueryClient.mockReturnValue(mockQueryClient);

    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(({ onSuccess }) => {
      return {
        mutate: async (_data) => {
          const _result = {
            data: {
              galleryItem: {
                // No pin or loreEntry
              },
            },
          };
          await onSuccess(result);
        },
      };
    });

    const { result } = renderHook(() => useUploadGallery());

    await act(async () => {
      await result.current.mutate({ file: new File([""], "test.jpg") });
    });

    expect(mockInvalidateQueries).not.toHaveBeenCalled();
  });
});

describe("useDeleteGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useMutation with deleteGalleryItemAction", () => {
    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(mockUseMutation);

    renderHook(() => useDeleteGallery());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it("should invalidate all gallery queries on delete", async () => {
    const mockInvalidateQueries = vi.fn();
    const mockQueryClient = { invalidateQueries: mockInvalidateQueries };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQueryClient } = require("@tanstack/react-query");
    useQueryClient.mockReturnValue(mockQueryClient);

    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(({ onSuccess }) => {
      return {
        mutate: async (_data) => {
          await onSuccess();
        },
      };
    });

    const { result } = renderHook(() => useDeleteGallery());

    await act(async () => {
      await result.current.mutate("gallery-item-123");
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["gallery"],
    });
  });
});

describe("useUpdateGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useMutation with updateGalleryItemAction", () => {
    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(mockUseMutation);

    renderHook(() => useUpdateGallery());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it("should invalidate all gallery queries on update", async () => {
    const mockInvalidateQueries = vi.fn();
    const mockQueryClient = { invalidateQueries: mockInvalidateQueries };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQueryClient } = require("@tanstack/react-query");
    useQueryClient.mockReturnValue(mockQueryClient);

    const _mockUseMutation = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMutation } = require("@tanstack/react-query");
    useMutation.mockImplementation(({ onSuccess }) => {
      return {
        mutate: async (_data) => {
          await onSuccess();
        },
      };
    });

    const { result } = renderHook(() => useUpdateGallery());

    await act(async () => {
      await result.current.mutate({ id: "gallery-item-123", caption: "Updated" });
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["gallery"],
    });
  });
});

describe("edge cases", () => {
  it("should handle concurrent mutations", async () => {
    const mockInvalidateQueries = vi.fn();
    const mockQueryClient = { invalidateQueries: mockInvalidateQueries };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useQueryClient } = require("@tanstack/react-query");
    useQueryClient.mockReturnValue(mockQueryClient);

    const { result: deleteResult } = renderHook(() => useDeleteGallery());
    const { result: updateResult } = renderHook(() => useUpdateGallery());

    await act(async () => {
      await Promise.all([
        deleteResult.current.mutate("item-1"),
        updateResult.current.mutate({ id: "item-2", caption: "Test" }),
      ]);
    });

    expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
  });
});
