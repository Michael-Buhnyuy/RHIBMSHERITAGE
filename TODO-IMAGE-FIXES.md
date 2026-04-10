# Image Fixes Master TODO - RHIBMS Heritage

**Current Directory:** RHIBMSHERITAGE/

**Status:** Planning → Implementation

## Plan Steps:
1. [x] Update imageHelpers.ts - verified globs + inline SVG fallbacks (no file deps)
2. [x] Update About.tsx - already uses founderImages.founda (good)
3. [x] Update PartnerGrid.tsx - added onError fallback to both national/international imgs
4. [ ] Update useDocumentaries.ts - Add DB→UI category mapping, defensive images JSON parsing, console.logs
5. [x] Verify Programs.tsx - onError + fallbackImages.program good
6. [ ] Test: `npm run dev` → check /programs /about /partners /documentary
7. [ ] Build test: `npm run build && npm run preview` (Vercel simulation)
8. [ ] Typecheck: `npm run typecheck`
9. [ ] Update all TODOs with ✓ status
10. [ ] Vercel deploy test

**Progress Tracking:**
- Update this file after each step completion
- No broken images on Vercel target

