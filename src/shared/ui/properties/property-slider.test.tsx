/**
 * Tests for PropertySlider component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PropertySlider, PropertySliderRange } from "./property-slider";

describe("PropertySlider", () => {
  it("renders label and slider", () => {
    render(
      <PropertySlider
        label="Opacity"
        value={50}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Opacity")).toBeInTheDocument();
  });

  it("displays current value", () => {
    render(
      <PropertySlider
        label="Size"
        value={32}
        onChange={vi.fn()}
        unit="px"
      />
    );
    expect(screen.getByText("32px")).toBeInTheDocument();
  });

  it("uses custom displayValue function when provided", () => {
    render(
      <PropertySlider
        label="Opacity"
        value={0.5}
        onChange={vi.fn()}
        displayValue={(v) => `${Math.round(v * 100)}%`}
      />
    );
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows reset button when showReset is true", () => {
    render(
      <PropertySlider
        label="Size"
        value={32}
        onChange={vi.fn()}
        showReset
        defaultValue={16}
      />
    );
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("calls onChange with correct value", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <PropertySlider
        label="Size"
        value={32}
        onChange={handleChange}
      />
    );
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
});

describe("PropertySliderRange", () => {
  it("renders dual sliders for range selection", () => {
    const { container } = render(
      <PropertySliderRange
        label="Zoom"
        min={0}
        max={200}
        minValue={10}
        maxValue={100}
        onMinChange={vi.fn()}
        onMaxChange={vi.fn()}
      />
    );
    const inputs = container.querySelectorAll('input[type="range"]');
    expect(inputs).toHaveLength(2);
  });

  it("displays range summary", () => {
    render(
      <PropertySliderRange
        label="Zoom"
        min={0}
        max={200}
        minValue={10}
        maxValue={100}
        onMinChange={vi.fn()}
        onMaxChange={vi.fn()}
        unit="%"
      />
    );
    expect(screen.getByText(/10% - 100%/)).toBeInTheDocument();
  });
});
