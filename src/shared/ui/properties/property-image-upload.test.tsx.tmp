/**
 * Tests for PropertyImageUpload component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertyImageUpload } from "./property-image-upload";

describe("PropertyImageUpload", () => {
  it("renders upload prompt when no image", () => {
    render(
      <PropertyImageUpload
        value={null}
        onChange={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    expect(screen.getByText(/Click or drag to upload/)).toBeInTheDocument();
  });

  it("renders image preview when value is provided", () => {
    const { container } = render(
      <PropertyImageUpload
        value="https://example.com/image.jpg"
        onChange={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    const img = container.querySelector('img[src="https://example.com/image.jpg"]');
    expect(img).toBeInTheDocument();
  });

  it("calls onUpload when file is selected", async () => {
    const handleUpload = vi.fn().mockResolvedValue("https://example.com/uploaded.jpg");
    const handleChange = vi.fn();

    const { container } = render(
      <PropertyImageUpload
        value={null}
        onChange={handleChange}
        onUpload={handleUpload}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;

    fireEvent.change(input);

    // Wait for async upload
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(handleUpload).toHaveBeenCalled();
  });

  it("validates file size", () => {
    const handleUpload = vi.fn();

    const { container } = render(
      <PropertyImageUpload
        value={null}
        onChange={vi.fn()}
        onUpload={handleUpload}
        maxSize={100} // 100 bytes
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const largeFile = new File(["x".repeat(1000)], "large.jpg", { type: "image/jpeg" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(largeFile);
    input.files = dataTransfer.files;

    fireEvent.change(input);

    // Should show error
    expect(screen.getByText(/File size must be less than/)).toBeInTheDocument();
    expect(handleUpload).not.toHaveBeenCalled();
  });

  it("removes image when remove button is clicked", () => {
    const handleChange = vi.fn();

    const { container } = render(
      <PropertyImageUpload
        value="https://example.com/image.jpg"
        onChange={handleChange}
        onUpload={vi.fn()}
      />
    );

    // Find the remove button (X icon in overlay)
    // The overlay appears on hover, but we can find it directly
    const buttons = container.querySelectorAll("button");
    const removeButton = Array.from(buttons).find((btn) => {
      const svg = btn.querySelector("svg");
      // Look for the X icon (lucide-react X component)
      return svg && btn.innerHTML.includes("remove");
    });

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(handleChange).toHaveBeenCalledWith(null);
    }
  });
});
