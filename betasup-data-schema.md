# Betasup Data Schema

Backend handoff schema for the Betasup Cyber Kitchen storefront. It covers store sections, soup/package products, configurable order lines, auctions, and the payloads needed by customer-facing screens.

## Shared API Conventions

- Base path: `/api/v1`; JSON except file uploads.
- Currency: `NGN`. All API amounts are integer kobo in fields ending with `Minor`; the UI formats them as naira.
- IDs are stable opaque strings. Dates are ISO-8601 UTC strings.
- Success response: `{ "data": ..., "meta": ... }`. Error response: `{ "error": { "code": "...", "message": "...", "fields": {} }, "requestId": "..." }`.
- Paginated lists accept `cursor` and `limit`; response `pageInfo` includes `nextCursor` and `hasMore`.
- Server is authoritative for options, prices, stock/availability, wallet balance, auction state, fees, and order status.

## Store Sections

`GET /stores/betasup/bootstrap` returns store settings and section descriptors. Suggested section keys:

- `classic_soups`
- `special_stews`
- `regional_delicacies`
- `party_packages`

Section descriptor:

```json
{
  "key": "classic_soups",
  "title": "Classic Soups",
  "displayOrder": 1,
  "productQuery": { "categoryId": "classic", "sort": "featured" }
}
```

Fetch section products separately using `GET /stores/betasup/sections/{sectionKey}/products?cursor=...&limit=...`. This keeps category/section rendering independent and supports per-section pagination. Product detail and selectors use `GET /products/{productId}`.

## Betasup Product Schema

```json
{
  "id": "bs_soup_101",
  "storeId": "betasup",
  "categoryId": "delicacies",
  "sectionKeys": ["regional_delicacies", "featured"],
  "productType": "soup_pot",
  "name": "Afang Soup Pot",
  "tagline": "Rich herbal Ukazi and waterleaf pot",
  "description": "Slow-simmered soup with waterleaf, stockfish, and beef.",
  "ingredients": ["Ukazi", "Waterleaf", "Stockfish", "Beef"],
  "allergens": [],
  "media": [
    { "mediaId": "med_bs_1", "type": "image", "url": "https://cdn.example/afang.webp", "altText": "Afang soup pot", "sortOrder": 0 }
  ],
  "basePriceMinor": 180000,
  "currency": "NGN",
  "variants": [
    { "id": "mini_1l", "name": "Mini 1L", "volumeMl": 1000, "priceMinor": 180000, "mediaId": "med_bs_2", "available": true },
    { "id": "family_2l", "name": "2L Family", "volumeMl": 2000, "priceMinor": 680000, "mediaId": "med_bs_3", "available": true }
  ],
  "proteinOptions": [
    { "id": "assorted", "name": "Assorted meat", "priceMinor": 0, "available": true },
    { "id": "goat", "name": "Goat meat", "priceMinor": 120000, "available": true }
  ],
  "swallowOptions": [
    { "id": "none", "name": "Soup pot only", "priceMinor": 0, "available": true },
    { "id": "eba_2", "name": "Eba (2 wraps)", "priceMinor": 40000, "available": true }
  ],
  "availability": {
    "status": "available",
    "availableQuantity": 12,
    "preparationLeadMinutes": 45,
    "availableFrom": "2026-10-16T13:00:00Z"
  },
  "rating": { "average": 4.9, "count": 128 },
  "status": "published",
  "createdAt": "2026-10-01T09:00:00Z",
  "updatedAt": "2026-10-16T09:00:00Z"
}
```

`categoryId` values: `classic`, `stews`, `delicacies`, `packages`. `productType` can distinguish `soup_pot`, `party_cooler`, `meal_pack`, or another backend-defined product class. Keep section membership separate from category so a product may appear in more than one curated section.

### Party Package Extension

Party coolers and catering packages should use the common product schema with additional `servesMin`, `servesMax`, `capacityLitres`, `includedItems[]`, `servingEquipmentIncluded`, `minimumNoticeHours`, and optional `customizationOptions[]`. Keep the same variant and option ID pattern to let the backend price the configured order.

## Configured Cart Line Schema

The client sends option IDs, never option names or computed prices:

```json
{
  "productId": "bs_soup_101",
  "variantId": "family_2l",
  "selectedOptions": {
    "proteinOptionId": "goat",
    "swallowOptionId": "eba_2"
  },
  "quantity": 2
}
```

Cart response line includes `lineId`, product summary, resolved option names, quantity, server-calculated `unitPriceMinor`, `lineTotalMinor`, and availability. The backend validates all option IDs, their availability, quantity limits, and current price.

## Auction Schema

An auction should reference a Betasup product (or auction-specific variant) and is not a replacement for fixed-price ordering.

```json
{
  "id": "auc_bs_9001",
  "storeId": "betasup",
  "productId": "bs_soup_101",
  "variantId": "family_2l",
  "status": "live",
  "openingPriceMinor": 600000,
  "currentPriceMinor": 720000,
  "minimumNextBidMinor": 740000,
  "currency": "NGN",
  "startsAt": "2026-10-16T11:00:00Z",
  "endsAt": "2026-10-16T14:00:00Z",
  "bidCount": 6,
  "bidHistoryVisibility": "public_amounts_anonymous",
  "winnerPaymentDeadline": null,
  "createdAt": "2026-10-15T10:00:00Z"
}
```

Bid record: `id`, `auctionId`, `bidderId` (private to authorized views), `displayName` (optional anonymized label), `amountMinor`, `status`, and `createdAt`. Never expose private account data in public bid history.

## Screen Data and API Requests

### Storefront, Category, Search, and Product Detail

- `GET /stores/betasup/bootstrap?locationId=...` returns store profile, categories, section descriptors, promotions, delivery/pickup options, and payment method availability.
- `GET /stores/betasup/sections/{sectionKey}/products?categoryId=...&q=...&sort=...&cursor=...&limit=...` returns `{ items: BetasupProduct[], pageInfo }`.
- `GET /products/{productId}` returns full product, available variant/options, current availability, and delivery eligibility.
- Optional `GET /stores/betasup/suggestions?q=...&limit=...` supports search autocomplete.

### Account and Hub

- `POST /auth/register` request: `{ name, phone, email?, password, hubId, agentCode? }`; response: user/session and wallet summary. Do not return a wallet PIN.
- `POST /auth/login` request: `{ phoneOrEmail, password }`; `POST /auth/logout`; `GET /account/me`.
- `GET /stores/betasup/hubs?query=...` response: `{ items: [{ id, name, address, location, openingHours, deliveryAvailable }] }`.

### Cart and Checkout

- Shared cart routes: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/{lineId}`, `DELETE /cart/items/{lineId}`.
- Add request uses the Configured Cart Line schema above.
- `POST /checkout/quote` request: `{ cartId, lineIds?, paymentMethod: "wallet"|"direct", deliveryOptionId?, deliveryAddressId?, pickupLocationId?, promotionCode? }`; response: `quoteId`, selected lines, `subtotalMinor`, `discountMinor`, `fees[]`, `totalMinor`, `currency`, payment method, expiry, and validation messages.
- `POST /orders` with `Idempotency-Key`, request `{ quoteId, paymentMethod, returnUrl? }`; response: order and payment state. Wallet debit plus order creation is atomic. Direct payment returns a pending payment and provider checkout URL.
- `GET /wallet`, `GET /wallet/transactions`, `POST /wallet/top-ups` use the shared wallet schema; fund wallet only after signed provider confirmation.
- `GET /orders`, `GET /orders/{orderId}`, `GET /orders/{orderId}/tracking`, and `POST /orders/{orderId}/confirm-delivery` support order history and delivery confirmation. Confirmation request: `{ deliveryPasscode }`; validate server-side.

### Auctions

- `GET /stores/betasup/auctions?status=live&cursor=...` returns paginated Auction summaries.
- `GET /stores/betasup/auctions/{auctionId}` returns full auction and permitted bid history.
- `POST /stores/betasup/auctions/{auctionId}/bids` with `Idempotency-Key`; request `{ amountMinor, walletPin? }`; response `{ bid, currentPriceMinor, minimumNextBidMinor, endsAt, bidderStatus }`.
- `GET /account/auctions/{auctionId}` returns the signed-in user's bid/leading status and, if won, payment deadline.
- Define tie-breaking, bid increments, auction extension/anti-sniping behavior, withdrawal policy, and winner non-payment/next-winner rules before launch. Validate concurrent bids transactionally and do not rely on client timers.

## Section and Response Envelopes

Bootstrap example:

```json
{
  "data": {
    "store": { "id": "betasup", "name": "Betasup Cyber Kitchen", "currency": "NGN" },
    "categories": [{ "id": "classic", "name": "Classic Soups" }],
    "sections": [{ "key": "classic_soups", "title": "Classic Soups", "displayOrder": 1 }],
    "deliveryOptions": [],
    "paymentMethods": ["wallet", "direct"]
  }
}
```

List response uses `data.items` plus `meta.pageInfo`. Error response: `{ "error": { "code": "VALIDATION_ERROR", "message": "Please select an available size", "fields": { "variantId": "Unavailable" } }, "requestId": "req_123" }`.

## Endpoint-by-Endpoint Request and Response Schemas

Unless stated otherwise, successful JSON responses use `{ "data": <response>, "meta": {} }`; errors use the error envelope above. GET requests have no body. Authenticated routes use the user's session. Every amount is integer kobo. `Idempotency-Key` is required on order creation, top-up creation, and bid submission.

### Storefront and Catalog

**GET `/stores/betasup/bootstrap`**  
Query: `locationId?`, `locale?`. No body.  
`data` schema: `{ store: { id, name, currency }, categories: [{ id, name, displayOrder }], sections: [{ key, title, displayOrder, productQuery? }], promotions: Promotion[], deliveryOptions: DeliveryOption[], paymentMethods: ["wallet"|"direct"], featureFlags: object }`.

**GET `/stores/betasup/sections/{sectionKey}/products`**  
Path: `sectionKey`. Query: `categoryId?`, `q?`, `sort?`, `cursor?`, `limit?`, `locationId?`. No body.  
`data`: `{ items: BetasupProduct[], pageInfo: { nextCursor: string|null, hasMore: boolean }, facets?: object }`; `meta` may include `total` when supported.

**GET `/products/{productId}`**  
Path: `productId`; no query/body.  
`data`: `{ product: BetasupProduct, deliveryOptions: DeliveryOption[], requestedLocation: { id, deliverable } }`. Return all available variants/options and current availability.

**GET `/stores/betasup/suggestions`**  
Query: required `q`, optional `limit`, `locationId`. No body.  
`data`: `{ items: [{ productId, name, categoryId, priceMinor, currency, thumbnailUrl, availability }] }`.

**GET `/stores/betasup/hubs`**  
Query: optional `query`, `cursor`, `limit`. No body.  
`data`: `{ items: [{ id, name, address, location: { latitude, longitude }|null, openingHours, deliveryAvailable }], pageInfo }`.

### Identity and Account

**POST `/auth/register`**  
Request: `{ name: string, phone: string, email?: string, password: string, storeKey: "betasup", hubId: string, agentCode?: string }`. The client may submit a PIN only through a dedicated secure PIN setup flow; do not include it in ordinary account responses.  
`data`: `{ user: { id, name, phone, email?, hubId, roles[] }, session: { expiresAt }, wallet: { balanceMinor, currency } }`.

**POST `/auth/login`**  
Request: `{ phoneOrEmail: string, password: string }`.  
`data`: `{ user: { id, name, phone, email?, hubId, roles[] }, session: { expiresAt }, wallet: { balanceMinor, currency } }`.

**POST `/auth/logout`**  
Request: empty JSON `{}` (or no body if cookie-auth implementation specifies).  
`data`: `{ loggedOut: true }`; invalidate the server session.

**GET `/account/me`**  
No query/body.  
`data`: `{ user: { id, name, phone, email?, hubId, roles[], createdAt }, wallet: { balanceMinor, currency } }`.

**PATCH `/account/me`**  
Request: `{ name?: string, email?: string, phone?: string, hubId?: string }`; reject unknown/immutable fields.  
`data`: `{ user: updatedUser }`.

**PUT `/account/wallet-pin`** (authenticated PIN setup/change)  
Request: `{ currentPin?: string, newPin: string, confirmPin: string }`; enforce PIN format, rate limits, and current PIN verification for changes.  
`data`: `{ configured: true, updatedAt }`. Never return or log the PIN or its hash.

**POST `/wallet/verify-pin`** (step-up verification where required)  
Request: `{ pin: string, purpose: "purchase"|"bid"|"sensitive_wallet_action" }`.  
`data`: `{ verified: true, verificationToken, expiresAt }`. Use a short-lived, single-purpose server token for the subsequent action; do not reuse the PIN as an authorization token.

**GET `/account/addresses`**  
Query: optional `cursor`, `limit`. No body.  
`data`: `{ items: [Address], pageInfo }`.

**POST `/account/addresses`**  
Request: `{ recipientName, phone, addressLine1, addressLine2?, city, state, postalCode?, countryCode: "NG", landmark?, hubId?, deliveryInstructions?, isDefault? }`.  
`data`: `{ address: Address }`.

**PATCH `/account/addresses/{addressId}`**  
Path: `addressId`. Request: partial editable fields from the create schema.  
`data`: `{ address: Address }`.

**DELETE `/account/addresses/{addressId}`**  
Path: `addressId`; no body.  
`data`: `{ deleted: true, addressId }`.

### Cart, Checkout, Payment, and Wallet

**GET `/cart`**  
No query/body.  
`data`: `{ cartId, currency: "NGN", lines: [{ lineId, productId, variantId, selectedOptions, product: { name, mediaThumbnail }, quantity, unitPriceMinor, lineTotalMinor, availability }], subtotalMinor, feesMinor, totalMinor, updatedAt }`.

**POST `/cart/items`**  
Request: `{ productId: string, variantId: string, selectedOptions: { proteinOptionId?: string, swallowOptionId?: string }, quantity: integer }`.  
`data`: the complete updated cart shape from `GET /cart`. Reject unavailable product/option IDs and invalid quantity.

**PATCH `/cart/items/{lineId}`**  
Path: `lineId`. Request: `{ quantity: integer, selectedOptions?: { proteinOptionId?, swallowOptionId? }, variantId?: string }`.  
`data`: the complete updated cart. Reprice line server-side.

**DELETE `/cart/items/{lineId}`**  
Path: `lineId`; no body.  
`data`: `{ cart: UpdatedCart, removedLineId: string }`.

**POST `/checkout/quote`**  
Request: `{ cartId: string, lineIds?: string[], paymentMethod: "wallet"|"direct", deliveryOptionId?: string, deliveryAddressId?: string, pickupLocationId?: string, promotionCode?: string }`.  
`data`: `{ quoteId, cartId, selectedLines: [{ lineId, productId, variantId, selectedOptions, quantity, unitPriceMinor, lineTotalMinor }], subtotalMinor, discountMinor, fees: [{ code, label, amountMinor }], totalMinor, currency: "NGN", paymentMethod, walletBalanceMinor?: integer, warnings: [{ code, message, lineId? }], expiresAt }`.

**POST `/orders`** (requires `Idempotency-Key`)  
Request: `{ quoteId: string, paymentMethod: "wallet"|"direct", returnUrl?: string }`.  
`data`: `{ order: { id, status, paymentStatus, lines: OrderLine[], subtotalMinor, discountMinor, fees, totalMinor, currency, fulfillment, createdAt }, payment: { id, type, status, amountMinor, currency, providerReference?, checkoutUrl?, expiresAt? }, remainingCart: UpdatedCart }`. Wallet debit and order creation are atomic.

**GET `/payments/{paymentId}`**  
Path: `paymentId`; no body.  
`data`: `{ payment: { id, orderId?, status, type, amountMinor, currency, providerReference?, updatedAt }, order?: { id, status, paymentStatus } }`.

**POST `/wallet/top-ups`** (requires `Idempotency-Key`)  
Request: `{ amountMinor: integer, paymentMethod: "direct", returnUrl: string }`.  
`data`: `{ topUpId, payment: { id, status: "pending", amountMinor, currency: "NGN", providerReference, checkoutUrl, expiresAt } }`. No wallet credit until provider confirmation.

**GET `/wallet`**  
No query/body.  
`data`: `{ balanceMinor, currency: "NGN", updatedAt }`.

**GET `/wallet/transactions`**  
Query: `cursor?`, `limit?`, `type?`. No body.  
`data`: `{ items: [{ id, type, status, amountMinor, currency, reference, description, createdAt }], pageInfo }`.

**POST `/webhooks/payments/{provider}`** (provider-to-server only)  
Request: provider-specific signed raw body; verify signature, event ID, and amount/currency.  
Response: HTTP 200 `{ received: true }` for accepted or already-processed event. Do not expose this route to browser code.

### Orders and Delivery

**GET `/orders`**  
Query: `cursor?`, `limit?`, `status?`. No body.  
`data`: `{ items: [OrderSummary], pageInfo }`.

**GET `/orders/{orderId}`**  
Path: `orderId`; no body.  
`data`: `{ order: { id, status, paymentStatus, lines: OrderLine[], subtotalMinor, fees, totalMinor, currency, fulfillment, deliveryPasscodeHint?, createdAt, updatedAt } }`. Do not return the full delivery passcode in routine history responses.

**GET `/orders/{orderId}/tracking`**  
Path: `orderId`; no body.  
`data`: `{ orderId, status, events: [{ status, message, occurredAt, location? }], estimatedDeliveryAt? }`.

**POST `/orders/{orderId}/confirm-delivery`**  
Path: `orderId`. Request: `{ deliveryPasscode: string }`.  
`data`: `{ orderId, status: "delivered", confirmedAt, receipt? }`. Validate passcode and caller authorization server-side.

### Auctions

**GET `/stores/betasup/auctions`**  
Query: `status?` (`upcoming`, `live`, `ended`), `cursor?`, `limit?`. No body.  
`data`: `{ items: [Auction], pageInfo }`.

**GET `/stores/betasup/auctions/{auctionId}`**  
Path: `auctionId`; query: optional `bidCursor`, `bidLimit`; no body.  
`data`: `{ auction: Auction, bids?: [{ id, displayName?, amountMinor, createdAt }], bidPageInfo? }`. Only expose anonymized public bid identities.

**POST `/stores/betasup/auctions/{auctionId}/bids`** (requires `Idempotency-Key`)  
Path: `auctionId`. Request: `{ amountMinor: integer, walletPin?: string }`. If the product/auction requires a deposit or authorization, specify that separately; never treat the PIN as a payment credential.  
`data`: `{ bid: { id, amountMinor, status, createdAt }, auction: { currentPriceMinor, minimumNextBidMinor, endsAt, status }, bidderStatus: "leading"|"outbid" }`.

**GET `/account/auctions/{auctionId}`**  
Path: `auctionId`; authenticated; no body.  
`data`: `{ auctionId, myBidCount, highestMyBidMinor?, bidderStatus, winnerPaymentDeadline?, settlementOrderId? }`.

### Shared Type Shapes Referenced Above

`Promotion`: `{ id, code?, label, discountType, discountValue, startsAt, endsAt }`. `DeliveryOption`: `{ id, type, label, feeMinor, estimatedMinutes?, available }`. `Address`: `{ id, recipientName, phone, addressLine1, addressLine2?, city, state, postalCode?, countryCode, landmark?, hubId?, deliveryInstructions?, isDefault }`. `OrderLine`: `{ productId, productName, variantId?, selectedOptions, quantity, unitPriceMinor, lineTotalMinor }`. `OrderSummary`: `{ id, status, paymentStatus, totalMinor, currency, itemCount, createdAt }`. `UpdatedCart` is the full `GET /cart` data object.

## Backend Invariants

- The backend computes variant, protein, swallow, fee, promotion, and total prices in integer kobo.
- Check availability at quote and order creation. For prepared food, model sellable/preparation windows and capacity rather than only numeric stock.
- Wallet PIN verification, balance changes, order writes, and auction bid acceptance are server-side and rate-limited.
- Payment webhook verification is mandatory; provider redirects do not prove payment.
- Delivery passcodes must be securely generated and validated; mark delivered only through an authorized backend action.
- Auction state and minimum next bid are computed atomically to prevent two concurrent bids from incorrectly winning.
