# InkVerse E-Commerce Project Documentation

---

# Project Name

InkVerse

Short summary:
InkVerse is a bookstore e-commerce project with a React/Next.js frontend and an Express/PostgreSQL backend. The app supports browsing books, product detail views, cart and checkout workflows, user registration/login, favorites, and admin book import functionality.

---

# Table of Contents

- Project Overview
- Tech Stack
- Project Architecture
- Folder Breakdown
- Routing
- Components
- Pages / Screens
- API Layer
- State Management
- Authentication
- Authorization
- Database
- Business Logic
- Services
- Hooks
- Utility Functions
- Configuration
- Styling
- Assets
- Performance
- Error Handling
- Security
- External Integrations
- Environment Variables
- Build & Deployment
- Testing
- Known Issues
- Improvement Suggestions
- Dependency Graph
- File Reference
- Developer Onboarding
- Glossary
- Appendix

---

# Project Overview

## What this project does
InkVerse is a full-stack books e-commerce application. It exposes a Next.js frontend for browsing books, viewing book details, managing a shopping cart, managing favorites, and checking out. The backend is an Express server with PostgreSQL database integration, authentication, book management, user cart/favorite management, and order checkout endpoints.

## Why it exists
The project exists to provide a bookstore shopping experience with product discovery, user persistence, cart management, and admin-driven book import. It is built as a demo/learning project for e-commerce patterns.

## Primary users
- End customers browsing books and purchasing them
- Registered users tracking cart, orders, and favorites
- Admin users importing and managing books via backend script

## Main business purpose
InkVerse is intended as a shopping platform for selling books, offering curated selections, author metadata, and checkout workflows.

---

# Tech Stack

- Frontend
  - Next.js 14
  - React 18
  - Zustand for state management
  - Axios for HTTP requests
  - Framer Motion for animations
  - Swiper for carousels
  - React Hook Form + Zod for form validation
  - Tailwind CSS for styling
  - Lucide React for icons
  - React Markdown for markdown rendering

- Backend
  - Node.js
  - Express 5
  - PostgreSQL via `pg`
  - JWT authentication via `jsonwebtoken`
  - Bcrypt for password hashing
  - dotenv for environment variables
  - Cors, helmet, cookie-parser for security and CORS
  - Winston for logging
  - Nodemailer for bug-report emails
  - Cloudinary SDK and streamifier for image upload support

- Database
  - PostgreSQL

- Authentication
  - JWT access + refresh tokens stored in cookies
  - Protected backend routes via middleware

- Styling
  - Tailwind CSS
  - Custom utility classes and theme extensions

- Deployment
  - Not found in current repository

- CI/CD
  - Not found in current repository

- Testing
  - Not found in current repository

---

# Project Architecture

## Overall architecture
This project is separated into two primary applications:

1. `client/`: Next.js frontend application.
2. `server/`: Express backend application.

The frontend communicates with backend APIs via `axios` using cookie-based JWT session management.

## Folder organization
- `client/`: Next.js app source, components, hooks, stores, services.
- `server/`: Express app source, configuration, routes, controllers, services, utilities, database connection.

## Design patterns
- Client-side state management using Zustand.
- REST API backend controllers with route modules.
- Middleware for auth validation.
- `useEffect` based page data loading.
- `persist` middleware for localStorage persistence.

## Architectural style
- Frontend served as a React SPA/Next.js app.
- Backend is a REST API.
- API-driven data loading.

## Data flow
- Frontend sends requests to backend using `src/lib/apiClient.js`.
- Backend verifies JWT from cookies, queries PostgreSQL, and returns JSON.
- Frontend persists cart/favorites locally and re-syncs with backend where applicable.

## Component hierarchy
- App Root (`client/app/layout.jsx`) wraps the app with `AuthProvider`.
- Most pages render reusable UI components from `client/src/components/ui/`.
- `Header` and `Footer` are global common components.
- `ToastContext` provides toast notifications.

## Route structure
- Public pages: `/`, `/books`, `/books/[id]`, `/auth/login`, `/auth/register`, `/favorites`, `/cart`, `/checkout`, `/order-success`
- Admin and account pages are available in app but not fully enforced by backend.

---

# Folder Breakdown

## client/
Purpose: Frontend application source.
Important files:
- `app/layout.jsx`: root layout wiring `AuthProvider`.
- `app/globals.css`: app-level global imports.
- `src/lib/apiClient.js`: axios instance with refresh token interceptor.
- `src/stores/`: Zustand stores for auth, cart, favorites.
- `src/services/`: API wrapper functions.
- `src/components/`: reusable UI components.
- `src/hooks/`: custom hooks.
- `src/contexts/ToastContext.js`: toast provider.
- `src/utils/`: formatting helpers.
Interaction:
- `app` pages import components and services.
- `AuthProvider` initializes user auth state on page load.

## server/
Purpose: Backend API server.
Important files:
- `src/app.js`: Express app setup.
- `src/server.js`: server bootstrap and PostgreSQL connection.
- `src/routes/`: route definitions.
- `src/controllers/`: request handlers.
- `src/middlewares/auth.middleware.js`: auth token validation.
- `src/config/env.config.js`: environment variables loader.
- `src/database/db.js`: PostgreSQL pool.
- `src/services/user.service.js`: user DB operations.
- `src/utils/token.js`: JWT generation.
- `src/utils/uploadToCloudinary.js`: Cloudinary upload helpers.
Interaction:
- `routes` map endpoints to controllers.
- `controllers` query DB and send JSON responses.
- `middlewares` enforce permissions.

---

# Routing

## Frontend routes

### `/`
- Component: `client/app/(main)/page.jsx`
- Purpose: Home page with featured/new arrival books and bug report modal.
- Public: yes
- Authentication: not required
- APIs used: `GET /book/home`

### `/books`
- Component: `client/app/(main)/books/page.jsx` (renders `BooksClient`)
- Purpose: Books listing page with fallback while loading.
- Public: yes
- Authentication: not required
- APIs used: likely `GET /book` via `books.service.js`

### `/books/[id]`
- Component: `client/app/(main)/books/[id]/page.jsx`
- Purpose: Book detail page with image carousel, format selection, add-to-cart, and buy-now.
- Public: yes
- Authentication: required for cart/checkout actions via API
- APIs used: `GET /book/:id`, `POST /user/cart`, `POST /user/checkout/book`

### `/cart`
- Component: `client/app/(main)/cart/page.jsx`
- Purpose: Full cart page with item list, quantity controls, and checkout link.
- Public: yes (but checkout requires auth)
- Authentication: local cart stored in Zustand; server sync only after login
- APIs used: cart item update and removal via `apiClient` in cart drawer and page

### `/checkout`
- Component: `client/app/(main)/checkout/page.jsx`
- Purpose: Multi-step checkout with shipping/payment/review and place order.
- Public: guarded by `useAuthGuard` in the page.
- Authentication: required
- APIs used: `POST /user/checkout/cart`

### `/favorites`
- Component: `client/app/(main)/favorites/page.jsx`
- Purpose: View and remove favorite books.
- Public: yes, but favorite data loads via auth-protected endpoint.
- Authentication: required for API calls
- APIs used: `GET /user/favorites`, `DELETE /user/favorites`

### `/order-success`
- Component: `client/app/(main)/order-success/page.jsx`
- Purpose: Order confirmation page after checkout.
- Public: yes
- Authentication: no
- APIs used: none

### `/auth/login`
- Component: `client/app/auth/login/page.jsx`
- Purpose: login flow.
- Public: yes
- APIs used: `POST /api/auth/login`

### `/auth/register`
- Component: `client/app/auth/register/page.jsx`
- Purpose: register flow.
- Public: yes
- APIs used: `POST /api/auth/register`

### `/account`
- Component: `client/app/(main)/account/page.jsx`
- Purpose: user profile and account overview.
- Public: no (requires auth state from store)
- APIs used: none directly; uses stored auth profile state

### `*` missing/404
- Component: `client/app/not-found.jsx`
- Purpose: custom 404 page

## Backend routes

### Auth routes

#### `POST /api/auth/register`
- Controller: `server/src/controllers/auth/auth.controller.js` (`register`)
- Purpose: register new user and create refresh token
- Request body: `{ name, email, password }`
- Response: `201` with success message
- Authentication: none

#### `POST /api/auth/login`
- Controller: `server/src/controllers/auth/auth.controller.js` (`login`)
- Purpose: authenticate user and issue cookies
- Request body: `{ email, password }`
- Response: `201` with user data and sets cookies `accessToken`, `refreshToken`
- Cookie options: `httpOnly`, `secure: true`, `sameSite: none`
- Authentication: none

#### `POST /api/auth/refresh`
- Controller: `server/src/controllers/auth/token.controller.js`
- Purpose: refresh access token using cookie refresh token
- Request cookies: `refreshToken`
- Response: `201` with `accessToken`
- Authentication: none, required cookie

#### `POST /api/auth/logout`
- Controller: `server/src/controllers/auth/auth.controller.js` (`logout`)
- Purpose: clear auth cookies
- Response: `200`
- Authentication: none required

### User routes

Protected by `authMiddleware`.

#### `GET /user/profile`
- Controller: inline route in `user.route.js`
- Purpose: return authenticated user profile
- Response: `{ user: { id, email, name, createdAt } }`

#### `POST /user/cart`
- Controller: `server/src/controllers/user/addTo.controller.js` (`addToCart`)
- Purpose: add book format to the user's cart
- Request body: `{ formatId, quantity }`
- Response: success message

#### `GET /user/cart`
- Controller: `server/src/controllers/user/get.controller.js` (`getCart`)
- Purpose: return cart items for authenticated user
- Response: `cart` array with book metadata

#### `DELETE /user/cart/:formatId`
- Controller: `server/src/controllers/user/remove.controller.js` (`removeFromCart`)
- Purpose: remove cart item by format id
- Response: success message

#### `PATCH /user/cart`
- Controller: `server/src/controllers/user/update.controller.js` (`updateQuantityInCart`)
- Purpose: update quantity of cart item
- Request body: `{ format_id, quantity }`

#### `POST /user/favorites`
- Controller: `server/src/controllers/user/addTo.controller.js` (`addToFavorites`)
- Purpose: toggle a favorite book for authenticated user
- Request body: `{ bookId }`

#### `GET /user/favorites`
- Controller: `server/src/controllers/user/get.controller.js` (`getFavorites`)
- Purpose: fetch favorite books for authenticated user
- Response: favorites array

#### `DELETE /user/favorites`
- Controller: `server/src/controllers/user/remove.controller.js` (`removeFromFavorite`)
- Purpose: remove a favorite book
- Request body: `{ bookId }`

#### `POST /user/checkout/cart`
- Controller: `server/src/controllers/user/checkout.controller.js` (`checkoutCart`)
- Purpose: place an order for all items in cart
- Response: order ID

#### `POST /user/checkout/book`
- Controller: `server/src/controllers/user/checkout.controller.js` (`checkoutSingleBook`)
- Purpose: place order for a single book format
- Request body: `{ formatId, quantity }`

### Book routes

#### `POST /book/add`
- Controller: `server/src/controllers/books/addBook.controller.js`
- Purpose: upload images and create a book record with formats
- Form data: book metadata, optional image files
- Middleware: `upload.fields(...)`

#### `GET /book/home`
- Controller: `server/src/controllers/books/getHomeBooks.controller.js`
- Purpose: fetch latest and featured books for home page

#### `GET /book`
- Controller: `server/src/controllers/books/getBooks.controller.js`
- Purpose: list books with search, genre filter, sorting, pagination
- Query params: `page`, `limit`, `search`, `genre`, `sort`

#### `GET /book/:id`
- Controller: `server/src/controllers/books/getBookById.controller.js`
- Purpose: fetch detailed book data by id

### System routes

#### `POST /api/system/report-bug`
- Controller: `server/src/controllers/system/bug.controller.js`
- Purpose: send bug report email to admin
- Request body: `{ message }`

---

# Components

## `Header` (`client/src/components/common/Header.jsx`)
Purpose: application top navigation bar.
Props: none.
State:
- `isCartOpen`
- `isScrolled`
- `searchQuery`
Dependencies:
- `useCartStore`, `useAuthStore`, `CartDrawer`
Children:
- search input, cart button, auth links, favorites link
Side effects:
- scroll listener sets sticky header mode
- triggers auth `init()` on mount
Performance:
- uses `AnimatePresence` and motion animation

## `Footer` (`client/src/components/common/Footer.jsx`)
Purpose: application footer with contact links.
Props: none.
State:
- `toasts`
- `copied`
Dependencies:
- `ToastContainer`
Side effects:
- writes to clipboard

## `UI` components (`client/src/components/ui/UI.jsx`)
Components:
- `Button`: styled button wrapper
- `Input`: accessible input field with label, error, and adornment
- `Card`: styled container
- `Badge`: small label
- `SectionHeader`: section heading with accent line

## `Toast` (`client/src/components/ui/Toast.jsx`)
Purpose: animated toast notifications.
Props:
- `message`, `type`, `onClose`, `duration`, `action`
State:
- internal visibility timer
Dependencies:
- `AnimatePresence`

## `Skeleton` (`client/src/components/ui/Skeleton.jsx`)
Purpose: loading placeholders.
Components:
- `Skeleton`, `ProductCardSkeleton`, `ProductDetailSkeleton`, `SearchSkeleton`

## `ProductCard` (`client/src/components/ui/ProductCard.jsx`)
Purpose: book card for carousel and featured book displays.
Props:
- `book`, `index`
State: none
Dependencies:
- `FavoritesButton`, `Image`, `formatPrice`

## `ProductCarousel` (`client/src/components/ui/ProductCarousel.jsx`)
Purpose: carousel grid of book cards.
Props:
- `books`
Dependencies:
- `Swiper`, `ProductCard`

## `ImageCarousel` (`client/src/components/ui/ImageCarousel.jsx`)
Purpose: animated book image carousel on detail page.
Props:
- `images`, `title`
State:
- internal `page` and swipe direction

## `QuantityStepper` (`client/src/components/ui/QuantityStepper.jsx`)
Purpose: quantity selector with plus/minus buttons.
Props:
- `value`, `onChange`, `min`, `max`, `disabled`

## `FavoritesButton` (`client/src/components/ui/FavoritesButton.jsx`)
Purpose: mark/unmark favorites.
Props:
- `bookId`, `className`
Dependencies:
- `useFavoriteStore`, `useToast`, `apiClient`

## `Modal` (`client/src/components/ui/Modal.jsx`)
Purpose: overlay dialog wrapper.
Props:
- `isOpen`, `onClose`, `title`, `children`, `size`
Side effects:
- disables body scroll when open

## `BugReportModal` (`client/src/components/ui/BugReport.jsx`)
Purpose: report UI issues via email.
Props:
- `isOpen`, `onClose`
State:
- `step`, `message`, `category`, `isSubmitting`
Dependencies:
- `apiClient`, `useToast`

## `CartDrawer` (`client/src/components/ui/CartDrawer.jsx`)
Purpose: slide-out cart details and quick checkout.
Props:
- `isOpen`, `onClose`
State:
- `isRemoving`
Dependencies:
- `useCartStore`, `useSyncCart`, `useToast`, `apiClient` 

## `ProductGrid` (`client/src/components/ui/ProductGrid.jsx`)
Purpose: list view of search results.
Props:
- `books`, `loading`, `showQuantity`
Dependencies:
- `SearchProductCard`, `ProductCardSkeleton`

## `SearchProductCard` (`client/src/components/ui/SearchProductCard.jsx`)
Purpose: detailed searchable book list item.
Props:
- `book`, `index`
State:
- `selectedFormat`, `adding`
Dependencies:
- `FavoritesButton`, `useSyncCart`, `useToast`, `useCartStore`, `apiClient`

## `AdminProductForm` (`client/src/components/ui/AdminProductForm.jsx`)
Purpose: admin edit form for books.
Props:
- `book`, `onSave`, `onCancel`
State:
- `formData`, `errors`, `formatOptions`

## `Hero` (`client/src/components/ui/Hero.jsx`)
Purpose: home page hero section.
Props:
- `onOpenBugReport`
State:
- internal mouse motion tracking
Dependencies:
- `motion`, `Link`

---

# Pages / Screens

## Home page `/`
- Component: `client/app/(main)/page.jsx`
- Data loaded: featured and latest books from `homeBooks()`
- Actions: open bug report, scroll to collections
- API calls: `GET /book/home`
- Loading state: skeleton cards shown while loading
- Error handling: console log only

## Books listing `/books`
- Component: `client/app/(main)/books/booksClient.jsx`
- Data loaded: book list from `GET /book` (page, search, genre, sort)
- Actions: search, browse, select book
- API calls: `GET /book?` via service
- Loading state: skeleton grid
- Error handling: not explicitly handled beyond network fail

## Book detail `/books/[id]`
- Component: `client/app/(main)/books/[id]/page.jsx`
- Data loaded: book details by ID
- Actions: select format, add to cart, buy now, favorite book
- API calls: `GET /book/:id`, `POST /user/cart`, `POST /user/checkout/book`
- Loading state: `ProductDetailSkeleton`
- Error handling: console error and toast notifications

## Cart `/cart`
- Component: `client/app/(main)/cart/page.jsx`
- Data loaded: local cart store
- Actions: remove items, change quantity, proceed to checkout
- API calls: none directly, but uses `useCartStore` locally
- Loading state: none
- Error handling: toasts for undo removal

## Checkout `/checkout`
- Component: `client/app/(main)/checkout/page.jsx`
- Data loaded: user auth and cart contents
- Actions: shipping form, payment form, review order, place order
- API calls: `POST /user/checkout/cart`
- Loading state: skeleton while auth check is running
- Error handling: toast on failed checkout

## Favorites `/favorites`
- Component: `client/app/(main)/favorites/page.jsx`
- Data loaded: `GET /user/favorites`
- Actions: remove favorite, browse books
- API calls: `DELETE /user/favorites`
- Loading state: skeleton placeholder
- Error handling: toast on failure

## Order success `/order-success`
- Component: `client/app/(main)/order-success/orderSuccess.jsx`
- Data loaded: order ID from URL search params
- Actions: redirect home, view orders
- API calls: none
- Loading state: none

## Auth pages
- Login: `client/app/auth/login/login.jsx`
- Register: `client/app/auth/register/register.jsx`
- Features: validation with Zod, toast notifications, remember me, redirect support

## Account page `/account`
- Component: `client/app/(main)/account/page.jsx`
- Data loaded: auth store user data
- Actions: update password form UI (non-functional)
- API calls: none

---

# API Layer

## Client API wrapper
- `client/src/lib/apiClient.js`
- `baseURL`: `process.env.NEXT_PUBLIC_BACKEND_URL`
- `withCredentials: true`
- 401 interceptor refreshes `/api/auth/refresh` and retries failed requests for `/user` endpoints

## Endpoint documentation

### `GET /book/home`
- Purpose: fetch home page book data
- Response: `{ latest, featured }`
- Used by: `client/app/(main)/page.jsx`

### `GET /book`
- Purpose: list books
- Parameters: `page`, `limit`, `search`, `genre`, `sort`
- Response: paginated books and metadata
- Used by: books listing page

### `GET /book/:id`
- Purpose: fetch single book detail
- Used by: book detail page

### `POST /api/auth/login`
- Purpose: login and set cookie auth
- Body: `{ email, password }`
- Response: user profile
- Used by: login page

### `POST /api/auth/register`
- Purpose: register user
- Body: `{ name, email, password }`
- Used by: registration page

### `POST /api/auth/refresh`
- Purpose: refresh access token
- Cookie: `refreshToken`
- Used by: `apiClient` interceptor and auth store init

### `POST /api/auth/logout`
- Purpose: clear auth cookies
- Used by: auth store logout

### `GET /user/profile`
- Purpose: return authenticated profile
- Used by: auth store init

### `POST /user/cart`
- Purpose: add item to cart
- Body: `{ formatId, quantity }`

### `GET /user/cart`
- Purpose: get authenticated user cart
- Used by: `useSyncCart`

### `PATCH /user/cart`
- Purpose: update cart item quantity
- Body: `{ format_id, quantity }`

### `DELETE /user/cart/:formatId`
- Purpose: remove cart item

### `POST /user/favorites`
- Purpose: toggle favorites
- Body: `{ bookId }`

### `GET /user/favorites`
- Purpose: fetch favorites

### `DELETE /user/favorites`
- Purpose: remove favorite
- Body: `{ bookId }`

### `POST /user/checkout/cart`
- Purpose: create order from cart

### `POST /user/checkout/book`
- Purpose: create order for a single book format
- Body: `{ formatId, quantity }`

### `POST /api/system/report-bug`
- Purpose: send admin bug report email
- Body: `{ message, category }`

---

# State Management

## Contexts
- `ToastContext` provides toast notifications globally.
- `AuthProvider` triggers auth initialization on app root mount.

## Zustand stores

### `authStore` (`client/src/stores/authStore.js`)
- Holds `user`, `isAuthenticated`, and `token`
- Methods:
  - `init()`: refreshes auth and loads `/user/profile`
  - `login({user})`, `register({user})`, `logout()`
- Uses `apiClient` for auth requests.

### `cartStore` (`client/src/stores/cartStore.js`)
- Holds `items`
- Persisted to `cart-storage`
- Selectors: `isInCart`, `getItemCount`, `getTotal`
- Actions: `setCart`, `clearCart`

### `favoriteStore` (`client/src/stores/favoriteStore.js`)
- Holds `favorites`, `loading`
- Persisted to `favorite-storage`
- Actions: `fetchFavorites`, `toggleFavorite`, `clearFavorites`
- Uses `apiClient` for backend sync

## Local state
- Page-specific state is handled with React `useState`, e.g. checkout step, book detail selections, modal open state.

## Data flow
- `AuthProvider` initializes session on mount.
- `Header` triggers `authStore.init()` to update auth state.
- Components call service functions that use `apiClient`.
- `useSyncCart` loads cart from backend and writes to `cartStore`.

---

# Authentication

## Login flow
1. User submits `/auth/login` form.
2. Frontend calls `login(email, password)` via `auth.service.js`.
3. Backend validates credentials in `server/src/controllers/auth/auth.controller.js`.
4. On success, backend sets `accessToken` and `refreshToken` cookies.
5. Frontend stores user data in `authStore` and redirects.

## JWT
- `accessToken`: signed with `JWT_SECRET`, expires in 30m.
- `refreshToken`: signed with `JWT_REFRESH_SECRET`, expires in 7d.
- Stored in cookies (`httpOnly`, `secure`, `sameSite`).

## Cookies
- Set by backend on login.
- Access token rotates on refresh in `authMiddleware`.

## Refresh tokens
- `authMiddleware` checks `accessToken`; if expired, uses `refreshToken` and reissues `accessToken`.
- `POST /api/auth/refresh` also issues fresh access token.

## Protected routes
- Backend: all `/user/*` routes require `authMiddleware`.
- Frontend: `useAuthGuard` handles redirecting unauthenticated users.

---

# Authorization

## Roles
- User roles are derived from `user.isAdmin` in `authStore`.
- Admin-specific route handling is client-side only.

## Permissions
- Backend routes use auth middleware but do not enforce admin roles.
- Frontend admin pages / UI elements check `user.isAdmin`.

## Middleware
- `server/src/middlewares/auth.middleware.js` verifies access/refresh tokens and loads `req.user`.

## Visibility rules
- Login/Register shown only if not authenticated.
- Account page and favorites require auth.
- Admin flows use `user.isAdmin` if available.

---

# Database

## Schema
Not fully defined in repo, but inferred from queries and model usage:

### Tables likely exist:
- `users`
- `books`
- `book_formats`
- `cart_items`
- `orders`
- `order_items`

## Models
- `users` holds `id`, `name`, `email`, `password`, `refresh_token`, `favorites`
- `books` holds metadata and `images`, `authors`, `tags`, `awards`
- `book_formats` stores format-specific pricing and stock
- `cart_items` stores user cart rows with `format_id`
- `orders` stores user orders and total_amount
- `order_items` stores line items per order

## Relationships
- `users` 1..* `cart_items`
- `books` 1..* `book_formats`
- `book_formats` 1..* `cart_items`
- `orders` 1..* `order_items`
- `book_formats` referenced from `order_items`

## Queries
- Home books use `DISTINCT ON` and random ordering.
- Book listing uses text similarity search if search string >= 3.
- Get book detail aggregates format objects.

## ORM usage
- Direct SQL queries via `pg`.

---

# Business Logic

## User creation
- `POST /api/auth/register` hashes password and stores user with generated refresh token.
- Duplicate email check returns 400.

## Login
- Validates password and returns cookies.
- Refresh token saved in DB.

## Cart flow
- `POST /user/cart` adds/increments cart items.
- `GET /user/cart` retrieves cart with joined book and format data.
- `PATCH /user/cart` updates quantity after stock validation.
- `DELETE /user/cart/:formatId` removes the item.

## Favorites flow
- `POST /user/favorites` toggles book ID in user's `favorites` JSONB.
- `GET /user/favorites` returns favorite book rows.
- `DELETE /user/favorites` removes favorite by ID.

## Checkout
- `POST /user/checkout/cart` reads cart items, creates order and order items, clears cart.
- `POST /user/checkout/book` creates order for a single format.
- Both set order status to `paid`.

## Bug reporting
- `POST /api/system/report-bug` sends an email using Gmail/Nodemailer.

---

# Services

## `client/src/services/auth.service.js`
- `login(email, password)`
- `registeration(name, email, password)`

## `client/src/services/books.service.js`
- `homeBooks()`
- `getBookById(id)`
- `getBooks(searchParams)`

## `client/src/services/checkout.service.js`
- `checkoutCartApi()`
- `checkoutSingleBookApi(formatId, quantity)`

## `server/src/services/user.service.js`
- `createUser(name, email, hashedPassword, refresh_token)`
- `findUserByEmail(email)`
- `updateRefreshToken(id, token)`

---

# Hooks

## `useAuthGuard` (`client/src/hooks/useAuthGuard.js`)
Inputs:
- `requireAdmin`, `redirect`, `toastMessage`
Outputs:
- `{ user, isAuthenticated, hasHydrated, status, isChecking, isReady, isDenied }`
State:
- `status`
Side effects:
- calls `init()` from `authStore`
- redirects unauthorized users to login
Usage:
- checkout and account pages should use this hook for page protection

## `useSyncCart` (`client/src/hooks/useSyncCart.js`)
Outputs:
- `syncCart()` function
Side effects:
- calls `GET /user/cart`
- normalizes response to cart store structure
Usage:
- book detail and cart drawer sync cart after operations

---

# Utility Functions

## `formatPrice` (`client/src/utils/format.js`)
- Purpose: format numeric price to INR currency string.
- Input: number
- Output: string
- Used by: almost all product/cart components

## `formatDate` (`client/src/utils/format.js`)
- Purpose: convert date string to display string.
- Used by: detail view and account

## `slugify` (`client/src/utils/format.js`)
- Purpose: build URL-friendly slugs.
- Not currently used in UI pages.

## `generateOrderId` and `getEstimatedDelivery`
- Purpose: mock order IDs and estimated delivery dates.
- Used in checkout page only.

## `genres` (`client/src/utils/genres.js`)
- Purpose: book genre values list.
- Used likely in filters.

---

# Configuration

## Environment variables
- `NEXT_PUBLIC_BACKEND_URL`: backend base URL for frontend API
- `CORS_ORIGIN`: frontend origin allowed by backend
- `JWT_SECRET`: JWT access secret
- `JWT_REFRESH_SECRET`: JWT refresh secret
- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_EMAIL`: email for bug report sender
- `EMAIL_PASS`: password for admin email account
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
- `PORT`: backend listening port

## Build configuration
- `client/next.config.js`: remote image pattern `res.cloudinary.com`
- `client/tailwind.config.js`: content paths and theme extensions
- `client/jsconfig.json`: path aliases

---

# Styling

## Tailwind usage
- Tailwind configured in `client/tailwind.config.js`
- Global CSS imports in `client/app/globals.css`
- `@layer components` defines reusable utility classes like `.premium-card` and `.premium-button`

## Theme system
- Custom colors under `theme.extend.colors.brand`
- Font families `serif: Playfair Display`, `sans: Inter`
- Size tokens defined for display and body text

## Responsive strategy
- Tailwind responsive classes used widely in components.
- `Header`, `Footer`, details pages adapt across breakpoints.

## Dark mode
- Not present.

---

# Assets

## Images
- `client/public/hero_image.png`
- `client/public/inkverse-icon.png`
- `client/public/inkverse-logo.png`
- Book images are remote Cloudinary URLs in server model data.

## Icons
- Lucide React icons used throughout.

## Fonts
- Google Fonts imported in `client/src/styles/globals.css`

---

# Performance

## Memoization
- Minimal explicit memoization.

## Lazy loading
- `Suspense` wrapped around some pages like `/books` and order success.

## Dynamic imports
- Not used.

## Caching
- `useFavoriteStore` and `useCartStore` persist data to localStorage.
- Backend `Cache-Control: no-store` disables caching.

## Server Components
- Frontend uses `use client` in most page files; the app is primarily client-side.

## Optimization opportunities
- Add React memoization for repeated list items.
- Use Next.js streaming or server-side rendering for home/books pages.
- Remove unused code and consolidate duplicated toast logic.

---

# Error Handling

## Error boundaries
- Not present.

## API errors
- Most frontend pages use toast notifications or console logs.
- `apiClient` refreshes session on 401 for `/user` endpoints.

## Validation
- Forms use Zod validation in auth pages.
- Backend validates request bodies for required fields.

## Logging
- Backend uses Winston logger.
- Client logs errors to console in places.

---

# Security

## Authentication
- JWT stored in cookies.
- Access token short-lived, refresh token 7 days.

## Authorization
- Protected routes via backend auth middleware.
- Client-side admin guard exists but backend lacks role enforcement.

## Secrets
- Environment secrets are required but not stored in repo.

## Input validation
- Basic backend validation on required body fields.

## CSRF
- Not explicitly handled.

## XSS prevention
- React sanitizes DOM output.
- No server-side sanitization for rich text.

---

# External Integrations

## Cloudinary
- Purpose: image uploads for book assets.
- Files: `server/src/config/cloudinary.js`, `server/src/utils/uploadToCloudinary.js`
- Auth: Cloudinary credentials via env vars

## Gmail/Nodemailer
- Purpose: bug reports email sender.
- Files: `server/src/controllers/system/bug.controller.js`
- Auth: `ADMIN_EMAIL`, `EMAIL_PASS`

---

# Environment Variables

| Variable | Purpose | Required | Default | Where used |
|---|---|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Frontend backend URL | yes | none | `client/src/lib/apiClient.js` |
| `CORS_ORIGIN` | Backend allowed origin | yes | none | `server/src/app.js` |
| `JWT_SECRET` | Access token secret | yes | none | `server/src/utils/token.js`, `server/src/middlewares/auth.middleware.js` |
| `JWT_REFRESH_SECRET` | Refresh token secret | yes | none | `server/src/utils/token.js`, `server/src/middlewares/auth.middleware.js` |
| `DATABASE_URL` | PostgreSQL connection string | yes | none | `server/src/database/db.js`, `server/src/config/env.config.js` |
| `ADMIN_EMAIL` | Email sender/recipient for bug reports | yes | none | `server/src/controllers/system/bug.controller.js` |
| `EMAIL_PASS` | Gmail account password | yes | none | `server/src/controllers/system/bug.controller.js` |
| `CLOUDINARY_NAME` | Cloudinary cloud name | yes | none | `server/src/config/cloudinary.js` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | yes | none | `server/src/config/cloudinary.js` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | yes | none | `server/src/config/cloudinary.js` |
| `PORT` | Backend listen port | no | `8080` | `server/src/server.js` |

---

# Build & Deployment

## Install
- Frontend: `cd client && npm install`
- Backend: `cd server && npm install`

## Development setup
- Frontend dev: `cd client && npm run dev`
- Backend dev: `cd server && npm run dev`

## Production build
- Frontend build: `cd client && npm run build`
- Backend start: `cd server && npm start`

## Deployment
- Not found in current repository.
- Expected steps: deploy frontend to Vercel/Netlify and backend to Heroku/GCP/AWS, configure env vars, and connect PostgreSQL.

## Hosting
- Not specified.

## CI/CD
- Not found in current repository.

---

# Testing

## Testing libraries
- None configured.

## Test structure
- No test files found.

## Coverage
- Not present.

## Missing tests
- Unit tests for stores, services, hooks, and backend controllers.
- Integration tests for auth and checkout flows.

---

# Known Issues

- Backend has no role-based authorization enforcement.
- Frontend uses mock auth and store-based session handling; not production-ready.
- Passwords are stored in plain text on mock auth flows.
- No CI/CD or Docker configuration.
- No frontend SSR or true API pagination UI.
- `client/src/components/ui/AdminProductForm.jsx` is not referenced by any page.
- Some pages log errors to console instead of showing user UI errors.
- No 404 handling for server API errors other than refresh.
- `client/src/components/ui/SearchProductCard.jsx` uses `selectedFormat.formatId` but backend returns `id` key not `formatId` consistently.

---

# Improvement Suggestions

## High Priority
1. Add backend role enforcement for admin routes.
2. Replace mock auth with real user database-backed login and registration.
3. Add API route tests and frontend integration tests.
4. Implement proper CSRF protection for cookie-based auth.
5. Add deployment configuration (Docker, GitHub Actions, etc.).

## Medium Priority
1. Add missing order history page and backend order retrieval.
2. Use Next.js server components or SSR for book lists.
3. Improve error handling with user-facing feedback.
4. Consolidate toast logic into context-only usage.

## Low Priority
1. Add dark mode support.
2. Add real product images and asset optimization.
3. Add filter UI for genres, sort, and price ranges.
4. Add localization support.

---

# Dependency Graph

- `client/src/lib/apiClient.js` → backend APIs
- `client/src/stores/authStore.js` → `apiClient`, `/api/auth/refresh`, `/user/profile`
- `client/src/stores/favoriteStore.js` → `GET /user/favorites`, `POST /user/favorites`
- `client/src/hooks/useSyncCart.js` → `GET /user/cart`
- `client/src/components/common/Header.jsx` → `useCartStore`, `useAuthStore`, `CartDrawer`
- `server/src/app.js` → routes + middleware
- `server/src/middlewares/auth.middleware.js` → `server/src/services/user.service.js` and `server/src/utils/token.js`
- `server/src/controllers/books/*` → `server/src/database/db.js`

---

# File Reference

## Important files
- `client/app/layout.jsx`: root app layout with `AuthProvider`
- `client/src/lib/apiClient.js`: axios instance + refresh token interceptor
- `client/src/stores/authStore.js`: auth state management
- `client/src/stores/cartStore.js`: cart persistence
- `client/src/stores/favoriteStore.js`: favorites persistence
- `client/src/components/ui/UI.jsx`: reusable button/input/card components
- `server/src/app.js`: Express app configuration
- `server/src/server.js`: backend startup and DB connect
- `server/src/middlewares/auth.middleware.js`: JWT auth
- `server/src/controllers/auth/auth.controller.js`: login/register/logout
- `server/src/controllers/books/*`: book APIs
- `server/src/controllers/user/*`: cart/favorites/checkout APIs
- `server/src/controllers/system/bug.controller.js`: bug report email
- `server/src/utils/token.js`: JWT generation

## Why important
These files contain core application flow, authentication, database integration, and UI building blocks.

---

# Developer Onboarding

1. Clone the repo.
2. Review `client/package.json` and `server/package.json`.
3. Set environment variables for backend.
4. Run frontend dev server: `cd client && npm install && npm run dev`.
5. Run backend dev server: `cd server && npm install && npm run dev`.
6. Open frontend at `http://localhost:3000` and backend at configured port (default 8080).
7. Use `AuthProvider` and `useAuthGuard` to inspect auth flow.
8. Use `scripts/importBooks.js` to load `server/src/models/books.json` into the database.

---

# Glossary

- **InkVerse**: Project name.
- **Book format**: product variant like paperback, hardcover, ebook.
- **Cart item**: item in user cart associated with a book format.
- **Refresh token**: long-lived JWT used to renew access tokens.
- **Zustand**: client-side state library.

---

# Appendix

## Useful commands
- Frontend dev: `cd client && npm run dev`
- Backend dev: `cd server && npm run dev`
- Backend start: `cd server && npm start`
- Frontend build: `cd client && npm run build`
- Auth smoke test: `cd client && npm run auth:smoke`

## Files to inspect
- `client/src/lib/apiClient.js`
- `server/src/controllers/auth/auth.controller.js`
- `server/src/middlewares/auth.middleware.js`
- `server/src/controllers/books/getBooks.controller.js`
- `server/src/components/ui/Toast.jsx`
- `client/src/stores/authStore.js`

---

# Notes
- No `Dockerfile`, `docker-compose.yml`, `.github/workflows`, or CI/CD config found.
- No test files present.
- `client/.env` exists with `NEXT_PUBLIC_BACKEND_URL` only.
