// Shared content contract. Keep this directory byte-identical in portfolio and portfolio_admin.
// Verify with: node scripts/contract-lock.mjs check   |   node scripts/contract-lock.mjs peer <other-repo-path>
export const CONTRACT_VERSION = "1.1.0";
export * from "./slug.js";
export * from "./text.js";
export * from "./lifecycle.js";
export * from "./seo.js";
export * from "./public-dto.js";
export * from "./structured-data.js";
export * from "./document.js";
