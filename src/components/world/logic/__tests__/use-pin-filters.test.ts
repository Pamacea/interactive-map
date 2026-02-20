import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePinFilters, useIsPinTypeVisible, useFilteredPins, useVisiblePinTypesCount, useHasActiveFilters } from "../use-pin-filters";
import { PinType } from "@/types/pin.type";

// Mock the pins store
const mockToggleFilter = vi.fn();
const mockShowAllTypes = vi.fn();
const mockHideAllTypes = vi.fn();

vi.mock("@/stores/use-pins-store", () => ({
  usePinTypeFilters: () => mockFilters,
  useShowAllPinTypesValue: () => mockShowAll,
  useTogglePinTypeFilter: () => mockToggleFilter,
  useShowAllPinTypes: () => mockShowAllTypes,
  useHideAllPinTypes: () => mockHideAllTypes,
  useVisiblePinTypes: () => mockVisibleTypes,
}));

let mockFilters: Record<string, boolean>;
let mockShowAll: boolean;
let mockVisibleTypes: number[];

describe("usePinFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock values - all types visible
    mockFilters = {
      [PinType.CITY]: true,
      [PinType.DUNGEON]: true,
      [PinType.TOWN]: true,
      [PinType.LANDMARK]: true,
      [PinType.REGION]: true,
      [PinType.LOCATION]: true,
      [PinType.QUEST]: true,
      [PinType.NOTE]: true,
    };
    mockShowAll = true;
    mockVisibleTypes = Object.values(PinType);
  });

  describe("initial state", () => {
    it("should return filter functions", () => {
      const { result } = renderHook(() => usePinFilters());

      expect(typeof result.current.toggleFilter).toBe("function");
      expect(typeof result.current.setFilter).toBe("function");
      expect(typeof result.current.showAllTypes).toBe("function");
      expect(typeof result.current.hideAllTypes).toBe("function");
      expect(typeof result.current.resetFilters).toBe("function");
      expect(typeof result.current.isTypeVisible).toBe("function");
    });

    it("should return current filters", () => {
      const { result } = renderHook(() => usePinFilters());

      expect(result.current.filters).toEqual(mockFilters);
    });

    it("should return showAll status", () => {
      const { result } = renderHook(() => usePinFilters());

      expect(result.current.showAll).toBe(true);
    });

    it("should return visible types", () => {
      const { result } = renderHook(() => usePinFilters());

      expect(result.current.visibleTypes).toEqual(mockVisibleTypes);
    });
  });

  describe("isTypeVisible", () => {
    it("should return true for visible pin type", () => {
      const { result } = renderHook(() => usePinFilters());

      expect(result.current.isTypeVisible(PinType.CITY)).toBe(true);
    });

    it("should return false for hidden pin type", () => {
      mockFilters[PinType.CITY] = false;

      const { result } = renderHook(() => usePinFilters());

      expect(result.current.isTypeVisible(PinType.CITY)).toBe(false);
    });

    it("should default to true for undefined filter", () => {
      delete mockFilters[PinType.CITY];

      const { result } = renderHook(() => usePinFilters());

      expect(result.current.isTypeVisible(PinType.CITY)).toBe(true);
    });
  });

  describe("toggleFilter", () => {
    it("should call toggle function with pin type", () => {
      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.toggleFilter(PinType.CITY);
      });

      expect(mockToggleFilter).toHaveBeenCalledWith(PinType.CITY);
    });

    it("should toggle different pin types", () => {
      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.toggleFilter(PinType.CITY);
        result.current.toggleFilter(PinType.DUNGEON);
        result.current.toggleFilter(PinType.QUEST);
      });

      expect(mockToggleFilter).toHaveBeenCalledTimes(3);
      expect(mockToggleFilter).toHaveBeenNthCalledWith(1, PinType.CITY);
      expect(mockToggleFilter).toHaveBeenNthCalledWith(2, PinType.DUNGEON);
      expect(mockToggleFilter).toHaveBeenNthCalledWith(3, PinType.QUEST);
    });
  });

  describe("setFilter", () => {
    it("should call toggle when value differs from current", () => {
      mockFilters[PinType.CITY] = true;

      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.setFilter(PinType.CITY, false);
      });

      expect(mockToggleFilter).toHaveBeenCalledWith(PinType.CITY);
    });

    it("should not call toggle when value matches current", () => {
      mockFilters[PinType.CITY] = true;

      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.setFilter(PinType.CITY, true);
      });

      expect(mockToggleFilter).not.toHaveBeenCalled();
    });
  });

  describe("showAllTypes", () => {
    it("should call showAllTypes function", () => {
      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.showAllTypes();
      });

      expect(mockShowAllTypes).toHaveBeenCalled();
    });
  });

  describe("hideAllTypes", () => {
    it("should call hideAllTypes function", () => {
      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.hideAllTypes();
      });

      expect(mockHideAllTypes).toHaveBeenCalled();
    });
  });

  describe("resetFilters", () => {
    it("should call showAllTypes (reset = show all)", () => {
      const { result } = renderHook(() => usePinFilters());

      act(() => {
        result.current.resetFilters();
      });

      expect(mockShowAllTypes).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle all filters hidden", () => {
      Object.keys(mockFilters).forEach((key) => {
        mockFilters[key] = false;
      });

      const { result } = renderHook(() => usePinFilters());

      expect(Object.values(result.current.filters).every((v) => v === false)).toBe(true);
    });

    it("should handle some filters hidden", () => {
      mockFilters[PinType.CITY] = false;
      mockFilters[PinType.DUNGEON] = false;

      const { result } = renderHook(() => usePinFilters());

      expect(result.current.isTypeVisible(PinType.CITY)).toBe(false);
      expect(result.current.isTypeVisible(PinType.DUNGEON)).toBe(false);
      expect(result.current.isTypeVisible(PinType.VILLAGE)).toBe(true);
    });
  });
});

describe("useIsPinTypeVisible", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFilters = {
      [PinType.CITY]: true,
      [PinType.DUNGEON]: false,
    };
  });

  it("should return true for visible pin type", () => {
    const { result } = renderHook(() => useIsPinTypeVisible(PinType.CITY));

    expect(result.current).toBe(true);
  });

  it("should return false for hidden pin type", () => {
    const { result } = renderHook(() => useIsPinTypeVisible(PinType.DUNGEON));

    expect(result.current).toBe(false);
  });

  it("should default to true for undefined filter", () => {
    delete mockFilters[PinType.TOWN];

    const { result } = renderHook(() => useIsPinTypeVisible(PinType.TOWN));

    expect(result.current).toBe(true);
  });
});

describe("useFilteredPins", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVisibleTypes = [PinType.CITY, PinType.TOWN];
  });

  it("should filter pins by visible types", () => {
    const _pins = [
      { id: "1", pinType: PinType.CITY },
      { id: "2", pinType: PinType.DUNGEON },
      { id: "3", pinType: PinType.TOWN },
    ] as Array<{ id: string; pinType: number }>;

    const { result } = renderHook(() => useFilteredPins(pins));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((p) => p.id)).toEqual(["1", "3"]);
  });

  it("should return empty array when no types visible", () => {
    mockVisibleTypes = [];

    const _pins = [
      { id: "1", pinType: PinType.CITY },
      { id: "2", pinType: PinType.DUNGEON },
    ] as Array<{ id: string; pinType: number }>;

    const { result } = renderHook(() => useFilteredPins(pins));

    expect(result.current).toHaveLength(0);
  });

  it("should return all pins when all types visible", () => {
    mockVisibleTypes = Object.values(PinType);

    const _pins = [
      { id: "1", pinType: PinType.CITY },
      { id: "2", pinType: PinType.DUNGEON },
      { id: "3", pinType: PinType.TOWN },
    ] as Array<{ id: string; pinType: number }>;

    const { result } = renderHook(() => useFilteredPins(pins));

    expect(result.current).toHaveLength(3);
  });

  it("should handle empty pins array", () => {
    const { result } = renderHook(() => useFilteredPins([]));

    expect(result.current).toHaveLength(0);
  });
});

describe("useVisiblePinTypesCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return count of visible types", () => {
    mockVisibleTypes = [PinType.CITY, PinType.TOWN, PinType.DUNGEON];

    const { result } = renderHook(() => useVisiblePinTypesCount());

    expect(result.current).toBe(3);
  });

  it("should return 0 when no types visible", () => {
    mockVisibleTypes = [];

    const { result } = renderHook(() => useVisiblePinTypesCount());

    expect(result.current).toBe(0);
  });

  it("should return total types count when all visible", () => {
    mockVisibleTypes = Object.values(PinType);

    const { result } = renderHook(() => useVisiblePinTypesCount());

    expect(result.current).toBe(Object.values(PinType).length);
  });
});

describe("useHasActiveFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false when all types are visible", () => {
    mockShowAll = true;

    const { result } = renderHook(() => useHasActiveFilters());

    expect(result.current).toBe(false);
  });

  it("should return true when some types are hidden", () => {
    mockShowAll = false;

    const { result } = renderHook(() => useHasActiveFilters());

    expect(result.current).toBe(true);
  });
});
