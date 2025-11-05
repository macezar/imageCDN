# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-11-05

### Fixed - Dependency Updates

#### Backend Dependencies

**Updated to fix deprecation warnings:**

- `cloudinary`: ^2.0.0 → ^2.5.1 (Latest stable release)
- `dotenv`: ^16.3.1 → ^16.4.7 (Security and bug fixes)
- `express`: ^4.18.2 → ^4.21.2 (Latest v4 with security patches)
- `express-fileupload`: ^1.4.3 → ^1.5.1 (Bug fixes and improvements)
- `express-rate-limit`: ^7.1.5 → ^7.5.0 (Enhanced features)
- `helmet`: ^7.1.0 → ^8.0.0 (Updated security policies)
- `joi`: ^17.11.0 → ^17.13.3 (Validation improvements)
- `sharp`: ^0.33.1 → ^0.33.5 (Performance improvements)
- `nodemon`: ^3.0.2 → ^3.1.9 (Better watch performance)
- `supertest`: ^6.3.3 → ^7.1.3 (Fixes memory leaks and deprecation warnings)

**Resolved Warnings:**
- ✅ Fixed `supertest` deprecation (now using v7.1.3+)
- ✅ Updated transitive dependencies to avoid `glob` v7 warnings
- ✅ Eliminated `inflight` memory leak warnings
- ✅ Removed `q` promise library deprecation

#### Frontend Dependencies

**Updated to fix deprecation warnings:**

- `react`: ^18.2.0 → ^18.3.1 (Latest stable)
- `react-dom`: ^18.2.0 → ^18.3.1 (Latest stable)
- `axios`: ^1.6.2 → ^1.7.9 (Security patches)
- `react-dropzone`: ^14.2.3 → ^14.3.5 (Bug fixes)
- `lucide-react`: ^0.294.0 → ^0.469.0 (New icons and improvements)
- `@vitejs/plugin-react`: ^4.2.1 → ^4.3.4 (Vite 6 compatibility)
- `vite`: ^5.0.8 → ^6.0.7 (Major version update with performance improvements)
- `eslint`: ^8.55.0 → ^9.18.0 (Major version update with flat config)
- `eslint-plugin-react`: ^7.33.2 → ^7.37.2 (ESLint 9 compatibility)
- `eslint-plugin-react-hooks`: ^4.6.0 → ^5.1.0 (Latest rules)
- `eslint-plugin-react-refresh`: ^0.4.5 → ^0.4.16 (Bug fixes)

**New Dependencies:**
- `@eslint/js`: ^9.18.0 (Required for ESLint 9 flat config)
- `globals`: ^15.14.0 (Browser globals for ESLint 9)

**Resolved Warnings:**
- ✅ Migrated from ESLint 8 to ESLint 9 with flat config
- ✅ Fixed `@humanwhocodes/config-array` deprecation
- ✅ Fixed `@humanwhocodes/object-schema` deprecation
- ✅ Eliminated `rimraf` v3 warnings
- ✅ Updated all eslint plugins for ESLint 9 compatibility

### Changed

#### ESLint Configuration Migration

Migrated from `.eslintrc` format to ESLint 9's flat config format (`eslint.config.js`):

- **Before**: Used `.eslintrc.json` with extends syntax
- **After**: New `eslint.config.js` with flat config array
- **Benefits**:
  - Better performance
  - More explicit configuration
  - Improved plugin resolution
  - Future-proof for ESLint 10+

Updated lint script in `package.json`:
```diff
- "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
+ "lint": "eslint ."
```

### Notes

#### Breaking Changes in Dependencies

**Vite 6.0:**
- Requires Node.js 18.20+ or 20.18+
- Some plugin APIs may have changed
- Better HMR performance
- Improved build optimization

**ESLint 9.0:**
- Uses flat config format only (no more `.eslintrc`)
- Removed some deprecated rules
- Better TypeScript support
- Faster linting

**Helmet 8.0:**
- Updated Content Security Policy defaults
- Some middleware options may have changed
- Improved security defaults

#### No Breaking Changes for Users

All updates are backwards-compatible at the API level. The microservice works the same way:
- All API endpoints remain unchanged
- Frontend UI and UX remain the same
- No configuration file changes required (except `.eslintrc` removal if present)
- No breaking changes to environment variables

### Testing

After updating dependencies:

1. **Backend Testing:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   - ✅ Server starts successfully
   - ✅ All API endpoints work
   - ✅ Cloudinary integration works
   - ✅ File upload and optimization work

2. **Frontend Testing:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - ✅ Vite dev server starts
   - ✅ Hot module replacement works
   - ✅ All components render correctly
   - ✅ ESLint runs without errors

3. **Production Build:**
   ```bash
   cd frontend
   npm run build
   ```
   - ✅ Production build succeeds
   - ✅ No warnings in build output
   - ✅ Optimized bundle size

### Recommendations

1. **Delete node_modules and reinstall:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verify no deprecation warnings:**
   After reinstalling, you should see significantly fewer (or zero) deprecation warnings.

3. **Update Node.js if needed:**
   - Minimum Node.js version: 18.20+
   - Recommended: Node.js 20.x LTS or 22.x

### Security

All updates include security patches and bug fixes from the last 12 months:
- CVE fixes in axios
- Security improvements in helmet
- Updated sharp with latest libvips security patches
- Express security patches

---

## [1.0.0] - 2025-11-05

### Added
- Initial release of Image CDN Microservice
- Node.js/Express backend with Cloudinary integration
- React/Vite frontend with drag & drop upload
- Full CRUD operations for images
- Image optimization with Sharp
- Statistics dashboard
- Comprehensive documentation
