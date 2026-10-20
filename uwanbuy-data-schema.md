# UwanBuy Data Schema

Backend handoff schema for UwanBuy. It covers independently rendered shop sections, category-dependent product attributes (especially gadgets), quick-add suggestions, shopping-list upload/matching, carts, checkout, and orders.

## Shared API Conventions

- Base path: `/api/v1`; JSON except multipart list upload.
- Currency: `NGN`. All API amounts are integer kobo in fields ending `Minor`; format as naira in the UI.
- IDs are stable opaque strings; timestamps use ISO-8601 UTC.
- Success response: `{ "data": ..., "meta": ... }`. Error response: `{ "error": { "code": "...", "message": "...", "fields": {} }, "requestId": "..." }`.
- Lists accept `cursor` and `limit`; return `pageInfo: { nextCursor, hasMore }`.
- Server controls product price, stock, deals, fees, totals, payment, and order state. Never trust client totals.

## Store Sections and Categories

`GET /stores/uwanbuy/bootstrap` returns store configuration, categories, section descriptors, promotions, locations/delivery choices, and supported payments. Suggested section keys:

- `foodstuff`
- `groceries`
- `fashion`
- `gadgets`
- `trending`

Section descriptor:

```json
{
  "key": "gadgets",
  "title": "Gadgets & Accessories",
  "displayOrder": 4,
  "productQuery": { "categoryId": "gadgets", "sort": "featured" }
}
```

Use `GET /stores/uwanbuy/sections/{sectionKey}/products?categoryId=...&q=...&sort=...&cursor=...&limit=...` per section. A product can appear in multiple sections without duplicate product records. Category IDs should be backend-managed and should not depend on display labels.

## UwanBuy Product Schema

```json
{
  "id": "uw_prd_3001",
  "storeId": "uwanbuy",
  "categoryId": "gadgets",
  "sectionKeys": ["gadgets", "trending"],
  "sku": "PHN-256-BLK",
  "title": "Smartphone Pro 256GB",
  "brand": "Example Mobile",
  "description": "Unlocked smartphone with 256GB storage.",
  "media": [
    { "mediaId": "uw_med_1", "type": "image", "url": "https://cdn.example/phone.webp", "thumbnailUrl": "https://cdn.example/phone-sm.webp", "altText": "Phone front and back", "sortOrder": 0 }
  ],
  "priceMinor": 85000000,
  "salePriceMinor": 85000000,
  "compareAtPriceMinor": 92000000,
  "currency": "NGN",
  "unitLabel": "each",
  "packSize": null,
  "stock": { "quantity": 18, "status": "in_stock", "allowBackorder": false },
  "specifications": {
    "model": "Example Pro",
    "storageGb": 256,
    "memoryGb": 8,
    "screenInches": 6.4,
    "connectivity": ["5G", "Wi-Fi 6", "Bluetooth 5.3"],
    "simType": "dual_nano_sim",
    "operatingSystem": "ExampleOS",
    "warrantyMonths": 12,
    "condition": "new"
  },
  "badges": ["featured", "limited_offer"],
  "status": "published",
  "createdAt": "2026-10-01T09:00:00Z",
  "updatedAt": "2026-10-16T09:00:00Z"
}
```

### Common Product Fields

- `id`, `storeId`, `categoryId`, `sectionKeys[]`, `sku`, `title`, `brand?`, `description`, `media[]`, `priceMinor`, `currency`, `unitLabel`, `packSize?`, `stock`, `specifications`, `badges[]`, `status`, `createdAt`, `updatedAt`.
- `priceMinor` is the effective selling price. `salePriceMinor` may be retained as an explicit current price for UI compatibility; it must equal the effective sale amount when a promotion applies. `compareAtPriceMinor` is the reference price and must not be used for checkout.
- `stock.status`: `in_stock`, `low_stock`, `out_of_stock`, `preorder`. Keep the actual quantity private if exposing it is not desired.

### Category-Specific Specifications

Use a JSON object validated against a category schema/version; avoid one fixed list of fields for every product.

- Gadgets/electronics: `model`, `storageGb`, `memoryGb`, `screenInches`, `connectivity[]`, `ports[]`, `compatibility[]`, `warrantyMonths`, `condition`, and model-specific attributes such as battery capacity.
- Foodstuff/groceries: `netWeight`, `unit`, `ingredients[]?`, `allergens[]?`, `expiryDate?`, `storageInstructions?`, `countryOfOrigin?`.
- Fashion: `size`, `sizeSystem`, `colour`, `material`, `fit`, `gender?`, `careInstructions?`.
- Home essentials: `dimensions`, `material`, `powerRating?`, `compatibility?`, `warrantyMonths?`.

Represent unknown or not-applicable specifications by omission, not invented defaults. Include `specificationSchemaVersion` if category schemas evolve.

## Section and Catalog Requests

1. `GET /stores/uwanbuy/bootstrap?locationId=...`  
   Response: `{ store, categories[], sections[], promotions[], deliveryOptions[], paymentMethods[], featureFlags }`.

2. `GET /stores/uwanbuy/sections/{sectionKey}/products`  
   Query: `categoryId?`, `q?`, `sort?` (`featured`, `price_asc`, `price_desc`, `discount_desc`), `cursor?`, `limit?`, `locationId?`.  
   Response: `{ items: UwanBuyProduct[], pageInfo, facets? }`.

3. `GET /products/{productId}`  
   Response: full product specifications, availability, current price, promotion details, and relevant delivery eligibility. This response powers gadget detail views; callers should not infer specifications from product title.

4. `GET /stores/uwanbuy/suggestions?q=...&categoryId=...&limit=...`  
   Response: `{ items: [{ productId, title, categoryId, categoryName, priceMinor, currency, thumbnailUrl, availability }] }`. Match title, SKU, brand, category, and relevant aliases. Return bounded results and no private inventory data.

## Shopping-List Upload and Matching

The current prototype has a file selector for TXT/CSV/PDF. Backend must parse the actual file and return explicit matches; never choose random products or silently add items.

5. `POST /stores/uwanbuy/shopping-lists/uploads` (multipart/form-data)  
   Fields: `file` (accepted TXT/CSV/PDF), optional `categoryId`, `locationId`. Enforce file size/type limits and malware scanning as applicable.  
   Response: `{ uploadId, status, createdAt }`; status can be `processing` or `ready`.

6. `GET /stores/uwanbuy/shopping-lists/uploads/{uploadId}`  
   Response:

```json
{
  "uploadId": "uw_list_9001",
  "status": "ready",
  "rows": [
    {
      "rowId": "row_1",
      "rowNumber": 1,
      "originalText": "2 bags parboiled rice 5kg",
      "parsedName": "parboiled rice",
      "requestedQuantity": 2,
      "requestedUnit": "bag",
      "matches": [
        { "productId": "uw_prd_1", "title": "Parboiled Rice 5kg", "priceMinor": 1350000, "confidence": 0.96, "availability": "in_stock" }
      ],
      "selectedProductId": null,
      "state": "needs_selection",
      "errors": []
    },
    {
      "rowId": "row_2",
      "rowNumber": 2,
      "originalText": "phone charger",
      "parsedName": "phone charger",
      "requestedQuantity": 1,
      "matches": [],
      "selectedProductId": null,
      "state": "unmatched",
      "errors": []
    }
  ]
}
```

`state` values: `matched`, `needs_selection`, `unmatched`, `invalid`. Include a `warnings[]` list when units/quantities are inferred. Confidence is a ranking aid, not permission to auto-select ambiguous results.

7. `POST /stores/uwanbuy/shopping-lists/uploads/{uploadId}/apply`  
   Request:

```json
{
  "selections": [
    { "rowId": "row_1", "productId": "uw_prd_1", "quantity": 2 }
  ]
}
```

Response: `{ cart, addedLines[], skippedRows[] }`. Validate product availability and quantity again. Require explicit customer selection/confirmation before applying matches. Upload owner must match the signed-in account or an allowed guest session.

## Shared Account, Cart, Checkout, Wallet, and Orders

- Account: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /account/me`, `PATCH /account/me`. Registration request: `{ name, phone, email?, password, storeKey: "uwanbuy" }`.
- Cart: `GET /cart`; `POST /cart/items` request `{ productId, quantity }`; `PATCH /cart/items/{lineId}` request `{ quantity }`; `DELETE /cart/items/{lineId}`. Responses contain server-calculated `unitPriceMinor`, `lineTotalMinor`, stock state, and cart totals.
- Quote: `POST /checkout/quote` request `{ cartId, lineIds?, paymentMethod: "wallet"|"direct", deliveryOptionId?, deliveryAddressId?, pickupLocationId?, promotionCode? }`. Response: `quoteId`, selected lines, subtotal/discount/fees/total in minor units, currency, warnings, expiry.
- Order: `POST /orders` with `Idempotency-Key`, request `{ quoteId, paymentMethod, returnUrl? }`. Response `{ order, payment, remainingCart }`.
- Direct payment: `GET /payments/{paymentId}` returns status. Confirm payment using verified provider webhook, not the return URL.
- Wallet: `GET /wallet`, `GET /wallet/transactions`, `POST /wallet/top-ups` request `{ amountMinor, paymentMethod: "direct", returnUrl }`. Credit only on verified payment event.
- Orders: `GET /orders`, `GET /orders/{orderId}`, `GET /orders/{orderId}/tracking`, `POST /orders/{orderId}/confirm-delivery` request `{ deliveryPasscode }` if applicable.

## Endpoint-by-Endpoint Request and Response Schemas

Unless stated otherwise, successful JSON responses use `{ "data": <response>, "meta": {} }`; errors use the error envelope above. GET requests have no body. Authenticated routes use the user's session. All amounts are integer kobo. `Idempotency-Key` is required on order and top-up creation.

### Storefront and Catalog

**GET `/stores/uwanbuy/bootstrap`**  
Query: `locationId?`, `locale?`. No body.  
`data`: `{ store: { id, name, currency }, categories: [{ id, name, displayOrder, parentId? }], sections: [{ key, title, displayOrder, productQuery? }], promotions: Promotion[], deliveryOptions: DeliveryOption[], paymentMethods: ["wallet"|"direct"], featureFlags: object }`.

**GET `/stores/uwanbuy/sections/{sectionKey}/products`**  
Path: `sectionKey`. Query: `categoryId?`, `q?`, `sort?` (`featured`, `price_asc`, `price_desc`, `discount_desc`), `cursor?`, `limit?`, `locationId?`. No body.  
`data`: `{ items: UwanBuyProduct[], pageInfo: { nextCursor: string|null, hasMore: boolean }, facets?: { brands?, priceRange?, attributes? } }`.

**GET `/products/{productId}`**  
Path: `productId`; no query/body.  
`data`: `{ product: UwanBuyProduct, promotion?: Promotion, deliveryOptions: DeliveryOption[] }`. Return all category-specific specifications, current effective price, and current availability.

**GET `/stores/uwanbuy/suggestions`**  
Query: required `q`; optional `categoryId`, `limit`, `locationId`. No body.  
`data`: `{ items: [{ productId, title, categoryId, categoryName, sku?, priceMinor, currency: "NGN", thumbnailUrl, availability: { status } }] }`.

### Shopping List Upload and Match Review

**POST `/stores/uwanbuy/shopping-lists/uploads`** (multipart/form-data)  
Parts: `file` required (TXT, CSV, or PDF), `categoryId?` text, `locationId?` text. No JSON body.  
`data`: `{ uploadId, status: "processing"|"ready", createdAt }`. Return 413 for oversized input and 415 for unsupported file types.

**GET `/stores/uwanbuy/shopping-lists/uploads/{uploadId}`**  
Path: `uploadId`; optional query `includeMatches` default true. No body.  
`data`: `{ uploadId, status, rows: [{ rowId, rowNumber, originalText, parsedName?, requestedQuantity, requestedUnit?, matches: [{ productId, title, priceMinor, currency, confidence, availability }], selectedProductId?, state: "matched"|"needs_selection"|"unmatched"|"invalid", errors: string[], warnings: string[] }], createdAt, updatedAt }`. Enforce upload ownership or allowed guest-session access.

**POST `/stores/uwanbuy/shopping-lists/uploads/{uploadId}/apply`**  
Path: `uploadId`. Request:

```json
{
  "selections": [
    { "rowId": "row_1", "productId": "uw_prd_1", "quantity": 2 }
  ]
}
```

`data`: `{ cart: Cart, addedLines: [{ rowId, lineId, productId, quantity, lineTotalMinor }], skippedRows: [{ rowId, code, message }] }`. Revalidate stock and price. Do not apply ambiguous rows unless the shopper explicitly selects a product.

### Identity and Account

**POST `/auth/register`**  
Request: `{ name: string, phone: string, email?: string, password: string, storeKey: "uwanbuy" }`.  
`data`: `{ user: { id, name, phone, email?, roles[] }, session: { expiresAt }, wallet: { balanceMinor, currency: "NGN" } }`.

**POST `/auth/login`**  
Request: `{ phoneOrEmail: string, password: string }`.  
`data`: `{ user: { id, name, phone, email?, roles[] }, session: { expiresAt }, wallet: { balanceMinor, currency: "NGN" } }`.

**POST `/auth/logout`**  
Request: empty JSON `{}` (or no body per cookie-session implementation).  
`data`: `{ loggedOut: true }`.

**GET `/account/me`**  
No query/body.  
`data`: `{ user: { id, name, phone, email?, roles[], createdAt }, wallet: { balanceMinor, currency: "NGN" } }`.

**PATCH `/account/me`**  
Request: `{ name?: string, email?: string, phone?: string }`; reject immutable/unknown fields.  
`data`: `{ user: updatedUser }`.

**GET `/account/addresses`**  
Query: optional `cursor`, `limit`. No body.  
`data`: `{ items: [Address], pageInfo }`.

**POST `/account/addresses`**  
Request: `{ recipientName, phone, addressLine1, addressLine2?, city, state, postalCode?, countryCode: "NG", landmark?, deliveryInstructions?, isDefault? }`.  
`data`: `{ address: Address }`.

**PATCH `/account/addresses/{addressId}`**  
Path: `addressId`. Request: partial editable fields from the create schema.  
`data`: `{ address: Address }`.

**DELETE `/account/addresses/{addressId}`**  
Path: `addressId`; no body.  
`data`: `{ deleted: true, addressId }`.

### Cart and Checkout

**GET `/cart`**  
No query/body.  
`data`: `Cart`, where `Cart = { cartId, currency: "NGN", lines: [{ lineId, productId, product: { title, thumbnailUrl, categoryId }, quantity, unitPriceMinor, lineTotalMinor, availability }], subtotalMinor, discountMinor, fees: [{ code, label, amountMinor }], totalMinor, updatedAt }`.

**POST `/cart/items`**  
Request: `{ productId: string, quantity: integer }`.  
`data`: updated `Cart`. Validate current product publication state, price, and stock.

**PATCH `/cart/items/{lineId}`**  
Path: `lineId`. Request: `{ quantity: integer }`.  
`data`: updated `Cart`; reject quantities above available stock.

**DELETE `/cart/items/{lineId}`**  
Path: `lineId`; no body.  
`data`: `{ cart: Cart, removedLineId: string }`.

**POST `/checkout/quote`**  
Request: `{ cartId: string, lineIds?: string[], paymentMethod: "wallet"|"direct", deliveryOptionId?: string, deliveryAddressId?: string, pickupLocationId?: string, promotionCode?: string }`. UwanBuy typically quotes the full cart; `lineIds` may be supported consistently with the shared commerce API.  
`data`: `{ quoteId, cartId, selectedLines: [{ lineId, productId, quantity, unitPriceMinor, lineTotalMinor }], subtotalMinor, discountMinor, fees: [{ code, label, amountMinor }], totalMinor, currency: "NGN", paymentMethod, walletBalanceMinor?, warnings: [{ code, message, lineId? }], expiresAt }`.

**POST `/orders`** (requires `Idempotency-Key`)  
Request: `{ quoteId: string, paymentMethod: "wallet"|"direct", returnUrl?: string }`.  
`data`: `{ order: { id, status, paymentStatus, lines: OrderLine[], subtotalMinor, discountMinor, fees, totalMinor, currency, fulfillment, createdAt }, payment: { id, type, status, amountMinor, currency, providerReference?, checkoutUrl?, expiresAt? }, remainingCart: Cart }`.

### Payments, Wallet, and Orders

**GET `/payments/{paymentId}`**  
Path: `paymentId`; no body.  
`data`: `{ payment: { id, orderId?, status, type, amountMinor, currency: "NGN", providerReference?, updatedAt }, order?: { id, status, paymentStatus } }`.

**POST `/webhooks/payments/{provider}`** (provider-to-server only)  
Request: provider-specific signed raw body. Verify signature, event ID, merchant reference, amount, and currency.  
Response: HTTP 200 `{ received: true }` for accepted or already-processed event. Not called by the browser.

**GET `/wallet`**  
No query/body.  
`data`: `{ balanceMinor, currency: "NGN", updatedAt }`.

**GET `/wallet/transactions`**  
Query: `cursor?`, `limit?`, `type?`. No body.  
`data`: `{ items: [{ id, type, status, amountMinor, currency: "NGN", reference, description, createdAt }], pageInfo }`.

**POST `/wallet/top-ups`** (requires `Idempotency-Key`)  
Request: `{ amountMinor: integer, paymentMethod: "direct", returnUrl: string }`.  
`data`: `{ topUpId, payment: { id, status: "pending", amountMinor, currency: "NGN", providerReference, checkoutUrl, expiresAt } }`. Credit only after verified provider webhook.

**GET `/orders`**  
Query: `cursor?`, `limit?`, `status?`. No body.  
`data`: `{ items: [OrderSummary], pageInfo }`.

**GET `/orders/{orderId}`**  
Path: `orderId`; no body.  
`data`: `{ order: { id, status, paymentStatus, lines: OrderLine[], subtotalMinor, fees, totalMinor, currency: "NGN", fulfillment, createdAt, updatedAt } }`.

**GET `/orders/{orderId}/tracking`**  
Path: `orderId`; no body.  
`data`: `{ orderId, status, events: [{ status, message, occurredAt, location? }], estimatedDeliveryAt? }`.

**POST `/orders/{orderId}/confirm-delivery`**  
Path: `orderId`. Request: `{ deliveryPasscode: string }` when delivery confirmation is enabled.  
`data`: `{ orderId, status: "delivered", confirmedAt }`. Verify authorization and passcode server-side.

### Shared Type Shapes Referenced Above

`Promotion`: `{ id, code?, label, discountType, discountValue, startsAt, endsAt }`. `DeliveryOption`: `{ id, type, label, feeMinor, estimatedMinutes?, available }`. `Address`: `{ id, recipientName, phone, addressLine1, addressLine2?, city, state, postalCode?, countryCode, landmark?, deliveryInstructions?, isDefault }`. `OrderLine`: `{ productId, productName, quantity, unitPriceMinor, lineTotalMinor }`. `OrderSummary`: `{ id, status, paymentStatus, totalMinor, currency, itemCount, createdAt }`.

## Response Envelope Examples

Bootstrap response:

```json
{
  "data": {
    "store": { "id": "uwanbuy", "name": "UwanBuy", "currency": "NGN" },
    "categories": [{ "id": "gadgets", "name": "Gadgets & Accessories" }],
    "sections": [{ "key": "gadgets", "title": "Gadgets & Accessories", "displayOrder": 4 }],
    "paymentMethods": ["wallet", "direct"],
    "deliveryOptions": []
  }
}
```

List response: `{ "data": { "items": [], "pageInfo": { "nextCursor": null, "hasMore": false } } }`. Error response: `{ "error": { "code": "OUT_OF_STOCK", "message": "This item is no longer available", "fields": {} }, "requestId": "req_123" }`.

## Backend Invariants and Tests

- Validate category specifications, price, promotion period, stock, quantity limits, and delivery region on the server.
- Checkout totals use integer kobo. Re-check price and inventory at quote and order creation. Reserve stock for pending direct payments and release on failure/expiry.
- Payment confirmation is webhook-verified and idempotent. Wallet debit and order creation are atomic.
- Search suggestions and shopping-list matches return only published, purchasable products for the selected location.
- Test section pagination and filtering, gadget spec completeness, grocery/fashion attributes, quick-add results, malformed/unsupported upload, duplicate rows, ambiguous and unmatched list rows, customer-selected apply, stock races, wallet insufficiency, direct-payment failure, and repeated checkout requests.
