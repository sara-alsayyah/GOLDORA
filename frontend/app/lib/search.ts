export function inferVisualSearch(fileName: string) {
  const normalized = fileName.toLowerCase();

  const categoryMatchers = [
    { slug: "bags", keywords: ["bag", "handbag", "purse", "tote"] },
    { slug: "shoes", keywords: ["shoe", "heel", "sneaker", "boot", "loafer"] },
    { slug: "beauty", keywords: ["beauty", "makeup", "serum", "cream", "lip", "skin"] },
    { slug: "jewelry", keywords: ["jewel", "ring", "necklace", "bracelet", "earring"] },
    { slug: "home", keywords: ["home", "candle", "decor", "vase", "bedding"] },
    { slug: "women", keywords: ["dress", "skirt", "top", "blouse", "women"] },
    { slug: "men", keywords: ["men", "shirt", "jacket", "pants"] },
  ];

  const matchedCategory = categoryMatchers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );

  const searchTerm =
    normalized
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b(img|image|photo|scan|screenshot)\b/g, "")
      .trim() || "";

  return {
    category: matchedCategory?.slug ?? "",
    search: searchTerm,
  };
}
