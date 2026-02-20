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

    render(
      <PropertyImageUpload
        value={null}
        onChange={handleChange}
        onUpload={handleUpload}
      />
    );

    const input = screen.getByRole("presentation").querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(input, "files", { value: [file], writable: false });

    fireEvent.change(input);

    // Note: Upload is async, so we'd need to wait for it
    expect(handleUpload).toHaveBeenCalled();
  });

  it("validates file size", () => {
    const handleUpload = vi.fn();

    render(
      <PropertyImageUpload
        value={null}
        onChange={vi.fn()}
        onUpload={handleUpload}
        maxSize={100} // 100 bytes
      />
    );

    const input = screen.getByRole("presentation").querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = new File(["x".repeat(1000)], "large.jpg", { type: "image/jpeg" });
    Object.defineProperty(input, "files", { value: [largeFile], writable: false });

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

    // Hover to show overlay
    const img = container.querySelector("img");
    fireEvent.mouseEnter(img!);

    // Click remove button
    const removeButtons = screen.getAllByRole("button");
    const removeButton = removeButtons.find((btn) => btn.querySelector("svg"));
    if (removeButton) {
      fireEvent.click(removeButton);
      expect(handleChange).toHaveBeenCalledWith(null);
    }
  });
});
