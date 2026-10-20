# Storefront Frontend-to-Backend Endpoint Mapping

**Purpose:** Comprehensive API integration map connecting UI components and user actions across **UwanBuy**, **Thrift-Z**, and **Betasup** to backend endpoints. Drawn directly from `storefront-backend-contract.md`, `betasup-data-schema.md`, `thriftz-data-schema.md`, and `uwanbuy-data-schema.md`.

---

## 1. Global Conventions & Standards

| Parameter | Specification |
| :--- | :--- |
| **Base API URL** | `/api/v1` |
| **Protocol & Format** | HTTPS, JSON request/response bodies (except multipart form-data for file uploads) |
| **Currency & Unit** | Nigerian Naira (`NGN`). All monetary amounts across APIs are integer kobo in fields ending with `Minor` (e.g. `1500000` = ₦15,000.00). Frontend formats them to display naira. |
| **Response Envelope** | Success: `{ "data": <payload>, "meta": { "pageInfo"?: {...}, "total"?: number } }`<br>Error: `{ "error": { "code": string, "message": string, "fields"?: object }, "requestId": string }` |
| **Pagination** | Cursor-based using query params `cursor` and `limit`. Meta returns `{ "nextCursor": string\|null, "hasMore": boolean }` |
| **Mutations & Safety**| Required `Idempotency-Key` header on order creation, wallet top-ups, auction bid placement, and bulk imports. |
| **Authentication** | Secure HTTP-only session cookies with role claims (`customer`, `seller`, `agent`, `admin`). |

---

## 2. Authentication, Account & Full Address Mapping

All three storefronts share a unified registration and address structure, with store-specific optional extensions.

### 2.1 Customer Registration
- **UI Trigger:** `#modal-register` submit button ("Create Account & Activate Wallet").
- **HTTP Method & Route:** `POST /api/v1/auth/register`
- **Request Headers:** `Content-Type: application/json`
- **Request Payload:**
```json
{
  "name": "Chukwuma Adebayo",
  "phone": "08012345678",
  "email": "chukwuma@example.com",
  "password": "SecurePassword123!",
  "walletPin": "1234",
  "storeKey": "uwanbuy", // or "thriftz" | "betasup"
  "hubId": "hub_tanke_ilorin",
  "agentCode": "FRM-ILN-042",
  "address": {
    "recipientName": "Chukwuma Adebayo",
    "phone": "08012345678",
    "addressLine1": "14 University Road, Tanke",
    "addressLine2": "Flat 3B, Sunshine Court",
    "city": "Ilorin",
    "state": "Kwara State",
    "postalCode": "240001",
    "countryCode": "NG",
    "landmark": "Opposite Sanrab Filling Station",
    "deliveryInstructions": "Call when at the estate security gate",
    "isDefault": true
  }
}
```
- **Response `data` (201 Created):**
```json
{
  "user": {
    "id": "usr_9812",
    "name": "Chukwuma Adebayo",
    "phone": "08012345678",
    "email": "chukwuma@example.com",
    "hubId": "hub_tanke_ilorin",
    "roles": ["customer"]
  },
  "session": { "expiresAt": "2026-11-20T12:00:00Z" },
  "wallet": { "balanceMinor": 2500000, "currency": "NGN" },
  "primaryAddress": {
    "id": "addr_01",
    "addressLine1": "14 University Road, Tanke",
    "city": "Ilorin",
    "state": "Kwara State"
  }
}
```

### 2.2 Customer Login
- **UI Trigger:** `#modal-login` submit button ("Sign In").
- **HTTP Method & Route:** `POST /api/v1/auth/login`
- **Request Payload:** `{ "phoneOrEmail": "08012345678", "password": "SecurePassword123!" }`
- **Response `data` (200 OK):** User summary, active session expiry, and current wallet balance in minor units.

### 2.3 Account Profile & Active Location Update
- **UI Trigger:** Location indicator `[Change]` in navbar, `#modal-location-switcher` submit.
- **HTTP Method & Route:** `PATCH /api/v1/account/me`
- **Request Payload:** `{ "hubId": "hub_tanke_ilorin" }`
- **Response `data` (200 OK):** `{ "user": { "id": "usr_9812", "hubId": "hub_tanke_ilorin", ... } }`

### 2.4 Address Book Management
- **List Addresses:** `GET /api/v1/account/addresses`
- **Add New Address:** `POST /api/v1/account/addresses`
- **Update Address:** `PATCH /api/v1/account/addresses/{addressId}`
- **Delete Address:** `DELETE /api/v1/account/addresses/{addressId}`

---

## 3. Hyperlocal AreaBazaar Live Session Mapping

Displays a real-time modal notification if an AreaBazaar session is actively running in the customer's registered or selected hub.

### 3.1 Check Active Bazaar Sessions by Location
- **UI Trigger:** Triggered on page load, login, registration, and location switch.
- **HTTP Method & Route:** `GET /api/v1/bazaar/sessions/active?hubId={hubId}`
- **Response `data` (200 OK):**
```json
{
  "hasActiveSession": true,
  "session": {
    "id": "ses_tanke_morning_01",
    "hubId": "hub_tanke_ilorin",
    "hubName": "Tanke Hub, Ilorin",
    "title": "Tanke Morning Flash Wave",
    "activeWave": "Wave 2 (High Mid)",
    "status": "Active",
    "bazaarPageUrl": "../Tanke/ch-frm-bazaar-page-sample.html",
    "bazaarLandingUrl": "../public/landing.php",
    "endsAt": "2026-10-20T14:30:00Z",
    "activeDealsCount": 18
  }
}
```
- **UI Behavior:**
  - If `hasActiveSession` is `true` AND `session.hubId === user.hubId`, display the `#modal-bazaar-session-alert` iziModal with "Enter Live Bazaar" button directing to `bazaarPageUrl`.
  - If `false` or location does not match, suppress the modal.

---

## 4. Catalog, Category Pages & Product Details Mapping

### 4.1 Storefront Bootstrap
- **UI Trigger:** Storefront initialization (`index.html`).
- **HTTP Method & Route:** `GET /api/v1/stores/{storeKey}/bootstrap?locationId={hubId}`
- **Returns:** Store configuration, categories list with display orders and parent relationships, section descriptors, active banners/promotions, and available payment methods.

### 4.2 Category Browse & Subcategory Listing Page (`category.html`)
- **UI Trigger:** Clicking category card/link or applying subcategory / filter pills on `category.html`.
- **HTTP Method & Route:** `GET /api/v1/stores/{storeKey}/sections/{sectionKey}/products` OR `GET /api/v1/stores/{storeKey}/products`
- **Query Parameters:**
  - `categoryId`: e.g. `groceries`, `gadgets`, `fashion`, `classic_soups`
  - `subcategoryId`: e.g. `phones`, `laptops`, `cooking_oil`
  - `q`: Search string within category
  - `condition`: `like_new` | `gently_used` | `refurbished` | `fair` (Thrift-Z)
  - `sort`: `featured` | `price_asc` | `price_desc` | `discount_desc`
  - `cursor`, `limit`: Pagination controls
  - `locationId`: Customer's hub ID
- **Response `data`:**
```json
{
  "items": [
    {
      "id": "uw_prd_3001",
      "storeId": "uwanbuy",
      "categoryId": "gadgets",
      "title": "Smartphone Pro Max 256GB",
      "priceMinor": 85000000,
      "salePriceMinor": 85000000,
      "compareAtPriceMinor": 92000000,
      "currency": "NGN",
      "media": [{ "type": "image", "url": "https://cdn.example/phone.webp", "thumbnailUrl": "..." }],
      "specifications": {
        "model": "Example Pro",
        "storageGb": 256,
        "memoryGb": 8,
        "screenInches": 6.4,
        "condition": "new"
      },
      "stock": { "quantity": 18, "status": "in_stock" }
    }
  ],
  "pageInfo": { "nextCursor": "cur_99", "hasMore": true },
  "facets": { "brands": ["Apple", "Samsung"], "priceRange": { "minMinor": 2500000, "maxMinor": 85000000 } }
}
```

### 4.3 Product Quick View Modal ("View Details" on Product Card)
- **UI Trigger:** Clicking "View Details" on any product card in `index.html` or `category.html`.
- **HTTP Method & Route:** `GET /api/v1/products/{productId}`
- **UI Behavior:** Opens `iziModal` with temporary specifications:
  - **UwanBuy:** Quick specs pill list (RAM, Storage, OS, Warranty, Condition / Net Weight, Pack Size).
  - **Thrift-Z:** Condition badge, verified seller rating, battery health, cosmetic condition, Thrift Price vs Original Price.
  - **Betasup:** Available pot sizes (1L, 2L, 4L), included proteins, recommended swallows, lead cooking time.
- **Full Details CTA:** Modal contains button **"See Full Details"** which routes to:
  - `uwanbuy/product-details.html?id={productId}`
  - `thriftz/product-details.html?id={productId}`
  - `betasup/product-details.html?id={productId}`

### 4.4 Full Product Details Page (`product-details.html`)
- **UI Trigger:** Loading `product-details.html?id={productId}`.
- **HTTP Method & Route:** `GET /api/v1/products/{productId}?locationId={hubId}`
- **Response `data`:** Full object with complete media gallery, exhaustive specification dictionary, variant matrix, allergen/ingredient info, seller verification data, and stock rules.

---

## 5. The 4 Auction Systems Mapping (Thrift-Z & Betasup)

### 5.1 Auction System 1: Fastest Finger
- **Process:** Limited stock item dropped at extreme discount. Users race to claim and lock before stock reaches zero.
- **Endpoints:**
  - **Get Flash Drop Status:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
    - Returns `{ type: "fastest_finger", availableQuantity: 3, flashPriceMinor: 500000, originalPriceMinor: 2500000, dropTime: "2026-10-20T10:00:00Z" }`.
  - **Claim Item (Fastest Finger):** `POST /api/v1/stores/{storeKey}/auctions/{auctionId}/claim-fastest-finger`
    - **Header:** `Idempotency-Key: <unique-uuid>`
    - **Payload:** `{ "walletPin": "1234", "quantity": 1 }`
    - **Response (200 OK):** `{ "success": true, "claimId": "clm_101", "orderId": "ord_882", "remainingStock": 2 }`
    - **Error (409 Conflict):** `{ "error": { "code": "STOCK_DEPLETED", "message": "All fastest-finger units have been claimed." } }`

### 5.2 Auction System 2: Timebound / While Offer Lasts
- **Process:** Offer active until strict deadline expires OR stock is exhausted. Shows live countdown clock and visual stock progress bar.
- **Endpoints:**
  - **Get Offer Details:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
    - Returns `{ type: "timebound_stock", expiresAt: "2026-10-20T12:00:00Z", totalStock: 10, remainingStock: 4, offerPriceMinor: 680000 }`.
  - **Lock / Purchase Offer:** `POST /api/v1/stores/{storeKey}/auctions/{auctionId}/purchase-timebound`
    - **Header:** `Idempotency-Key: <unique-uuid>`
    - **Payload:** `{ "walletPin": "1234", "quantity": 1 }`
    - **Response (200 OK):** Order confirmation and atomic wallet deduction.

### 5.3 Auction System 3: Real Bidding Auction
- **Process:** Competitive open-bid auction. Bidders enter bids exceeding minimum increment. Features anti-sniping extension (+2 mins if bid placed in last 60 seconds) and live bid history.
- **Endpoints:**
  - **Get Live Auction & Bid History:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
    - Returns `{ type: "real_bidding", openingPriceMinor: 1000000, currentPriceMinor: 1450000, minimumNextBidMinor: 1550000, bidCount: 8, endsAt: "...", bidHistory: [{ bidderTag: "Bidder ***42", amountMinor: 1450000, placedAt: "..." }] }`.
  - **Place Bid:** `POST /api/v1/stores/{storeKey}/auctions/{auctionId}/bids`
    - **Header:** `Idempotency-Key: <unique-uuid>`
    - **Payload:** `{ "amountMinor": 1550000, "walletPin": "1234" }`
    - **Response (200 OK):** `{ "bid": { "id": "bid_409", "amountMinor": 1550000 }, "currentPriceMinor": 1550000, "minimumNextBidMinor": 1650000, "endsAt": "..." }`
  - **Winner Settlement:** `POST /api/v1/stores/{storeKey}/auctions/{auctionId}/settle`
    - Settle winning bid using wallet balance or direct payment adapter.

### 5.4 Auction System 4: Price Waves
- **Process:** Step-down pricing structured across scheduled hourly intervals (e.g., Wave 1: ₦30k -> Wave 2: ₦24k -> Wave 3: ₦18k). Customer can spot-pay to lock the current wave price or wait for cheaper waves at the risk of losing item availability.
- **Endpoints:**
  - **Get Wave Schedule:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}/waves`
    - Returns `{ currentWave: 2, currentPriceMinor: 2400000, nextWaveStartsAt: "...", nextWavePriceMinor: 1800000, totalAvailable: 5 }`.
  - **Spot Buy at Current Wave:** `POST /api/v1/checkout/quote` with current wave price lock.

---

## 6. Cart, Checkout & Orders Lifecycle Mapping

| Action | HTTP Route | Method | Key Request Fields | Key Response Fields |
| :--- | :--- | :--- | :--- | :--- |
| **Get Cart** | `/api/v1/cart` | `GET` | — | `cartId`, `lines[]`, `subtotalMinor`, `totalMinor` |
| **Add Line** | `/api/v1/cart/items` | `POST` | `productId`, `variantId?`, `quantity`, `selectedOptions?` | Recalculated `Cart` |
| **Update Line** | `/api/v1/cart/items/{lineId}` | `PATCH` | `quantity` | Recalculated `Cart` |
| **Remove Line** | `/api/v1/cart/items/{lineId}` | `DELETE` | — | Recalculated `Cart` |
| **Generate Quote** | `/api/v1/checkout/quote` | `POST` | `cartId`, `lineIds[]?`, `paymentMethod`, `deliveryAddressId` | `quoteId`, `fees[]`, `totalMinor`, `expiresAt` |
| **Place Order** | `/api/v1/orders` | `POST` | `quoteId`, `paymentMethod: "wallet"\|"direct"`, `returnUrl?` | `orderId`, `status`, `deliveryPasscode`, `payment` |
| **Order History** | `/api/v1/orders` | `GET` | `cursor?`, `limit?` | `items: Order[]`, `pageInfo` |
| **Order Tracking**| `/api/v1/orders/{orderId}/tracking` | `GET` | — | `timeline[]`, `driverContact?`, `hubStatus` |
| **Confirm Delivery**| `/api/v1/orders/{orderId}/confirm-delivery`| `POST` | `deliveryPasscode` | `order`: status `delivered` |
