# Image Fix Progress - RHIBMS Heritage ✅ 2/8

**Current Directory:** RHIBMSHERITAGE/

**Task:** Fix ALL images loading on Vercel (local OK → prod broken icons)

## ✅ Complete ✓
- [x] Documentary.tsx - Robust `**/*` globs + deep path parsing ✓
- [x] TODO tracking ✓

## 🔄 Next Steps (3/8 → Complete)
```
3. [ ] imageHelpers.ts - Add fallbackImages + founderImages globs
4. [ ] About.tsx - Replace static `import founda.jpg` → helpers.founda  
5. [ ] Programs.tsx - `/assets/fallback-program.jpg` → helpers.fallbackImages.program
6. [ ] PartnerGrid.tsx - `/fallback-partner.jpg` → helpers.fallbackImages.partner
7. [ ] Create fallback PNGs in src/assets/images/fallbacks/
8. [ ] Test: npm run build && preview (prod sim)
9. [ ] Vercel deploy - NO broken images!
```

**Test Documentary now:**
```bash
cd RHIBMSHERITAGE && npm run dev
```
→ http://localhost:5173/documentary → Verify galleries scroll/load.

**Next:** Edit imageHelpers.ts
