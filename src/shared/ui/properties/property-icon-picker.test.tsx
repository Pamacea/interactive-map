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

  it("filters icons based on search query", async () => {
    const handleChange = vi.fn();
    render(
      <PropertyIconPicker
        value=""
        onChange={handleChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search icons...");
    fireEvent.change(searchInput, { target: { value: "location" } });

    // "Location" category label should be visible when searching for "location"
    expect(screen.getByText("Locations")).toBeInTheDocument();

    // Castle icon (🏰) should be visible in the Locations category
    const castleIcon = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "🏰"
    );
    expect(castleIcon).toBeDefined();
  });

  it("shows selected icon preview", () => {
    const { container } = render(
      <PropertyIconPicker
        value="🏰"
        onChange={vi.fn()}
      />
    );

    // Find the selected icon preview section
    const selectedText = screen.getByText(/selected/i);
    expect(selectedText).toBeInTheDocument();

    // The icon should be visible in the preview
    const iconElements = container.querySelectorAll("*");
    const hasCastleIcon = Array.from(iconElements).some(
      (el) => el.textContent === "🏰"
    );
    expect(hasCastleIcon).toBe(true);
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
