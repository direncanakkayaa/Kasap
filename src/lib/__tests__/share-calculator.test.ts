import { describe, it, expect } from "vitest";
import { calculateShareDistribution } from "../share-calculator";

describe("calculateShareDistribution", () => {
  it("should calculate distribution correctly for a base weight", () => {
    const totalWeight = 280;
    const result = calculateShareDistribution(totalWeight);
    
    // Total carcass is divided by 7 for shares
    expect(result.perShareKg).toBe(40);
  });

  it("should have consistent category values", () => {
    const totalWeight = 350;
    const result = calculateShareDistribution(totalWeight);
    
    // perShareKg = 350 / 7 = 50
    // If categories are predefined percentages, checking the sum of categories
    const totalFromCategories = result.kiymaKg + result.kusbasiKg + result.kemikliKg + result.digerKg;
    expect(totalFromCategories).toBeCloseTo(result.perShareKg, 2);
  });

  it("should handle larger weights", () => {
    const totalWeight = 420;
    const result = calculateShareDistribution(totalWeight);
    expect(result.perShareKg).toBe(60);
  });
});
