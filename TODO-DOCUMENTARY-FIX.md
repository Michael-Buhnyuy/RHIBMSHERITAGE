## TODO: Make Documentary Page Crash-Proof

### Plan Breakdown (Approved ✅)

**✅ Step 1: Create this TODO.md**  
**✅ Step 2: Implement fixes in Documentary.tsx** (crash-proof with guards, logs, validation)  
**✅ Step 3: Update App.tsx**
- Add data logging/validation  
- Safe gallery filtering (skip invalid/empty)  
- Guard .map(), .length with ?? 0 / || []  
- Safe slider next/prev/lightbox  
- Error boundaries/fallback UI  

**⏳ Step 3: Update App.tsx**  
- Safe initial data shape  

**⏳ Step 4: Fix AdminPage.tsx**  
- Ensure newPost.images always valid array  

**⏳ Step 5: Test**  
- `npm run dev`  
- Console logs for data  
- Test empty/bad data  
- Navigate to /documentary  

**⏳ Step 6: attempt_completion**

Progress: 3/6 complete
