import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useImageUpload } from "../use-image-upload";

// Mock image utilities - use module-level variables
const mockValidateAndPrepareImage = vi.fn();
const mockRevokePreviewURL = vi.fn();
const mockCreatePreviewURL = vi.fn((file: File) => `blob:${file.name}`);

vi.mock("@/features/gallery/utils/image-utils", () => ({
  validateAndPrepareImage: (file: File) => mockValidateAndPrepareImage(file),
  revokePreviewURL: (url: string) => mockRevokePreviewURL(url),
  createPreviewURL: (file: File) => mockCreatePreviewURL(file),
}));

describe("useImageUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateAndPrepareImage.mockResolvedValue({ valid: true });
  });

  describe("initial state", () => {
    it("should initialize with empty pending files", () => {
      const { result } = renderHook(() => useImageUpload());

      expect(result.current.pendingFiles).toEqual([]);
      expect(result.current.hasValidFiles).toBe(false);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadErrors).toEqual([]);
    });
  });

  describe("processFiles", () => {
    it("should process valid files and create previews", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const files = [new File(["content"], "test.jpg")];

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles(files);
      });

      expect(result.current.pendingFiles).toHaveLength(1);
      expect(result.current.pendingFiles[0].file.name).toBe("test.jpg");
      expect(result.current.pendingFiles[0].preview).toBe("blob:test.jpg");
      expect(result.current.pendingFiles[0].valid).toBe(true);
      expect(result.current.hasValidFiles).toBe(true);
    });

    it("should handle invalid files with errors", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({
        valid: false,
        error: "File too large",
      });

      const files = [new File(["content"], "large.jpg")];

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles(files);
      });

      expect(result.current.pendingFiles).toHaveLength(1);
      expect(result.current.pendingFiles[0].valid).toBe(false);
      expect(result.current.pendingFiles[0].error).toBe("File too large");
      expect(result.current.uploadErrors).toContain("File too large");
    });

    it("should process multiple files", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const files = [
        new File(["content1"], "test1.jpg"),
        new File(["content2"], "test2.jpg"),
      ];

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles(files);
      });

      expect(result.current.pendingFiles).toHaveLength(2);
      expect(result.current.hasValidFiles).toBe(true);
    });

    it("should append new files to existing pending files", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([new File(["content1"], "test1.jpg")]);
      });

      await act(async () => {
        await result.current.processFiles([new File(["content2"], "test2.jpg")]);
      });

      expect(result.current.pendingFiles).toHaveLength(2);
    });
  });

  describe("handleFileInput", () => {
    it("should process files from input event", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      const file = new File(["content"], "test.jpg");
      const inputEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileInput(inputEvent);
      });

      expect(result.current.pendingFiles).toHaveLength(1);
      expect(result.current.pendingFiles[0].file).toBe(file);
    });

    it("should reset input value after processing", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      const inputEvent = {
        target: { files: [new File(["content"], "test.jpg")] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileInput(inputEvent);
      });

      expect(inputEvent.target.value).toBe("");
    });

    it("should handle empty file list", async () => {
      const { result } = renderHook(() => useImageUpload());

      const inputEvent = {
        target: { files: null },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileInput(inputEvent);
      });

      expect(result.current.pendingFiles).toHaveLength(0);
    });
  });

  describe("removePendingFile", () => {
    it("should remove file by index and revoke preview", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([
          new File(["content1"], "test1.jpg"),
          new File(["content2"], "test2.jpg"),
        ]);
      });

      act(() => {
        result.current.removePendingFile(0);
      });

      expect(result.current.pendingFiles).toHaveLength(1);
      expect(result.current.pendingFiles[0].file.name).toBe("test2.jpg");
      expect(mockRevokePreviewURL).toHaveBeenCalledWith("blob:test1.jpg");
    });

    it("should update hasValidFiles when last valid file is removed", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      expect(result.current.hasValidFiles).toBe(true);

      act(() => {
        result.current.removePendingFile(0);
      });

      expect(result.current.hasValidFiles).toBe(false);
    });
  });

  describe("handleUpload", () => {
    it("should call onUpload with valid files", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const onUpload = vi.fn();
      const { result } = renderHook(() =>
        useImageUpload({ onUpload })
      );

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      await act(async () => {
        result.current.handleUpload();
      });

      expect(onUpload).toHaveBeenCalledWith([expect.any(File)]);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.pendingFiles).toHaveLength(0);
    });

    it("should not upload when no valid files", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({
        valid: false,
        error: "Invalid",
      });

      const onUpload = vi.fn();
      const { result } = renderHook(() =>
        useImageUpload({ onUpload })
      );

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      act(() => {
        result.current.handleUpload();
      });

      expect(onUpload).not.toHaveBeenCalled();
    });

    it("should revoke previews after upload", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() =>
        useImageUpload({ onUpload: vi.fn() })
      );

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      await act(async () => {
        result.current.handleUpload();
      });

      expect(mockRevokePreviewURL).toHaveBeenCalledWith("blob:test.jpg");
    });

    it("should clear errors after successful upload", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() =>
        useImageUpload({ onUpload: vi.fn() })
      );

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      await act(async () => {
        result.current.handleUpload();
      });

      expect(result.current.uploadErrors).toHaveLength(0);
    });

    it("should handle upload errors gracefully", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const onUpload = vi.fn(() => {
        throw new Error("Upload failed");
      });
      const { result } = renderHook(() =>
        useImageUpload({ onUpload })
      );

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      await act(async () => {
        result.current.handleUpload();
      });

      expect(result.current.uploadErrors).toContain("Upload failed");
      expect(result.current.isUploading).toBe(false);
    });
  });

  describe("clearPendingFiles", () => {
    it("should clear all pending files and revoke previews", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([
          new File(["content1"], "test1.jpg"),
          new File(["content2"], "test2.jpg"),
        ]);
      });

      act(() => {
        result.current.clearPendingFiles();
      });

      expect(result.current.pendingFiles).toHaveLength(0);
      expect(result.current.uploadErrors).toHaveLength(0);
      expect(mockRevokePreviewURL).toHaveBeenCalledTimes(2);
    });
  });

  describe("hasValidFiles", () => {
    it("should return true when at least one valid file", async () => {
      mockValidateAndPrepareImage.mockImplementation(
        (file: File) => Promise.resolve({ valid: file.name === "valid.jpg" })
      );

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([
          new File(["content"], "invalid.jpg"),
          new File(["content"], "valid.jpg"),
        ]);
      });

      expect(result.current.hasValidFiles).toBe(true);
    });

    it("should return false when all files are invalid", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({
        valid: false,
        error: "Invalid",
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([new File(["content"], "test.jpg")]);
      });

      expect(result.current.hasValidFiles).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle mixed valid and invalid files", async () => {
      let callCount = 0;
      mockValidateAndPrepareImage.mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          valid: callCount % 2 === 0,
          error: callCount % 2 === 1 ? "Invalid" : undefined,
        });
      });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.processFiles([
          new File(["content1"], "test1.jpg"),
          new File(["content2"], "test2.jpg"),
          new File(["content3"], "test3.jpg"),
        ]);
      });

      expect(result.current.pendingFiles).toHaveLength(3);
      expect(result.current.uploadErrors).toHaveLength(2);
    });

    it("should handle rapid file additions", async () => {
      mockValidateAndPrepareImage.mockResolvedValue({ valid: true });

      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        result.current.processFiles([new File(["content"], "test1.jpg")]);
        result.current.processFiles([new File(["content"], "test2.jpg")]);
        result.current.processFiles([new File(["content"], "test3.jpg")]);
      });

      expect(result.current.pendingFiles).toHaveLength(3);
    });
  });
});
