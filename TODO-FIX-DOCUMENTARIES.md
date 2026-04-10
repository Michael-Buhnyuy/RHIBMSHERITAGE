# Fix Supabase Images Display TODO

## Analysis
- Hook expects category: 'internationalTours' but DB likely uses "international"
- images jsonb needs defensive parsing
- Add debugging logs

## Plan
1. [x] Update useDocumentaries.ts - category mapping, defensive JSON parse/validate, logs ✓
2. [ ] Test with admin create - verify data flow
3. [ ] Check browser console for logs/raw data
4. [ ] Verify slider/lightbox displays images

## Category Mapping
DB -> UI
international -> internationalTours
national -> nationalTours
events -> events
awards -> awards

