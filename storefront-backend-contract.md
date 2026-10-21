# Backend Contract Draft: Betasup, UwanBuy, and Thrift-Z

**Purpose:** Shared API overview for completing the three storefronts. The current HTML files are prototypes: catalog data and most cart, wallet, payment, and order actions are simulated in browser JavaScript. This file defines cross-store conventions and shared flows; the linked store-specific schema documents are canonical for each store's product, endpoint request, and response payloads. Keep those contracts in sync when changing shared behavior.

**Canonical store schemas:** [Betasup](betasup-data-schema.md), [UwanBuy](uwanbuy-data-schema.md), and [Thrift-Z](thriftz-data-schema.md).

## Decisions and Conventions

- API base path: `/api/v1`; JSON request/response bodies, except signed binary media uploads.
- Currency is NGN for all three shops. API amounts are integer kobo (`priceMinor`, `totalMinor`); the frontend formats them as naira. Never accept client-calculated totals or wallet balances as authoritative.
- Use stable IDs, ISO-8601 UTC timestamps, cursor pagination (`limit`, `cursor`), and an `Idempotency-Key` header for order and top-up creation, auction bids, listing submission where retried, media upload completion, and bulk import application.
- Success envelope: `{ "data": ..., "meta": ... }`. Error envelope: `{ "error": { "code": "...", "message": "...", "fields": {} }, "requestId": "..." }`.
- Authenticate with secure, HTTP-only session cookies (or a documented bearer-token alternative). Enforce user, seller, moderator, and admin permissions in the backend. Hiding a page or button is not authorization.
- All prices, promotions, fees, stock, wallet balances, payment status, auction outcomes, and order status are server-authoritative.
- Direct payments use a provider adapter. Return a provider checkout URL/token; do not handle raw card data in the storefront. Verify provider webhooks and make them idempotent.

## Screens To Complete

**All stores:** home/storefront; independently populated product sections; category/search/sort; product detail; cart; sign-in/register/profile; wallet and transaction history; checkout/payment selection; payment result; orders, order detail, and tracking; delivery options and address/pickup selection; empty/loading/error states.

**Betasup:** configurable soup/product detail for size, protein, swallow and quantity; hub/delivery selection; wallet deposit; cart and order history; genuine auction detail, bid history, winner and settlement screens.

**UwanBuy:** foodstuff, groceries, fashion, gadgets, trending, and future merchant-defined product sections; gadget details/specifications modal; quick-add suggestions; upload shopping list and review parsed product matches.

**Thrift-Z:** public browse and product detail with multi-photo/video gallery, larger media viewer and zoom; cart and per-item/whole-cart checkout; wallet and direct payment; orders; restricted seller portal; single listing submission; seller listing management/moderation state; Google Sheets and Google Drive import preview/review.

## Shared Data Models

### Product (common fields)

```json
{
  "id": "prd_123",
  "storeId": "thriftz",
  "categoryId": "gadgets",
    "sectionKeys": ["featured", "gadgets"],
  "title": "Example item",
  "description": "Description",
  "media": [
    { "mediaId": "med_123", "type": "image", "url": "https://cdn.example/item.webp", "thumbnailUrl": "https://cdn.example/item-thumb.webp", "altText": "Front view", "sortOrder": 0 }
  ],
  "priceMinor": 125000,
  "currency": "NGN",
  "availability": { "status": "in_stock", "quantity": 1 },
  "status": "published",
  "tags": [],
  "createdAt": "2026-10-16T12:00:00Z",
  "updatedAt": "2026-10-16T12:00:00Z"
}
```

Video media additionally returns `durationSeconds` and a thumbnail. Never place upload credentials or private storage paths in public catalog responses.

### Cart and Quote

Cart line: `lineId`, `productId`, `variantId?`, `selectedOptions?`, product summary, `quantity`, `unitPriceMinor`, `lineTotalMinor`, `availability`.

Quote: `quoteId`, `cartId`, selected `lineIds[]`, `currency`, `subtotalMinor`, `discountMinor`, `fees[]`, `totalMinor`, `paymentMethod`, optional `walletBalanceMinor`, `expiresAt`, and validation warnings. The server recalculates price and availability when quoting and again when creating an order.

### Order and Payment

Order: `id`, `storeId`, `status`, `paymentStatus`, `lines[]` (product snapshot, selected options, quantity, unit/line price), subtotal/discount/fees/total in minor units, delivery/pickup details, timestamps, and tracking timeline.

Payment: `id`, `orderId?`, `type` (`wallet`, `direct`, `wallet_top_up`), `status` (`pending`, `succeeded`, `failed`, `expired`, `refunded`), `amountMinor`, `currency`, `providerReference?`, `checkoutUrl?`, and timestamps.

## Shared API Requests

### Storefront and Catalog

1. `GET /stores/{storeKey}/bootstrap`  
   Optional query: `locale`, `locationId`.  
   Response: `{ store, categories[], sections[], promotions[], deliveryOptions[], paymentMethods[], featureFlags }`. Each section includes a stable `key`, display title/order, and optional default product query. Keep section definitions independent from product payloads.

2. `GET /stores/{storeKey}/sections/{sectionKey}/products`  
   Query: `categoryId?`, `q?`, `sort?`, `cursor?`, `limit?`, `locationId?`.  
   Response: `{ items: Product[], pageInfo: { nextCursor, hasMore }, facets? }`.

3. `GET /products/{productId}`  
   Response: full store-specific Product, variants/options/specifications, current availability, and eligible delivery choices.

4. `GET /stores/{storeKey}/suggestions?q=...&categoryId=...&limit=...`  
   Response: `{ items: [{ productId, title, category, priceMinor, currency, mediaThumbnail }] }`.

### Account

5. `POST /auth/register`  
   Request: `{ name, phone, email?, password, storeKey, ...storeSpecificProfileFields }`. Betasup requires `hubId` and can accept `agentCode`.  
   Response: `{ user, session, walletSummary }`. Do not return password/PIN material.

6. `POST /auth/login` request `{ phoneOrEmail, password }`; `POST /auth/logout`; `GET /account/me`; `PATCH /account/me`.  
    Login returns user/session/profile summary. Do not return password or PIN material. Betasup PIN setup/change uses `PUT /account/wallet-pin`; step-up checks use `POST /wallet/verify-pin` and return a short-lived, purpose-bound verification token. Store PINs only as secure one-way hashes.

7. `GET /account/addresses`; `POST /account/addresses`; `PATCH /account/addresses/{addressId}`; `DELETE /account/addresses/{addressId}`.  
    Address request fields: `{ recipientName, phone, addressLine1, addressLine2?, city, state, postalCode?, countryCode: "NG", landmark?, hubId?, deliveryInstructions?, isDefault? }`. List response: `{ items: Address[], pageInfo }`; create/update response: `{ address: Address }`; delete response: `{ deleted: true, addressId }`. Each store-specific schema defines the exact request/response shapes.

### Cart, Checkout, and Payments

8. `GET /cart`; `POST /cart/items`; `PATCH /cart/items/{lineId}`; `DELETE /cart/items/{lineId}`.  
   Add request: `{ productId, variantId?, selectedOptions?, quantity }`. Patch request: `{ quantity }`. Responses return the full recalculated cart and totals.

9. `POST /checkout/quote`  
   Request: `{ cartId, lineIds?, paymentMethod, deliveryOptionId?, deliveryAddressId?, pickupLocationId?, promotionCode? }`. Omit `lineIds` to quote the full cart. A provided subset enables Thrift-Z single-item/partial-cart purchase.  
   Response: quote model above. Reject unavailable lines and explain per-line errors; quote must expire.

10. `POST /orders` with `Idempotency-Key`  
   Request: `{ quoteId, paymentMethod, returnUrl? }`.  
   Response: `{ order, payment, remainingCart }`. For wallet payment, debit and order creation must be atomic. For direct payment, return pending state plus provider checkout URL/reference. For Thrift-Z partial-cart purchase, leave unselected lines in the cart.

11. `GET /payments/{paymentId}`  
    Response: current payment state and associated order. Payment provider webhook endpoint is server-to-server, signature-verified, and idempotent. Never treat a browser redirect as proof of payment.

### Wallet

12. `GET /wallet`; `GET /wallet/transactions?cursor=...&limit=...`; `POST /wallet/top-ups` with `Idempotency-Key`.  
    Top-up request: `{ amountMinor, paymentMethod: "direct", returnUrl }`.  
    Response: `{ topUpId, payment: { status, checkoutUrl, providerReference, expiresAt } }`. Credit only after trusted provider confirmation. Wallet response includes `balanceMinor`, `currency`; transactions include ID/type/amount/status/reference/timestamp.

### Orders and Delivery

13. `GET /orders?cursor=...&limit=...`; `GET /orders/{orderId}`; `GET /orders/{orderId}/tracking`; `POST /orders/{orderId}/confirm-delivery`.  
    Confirmation request: `{ deliveryPasscode }` when required. Response includes updated order/timeline and confirmation result. Verify passcodes server-side; never mark delivered in local browser state only.

## Betasup Product and Auction API

The full Betasup product, account, cart, PIN, address, wallet, delivery, and auction request/response schemas are maintained in [betasup-data-schema.md](betasup-data-schema.md). That file is authoritative for these payloads.

### Betasup Product Extension

The detailed Betasup schema uses `name` for the display title and `basePriceMinor` for the starting price; these are Betasup-specific names, not aliases sent alongside common `title`/`priceMinor` fields. Each `variant.priceMinor` is the price used to configure an order. Add `categoryId` (`classic`, `stews`, `delicacies`, `packages`), `productType` (`soup_pot`, `party_cooler`, `meal_pack`), `tagline`, `ingredients[]`, `allergens[]`, and:

```json
{
  "variants": [{ "id": "size_1l", "name": "1L Standard", "volumeMl": 1000, "priceMinor": 350000, "mediaId": "med_1" }],
  "proteinOptions": [{ "id": "goat", "name": "Goat meat", "priceMinor": 0 }],
  "swallowOptions": [{ "id": "eba", "name": "Eba (2 wraps)", "priceMinor": 40000 }],
  "availability": { "status": "available", "preparationLeadMinutes": 45, "availableFrom": "2026-10-16T13:00:00Z" }
}
```

Order line `selectedOptions` must preserve variant, protein, swallow, and quantity. Return server-calculated line totals.

### Auction Screens/Requests

13. `GET /stores/betasup/auctions?status=live&cursor=...` and `GET /stores/betasup/auctions/{auctionId}`.  
    Response: auction/product, opening/current price, minimum next bid, `startsAt`, `endsAt`, status, bid count, and bid history visibility/data.

14. `POST /stores/betasup/auctions/{auctionId}/bids` with `Idempotency-Key`.  
    Request: `{ amountMinor, walletPin? }`.  
    Response: `{ bid, currentPriceMinor, minimumNextBidMinor, endsAt, bidderStatus }`. Validate auction state, bid increments, funds/authorization, and concurrent bids transactionally. Define anti-sniping extension rules if used.

15. `GET /account/auctions/{auctionId}` and winner settlement via standard quote/order/payment APIs.  
    Winner response includes payment deadline and status. Expired winner payment must trigger a documented next-winner or auction-closure rule. Keep ordinary fixed-price soup ordering available separately from auctions.

## UwanBuy Product and Shopping-List API

The full UwanBuy product/specification, account, address, cart, wallet, order, and shopping-list upload/match/apply schemas are maintained in [uwanbuy-data-schema.md](uwanbuy-data-schema.md). That file is authoritative for these payloads, including multipart upload fields and row-by-row match results.

### UwanBuy Product Extension

Use common Product fields plus `sku`, `brand`, `unitLabel`, `packSize`, `stock: { quantity, status, allowBackorder }`, `salePriceMinor`, `compareAtPriceMinor`, `specifications`, and `specificationSchemaVersion` as a validated category-specific object. Gadget specifications should include applicable model, storage, memory, connectivity, compatibility, warranty, and condition fields. Do not force grocery/fashion attributes into gadget fields.

### Shopping List Upload/Matching

16. `POST /stores/uwanbuy/shopping-lists/uploads` multipart file (`txt`, `csv`, `pdf`), optional category/location.  
    Response: `{ uploadId, status }` or parsed result if synchronous.

17. `GET /stores/uwanbuy/shopping-lists/uploads/{uploadId}`  
    Response: `{ status, rows: [{ rowId, originalText, requestedQuantity, matches: [{ productId, title, priceMinor, confidence }], selectedProductId?, state, errors[] }] }`. Return unmatched rows and ambiguities instead of guessing.

18. `POST /stores/uwanbuy/shopping-lists/uploads/{uploadId}/apply`  
    Request: `{ selections: [{ rowId, productId, quantity }] }`.  
    Response: updated cart. Require the customer to review/confirm matches before adding them.

## Thrift-Z Product, Seller, Media, and Google Workspace API

The full Thrift-Z product, seller authorization/dashboard/listing, media allocation/upload/completion, Google OAuth/connection/source, bulk import, address, cart, payment, and order schemas are maintained in [thriftz-data-schema.md](thriftz-data-schema.md). That file is authoritative for these payloads and permission requirements.

### Thrift-Z Product Extension

Use common Product fields plus `sellerId`, `condition` (`like_new`, `gently_used`, `refurbished`, `fair`), `originalPriceMinor?`, `attributes`, category-dependent `specifications`, `moderationStatus` (`draft`, `pending_review`, `published`, `rejected`, `sold`), `sellerRatingSummary`, and `quantity` (normally one). Support multiple ordered images and optional video. Listing availability must prevent purchasing a one-off item twice.

### Restricted Seller Session and Single Listing

19. `GET /seller/me`  
    Response: `{ sellerId, role: "seller", displayName, email?, sellerStatus }`. Return 401 when signed out and 403 when authenticated but not authorized. The seller page must remain locked for any other response/error.

20. `POST /seller/media/uploads`  
    Request: `{ fileName, contentType, sizeBytes, mediaType: "image"|"video", sortOrder }`.  
    Response: `{ uploadId, uploadUrl, headers, expiresAt }`. Validate type, byte size, and video duration. Upload bytes directly to signed storage URL.

21. `POST /seller/media/uploads/{uploadId}/complete` with `Idempotency-Key`  
    Request: `{ checksum? }`.  
    Response: `{ media: { mediaId, type, url, thumbnailUrl, durationSeconds?, sortOrder } }`. Verify the upload before returning an attachable media ID.

22. `POST /seller/listings`; `PATCH /seller/listings/{listingId}`; `GET /seller/listings`; `GET /seller/listings/{listingId}`; `POST /seller/listings/{listingId}/submit`.  
    Create request: `{ title, category, condition, priceMinor, originalPriceMinor?, description, attributes?, specifications?, media: [{ mediaId, type, sortOrder }] }`.  
    Response returns listing ID, seller ID, normalized values, and moderation status. The seller cannot assign their own seller ID, rating, moderation state, or publication status. Require seller ownership for updates. A create request defaults to `draft`; explicit submission moves it to `pending_review`. It is never public before approval.

### Google Sheets and Drive Bulk Import

1. `GET /seller/google/connect`  
    Response: `{ authorizationUrl }`; request only necessary Google Sheets/Drive scopes, protect refresh/access tokens server-side, support revoke/disconnect.

2. `GET /seller/google/callback`  
    Google redirects with `code` and `state` (or an error). Validate state, exchange the code server-side, and redirect to the seller portal with a non-sensitive result. Never include tokens in the redirect URL or browser storage.

3. `GET /seller/google/connection` and `DELETE /seller/google/connection`  
    GET response: `{ connected, accountEmail?, connectedAt?, grantedScopes[] }`. DELETE response: `{ disconnected: true }`; revoke and remove stored authorization.

4. `GET /seller/google/sources`  
    Response: `{ items: [{ id, name, type: "google_sheet"|"drive_file", modifiedAt }] }`. Only return files the seller authorized the app to access.

5. `POST /seller/imports`  
    Request: `{ sourceType, sourceId, sheetName?, columnMapping? }`.  
    Response: `{ importId, status, rows: [{ rowId, rowNumber, originalText?, normalized: { title, category, condition, priceMinor, originalPriceMinor?, description, mediaReferences? }, valid, errors[], warnings[], duplicateCandidate? }] }`. Support Sheets and supported Drive file types; define accepted file formats.

6. `GET /seller/imports/{importId}`  
    Response: current import job state and row preview/errors. Bind import to the authenticated seller and expire temporary source data appropriately.

7. `POST /seller/imports/{importId}/apply` with `Idempotency-Key`  
    Request: `{ selectedRowIds: [], publishIntent: "pending_review" }`.  
    Response: `{ createdListings: [{ rowId, listingId, moderationStatus }], failedRows: [{ rowId, errors[] }] }`. Create only selected valid rows, deduplicate retries, and never bypass moderation.

## Storefront Section Data and Rendering

- Return bootstrap configuration, categories, promos, and named section descriptors together once per store. Fetch each section's products separately with pagination/search/filter parameters. This lets sections render and refresh independently without many page-start requests.
- Initial section keys: Betasup `classic_soups`, `special_stews`, `regional_delicacies`, `party_packages`; UwanBuy `foodstuff`, `groceries`, `fashion`, `gadgets`, `trending`; Thrift-Z `featured`, `fashion`, `gadgets`, `home`.
- Treat section keys as configuration, not hard-coded product schema. The same product may appear in multiple sections without duplicating the product record.

## Security, Consistency, and Acceptance Tests

- Server validates roles, listing ownership, product status, option IDs, stock, prices, fees, promotion eligibility, seller media ownership, and auction rules.
- Wallet debit plus order creation is atomic. Payment webhooks, order submission, top-ups, bid submission, and import application are idempotent.
- Reserve stock for pending direct payments; release on failed/expired payment. Re-check stock and quoted prices at order creation.
- Thrift-Z partial checkout buys only selected cart lines and leaves other lines untouched. Verify single-quantity inventory prevents two successful buyers.
- Verify 401/403 seller portal states, signed media upload completion, multiple images/video, and that unapproved listings do not appear in public catalog.
- Verify Google OAuth scope, source listing, preview validation, duplicate detection, selected-row submission, retry behavior, and row-specific failures.
- Verify UwanBuy upload parsing, suggested matches, user-confirmed cart application, gadget specification payloads, and out-of-stock behavior.
- Verify Betasup variant/protein/swallow calculations, wallet/direct checkout, auction minimum bid, concurrent bid race, end-time behavior, winner deadline, and passcode validation.
- Test totals and rounding in kobo, direct-payment return/webhook failure modes, wallet insufficiency, duplicate idempotency key, and cart changes after quote.

## Suggested Delivery Sequence

1. Agree endpoint naming, auth/session model, NGN kobo convention, error format, and core schemas.
2. Implement store bootstrap, section catalog, detail endpoints, and product fixtures per store.
3. Implement account, cart, quote, orders, wallet, direct-payment adapter, and webhook handling.
4. Integrate storefronts section by section and remove hard-coded transaction state.
5. Complete UwanBuy shopping-list parsing/matching and gadget attributes.
6. Complete Thrift-Z seller authorization, media storage, moderation, Sheets/Drive import, gallery metadata, and partial checkout.
7. Complete Betasup custom options, fulfillment/passcodes, and timed auctions.
8. Add contract/integration tests for all acceptance checks before production launch.

## Current Frontend Work Started

- `thriftz.html` now links seller calls to a separate `thriftz-seller.html`; the public seller modal and client-only listing publish path have been removed.
- `thriftz-seller.html` fails closed unless `GET /api/v1/seller/me` returns an authorized seller. It contains a single-listing flow with multiple images/optional video and a Google Sheets/Drive source-preview-apply flow.
- The seller portal expects the endpoints above and must not be considered production-secure until those server checks, upload validation, storage controls, and moderation rules exist.

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

# UwanBuy Storefront Architecture & Lifecycle Extensions (October 2026)

This section extends the shared backend contract with storefront-level autonomous features pioneered on **UwanBuy** and standardized for future storefront updates (Thrift-Z and Betasup).

---

### 1. Storefront Autonomous Auctions & MOQ Contract

Storefront auctions are managed locally within each storefront's administration boundary (`uwanbuy/admin/`) rather than originating from the centralized AreaBazaar live session engine.

- **MOQ (Minimum Order Quantity):** All auction types must include `moq: integer` in their initial payload. The server validates that all bid bids, spot purchases, and claims satisfy `quantity >= moq`.
- **Supported Formats:**
  1. `bid_and_win`: Open bidding with minimum increment (`minimumNextBidMinor`), auto anti-sniping extension (+120 seconds if bid placed within 60s of deadline), and MOQ enforcement.
  2. `flat_rate`: Fixed steep discount liquidation requiring bulk purchase quantity meeting or exceeding `moq`.
  3. `price_wave`: Scheduled hourly step-downs (`waves: [{ waveNumber, priceMinor, startsAt }]`) with price locks honoring wave-specific MOQ.
  4. `stock_cap`: Total pool quantity allocation with hard-capped inventory limits and client MOQ thresholds.
  5. `time_cap`: Strict deadline sales expiring unconditionally at `00:00:00`.

---

### 2. Asynchronous Checkout Validation & Delivery Contract

- **Order Identification:** Every checkout initiation assigns an immutable server-generated `orderId` (format: `ORD-[STORE]-[YEAR][MONTH]-[RANDOM]`).
- **Asynchronous Quote Validation (`POST /api/v1/checkout/validate`):**
  - Evaluates fulfillment options:
    - **Pickup Point (Free):** Returns active hub collection points (`pku_*`) with address and operating hours; delivery fee = 0 kobo.
    - **Address Delivery:** Computes standard shipping fee based on registered or input delivery destination.
    - **Express Delivery:** Adds an express handling surcharge when requested.
  - Dynamically computes VAT (7.5% where applicable) and server-calculated `totalMinor`.
  - Compares against user's wallet balance and returns `isSufficient: boolean` and `deficitMinor`.

---

### 3. Storefront Payment Request, Reference Generation & Dual Reconciliation

- **Dual-Channel Payment Request (`POST /api/v1/payments/request`):**
  - **Agent Channel:** Returns verified agent contact credentials, phone, WhatsApp link, and hub accreditation code.
  - **Direct Channel:** Returns company bank account details (bank name, account number, account name).
- **Payment Reference Generation (`POST /api/v1/payments/generate-ref`):**
  - Produces an alphanumeric reference (e.g. `REF-UWB-202610-xxxx`) with a 24-hour expiration window.
- **Payment Reporting & Dual Reconciliation (`POST /api/v1/payments/report`):**
  - Client submits payment reference, amount paid in minor kobo, bank paid from, and receipt notes.
  - **Reconciliation Path A (Wallet Top-Up):** Approving the report credits the customer's wallet balance; the user is prompted to return to cart and settle with wallet.
  - **Reconciliation Path B (Direct Order Payment):** If created directly for the order, approving the report bypasses wallet balance crediting and directly transitions the order to `paid`/`confirmed`, generating a delivery passcode.
- **Cart Top Alert State:** Unpaid orders with pending payment requests persist at the top of the user's cart drawer (`#cart-pending-orders-container`) with an actionable "Complete Purchase" trigger.

---

### 4. Category-Scoped Shopping List Matching

To conserve computational resources and eliminate unbounded catalog scans:
- List suggestions (`GET /api/v1/stores/uwanbuy/list-suggestions`) require an explicit `categoryId`.
- The frontend enforces category selection; typing without an active category highlights the selector with an animated red-glow state.
- Unlisted items submitted through the modal are retained as custom line items (`state: "unlisted"`) with user-provided descriptions.

---

### 5. Asynchronous Post-Payment Bulk Delivery Tracking Contract (15-Minute Interval)

- **Post-Payment Lifecycle Transition:** An order transitions to `paid_and_confirmed` once wallet balance deduction or payment report reconciliation is verified.
- **Customer Tracking Request Queue (`POST /api/v1/orders/{orderId}/tracking/request`):**
  - Customer can submit tracking requests across mobile and desktop.
  - Tracking requests are enqueued in `pending_tracking_dispatch` state, preventing redundant or duplicate external courier pings.
- **15-Minute Cron Batch Processing (`POST /api/v1/orders/tracking/bulk-dispatch`):**
  - Ingestion interval is fixed at **15 minutes** to aggregate orders efficiently for hyperlocal rider route grouping.
  - Server assigns active fulfillment riders (`riderName`, `riderPhone`, `dispatchStation`).
  - Automatically dispatches transactional email notifications to all customers whose tracking requests were queued in that 15-minute window.
  - Order status atomically transitions to `in_transit`.
- **Delivery Handover Verification:** Order handoff requires customer disclosure of the 4-digit numeric delivery passcode (`POST /api/v1/orders/{orderId}/confirm-delivery`).

---

### 6. Navigation-Triggered Self-Service Wallet Funding & Direct Reconciliation

- **Entrypoint:** Available globally from navigation `#btnNavWallet` across all storefront headers.
- **Top-Up Isolation:** Wallet top-ups carry `purpose: "wallet_topup"`. They generate dedicated references (`REF-UWB-YYYYMM-XXXXX`) and do not link to immediate order lines.
- **Idempotent Crediting:** When the payment report is reconciled by an administrator or accredited hub agent, the server credits the customer's wallet account in minor kobo and dispatches an instant confirmation notification.

---

### 7. Multi-Item Uniform Flat-Rate Auction Pool Contract & Cross-Store Parity

- **Pool Structure:** Flat-rate auctions can host a heterogeneous pool of eligible SKUs spanning multiple categories (appliances, cookware, fashion, tech accessories) all priced at an identical flat liquidation rate (e.g. ₦12,500.00).
- **Enforcement Rules:**
  - `uniformFlatPriceMinor`: Immutable across all pool items in the lot.
  - `poolCapacity` and `claimedSlots`: Decremented atomically when a batch is confirmed.
  - `moq` (Minimum Order Quantity): Client and server enforce that total units selected across any combination of pool items satisfy `sum(quantities) >= moq`.
- **Storefront Parity:** This multi-product flat-rate liquidation architecture, responsive offcanvas drawer, and 15-minute batch tracking queue serve as the standard reference implementation for Thrift-Z and Betasup.

