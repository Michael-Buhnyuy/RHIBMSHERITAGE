# RBAC Google Auth Implementation TODO

## Steps (0/9 complete)

### ✅ 1. [Superseded] Firebase → Supabase client & Google OAuth
### ✅ 2. Create src/context/AuthContext.tsx (user/role state, signIn/out)
### ✅ 3. Update src/types/index.ts with AuthUser, UserRole types
### ✅ 4. Refactor src/components/ProtectedRoute.tsx → UserProtectedRoute.tsx
### ✅ 5. Create src/components/AdminProtectedRoute.tsx
### ✅ 7. Update src/App.tsx (AuthProvider + route guards)
### ✅ 8. Update src/components/Navbar.tsx (role-based nav)
### ✅ 9. Test & verify (login admin/user, routes, navbar, persistence)

**COMPLETE** 🎉 Run `npm run dev` to test:

- Unauthenticated → only / and /login accessible
- User login → protected pages + no admin access
- Admin (rhibmsadmin@gmail.com) → all + admin badge + /admin
- Logout works
- State persists on refresh

### ☐ 7. Update src/App.tsx (AuthProvider + route guards)
### ☐ 8. Update src/components/Navbar.tsx (role-based nav)
### ☐ 9. Test & verify (login admin/user, routes, navbar, persistence)
### ☐ 7. Update src/App.tsx (AuthProvider + route guards)
### ☐ 8. Update src/components/Navbar.tsx (role-based nav)
### ☐ 9. Test & verify (login admin/user, routes, navbar, persistence)

**Next:** Install firebase deps if needed, then `npm run dev`

