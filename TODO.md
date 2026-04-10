# Programs Images Fix - Implementation Plan (BLACKBOXAI)

**Status:** Path fix complete, testing dev server

## Steps:
- [x] 1. Fix glob paths in src/utils/imageHelpers.ts ('./assets/' → '../assets/') ✓
- [ ] 2. cd RHIBMSHERITAGE && npm run dev → Test /programs: 6 images load
- [ ] 3. npm run build && npm run preview → Prod verification
- [ ] 4. Update TODO-PROGRAMS-IMAGES.md / TODO-IMAGES.md ✓ complete
- [ ] 5. attempt_completion

**Goal:** Reuse About.tsx imageHelpers mapping in Programs.tsx (path fix enables it)

**Verification:** programs.json imageIds match filenames; logic identical.
