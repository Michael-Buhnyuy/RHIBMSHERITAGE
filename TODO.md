# Supabase Storage Integration - TODO Steps

## Status: 0/14 ✅

### 1. **Install Dependencies** ✅
- [x] `npm install uuid @types/uuid`

### 2. **Create DB Table** ✅
- [x] Create 'admissions' table in Supabase with schema

### 3. **Create storageHelpers.ts** ✅
- [x] src/utils/storageHelpers.ts (generic upload/delete/getSignedUrl)

### 4. **Update AdmissionForm.tsx** ✅
- [x] Add state for paths
- [x] Upload on file change 
- [x] Save to admissions table

### 5. **Update form.js** ✅
- [x] Store paths in form data
- [x] Submit to admissions table

### 6. **Connect Admin.tsx** ✅
- [x] Upload logic + save paths

### 7. **Update imageHelpers.ts** ✅
- [x] Use storageHelpers

### 8. **Add Delete Logic** (Pending)
- [ ] Remove buttons + storage.remove()

### 9. **Test AdminPage** (Pending)
- [ ] Existing - verify paths + signed URLs

### 10. **Test AdmissionForm** (Pending)
- [ ] Certs/passport upload + DB save

### 11. **Test form.js** (Pending)
- [ ] Cert/passport + submit

### 12. **RLS Policies** (Pending)
- [ ] User owns own files/admissions

### 13. **Admin Queries** (Pending)
- [ ] List user admissions

### 14. **Completion** (Pending)
- [ ] attempt_completion

*Updated automatically after each step.*

