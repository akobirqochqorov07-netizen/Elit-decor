# Implementation Plan: Cart Drawer & Order Request

## Overview

Implement a slide-in cart drawer with an inline order request form for the Elit Dekor Next.js website.
The work follows a layered approach: context foundation first, then UI components, then integration points (Header, Layout, /cart page), and finally a build check.

## Tasks

- [ ] 1. DrawerContext — foundation
  - [ ] 1.1 Create `src/context/DrawerContext.tsx`
    - Export `DrawerContextType` interface with `isOpen: boolean`, `openDrawer: () => void`, `closeDrawer: () => void`
    - Implement `DrawerProvider` using `useState(false)` — no dependency on `CartContext`
    - Export `useDrawer()` hook that throws when used outside the provider
    - _Requirements: 2.4_

  - [ ]* 1.2 Write unit tests for DrawerContext
    - `openDrawer` sets `isOpen` to `true`
    - `closeDrawer` sets `isOpen` to `false`
    - `useDrawer` throws when called outside `DrawerProvider`
    - _Requirements: 2.4_

- [ ] 2. Translation keys — CartDrawer + OrderForm namespaces
  - [ ] 2.1 Add `CartDrawer` namespace to `messages/uz.json`, `messages/ru.json`, `messages/en.json`
    - Keys: `title`, `close_aria`, `empty_title`, `empty_desc`, `catalog_link`, `success_title`, `success_msg`, `close_btn`, `badge_aria`
    - All three files must be updated in sync
    - _Requirements: 9.1, 9.3, 9.5_

  - [ ] 2.2 Add `OrderForm` namespace to all three message files
    - Keys: `name_label`, `name_placeholder`, `phone_label`, `phone_placeholder`, `comment_label`, `comment_placeholder`, `submit_btn`, `loading`, `success_msg`, `err_name`, `err_phone`, `err_cart_empty`, `err_send`
    - _Requirements: 9.2, 9.5_

- [ ] 3. OrderRequestForm component — core logic
  - [ ] 3.1 Create `src/components/cart/OrderRequestForm.tsx`
    - Accept `onSuccess?: () => void` prop
    - Internal state: `FormState { name, phone, comment }` and `SubmitState ('idle' | 'loading' | 'success' | 'error')`
    - Validate: `name` non-empty, `phone` non-empty, `items.length > 0`; show field-level errors, no API call on failure
    - On valid submit: set `'loading'`, guard duplicate submits with early return when already loading
    - Call internal `sendToTelegram(message)` via `Promise.all` to both chat IDs (`864230184`, `465180005`)
    - On success: call `clearCart()` then `onSuccess?.()`; transition to `'success'` state
    - On failure (all `ok: false` or network error): transition to `'error'`, preserve form values
    - Use `buildOrderMessage(name, phone, comment, items)` helper that produces the exact `OrderMessage` format
    - Source all labels/errors from `useTranslations('OrderForm')`
    - Loading state: disable submit button, show loading text
    - _Requirements: 5.1–5.8, 6.1–6.7, 7.1, 7.3, 8.3_

  - [ ]* 3.2 Write property test — Property 11: Double-Submit Guard
    - **Property 11: Double-Submit Guard**
    - Mock `fetch`; render form in `loading` state; fire submit handler N times (N ≥ 2); assert `fetch` called exactly once
    - **Validates: Requirements 5.7, 5.8**

  - [ ]* 3.3 Write property test — Property 12: Order Message Format
    - **Property 12: Order Message Format**
    - Use `fast-check`: generate arbitrary non-empty `name`, `phone`, optional `comment`, and `CartItem[]` with random `sku` presence
    - Assert `buildOrderMessage` output starts with `🛒 Yangi so'rov — Elit Dekor`, contains `👤 {name}`, `📞 {phone}`, one `• {qty}x {title}` line per item, `(SKU: {sku})` iff `sku` defined, ends with `💬 Izoh:` line
    - **Validates: Requirements 6.2, 6.3**

  - [ ]* 3.4 Write unit tests for OrderRequestForm
    - Submit with empty name: name error shown, no `fetch` called
    - Submit with empty phone: phone error shown, no `fetch` called
    - Submit with empty cart: cart-empty error shown, no `fetch` called
    - Successful send: `clearCart` called, `onSuccess` called
    - Failed send: error banner shown, form values preserved
    - `buildOrderMessage` snapshot: item with SKU and without SKU
    - _Requirements: 5.4–5.8, 6.2, 6.3_

- [ ] 4. CartDrawerItems component
  - [ ] 4.1 Create `src/components/cart/CartDrawerItems.tsx`
    - No external props; read `items`, `updateQuantity`, `removeItem` from `useCart()`
    - Map over `items`: render 64×64 px image, `title`, SKU if present, `unit`, quantity controls, remove button
    - Increment: `updateQuantity(id, quantity + 1)`
    - Decrement with `quantity > 1`: `updateQuantity(id, quantity - 1)`
    - Decrement with `quantity === 1`: `updateQuantity(id, 0)` (CartContext removes at 0)
    - Remove button: `removeItem(id)`
    - Empty state: translated empty message + `<Link href="/catalog/">`
    - Container: `overflow-y-auto flex-1` for independent scrolling
    - _Requirements: 4.1–4.7, 10.2_

  - [ ]* 4.2 Write property test — Property 10: CartItem Fields Rendered in Drawer
    - **Property 10: CartItem Fields Rendered in Drawer**
    - Use `fast-check`: generate arbitrary `CartItem` with and without `sku`; render `CartDrawerItems`; assert `title`, `quantity`, `unit` present; assert `sku` present iff defined
    - **Validates: Requirements 4.1**

  - [ ]* 4.3 Write unit tests for CartDrawerItems
    - Empty-state message and catalog link rendered when `items === []`
    - Increment button calls `updateQuantity(id, q + 1)`
    - Decrement at `quantity === 1` calls `updateQuantity(id, 0)` triggering removal
    - Remove button calls `removeItem(id)`
    - _Requirements: 4.2–4.6_

- [ ] 5. CartDrawer component — portal, animation, backdrop
  - [ ] 5.1 Create `src/components/cart/CartDrawer.tsx`
    - No external props; reads `isOpen` from `useDrawer()`, `items` from `useCart()`
    - Return `null` (no portal) when `isOpen === false`; guard with `typeof document !== 'undefined'` for SSR
    - Render via `ReactDOM.createPortal(panel, document.body)`
    - Panel: `fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-xl flex flex-col`
    - Slide animation: `translate-x-full` → `translate-x-0` using Tailwind `transition-transform duration-300`
    - Backdrop: `<div className="fixed inset-0 bg-black/50 z-40">` that calls `closeDrawer()` on click
    - `useEffect`: add `overflow: hidden` to `document.body` on open; restore on cleanup
    - `useEffect`: listen for `keydown` Escape → `closeDrawer()`
    - Layout: scrollable `<CartDrawerItems>` (`flex-1 overflow-y-auto`) above sticky `<OrderRequestForm>`
    - Show success view (replacing `<OrderRequestForm>`) when `submitted === true`; success view contains close button that calls `closeDrawer()` and resets `submitted`
    - Close button in header: `aria-label` from `t('CartDrawer.close_aria')`
    - On drawer close (via any path) reset `submitted` to `false` to satisfy Property 13
    - _Requirements: 1.1–1.10, 2.1–2.2, 7.1–7.5, 9.1_

  - [ ]* 5.2 Write unit tests for CartDrawer
    - Renders `null` when `isOpen === false`
    - Renders portal when `isOpen === true`
    - Escape keypress calls `closeDrawer`
    - Backdrop click calls `closeDrawer`
    - `document.body.style.overflow` is `'hidden'` while open, restored on close
    - Close button is accessible via keyboard and has `aria-label`
    - _Requirements: 1.3, 1.4, 1.6, 1.9_

  - [ ]* 5.3 Write property test — Property 13: Form Resets After Drawer Close
    - **Property 13: Form Resets After Drawer Close**
    - For any prior form state (success or error), simulate drawer close + reopen; assert all fields empty and `submitState === 'idle'`
    - **Validates: Requirements 7.4**

- [ ] 6. CartBadge inline component + Header wiring
  - [ ] 6.1 Add `CartBadge` inline component and cart icon button to `src/components/Header.tsx`
    - Implement `function CartBadge({ count }: { count: number }): JSX.Element | null` inline in `Header.tsx`
    - Returns `null` when `count === 0`; renders `"99+"` when `count > 99`; otherwise renders the count as a string
    - Badge element: `aria-label` from `t('CartDrawer.badge_aria')` (interpolate count)
    - Import `useDrawer` from `DrawerContext`; add cart icon `<button>` that calls `openDrawer()` on click
    - Place cart icon button in the right-buttons row alongside the existing search button
    - Remove the `_totalItems` unused-variable prefix (`const { totalItems } = useCart()`)
    - _Requirements: 2.2, 3.1–3.4_

  - [ ]* 6.2 Write property test — Property 9: Badge Reflects totalItems
    - **Property 9: Badge Reflects totalItems**
    - Use `fast-check`: generate arbitrary non-negative integer as `totalItems`; render `CartBadge`; assert renders `null` at 0, exact count for 1–99, `"99+"` for 100+
    - **Validates: Requirements 3.1, 3.3, 3.4**

- [ ] 7. Layout update — DrawerProvider + CartDrawer mount
  - [ ] 7.1 Update `src/app/[locale]/layout.tsx`
    - Import `DrawerProvider` from `@/context/DrawerContext`
    - Import `CartProvider` from `@/context/CartContext`
    - Import `CartDrawer` from `@/components/cart/CartDrawer`
    - Wrap `children` as: `<DrawerProvider><CartProvider>{children}<CartDrawer /></CartProvider></DrawerProvider>`
    - Place the `<CartDrawer />` mount point inside `CartProvider` but alongside `{children}` so it has access to both contexts
    - _Requirements: 1.10, 2.4_

- [ ] 8. /cart page update
  - [ ] 8.1 Update `src/app/[locale]/cart/page.tsx`
    - Remove the local `<CartProvider>` wrapper from `CartPage` (now provided by layout)
    - Remove the `checkout_btn` placeholder button from the order-summary panel
    - Import and render `<OrderRequestForm />` below the cart items grid inside `CartContent`
    - Hide `<OrderRequestForm />` when `items.length === 0` (already handled inside component, but guard with `{items.length > 0 && <OrderRequestForm />}`)
    - Pass no `onSuccess` prop (cart page success is self-contained)
    - _Requirements: 8.1–8.5_

- [ ] 9. CartContext property-based tests
  - [ ]* 9.1 Write property test — Property 1: Cart Additive Invariant
    - **Property 1: Cart Additive Invariant**
    - Use `fast-check`: `fc.array(fc.record({id: fc.uuid(), quantity: fc.integer({min:1,max:99}), ...}), {minLength:1})` with distinct IDs; call `addItem` for each; assert `totalItems === sum of quantities`
    - **Validates: Requirements 11.1**

  - [ ]* 9.2 Write property test — Property 2: Cart Merge Invariant
    - **Property 2: Cart Merge Invariant**
    - Generate existing cart + `addItem` with same ID + random additional quantity; assert `items.length` unchanged and quantity merged
    - **Validates: Requirements 11.2**

  - [ ]* 9.3 Write property test — Property 3: Zero-or-Negative Quantity Removes Item
    - **Property 3: Zero-or-Negative Quantity Removes Item**
    - For any cart item, call `updateQuantity(id, q)` where `q ≤ 0`; assert item absent from `items`
    - **Validates: Requirements 11.3, 4.4**

  - [ ]* 9.4 Write property test — Property 4: Remove Completeness
    - **Property 4: Remove Completeness**
    - For any cart array with at least one item, pick a random existing ID, call `removeItem(id)`; assert no entry with that ID remains
    - **Validates: Requirements 11.4, 4.5**

  - [ ]* 9.5 Write property test — Property 5: Clear Invariant
    - **Property 5: Clear Invariant**
    - For any non-empty cart, call `clearCart()`; assert `items === []` and `totalItems === 0`
    - **Validates: Requirements 11.5, 7.3, 8.3**

  - [ ]* 9.6 Write property test — Property 6: Serialization Round-Trip
    - **Property 6: Serialization Round-Trip**
    - For any `CartItem[]` with optional `sku`, serialize to JSON and parse back; assert deep equality
    - **Validates: Requirements 11.6**

  - [ ]* 9.7 Write property test — Property 7: Add-then-Remove Identity
    - **Property 7: Add-then-Remove Identity**
    - For any cart state not containing ID `x`, call `addItem({id: x, ...})` then `removeItem(x)`; assert `items` equals original array
    - **Validates: Requirements 11.7**

  - [ ]* 9.8 Write property test — Property 8: Quantity Controls Invariant
    - **Property 8: Quantity Controls Invariant**
    - For any `CartItem` with initial `q ≥ 2`, assert `updateQuantity(id, q+1)` yields `q+1` and `updateQuantity(id, q-1)` yields `q-1`
    - **Validates: Requirements 4.2, 4.3**

- [ ] 10. Build verify
  - Run `next build` (or `tsc --noEmit`) and confirm zero TypeScript errors and no missing translation keys
  - Fix any type errors surfaced by the build
  - _Requirements: all_

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `buildOrderMessage` should be a pure, exported function (not nested inside the component) to make property tests straightforward
- Both `CartDrawer` and `OrderRequestForm` are client components (`'use client'`) — they use hooks and browser APIs
- The portal guard `typeof document !== 'undefined'` prevents SSR crashes; the drawer can also return `null` during SSR and hydrate on the client
- Property tests use `fast-check`; run with Vitest (`vitest --run`) — no watch mode needed during CI
- All three message files (uz/ru/en) must be updated together in task 2 to avoid missing-key runtime errors from next-intl
- DrawerContext wraps CartProvider in layout so every page under `[locale]` has both contexts without per-page providers

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "2.2"] },
    { "id": 1, "tasks": ["1.2", "3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4", "4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "6.1"] },
    { "id": 5, "tasks": ["6.2", "7.1"] },
    { "id": 6, "tasks": ["8.1"] },
    { "id": 7, "tasks": ["9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "9.8"] }
  ]
}
```
