# Requirements Document

## Introduction

The Cart Drawer & Order Request feature adds a slide-in drawer panel to the Elit Dekor Next.js website. When a user adds a product to the cart or clicks the cart icon in the header, a drawer slides in from the right side of the viewport, displaying all cart items alongside an inline order request form. On submission, the form sends a formatted Telegram message to the existing bot recipients. The feature also adds an item-count badge to the header cart icon, updates the existing `/cart` page to include the same send form, and exposes property-based testable invariants for the cart state.

The stack is Next.js 15, React 19, TypeScript, Tailwind CSS, and next-intl (uz / ru / en). The existing `CartContext` (addItem / removeItem / updateQuantity / clearCart), Telegram bot token, and chat-ID list are reused without modification.

---

## Glossary

- **Cart_Drawer**: The slide-in panel that appears from the right edge of the viewport.
- **Backdrop**: The semi-transparent overlay rendered behind the Cart_Drawer that blocks interaction with the rest of the page.
- **Cart_Badge**: The numeric indicator on the header cart icon showing the total item count.
- **Order_Form**: The inline contact form embedded inside the Cart_Drawer and on the /cart page.
- **CartContext**: The existing React context that stores cart items in sessionStorage and exposes addItem / removeItem / updateQuantity / clearCart.
- **CartItem**: The data structure `{ id, title, price, quantity, imgSrc, unit, sku? }` as defined in CartContext.
- **Telegram_Service**: The server-side logic that sends a POST request to the Telegram Bot API using the existing token `8878838934:AAHMrcFWgdvcAkdG7wYolXsGT1CPV1Qx19g` and chat IDs `['864230184', '465180005']`.
- **Order_Message**: The formatted Telegram text that includes customer contact details and the list of selected products.
- **DrawerContext**: A new React context that manages the open/closed state of the Cart_Drawer.
- **totalItems**: The computed sum of all CartItem quantities, exposed by CartContext.

---

## Requirements

### Requirement 1: Cart Drawer Panel

**User Story:** As a customer, I want a sliding drawer to appear from the right when I interact with the cart, so that I can review and request my selected products without leaving the current page.

#### Acceptance Criteria

1. WHEN the Cart_Drawer is opened, THE Cart_Drawer SHALL slide in from the right edge of the viewport using a CSS transition of 300 ms or less.
2. WHEN the Cart_Drawer is opened, THE Backdrop SHALL be rendered behind the Cart_Drawer covering the rest of the viewport with at least 50% opacity.
3. WHEN the user clicks the Backdrop, THE Cart_Drawer SHALL close.
4. WHEN the user presses the Escape key while the Cart_Drawer is open, THE Cart_Drawer SHALL close.
5. WHILE the Cart_Drawer is open, THE Cart_Drawer SHALL trap keyboard focus within the panel.
6. WHILE the Cart_Drawer is open, THE Cart_Drawer SHALL prevent the page body from scrolling.
7. THE Cart_Drawer SHALL render at full viewport width on screens narrower than 640 px.
8. THE Cart_Drawer SHALL render at a fixed width of 420 px on screens 640 px and wider.
9. THE Cart_Drawer SHALL include a close button that, when activated, closes the Cart_Drawer.
10. THE Cart_Drawer SHALL be rendered as a DOM portal so that it overlays all page content regardless of the current route.

---

### Requirement 2: Drawer Open Triggers

**User Story:** As a customer, I want the cart drawer to open automatically when I add a product and when I click the cart icon, so that I always have fast access to my cart.

#### Acceptance Criteria

1. WHEN the user activates an "Add to cart" button on a product card, THE Cart_Drawer SHALL open regardless of the current page, including the `/cart` page.
2. WHEN the user activates the cart icon in the Header, THE Cart_Drawer SHALL open regardless of the current page, including the `/cart` page.
3. WHEN the user navigates to the `/cart` page without having activated a drawer trigger, THE Cart_Drawer SHALL remain closed.
4. THE DrawerContext SHALL expose an `openDrawer` function and a `closeDrawer` function accessible to any component in the component tree.

---

### Requirement 3: Cart Icon Badge

**User Story:** As a customer, I want to see how many items are in my cart from any page, so that I can keep track of my selections at a glance.

#### Acceptance Criteria

1. WHILE the cart contains one or more items, THE Cart_Badge SHALL display the current `totalItems` value on the Header cart icon.
2. WHEN `totalItems` is zero, THE Cart_Badge SHALL not be visible.
3. WHEN `totalItems` exceeds 99, THE Cart_Badge SHALL display "99+" instead of the exact number.
4. THE Cart_Badge SHALL update reactively whenever `totalItems` changes without a full page reload.

---

### Requirement 4: Cart Item List in Drawer

**User Story:** As a customer, I want to see all my selected products inside the drawer with quantity controls, so that I can adjust or remove items before submitting.

#### Acceptance Criteria

1. WHEN the Cart_Drawer is open and the cart contains items, THE Cart_Drawer SHALL display each CartItem with its image, title, SKU (if present), unit, and current quantity.
2. WHEN the user activates the quantity-increment control for a CartItem, THE CartContext SHALL increase that item's quantity by 1.
3. WHEN the user activates the quantity-decrement control for a CartItem whose quantity is greater than 1, THE CartContext SHALL decrease that item's quantity by 1.
4. WHEN the user activates the quantity-decrement control for a CartItem whose quantity is exactly 1, THE CartContext SHALL remove that item from the cart.
5. WHEN the user activates the remove button for a CartItem, THE CartContext SHALL remove that item from the cart.
6. WHEN the cart is empty and the Cart_Drawer is open, THE Cart_Drawer SHALL display an empty-state message and a link to the catalog.
7. THE Cart_Drawer item list SHALL be scrollable independently of the Order_Form when content overflows the available height.

---

### Requirement 5: Inline Order Form

**User Story:** As a customer, I want to fill in my name and phone number inside the drawer, so that I can submit a product request without navigating away.

#### Acceptance Criteria

1. THE Order_Form SHALL contain a required text field for the customer's name.
2. THE Order_Form SHALL contain a required telephone field for the customer's phone number.
3. THE Order_Form SHALL contain an optional textarea for a comment.
4. WHEN the user submits the Order_Form and the name field is empty, THE Order_Form SHALL display a validation error for the name field and SHALL NOT send the request.
5. WHEN the user submits the Order_Form and the phone field is empty, THE Order_Form SHALL display a validation error for the phone field and SHALL NOT send the request.
6. WHEN the user submits the Order_Form and the cart is empty, THE Order_Form SHALL display an error indicating the cart is empty and SHALL NOT send the request.
7. WHEN the user submits the Order_Form and validation passes, THE Order_Form SHALL display a loading indicator on the submit button and SHALL disable the button.
8. WHILE the Order_Form is in the loading state, THE Order_Form SHALL silently discard any additional submit attempts, with no feedback beyond the already-disabled submit button.

---

### Requirement 6: Telegram Notification

**User Story:** As a store operator, I want to receive a Telegram message with the customer's contact details and product list whenever an order request is submitted, so that I can follow up promptly.

#### Acceptance Criteria

1. WHEN validation passes and the user submits the Order_Form, THE Telegram_Service SHALL send the Order_Message to both chat IDs simultaneously using `Promise.all`.
2. THE Order_Message SHALL use the following exact format:

   ```
   🛒 Yangi so'rov — Elit Dekor
   👤 [Name]
   📞 [Phone]
   📦 Tanlangan tovarlar:
     • [qty]x [title] (SKU: [sku])
   💬 Izoh: [comment or "Yo'q"]
   ```

3. WHEN a CartItem has no SKU, THE Order_Message SHALL omit the "(SKU: ...)" part for that line.
4. THE Telegram_Service SHALL use `parse_mode: "Markdown"` in the request body.
5. WHEN at least one Telegram API response has `ok: true`, THE Order_Form SHALL transition to the success state.
6. WHEN all Telegram API responses have `ok: false` or a network error occurs, THE Order_Form SHALL display an error message and SHALL allow the user to retry.
7. THE Telegram_Service SHALL use the bot token `8878838934:AAHMrcFWgdvcAkdG7wYolXsGT1CPV1Qx19g` and chat IDs `['864230184', '465180005']`.

---

### Requirement 7: Success and Loading States

**User Story:** As a customer, I want to see clear feedback after submitting my order, so that I know whether my request was received successfully.

#### Acceptance Criteria

1. WHEN the Telegram_Service reports success, THE Cart_Drawer SHALL replace the Order_Form with a success message.
2. WHEN the success state is displayed, THE Cart_Drawer SHALL display a confirmation prompt and a button to close the drawer.
3. WHEN the success state is displayed, THE CartContext SHALL clear all items from the cart.
4. WHEN the user closes the Cart_Drawer after a successful submission, THE Cart_Drawer SHALL reset the Order_Form to its initial empty state.
5. WHEN the Telegram_Service reports failure, THE Cart_Drawer SHALL display the Order_Form again with an error message, preserving the values the user had entered.

---

### Requirement 8: /cart Page Order Form

**User Story:** As a customer who navigates to the full cart page, I want to submit my order from there as well, so that I have a consistent experience on the dedicated cart page.

#### Acceptance Criteria

1. THE `/cart` page SHALL include the Order_Form component below the existing cart item list.
2. WHEN the `/cart` page Order_Form is submitted successfully, THE `/cart` page SHALL display the same success state as the Cart_Drawer.
3. WHEN the `/cart` page Order_Form is submitted successfully, THE CartContext SHALL clear all items from the cart.
4. WHEN the cart is empty on the `/cart` page, THE `/cart` page SHALL show the existing empty-state view and SHALL hide the Order_Form.
5. THE Order_Form component SHALL be reusable between the Cart_Drawer and the `/cart` page without code duplication.

---

### Requirement 9: Internationalisation

**User Story:** As a customer who browses in Uzbek, Russian, or English, I want all drawer and form texts to appear in my chosen language, so that the experience is consistent with the rest of the site.

#### Acceptance Criteria

1. THE Cart_Drawer SHALL source all visible text from the next-intl translation files (`uz.json`, `ru.json`, `en.json`) under a `CartDrawer` namespace.
2. THE Order_Form inside the Cart_Drawer SHALL source all visible text from the translation files under a `OrderForm` namespace.
3. THE Cart_Badge aria-label SHALL be translated and reflect the current item count.
4. WHEN a new locale is activated, THE Cart_Drawer and Order_Form SHALL atomically update all visible text — including labels, placeholders, and error messages — to the new locale without a page reload, such that no partial-update state (some text in the old locale, some in the new) is ever displayed.
5. THE translation keys SHALL include at minimum: drawer title, empty cart message, catalog link label, name label and placeholder, phone label and placeholder, comment label and placeholder, submit button, loading text, success message, and all validation error messages.

---

### Requirement 10: Mobile Responsiveness

**User Story:** As a customer on a mobile device, I want the drawer and form to be fully usable on a small screen, so that I can submit requests from my phone without layout issues.

#### Acceptance Criteria

1. THE Cart_Drawer SHALL render at full viewport width on screens narrower than 640 px (equivalent to Tailwind's `sm` breakpoint).
2. THE Cart_Drawer SHALL render product images at a size no smaller than 64 × 64 px on all screen sizes.
3. THE Order_Form input fields SHALL have a minimum tap target height of 44 px on mobile viewports.
4. THE Cart_Drawer SHALL remain fully scrollable on mobile devices without content being hidden behind the device navigation bar.
5. WHEN the on-screen keyboard appears on a mobile device, THE Cart_Drawer SHALL scroll to keep the focused input field visible.

---

### Requirement 11: Cart State Correctness Properties

**User Story:** As a developer, I want the cart state to satisfy mathematical invariants regardless of operation order or input, so that I can rely on the CartContext for all cart-related features without unexpected edge-case bugs.

#### Acceptance Criteria

1. FOR ALL sequences of `addItem` calls with distinct item IDs, THE CartContext SHALL produce a `totalItems` equal to the sum of all added quantities (additive invariant).
2. FOR ALL `addItem` calls with an item ID already present in the cart, THE CartContext SHALL merge the quantities rather than create a duplicate entry — the number of unique items in `items` SHALL remain unchanged (merge invariant).
3. FOR ALL `updateQuantity` calls with a quantity value less than or equal to zero, THE CartContext SHALL remove the item from the cart (removal on zero-quantity invariant).
4. FOR ALL `removeItem` calls, THE CartContext SHALL produce an `items` array that does not contain the removed item ID (removal completeness invariant).
5. FOR ALL `clearCart` calls, THE CartContext SHALL produce an empty `items` array and `totalItems` of zero (clear invariant).
6. WHEN the cart state is serialized to and then deserialized from sessionStorage, THE CartContext SHALL produce a cart state equivalent to the original (round-trip serialization invariant).
7. FOR ALL sequences of `addItem` followed by `removeItem` for the same item, THE CartContext SHALL return to the state that existed before the `addItem` call (add-then-remove identity invariant).
