# Books E-Commerce Frontend

A clean, production-ready Next.js frontend for a single-admin books e-commerce site. Built with Next.js (App Router), Tailwind CSS, and Zustand for state management.

## Features

- 🏠 **Home Page** - Featured books, new arrivals, and most popular sections
- 📚 **Book Listing** - Search, filter by genre/format/price, and browse all books
- 📖 **Book Detail** - Full product details with image carousel, format selection, and tabs
- ❤️ **Favorites** - Save and manage favorite books
- 🛒 **Shopping Cart** - Add items, adjust quantities, and view cart summary
- 💳 **Checkout** - Multi-step checkout process (shipping → payment → review)
- 👤 **Account** - Profile management and order history
- 🔐 **Auth Pages** - Login/Register UI with mock persistence, remember-me, and admin demo credential
- 🔧 **Admin Panel** - Product management with edit capabilities

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** - Custom warm, paper-book inspired color palette
- **Zustand** - State management for cart and favorites
- **react-markdown** - Markdown rendering for hero content and descriptions
- **localStorage** - Persistence for cart and favorites

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                         # Next.js App Router entrypoint
│   ├── layout.jsx              # Root layout w/ shared providers
│   ├── globals.css             # App-wide styles
│   ├── page.jsx                # Home page
│   ├── (auth)/                 # Grouped auth segment
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   ├── (account)/
│   │   └── account/page.jsx    # Dashboard
│   ├── (admin)/
│   │   ├── login/page.jsx
│   │   └── products/page.jsx
│   ├── books/
│   │   ├── page.jsx
│   │   └── [slug]/page.jsx
│   ├── cart/page.jsx
│   ├── checkout/page.jsx
│   └── favorites/page.jsx
├── src/
│   ├── components/
│   │   ├── common/             # Header, Footer, Navbar
│   │   └── ui/                 # Buttons, cards, modals, product UI
│   ├── hooks/
│   │   └── useAuthGuard.js
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── favoriteStore.js
│   ├── services/               # 🔥 API call layer
│   │   ├── auth.service.js
│   │   ├── books.service.js
│   │   └── cart.service.js
│   ├── lib/
│   │   └── apiClient.js        # Axios/fetch client
│   └── utils/
│       └── format.js
├── data/
│   └── demo-books.json
├── public/
│   └── hero.md
├── scripts/
│   └── auth-smoke.mjs
├── next.config.js
├── package.json
└── tailwind.config.js
```

## Demo Data

Demo data is stored in `/data/demo-books.json` and contains 15 books with:
- Multiple formats (paperback, hardcover, eBook)
- Various genres and authors
- Stock levels (including out-of-stock items)
- Complete metadata (ISBN, publisher, publication dates, etc.)

### Demo Data Requirements Met:
- ✅ 15 books total
- ✅ At least 3 books with multiple formats
- ✅ At least 1 book marked out-of-stock
- ✅ At least 2 books digital-only (eBook)

## State Management

### Cart Store (`src/stores/cartStore.js`)
- Manages shopping cart items
- Persists to localStorage (key: `cart-storage`)
- Methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotal`

### Favorites Store (`src/stores/favoriteStore.js`)
- Manages favorite books
- Persists to localStorage (key: `favorite-storage`)
- Methods: `toggleFavorite`, `isFavorite`, `removeFavorite`, `clearFavorites`

- ### Auth Store (`src/stores/authStore.js`)
  - Handles mock registration/login/logout with client-side persistence
  - Persists users to `localStorage` (`bookstore_users`) and sessions to `localStorage` or `sessionStorage` (`bookstore_session`)
  - Exposes helper utilities (`queueAuthRedirect`, `consumeAuthRedirect`) for client-side route protection
  - Includes a baked-in demo admin credential (`admin@local.test` / `AdminPass123!`)

## Mock Authentication (Frontend-only)

- **Register (`/auth/register`)**
  - Fields: name, display name, email, password, confirm password
  - Optional “Register as demo admin” toggle (dev builds only)
  - Client-side validation for email + password strength and inline messaging
  - Stores users in `localStorage` under `bookstore_users`
- **Login (`/auth/login`)**
  - Fields: email, password, remember me
  - Password show/hide toggle and inline validation hints
  - “Remember me” keeps the session in `localStorage`; unchecked uses `sessionStorage`
  - Supports deep-linking via `?next=/checkout` to return users to protected routes after login
- **Protected Routes**
  - `/checkout`, `/account`, and `/admin/*` use a client guard that queues the requested path and redirects to `/auth/login`
  - Guard displays “Please login to continue” toast when redirecting
- **Logout**
  - Triggered via the Header dropdown (`authStore.logout()`); `/auth/logout` route exists for reference but does not mutate storage on the server
- **Security Note**
  - Passwords are stored in plain text strictly for demo purposes. Replace the flow with a secure backend before production.

## Resetting Demo State

To reset the demo state, clear localStorage:

```javascript
// In browser console:
localStorage.removeItem('cart-storage');
localStorage.removeItem('favorite-storage');
localStorage.removeItem('bookstore_users');
localStorage.removeItem('bookstore_session');
sessionStorage.removeItem('bookstore_session');
sessionStorage.removeItem('bookstore_pending_path');
sessionStorage.removeItem('bookstore_pending_toast');
```

Or clear all:
```javascript
localStorage.clear();
```

## Admin Access

- Navigate to `/auth/login?next=/admin/products`
- Use the baked-in credential `admin@local.test / AdminPass123!` **or** register a new account via `/auth/register` (enable “Register as demo admin” toggle in non-production builds)
- After login, you are redirected to `/admin/products`
- Admin-only UI elements (nav links, badges) respect the `user.isAdmin` flag from the auth store

## Smoke Tests

Run a lightweight auth smoke test that exercises registration + login flows in memory:

```bash
npm run auth:smoke
```

The script (`scripts/auth-smoke.mjs`) mocks `localStorage`/`sessionStorage`, registers a demo user, and verifies both regular and admin logins succeed without touching the browser.

## Color Palette

The app uses a warm, paper-book inspired color palette:

- **Primary**: `#0D3B66` (Deep ocean blue)
- **Secondary**: `#F95738` (Warm coral)
- **Accent**: `#FFB703` (Golden amber)
- **Background**: `#FAF8F6` (Soft paper)
- **Surface**: `#FFFFFF` (Card backgrounds)
- **Muted**: `#6B6E70` (Muted text)

## Loading States

All pages include loading skeletons:
- Product grids show `ProductCardSkeleton`
- Product detail pages show `ProductDetailSkeleton`
- Artificial delays (400-800ms) simulate network requests

## Placeholder Images

Book cover images are stored in `/public/assets/covers/`. For demo purposes:
- Use placeholder image services (e.g., placeholder.com, via.placeholder.com)
- Or add actual book cover images
- Images are referenced in `demo-books.json` as `/assets/covers/{filename}.jpg`

## Known Limitations

- **No Backend**: All data is mock/demo data. Cart, favorites, and auth persist only in browser storage.
- **No Real Payments**: Checkout process is UI-only with mock order confirmation.
- **Mock Authentication**: Login/Register flows intentionally store plain-text passwords for demo purposes. Replace with a secure backend.
- **No Image Upload**: Admin product editing doesn't support image uploads (use file paths).

## Replacing Demo Data with Real Backend

To connect to a real backend:

1. **API Layer**: Create API routes in `/app/api/` or use external API
2. **Data Fetching**: Replace direct imports of `demo-books.json` with API calls
3. **State Management**: Update stores to sync with backend (add API calls)
4. **Authentication**: Implement real auth (NextAuth.js, Auth0, etc.)
5. **Image Storage**: Use cloud storage (AWS S3, Cloudinary, etc.) for book covers

Example API integration:
```javascript
// Replace: import demoBooks from '@/data/demo-books.json';
// With:
const response = await fetch('/api/books');
const books = await response.json();
```

## Development

- **Hot Reload**: Enabled by default in Next.js dev mode
- **Linting**: Run `npm run lint` (if configured)
- **Build**: Run `npm run build` for production build
- **Start**: Run `npm start` to start production server

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design (mobile, tablet, desktop)

## License

This is a demo project for educational purposes.


