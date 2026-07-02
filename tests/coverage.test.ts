import { describe, expect, it } from "vitest";
import { nextEligibleStaffId } from "@/lib/coverage";

describe("nextEligibleStaffId", () => {
  it("returns the first staff member not yet offered", () => {
    const result = nextEligibleStaffId(["a", "b", "c"], new Set());
    expect(result).toBe("a");
  });

  it("skips staff who already have an offer for this request", () => {
    const result = nextEligibleStaffId(["a", "b", "c"], new Set(["a"]));
    expect(result).toBe("b");
  });

  it("skips multiple already-offered staff in priority order", () => {
    const result = nextEligibleStaffId(["a", "b", "c", "d"], new Set(["a", "b"]));
    expect(result).toBe("c");
  });

  it("returns null when every staff member has already been offered", () => {
    const result = nextEligibleStaffId(["a", "b"], new Set(["a", "b"]));
    expect(result).toBeNull();
  });

  it("returns null for an empty staff list", () => {
    const result = nextEligibleStaffId([], new Set());
    expect(result).toBeNull();
  });
});
