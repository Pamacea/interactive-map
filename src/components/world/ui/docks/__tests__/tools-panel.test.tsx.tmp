/**
 * ToolsPanel Integration Tests
 *
 * Tests that verify the ToolsPanel component correctly:
 * 1. Displays all tools
 * 2. Updates the tool mode when clicking buttons
 * 3. Shows active state for selected tool
 * 4. Responds to keyboard shortcuts
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ToolsPanel } from "../tools-panel";
import { useToolsStore } from "@/stores/tools";

// Mock the useLeftDock hook
vi.mock("../../logic/use-left-dock", () => ({
  useLeftDock: () => ({ isExpanded: true }),
}));

describe("ToolsPanel", () => {
  beforeEach(() => {
    // Reset store before each test
    useToolsStore.getState().reset();
  });

  describe("Tool Buttons Display", () => {
    it("should render all tool buttons", () => {
      render(<ToolsPanel />);

      expect(screen.getByLabelText("Select")).toBeInTheDocument();
      expect(screen.getByLabelText("Add Pin")).toBeInTheDocument();
      expect(screen.getByLabelText("Pan")).toBeInTheDocument();
      expect(screen.getByLabelText("Measure")).toBeInTheDocument();
      expect(screen.getByLabelText("Area")).toBeInTheDocument();
    });

    it("should show keyboard shortcuts when dock is expanded", () => {
      render(<ToolsPanel />);

      // Check for shortcut labels (V, P, H, M, A)
      expect(screen.getByText("V")).toBeInTheDocument();
      expect(screen.getByText("P")).toBeInTheDocument();
      expect(screen.getByText("H")).toBeInTheDocument();
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  describe("Tool Mode Switching", () => {
    it("should switch to select mode when clicking Select button", () => {
      render(<ToolsPanel />);

      const selectButton = screen.getByLabelText("Select");
      fireEvent.click(selectButton);

      expect(useToolsStore.getState().mode).toBe("select");
    });

    it("should switch to create-pin mode when clicking Add Pin button", () => {
      render(<ToolsPanel />);

      const addPinButton = screen.getByLabelText("Add Pin");
      fireEvent.click(addPinButton);

      expect(useToolsStore.getState().mode).toBe("create-pin");
    });

    it("should switch to pan mode when clicking Pan button", () => {
      render(<ToolsPanel />);

      const panButton = screen.getByLabelText("Pan");
      fireEvent.click(panButton);

      expect(useToolsStore.getState().mode).toBe("pan");
    });

    it("should switch to measure mode when clicking Measure button", () => {
      render(<ToolsPanel />);

      const measureButton = screen.getByLabelText("Measure");
      fireEvent.click(measureButton);

      expect(useToolsStore.getState().mode).toBe("measure");
    });

    it("should switch to area mode when clicking Area button", () => {
      render(<ToolsPanel />);

      const areaButton = screen.getByLabelText("Area");
      fireEvent.click(areaButton);

      expect(useToolsStore.getState().mode).toBe("area");
    });

    it("should show active state for selected tool", () => {
      render(<ToolsPanel />);

      // Click on Add Pin button
      const addPinButton = screen.getByLabelText("Add Pin");
      fireEvent.click(addPinButton);

      // The button should have aria-pressed="true"
      expect(addPinButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("should switch to select mode on 'v' key", () => {
      render(<ToolsPanel />);

      fireEvent.keyDown(window, { key: "v" });

      expect(useToolsStore.getState().mode).toBe("select");
    });

    it("should switch to create-pin mode on 'p' key", () => {
      render(<ToolsPanel />);

      fireEvent.keyDown(window, { key: "p" });

      expect(useToolsStore.getState().mode).toBe("create-pin");
    });

    it("should switch to pan mode on 'h' key", () => {
      render(<ToolsPanel />);

      fireEvent.keyDown(window, { key: "h" });

      expect(useToolsStore.getState().mode).toBe("pan");
    });

    it("should switch to measure mode on 'm' key", () => {
      render(<ToolsPanel />);

      fireEvent.keyDown(window, { key: "m" });

      expect(useToolsStore.getState().mode).toBe("measure");
    });

    it("should switch to area mode on 'a' key", () => {
      render(<ToolsPanel />);

      fireEvent.keyDown(window, { key: "a" });

      expect(useToolsStore.getState().mode).toBe("area");
    });

    it("should ignore shortcuts when typing in an input", () => {
      render(<ToolsPanel />);

      // Create an input element
      const input = document.createElement("input");
      document.body.appendChild(input);

      // Focus the input and press 'v'
      input.focus();
      fireEvent.keyDown(window, { key: "v" });

      // Mode should not change (still select by default)
      expect(useToolsStore.getState().mode).toBe("select");

      // Cleanup
      document.body.removeChild(input);
    });

    it("should work with uppercase keys", () => {
      render(<ToolsPanel />);

      fireEvent.keyDown(window, { key: "M" });

      expect(useToolsStore.getState().mode).toBe("measure");
    });
  });

  describe("Cleanup", () => {
    it("should remove event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<ToolsPanel />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    });
  });
});
