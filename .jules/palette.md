# Palette's Journal

## 2024-05-22 - Inconsistent Form States
**Learning:** Found an accessibility pattern where some forms (ContractScreen) use inline styles for disabled states, while others (IdentityScreen) lack disabled states entirely. This inconsistency hurts learnability.
**Action:** Standardize on CSS modules for disabled states (using `:disabled` pseudo-class) rather than inline logic to ensure consistent visual feedback and reduced code complexity.
