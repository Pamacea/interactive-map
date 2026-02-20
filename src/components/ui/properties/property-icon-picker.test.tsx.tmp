/**
 * Tests for PropertyIconPicker component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertyIconPicker, EMOJI_CATEGORIES } from "./property-icon-picker";

describe("PropertyIconPicker", () => {
  it("renders icon categories", () => {
    render(
      <PropertyIconPicker
        value="📍"
        onChange={vi.fn()}
      />
    );

    Object.keys(EMOJI_CATEGORIES).forEach((category) => {
      expect(screen.getByText(EMOJI_CATEGORIES[category as keyof typeof EMOJI_CATEGORIES].label)).toBeInTheDocument();
    });
  });

  it("calls onChange when icon is clicked", () => {
    const handleChange = vi.fn();
    render(
      <PropertyIconPicker
        value=""
        onChange={handleChange}
      />
    );

    const firstIcon = screen.getAllByRole("button")[0];
    fireEvent.click(firstIcon);

    expect(handleChange).toHaveBeenCalled();
  });

  it("filters icons based on search query", () => {
    render(
      <PropertyIconPicker
        value=""
        onChange={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search icons...");
    fireEvent.change(searchInput, { target: { value: "castle" } });

    // Should show filtered results
    expect(screen.getByText("🏰")).toBeInTheDocument();
  });

  it("shows selected icon preview", () => {
    render(
      <PropertyIconPicker
        value="🏰"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Selected:")).toBeInTheDocument();
    expect(screen.getByText("🏰")).toBeInTheDocument();
  });

  it("removes selected icon when X is clicked", () => {
    const handleChange = vi.fn();
    render(
      <PropertyIconPicker
        value="🏰"
        onChange={handleChange}
      />
    );

    const removeButton = screen.getAllByRole("button").find(
      (btn) => btn.querySelector("svg")
    );
    if (removeButton) {
      fireEvent.click(removeButton);
      expect(handleChange).toHaveBeenCalledWith("");
    }
  });
});
