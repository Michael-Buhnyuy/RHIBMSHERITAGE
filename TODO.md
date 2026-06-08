- [ ] Update `src/components/AdmissionForm.tsx`:
  - [ ] Add payment fields to form state (`payment_method`, `momo_number`, `payment_amount`).
  - [ ] Add Step 7 UI before the submit button: dropdown with MTN MOMO / ORANGE MONEY and icons, plus conditional inputs for user number + amount.
  - [ ] Update Step 7 validation to require payment fields when a method is selected.
  - [ ] Include payment fields in `admissionData` insert to Supabase.
  - [ ] Update Step 7 review section to display chosen payment details.
- [ ] Update standalone HTML template `src/components/form/form.html` (+ `src/components/form/form.js` if needed):
  - [ ] Add payment section in Step 7 before submit.
  - [ ] Add corresponding JS validation + review population.
  - [ ] Include payment fields in submission payload.
- [ ] Run `npm run build` (or `npm run typecheck` if available) to verify compilation.


