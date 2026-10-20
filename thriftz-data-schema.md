# Thrift-Z Data Schema

Backend handoff schema for the Thrift-Z secondhand marketplace. Covers public product sections and media, seller-only listing management, single and bulk listing creation, wallet/direct payments, whole-cart and selected-item checkout, and orders.

## Shared API Conventions

- Base path: `/api/v1`; JSON except multipart files and signed media uploads.
- Currency: `NGN`. All amounts are integer kobo in `*Minor` fields. Display as naira in the frontend.
- IDs are stable opaque strings; timestamps use ISO-8601 UTC.
- Success response: `{ "data": ..., "meta": ... }`. Error response: `{ "error": { "code": "...", "message": "...", "fields": {} }, "requestId": "..." }`.
- Use `cursor`/`limit` pagination and `Idempotency-Key` on order, payment, media, and import mutations.
- Server is authoritative for seller role, moderation, price, one-off stock, fees, payment, ownership, and order state.
- Seller role and listing authorization must be enforced server-side. A separate page or hidden link is not security. Use secure HTTP-only sessions or a documented bearer-token scheme.

## Public Sections and Categories

`GET /stores/thriftz/bootstrap` returns store settings, categories, section descriptors, promotions, delivery choices, and available payments. Suggested section keys:

- `featured`
- `fashion`
- `gadgets`
- `home`

Section descriptor:

```json
{
  "key": "gadgets",
  "title": "Gadgets & Tech",
  "displayOrder": 2,
  "productQuery": { "categoryId": "gadgets", "sort": "featured" }
}
```

Fetch section content independently: `GET /stores/thriftz/sections/{sectionKey}/products?categoryId=...&q=...&condition=...&sort=...&cursor=...&limit=...`. A listing can appear in multiple sections. Category IDs: `fashion`, `gadgets`, `home` (extendable by the backend).

## Thrift-Z Product Schema

```json
{
  "id": "tz_prd_105",
  "storeId": "thriftz",
  "categoryId": "gadgets",
  "sectionKeys": ["featured", "gadgets"],
  "sellerId": "usr_seller_77",
  "title": "MacBook Air M1 2020",
  "description": "Tested, with 91% battery health and minor case wear.",
  "condition": "gently_used",
  "priceMinor": 48000000,
  "originalPriceMinor": 89900000,
  "currency": "NGN",
  "quantity": 1,
  "availability": { "status": "in_stock", "quantity": 1 },
  "attributes": { "colour": "Space Gray", "includedAccessories": ["charger"] },
  "specifications": {
    "brand": "Apple",
    "model": "MacBook Air M1 2020",
    "memoryGb": 8,
    "storageGb": 256,
    "batteryHealthPercent": 91,
    "operatingSystem": "macOS"
  },
  "media": [
    { "mediaId": "tz_med_1", "type": "image", "url": "https://cdn.example/laptop-front.webp", "thumbnailUrl": "https://cdn.example/laptop-front-sm.webp", "altText": "Laptop front view", "sortOrder": 0 },
    { "mediaId": "tz_med_2", "type": "image", "url": "https://cdn.example/laptop-back.webp", "thumbnailUrl": "https://cdn.example/laptop-back-sm.webp", "altText": "Laptop case condition", "sortOrder": 1 },
    { "mediaId": "tz_med_3", "type": "video", "url": "https://cdn.example/laptop-demo.mp4", "thumbnailUrl": "https://cdn.example/laptop-demo-poster.webp", "altText": "Laptop powering on", "sortOrder": 2, "durationSeconds": 18 }
  ],
  "seller": { "displayName": "TechRenew", "ratingAverage": 4.9, "ratingCount": 34, "verified": true },
  "moderationStatus": "published",
  "status": "published",
  "createdAt": "2026-10-01T09:00:00Z",
  "updatedAt": "2026-10-16T09:00:00Z"
}
```

### Product Field Rules

- `condition`: `like_new`, `gently_used`, `refurbished`, `fair`. This is distinct from listing moderation and availability status.
- `priceMinor` is the current asking price; `originalPriceMinor` is optional reference price only and never used for checkout.
- `quantity` is normally `1` for unique secondhand listings. Support quantities above one only where seller confirms multiple identical units.
- `attributes` contains category-specific seller-declared details; `specifications` uses a category validation schema, especially for gadgets.
- `media[]` may contain multiple images and an optional video. Include ordered URLs/thumbnails and `durationSeconds` for video. The UI handles gallery, larger modal, and zoom; API delivers media metadata and authorized stable URLs.
- Public catalog only returns `moderationStatus: "published"` and available products. Keep seller contact details private; expose only approved display name and rating summary.

## Seller and Listing Schemas

Seller account summary:

```json
{
  "sellerId": "usr_seller_77",
  "role": "seller",
  "sellerStatus": "approved",
  "displayName": "TechRenew",
  "email": "seller@example.com"
}
```

Listing lifecycle: `draft` → `pending_review` → `published` or `rejected`; a published one-off product can later become `sold`, `removed`, or `archived`. Seller must not set `sellerId`, rating, review outcome, or publish status in create/update requests.

Create listing request:

```json
{
  "title": "MacBook Air M1 2020",
  "category": "gadgets",
  "condition": "gently_used",
  "priceMinor": 48000000,
  "originalPriceMinor": 89900000,
  "description": "Tested, 91% battery health; minor case wear.",
  "attributes": { "colour": "Space Gray" },
  "specifications": { "brand": "Apple", "model": "MacBook Air M1 2020", "memoryGb": 8, "storageGb": 256, "batteryHealthPercent": 91 },
  "media": [
    { "mediaId": "tz_med_1", "type": "image", "sortOrder": 0 },
    { "mediaId": "tz_med_3", "type": "video", "sortOrder": 1 }
  ]
}
```

Response returns normalized listing, assigned `id`/`sellerId`, `moderationStatus`, validation notes, and timestamps. Public details can return an expanded gallery; card/list responses may include a thumbnail subset.

## Media Upload Schema

1. `POST /seller/media/uploads` request `{ fileName, contentType, sizeBytes, mediaType, sortOrder }`; response `{ uploadId, uploadUrl, headers, expiresAt }`.
2. Client uploads bytes to the signed `uploadUrl` using returned headers.
3. `POST /seller/media/uploads/{uploadId}/complete` request `{ checksum? }`; response `{ media: { mediaId, type, url, thumbnailUrl, durationSeconds?, sortOrder } }`.

Validate MIME/type from file contents, maximum image/video bytes, image dimensions, video duration, seller ownership, and upload expiry. A media ID must belong to the submitting seller and be fully processed before a listing can be submitted. Never accept an arbitrary external image URL as proof of listing media. Use generated video poster/thumbnail as supported.

## Seller APIs and Requests

- `GET /seller/me`: 200 `{ sellerId, role: "seller", displayName, sellerStatus }`; 401 when no active session; 403 for signed-in users without seller permission. Keep the UI locked for all other states.
- `GET /seller/dashboard`: listing counts by status, sales summary, and recent activity.
- `GET /seller/listings?status=...&cursor=...&limit=...`; `GET /seller/listings/{listingId}`. Seller sees only own records unless moderator/admin.
- `POST /seller/listings`; `PATCH /seller/listings/{listingId}`; `POST /seller/listings/{listingId}/submit`. Require ownership and server-side validation. New listings default to `draft` or `pending_review` according to submission action; never publish directly from untrusted client input.
- Moderation/admin endpoints are separately authorized and may record `moderationStatus`, `moderatorId`, `decisionReason`, and `reviewedAt`.

## Google Sheets and Drive Bulk Import

Google connection tokens stay on the backend. Request minimum required Sheets/Drive scopes, allow revocation, and never expose provider refresh tokens to browser code.

1. `GET /seller/google/connect` → `{ authorizationUrl }`; OAuth callback stores connection and redirects to seller portal with non-sensitive result.
2. `GET /seller/google/sources` → `{ items: [{ id, name, type: "google_sheet"|"drive_file", modifiedAt }] }` for resources explicitly authorized by the seller.
3. `POST /seller/imports` request `{ sourceType, sourceId, sheetName?, columnMapping? }`; response `{ importId, status, rows[] }`.
4. `GET /seller/imports/{importId}` returns current job and preview rows.
5. `POST /seller/imports/{importId}/apply` with `Idempotency-Key`; request `{ selectedRowIds: [], publishIntent: "pending_review" }`; response `{ createdListings: [{ rowId, listingId, moderationStatus }], failedRows: [{ rowId, errors[] }] }`.

Import row model:

```json
{
  "rowId": "row_17",
  "rowNumber": 17,
  "normalized": {
    "title": "Vintage Denim Jacket",
    "category": "fashion",
    "condition": "like_new",
    "priceMinor": 2200000,
    "originalPriceMinor": 6500000,
    "description": "Oversized jacket, worn twice.",
    "attributes": { "size": "L", "colour": "Blue" },
    "mediaReferences": ["https://drive.google.com/..." ]
  },
  "valid": true,
  "errors": [],
  "warnings": [],
  "duplicateCandidate": null
}
```

Define supported Drive file formats and Sheet column mapping. Validate each row, allow selection of valid rows, show row-specific errors, detect duplicates, enforce ownership of referenced media, and require media to be copied/uploaded into approved storage before listing publication. Retrying `apply` must not duplicate listings.

## Cart, Selected-Item Checkout, Wallet, and Direct Payment

Shared cart line: `lineId`, `productId`, product/media summary, `quantity`, `unitPriceMinor`, `lineTotalMinor`, and availability. Because most listings are unique, refuse quantity above available quantity.

1. `GET /cart`; `POST /cart/items` request `{ productId, quantity }`; `PATCH /cart/items/{lineId}` request `{ quantity }`; `DELETE /cart/items/{lineId}`.
2. `POST /checkout/quote` request:

```json
{
  "cartId": "cart_321",
  "lineIds": ["line_1"],
  "paymentMethod": "direct",
  "deliveryOptionId": "campus_delivery",
  "deliveryAddressId": "addr_9"
}
```

Omit `lineIds` to quote the whole cart; specify one or more lines to purchase only those items. Response: `quoteId`, selected line IDs, product price snapshots, subtotal/fees/discount/total in minor units, `currency`, payment method, `expiresAt`, and stock/validation warnings.

3. `POST /orders` with `Idempotency-Key`, body `{ quoteId, paymentMethod, returnUrl? }`. Response `{ order, payment, remainingCart }`. On successful selected-line order creation, remove only purchased lines. Preserve all unselected lines. Revalidate status, stock, and price at order creation.
4. Supported payment methods: `wallet` and `direct`. Wallet checkout debits and creates the order atomically. Direct payment returns pending state and a provider checkout URL/reference; payment status changes only after signed provider webhook confirmation. Reserve the unique item while direct payment is pending and release after payment expiry/failure.
5. Wallet endpoints: `GET /wallet`, `GET /wallet/transactions`, `POST /wallet/top-ups` request `{ amountMinor, paymentMethod: "direct", returnUrl }`. Credit wallet only on verified provider confirmation.
6. Orders: `GET /orders`, `GET /orders/{orderId}`, `GET /orders/{orderId}/tracking`, and `POST /orders/{orderId}/confirm-delivery` if Thrift-Z delivery confirmation is supported.

Order line must store an immutable item snapshot (title, seller display name, condition, media cover, unit price, quantity), so sold/edited listings do not rewrite order history.

## Product Detail and Media Viewer Response

`GET /products/{productId}` returns the full ordered `media[]` and current purchase availability. The front end may open an image/video viewer modal and implement zoom/pan client-side. Backend may also provide transformed image sizes/thumbnail URLs; never require the viewer to fetch a seller's private original file. Video response includes poster and duration; media URLs may be public CDN URLs or short-lived read URLs per policy.

## Example Storefront and List Responses

Bootstrap:

```json
{
  "data": {
    "store": { "id": "thriftz", "name": "Thrift-Z", "currency": "NGN" },
    "categories": [{ "id": "fashion", "name": "Fashion & Accessories" }],
    "sections": [{ "key": "featured", "title": "Featured Thrift Finds", "displayOrder": 1 }],
    "paymentMethods": ["wallet", "direct"],
    "deliveryOptions": []
  }
}
```

Catalog list: `{ "data": { "items": [ThriftZProduct], "pageInfo": { "nextCursor": null, "hasMore": false } } }`. Error: `{ "error": { "code": "ITEM_ALREADY_RESERVED", "message": "This listing is being purchased by another buyer", "fields": {} }, "requestId": "req_123" }`.

## Endpoint-by-Endpoint Request and Response Schemas

Unless stated otherwise, successful JSON responses use `{ "data": <response>, "meta": {} }`; errors use the error envelope above. GET requests have no body. Authenticated routes use the user's secure session. All amounts are integer kobo. `Idempotency-Key` is required for order, top-up, listing submission where retried, media completion, and import application.

### Public Storefront and Product Catalog

**GET `/stores/thriftz/bootstrap`**  
Query: `locale?`. No body.  
`data`: `{ store: { id, name, currency: "NGN" }, categories: [{ id, name, displayOrder, parentId? }], sections: [{ key, title, displayOrder, productQuery? }], promotions: Promotion[], deliveryOptions: DeliveryOption[], paymentMethods: ["wallet"|"direct"], featureFlags: object }`.

**GET `/stores/thriftz/sections/{sectionKey}/products`**  
Path: `sectionKey`. Query: `categoryId?`, `q?`, `condition?`, `sort?` (`featured`, `price_asc`, `price_desc`, `discount_desc`), `cursor?`, `limit?`. No body.  
`data`: `{ items: ThriftZProduct[], pageInfo: { nextCursor: string|null, hasMore: boolean }, facets?: { categories?, conditions?, priceRange? } }`. Return only published and available listings.

**GET `/products/{productId}`**  
Path: `productId`; no query/body.  
`data`: `{ product: ThriftZProduct, deliveryOptions: DeliveryOption[] }`. Return ordered image/video metadata and current purchase availability. Exclude seller-private data.

**GET `/stores/thriftz/suggestions`** (optional autocomplete endpoint)  
Query: required `q`; optional `categoryId`, `limit`. No body.  
`data`: `{ items: [{ productId, title, categoryId, priceMinor, currency: "NGN", thumbnailUrl, availability }] }`.

### Identity and Account

**POST `/auth/register`**  
Request: `{ name: string, phone: string, email?: string, password: string, storeKey: "thriftz" }`. Seller application/approval is a separate action; registration must not automatically confer seller role.  
`data`: `{ user: { id, name, phone, email?, roles[] }, session: { expiresAt }, wallet: { balanceMinor, currency: "NGN" } }`.

**POST `/auth/login`**  
Request: `{ phoneOrEmail: string, password: string }`.  
`data`: `{ user: { id, name, phone, email?, roles[] }, session: { expiresAt }, wallet: { balanceMinor, currency: "NGN" } }`.

**POST `/auth/logout`**  
Request: empty JSON `{}` or no body as specified by cookie-session implementation.  
`data`: `{ loggedOut: true }`.

**GET `/account/me`**  
No query/body.  
`data`: `{ user: { id, name, phone, email?, roles[], createdAt }, wallet: { balanceMinor, currency: "NGN" } }`.

**PATCH `/account/me`**  
Request: `{ name?: string, email?: string, phone?: string }`; reject role, wallet, rating, and other protected fields.  
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

### Seller Authorization and Dashboard

**GET `/seller/me`**  
No query/body. 200 `data`: `{ sellerId, role: "seller", sellerStatus: "pending"|"approved"|"suspended", displayName, email? }`. Return 401 for no session and 403 for an authenticated non-seller or unauthorized seller. `approved` is required to create/submit active listings.

**GET `/seller/dashboard`**  
Query: optional `from`, `to`. No body.  
`data`: `{ listingCounts: { draft, pendingReview, published, rejected, sold }, sales: { grossMinor, currency: "NGN", orderCount }, recentActivity: [{ type, listingId?, orderId?, occurredAt }] }`.

**GET `/seller/listings`**  
Query: `status?`, `categoryId?`, `cursor?`, `limit?`. No body.  
`data`: `{ items: [SellerListingSummary], pageInfo }`. Seller sees own listings only, unless moderator/admin.

**GET `/seller/listings/{listingId}`**  
Path: `listingId`; no body.  
`data`: `{ listing: ThriftZListing, moderation: { decisionReason?, reviewedAt? } }`, with ownership/role checks.

**POST `/seller/listings`**  
Request: `{ title, category, condition, priceMinor, originalPriceMinor?, description, attributes?, specifications?, media: [{ mediaId, type: "image"|"video", sortOrder }] }`. The client cannot set `sellerId`, ratings, moderation status, section membership, or published state.  
`data`: `{ listing: ThriftZListing, validation: { warnings: string[] } }`. New record is `draft` unless the endpoint explicitly accepts a submit intent; it is never public until approved/published.

**PATCH `/seller/listings/{listingId}`**  
Path: `listingId`. Request: a partial subset of editable fields from create schema; only `draft`/`rejected` listings may be edited unless policy permits otherwise.  
`data`: `{ listing: ThriftZListing, validation: { warnings: string[] } }`.

**POST `/seller/listings/{listingId}/submit`** (requires `Idempotency-Key`)  
Path: `listingId`. Request: `{ sellerAttestation: true }`.  
`data`: `{ listingId, moderationStatus: "pending_review", submittedAt, reviewEstimate? }`.

Moderation actions should use separate moderator-only endpoints; request schema should identify `decision: "approve"|"reject"`, optional `reason`, and response with moderation status, reviewer, and timestamp. Never expose these routes to seller role.

### Media Uploads

**POST `/seller/media/uploads`**  
Request: `{ fileName: string, contentType: string, sizeBytes: integer, mediaType: "image"|"video", sortOrder: integer }`.  
`data`: `{ uploadId, uploadUrl, method: "PUT", headers: { "Content-Type": string }, expiresAt, maxBytes }`.

**PUT `{uploadUrl}`** (signed object-storage URL)  
Request: raw file bytes; required headers exactly as returned by upload allocation.  
Response: storage success (typically HTTP 200/204); no application JSON body required. Backend must still verify the uploaded object before media completion.

**POST `/seller/media/uploads/{uploadId}/complete`** (requires `Idempotency-Key`)  
Path: `uploadId`. Request: `{ checksum? }`.  
`data`: `{ media: { mediaId, type, url, thumbnailUrl, durationSeconds?, width?, height?, sortOrder, processingStatus: "ready" } }`. Reject incomplete, mismatched, unsafe, expired, or unowned uploads.

### Google Sheets and Google Drive Import

**GET `/seller/google/connect`**  
Query: optional `returnTo` from an allowlisted relative path. No body.  
`data`: `{ authorizationUrl, state, expiresAt }`; redirect the browser to the returned URL. Tokens remain server-side.

**GET `/seller/google/callback`** (Google-to-browser OAuth callback)  
Query: provider `code`, `state` (or provider `error`). No JSON body. Validate state and exchange code server-side.  
Success: HTTP 302 to seller portal with a non-sensitive result indicator; failure: safe error redirect. Do not put access/refresh tokens in query parameters or browser storage.

**GET `/seller/google/connection`**  
No query/body.  
`data`: `{ connected: boolean, accountEmail?, connectedAt?, grantedScopes[] }`.

**DELETE `/seller/google/connection`**  
No body. Revoke/remove stored authorization.  
`data`: `{ disconnected: true }`.

**GET `/seller/google/sources`**  
Query: optional `type` (`google_sheet`, `drive_file`), `q`, `cursor`, `limit`. No body.  
`data`: `{ items: [{ id, name, type: "google_sheet"|"drive_file", mimeType?, modifiedAt }], pageInfo }`. Return only resources accessible through the seller's granted Google connection.

**POST `/seller/imports`**  
Request: `{ sourceType: "google_sheet"|"drive_file", sourceId: string, sheetName?: string, columnMapping?: { title?, category?, condition?, price?, originalPrice?, description?, imageUrls?, videoUrl?, attributes? } }`.  
`data`: `{ importId, status: "processing"|"ready", totalRows?, createdAt }`. Validate seller ownership of source and supported MIME/type.

**GET `/seller/imports/{importId}`**  
Path: `importId`; query: optional `cursor`, `limit`. No body.  
`data`: `{ importId, status, rows: [{ rowId, rowNumber, normalized: { title, category, condition, priceMinor, originalPriceMinor?, description, attributes?, specifications?, mediaReferences[] }, valid, errors: string[], warnings: string[], duplicateCandidate?: { listingId, title } }], pageInfo, createdAt, updatedAt }`. Bind imports and rows to the authenticated seller.

**POST `/seller/imports/{importId}/apply`** (requires `Idempotency-Key`)  
Path: `importId`. Request:

```json
{
  "selectedRowIds": ["row_17", "row_18"],
  "publishIntent": "pending_review"
}
```

`data`: `{ createdListings: [{ rowId, listingId, moderationStatus }], failedRows: [{ rowId, errors: string[] }] }`. Create only selected valid rows; safely ingest media; enforce duplicate policy and do not bypass moderation. Repeated idempotency key must not create duplicate listings.

### Cart, Quote, and Selected-Item Checkout

**GET `/cart`**  
No query/body.  
`data`: `{ cartId, currency: "NGN", lines: [{ lineId, productId, product: { title, condition, thumbnailUrl, sellerDisplayName }, quantity, unitPriceMinor, lineTotalMinor, availability }], subtotalMinor, discountMinor, fees: [{ code, label, amountMinor }], totalMinor, updatedAt }`.

**POST `/cart/items`**  
Request: `{ productId: string, quantity: integer }`.  
`data`: updated cart. Reject unavailable, unpublished, reserved, or sold listing. For unique goods, quantity must be exactly 1.

**PATCH `/cart/items/{lineId}`**  
Path: `lineId`. Request: `{ quantity: integer }`.  
`data`: updated cart; enforce current available quantity.

**DELETE `/cart/items/{lineId}`**  
Path: `lineId`; no body.  
`data`: `{ cart: Cart, removedLineId: string }`.

**POST `/checkout/quote`**  
Request: `{ cartId: string, lineIds?: string[], paymentMethod: "wallet"|"direct", deliveryOptionId?: string, deliveryAddressId?: string, pickupLocationId?: string, promotionCode?: string }`. Omit `lineIds` to select the entire cart; include one or more IDs to purchase only those lines.  
`data`: `{ quoteId, cartId, selectedLines: [{ lineId, productId, quantity, unitPriceMinor, lineTotalMinor, availability }], subtotalMinor, discountMinor, fees: [{ code, label, amountMinor }], totalMinor, currency: "NGN", paymentMethod, walletBalanceMinor?, warnings: [{ code, message, lineId? }], expiresAt }`.

**POST `/orders`** (requires `Idempotency-Key`)  
Request: `{ quoteId: string, paymentMethod: "wallet"|"direct", returnUrl?: string }`.  
`data`: `{ order: { id, status, paymentStatus, lines: OrderLine[], subtotalMinor, discountMinor, fees, totalMinor, currency, fulfillment, createdAt }, payment: { id, type, status, amountMinor, currency, providerReference?, checkoutUrl?, expiresAt? }, remainingCart: Cart }`. Remove only successfully purchased lines; leave all unselected cart lines. Wallet debit and order creation must be atomic.

### Direct Payment, Wallet, and Orders

**GET `/payments/{paymentId}`**  
Path: `paymentId`; no body.  
`data`: `{ payment: { id, orderId?, status, type, amountMinor, currency: "NGN", providerReference?, updatedAt }, order?: { id, status, paymentStatus } }`.

**POST `/webhooks/payments/{provider}`** (provider-to-server only)  
Request: provider-specific signed raw body. Validate signature, event ID, provider reference, amount, and currency.  
Response: HTTP 200 `{ received: true }` for accepted/already-processed event. Never treat browser redirect as confirmation.

**GET `/wallet`**  
No query/body.  
`data`: `{ balanceMinor, currency: "NGN", updatedAt }`.

**GET `/wallet/transactions`**  
Query: `cursor?`, `limit?`, `type?`. No body.  
`data`: `{ items: [{ id, type, status, amountMinor, currency: "NGN", reference, description, createdAt }], pageInfo }`.

**POST `/wallet/top-ups`** (requires `Idempotency-Key`)  
Request: `{ amountMinor: integer, paymentMethod: "direct", returnUrl: string }`.  
`data`: `{ topUpId, payment: { id, status: "pending", amountMinor, currency: "NGN", providerReference, checkoutUrl, expiresAt } }`. Credit only after verified provider event.

**GET `/orders`**  
Query: `cursor?`, `limit?`, `status?`. No body.  
`data`: `{ items: [OrderSummary], pageInfo }`.

**GET `/orders/{orderId}`**  
Path: `orderId`; no body.  
`data`: `{ order: { id, status, paymentStatus, lines: OrderLine[], subtotalMinor, fees, totalMinor, currency: "NGN", fulfillment, tracking, createdAt, updatedAt } }`. Order lines hold item snapshots so later listing edits cannot rewrite purchase history.

**GET `/orders/{orderId}/tracking`**  
Path: `orderId`; no body.  
`data`: `{ orderId, status, events: [{ status, message, occurredAt, location? }], estimatedDeliveryAt? }`.

**POST `/orders/{orderId}/confirm-delivery`** (if buyer passcode confirmation is enabled)  
Path: `orderId`. Request: `{ deliveryPasscode: string }`.  
`data`: `{ orderId, status: "delivered", confirmedAt }`. Verify passcode and buyer/order authorization server-side.

### Shared Type Shapes Referenced Above

`Promotion`: `{ id, code?, label, discountType, discountValue, startsAt, endsAt }`. `DeliveryOption`: `{ id, type, label, feeMinor, estimatedMinutes?, available }`. `Address`: `{ id, recipientName, phone, addressLine1, addressLine2?, city, state, postalCode?, countryCode, landmark?, deliveryInstructions?, isDefault }`. `OrderLine`: `{ productId, productName, sellerDisplayName, condition, mediaThumbnailUrl?, quantity, unitPriceMinor, lineTotalMinor }`. `OrderSummary`: `{ id, status, paymentStatus, totalMinor, currency, itemCount, createdAt }`. `Cart` is the data object returned by `GET /cart`.

## Backend Invariants and Tests

- Only approved/published listings appear publicly. Enforce seller status and ownership on every seller API call.
- Client cannot set rating, seller ID, moderation outcome, available quantity, transaction status, or final price.
- Validate listing media ownership and processing state. Scan uploads, constrain sizes/formats/duration, and remove orphaned uploads.
- A single-quantity listing can be sold once only. Reservation, wallet debit, order creation, and payment transitions need concurrency control and idempotency.
- Whole-cart checkout selects all current lines; selected-line checkout leaves all other lines intact. Requote if a selected listing changed or became unavailable.
- Test multiple photos, optional video, thumbnail order, rejected media, zoom viewer URLs, seller 401/403, moderation visibility, Google source access and revoke, invalid/duplicate import rows, retry idempotency, direct-payment expiry, wallet insufficiency, and two buyers racing for one listing.
