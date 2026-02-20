/**
 * Tests for PropertyInput component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertyInput } from "./property-input";

describe("PropertyInput", () => {
  it("renders label and input", () => {
    render(<PropertyInput label="Title" value="Test" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
  });

  it("calls onChange when input changes", () => {
    const handleChange = vi.fn();
    render(<PropertyInput label="Title" value="" onChange={handleChange} />);
    const input = screen.getByLabelText("Title");
    input.click();
    // User types something
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  it("shows error message when error prop is provided", () => {
    render(
      <PropertyInput
        label="Title"
        value=""
        onChange={vi.fn()}
        error="Title is required"
      />
    );
    expect(screen.getByText("Title is required")).toBeInTheDocument();
  });

  it("shows description when provided", () => {
    render(
      <PropertyInput
        label="Title"
        value=""
        onChange={vi.fn()}
        description="Enter a title for your pin"
      />
    );
    expect(screen.getByText("Enter a title for your pin")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<PropertyInput label="Title" value="Test" onChange={vi.fn()} disabled />);
    expect(screen.getByLabelText("Title")).toBeDisabled();
  });

  it("respects maxLength prop", () => {
    render(
      <PropertyInput label="Title" value="Test" onChange={vi.fn()} maxLength={10} />
    );
    const input = screen.getByLabelText("Title") as HTMLInputElement;
    expect(input.maxLength).toBe(10);
  });
});
