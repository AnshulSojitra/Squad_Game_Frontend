# Loader Component Documentation

A reusable, flexible loader component that can be used throughout your Squad Game Frontend application.

## Location
```
src/components/utils/Loader.js
```

## Installation
The component is already integrated into all pages that require loading states.

## Import
```javascript
import Loader from "../../components/utils/Loader";
```

## Usage

### 1. **Button Loader** (Default)
Used inside button elements to show loading state.

```javascript
{loading ? (
  <Loader variant="button" text="Signing in..." />
) : (
  "Login"
)}
```

**Variants:**
- Text is displayed alongside a spinning emoji (⏳)
- Compact size, suitable for buttons

---

### 2. **Simple Loader**
Minimal spinner for page sections.

```javascript
if (loading) {
  return <Loader variant="simple" text="Loading grounds..." />;
}
```

**Features:**
- Circular spinner with blue border
- Centered display
- Optional `fullScreen` prop (default: `true`)

**Props:**
- `fullScreen={false}` - Reduces height for sections instead of full pages

---

### 3. **Dashboard Loader**
Premium loader with background effects and description.

```javascript
if (loading) {
  return <Loader variant="dashboard" text="Loading dashboard" />;
}
```

**Features:**
- Gradient border and background effects
- Includes both title and description text
- Professional appearance for dashboard/admin pages
- Shows: "Loading dashboard" + "Fetching latest data…"

---

### 4. **Page Loader**
Centered loader with SVG spinner for full pages.

```javascript
if (loading) {
  return <Loader variant="page" text="Loading profile..." fullScreen={false} />;
}
```

**Features:**
- SVG-based spinner with indigo color
- Centered text below spinner
- Responsive to dark mode
- Optional `fullScreen` prop

---

## Complete Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | "button" | Type of loader: "button", "simple", "dashboard", or "page" |
| `text` | string | "Loading" | Loading message to display |
| `fullScreen` | boolean | true | Whether to take full screen height (not used in "button" variant) |

---

## Updated Files

The following files have been updated to use the new Loader component:

### User Pages
- ✅ `src/pages/user/UserLogin.js`
- ✅ `src/pages/user/UserRegister.js`
- ✅ `src/pages/user/UserProfile.js`
- ✅ `src/pages/user/UserResetPassword.js`
- ✅ `src/pages/user/UserChangePassword.js`
- ✅ `src/pages/user/UserForgotPassword.js`
- ✅ `src/pages/user/EditProfile.js`
- ✅ `src/pages/user/Mybooking.js`

### Admin Pages
- ✅ `src/pages/admin/AdminLogin.js`
- ✅ `src/pages/admin/AdminForgotPassword.js`
- ✅ `src/pages/admin/AddGround.js`

### Super Admin Pages
- ✅ `src/pages/super-admin/SuperAdminDashboard.js`
- ✅ `src/pages/super-admin/SuperAdminGrounds.js`
- ✅ `src/pages/super-admin/SuperAdminCreateAdmin.js`
- ✅ `src/pages/super-admin/SuperAdminAdminDetails.js`

### Components
- ✅ `src/components/payment/RazorpayPayment.js`

---

## Examples by Use Case

### Login Button Loader
```javascript
<button disabled={loading}>
  {loading ? (
    <Loader variant="button" text="Signing in..." />
  ) : (
    "Login"
  )}
</button>
```

### Page Loading Screen
```javascript
if (loading) {
  return <Loader variant="page" text="Loading your bookings..." fullScreen={false} />;
}
```

### Dashboard Initial Load
```javascript
if (loading) {
  return <Loader variant="dashboard" text="Loading dashboard" />;
}
```

### Quick Section Loading
```javascript
if (loading) {
  return <Loader variant="simple" text="Loading grounds..." />;
}
```

---

## Styling Notes

- All loaders are responsive and mobile-friendly
- Loaders respect Tailwind CSS theme colors
- The "page" variant adapts to dark mode automatically
- All spinners use smooth `animate-spin` CSS animation

---

## Future Enhancements

Possible improvements for later versions:
- Add `size` prop for different spinner sizes
- Add `color` prop to customize loader colors
- Add `hideText` prop to show spinner only
- Add skeleton loaders for data lists
- Add progress bar variant

---

## Support

If you need to modify the Loader component, edit `src/components/utils/Loader.js` and all pages using it will automatically use the updated version.
