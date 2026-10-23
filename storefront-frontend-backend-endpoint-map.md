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

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

# 7. UwanBuy Storefront & Unified Template Updates (October 2026)

This section documents the enhanced storefront capabilities introduced for **UwanBuy** and established as the reference architecture for Betasup and Thrift-Z. Everything above this dashed separator represents the baseline contract; the specifications below detail the October 2026 interactive updates.

---

### 7.1 Type-Your-List Scoped Suggestions Endpoint

Replaces the unstructured file upload with an interactive category-scoped list builder that minimizes backend search load.

- **UI Trigger:** `#modal-type-shopping-list` search input while typing.
- **Client Constraint:** Category selection is mandatory. If the user attempts to type without selecting a category, the UI prevents execution and displays an active red-glow animation on the category selector (`.category-glow-alert`).
- **HTTP Method & Route:** `GET /api/v1/stores/uwanbuy/list-suggestions`
- **Query Parameters:**
  - `categoryId`: required (e.g. `groceries`, `gadgets`, `fashion`, `home`)
  - `q`: search string (minimum 2 characters)
  - `limit`: default 8
  - `locationId`: active hub ID
- **Response `data` (200 OK):**
```json
{
  "items": [
    {
      "productId": "uw_gro_001",
      "title": "Mama Gold Parboiled Rice 50kg",
      "brand": "Mama Gold",
      "sku": "GRO-RIC-50KG",
      "categoryId": "groceries",
      "subCategoryId": "grains-staples",
      "priceMinor": 4500000,
      "currency": "NGN",
      "unitLabel": "bag (50kg)",
      "thumbnailUrl": "../assetsecm/images/soups/egusi-soup-roundbowl.png",
      "availability": {
        "status": "in_stock",
        "quantity": 32,
        "moq": 1
      }
    }
  ],
  "unlistedAllowed": true
}
```
- **UI Behavior:**
  - Clicking any suggested item appends it to the shopping list table with its suggested unit price, quantity stepper, and matched indicator.
  - Clicking the explicit **"Add to List"** button allows adding unlisted / custom items with estimated pricing and "Pending Match" status.
  - Clicking **"Transfer List to Cart"** calls `POST /api/v1/cart/bulk-add` with all matched items.

---

### 7.2 The 5 UwanBuy Auction Systems Mapping (with MOQ)

Unlike the main AreaBazaar platform auction sessions, storefront-specific auctions run directly within the storefront domain (`uwanbuy/auctions/`) and are managed via the storefront admin suite (`uwanbuy/admin/`). Every auction format returns and enforces a Minimum Order Quantity (`moq`).

#### 7.2.1 Auction Type 1: Bid & Win (`bid-and-win.html`)
- **Concept:** Open competitive bidding with minimum bid increments, real-time bid log, anti-sniping timer extensions (+2 minutes on last-minute bids), and MOQ rules.
- **Fetch Auction Details:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
  - Returns `{ "auctionType": "bid_and_win", "openingPriceMinor": 4000000, "currentBidMinor": 5500000, "minimumNextBidMinor": 5800000, "bidIncrementMinor": 300000, "moq": 2, "unitLabel": "units", "endsAt": "2026-10-21T18:00:00Z", "bidCount": 14 }`.
- **Submit Bid:** `POST /api/v1/stores/{storeKey}/auctions/{auctionId}/bid`
  - **Payload:** `{ "bidAmountMinor": 5800000, "quantity": 2, "walletPin": "1234" }` (quantity must be $\ge$ `moq`).
  - **Response (200 OK):** `{ "bidId": "bid_901", "newCurrentBidMinor": 5800000, "newMinimumNextBidMinor": 6100000, "endsAt": "..." }`.

#### 7.2.2 Auction Type 2: Flat-Rate Auction (`flat-rate.html`)
- **Concept:** Fixed steep discount clearance with a mandatory bulk Minimum Order Quantity (MOQ).
- **Fetch Details:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
  - Returns `{ "auctionType": "flat_rate", "flatPriceMinor": 1200000, "regularPriceMinor": 2500000, "moq": 5, "availableUnits": 80, "unitLabel": "cartons" }`.
- **Instant Buy:** Routes to the Checkout Validation Modal with quantity locked to $\ge$ `moq`.

#### 7.2.3 Auction Type 3: Price Wave Auction (`price-wave.html`)
- **Concept:** Stepped price reductions across scheduled hourly intervals (Wave 1 $\rightarrow$ Wave 2 $\rightarrow$ Wave 3) with MOQ per wave.
- **Fetch Wave Schedule:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}/waves`
  - Returns:
```json
{
  "auctionType": "price_wave",
  "currentWave": 2,
  "moq": 3,
  "currentPriceMinor": 1850000,
  "nextWaveStartsAt": "2026-10-21T14:00:00Z",
  "nextWavePriceMinor": 1450000,
  "totalAvailable": 18
}
```
- **Lock Price & Buy:** Dispatches quote validation with current wave price lock and MOQ verification.

#### 7.2.4 Auction Type 4: Stock Cap Auction (`stock-cap.html`)
- **Concept:** Limited units pool allocated at flash discount. Displays dynamic stock depletion progress bar; locks permanently when the stock cap is reached.
- **Fetch Details:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
  - Returns `{ "auctionType": "stock_cap", "capUnits": 50, "soldUnits": 38, "remainingUnits": 12, "moq": 2, "discountPriceMinor": 3200000 }`.

#### 7.2.5 Auction Type 5: Time Cap Auction (`time-cap.html`)
- **Concept:** Flash drop tied to a strict countdown timer (e.g. 2 hours). Terminates automatically when the countdown hits zero, regardless of remaining stock.
- **Fetch Details:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}`
  - Returns `{ "auctionType": "time_cap", "expiresAt": "2026-10-21T16:00:00Z", "moq": 1, "dealPriceMinor": 850000 }`.

---

### 7.3 Asynchronous Order Validation & Delivery Quote Engine

When a customer clicks "Checkout" from the Cart Drawer or an Auction Buy action, the backend initializes an order validation record with a distinct `order_id` and opens the **Validation Modal** (`#modal-checkout-validate`).

- **HTTP Method & Route:** `POST /api/v1/checkout/validate`
- **Request Payload:**
```json
{
  "orderId": "ORD-UWB-202610-8472",
  "cartId": "cart_uw_1092",
  "fulfillmentType": "pickup" | "address",
  "pickupPointId": "pku_tanke_01",
  "deliveryAddress": {
    "recipientName": "Adebayo Salami",
    "phone": "08031234567",
    "address": "15 University Road, Tanke, Ilorin"
  },
  "isExpress": false
}
```
- **Response `data` (200 OK):**
```json
{
  "orderId": "ORD-UWB-202610-8472",
  "status": "validated_awaiting_payment",
  "breakdown": {
    "subtotalMinor": 4500000,
    "fulfillmentType": "address",
    "deliveryFeeMinor": 120000,
    "expressSurchargeMinor": 0,
    "vatPercent": 7.5,
    "vatAmountMinor": 346500,
    "totalMinor": 4966500
  },
  "wallet": {
    "currentBalanceMinor": 2500000,
    "isSufficient": false,
    "deficitMinor": 2466500
  },
  "pickupPoints": [
    { "id": "pku_tanke_01", "name": "Tanke Central Hub Pickup", "address": "12 University Road, Tanke, Ilorin", "operatingHours": "8:00 AM - 7:00 PM", "phone": "08039991122" },
    { "id": "pku_sanrab_02", "name": "Sanrab Station Collection Center", "address": "Sanrab Junction, Tanke, Ilorin", "operatingHours": "9:00 AM - 6:00 PM", "phone": "08039993344" }
  ]
}
```
- **Asynchronous Recalculation Behavior:**
  - Toggling between "Deliver at Pickup Point (Free)" and "Deliver to My Address" (+ delivery cost) asynchronously triggers a re-calculation.
  - Toggling the "Express Delivery" checkbox adds an express surcharge (e.g. +₦1,500) and recalculates the VAT and total without closing or reloading the modal.

---

### 7.4 Storefront Payment Request, Reference Generation & Reconciliation

Storefronts manage their own payment request and reporting flows independently of the core AreaBazaar platform.

#### 7.4.1 Create Payment Request
- **UI Trigger:** Validation modal when user chooses "Create Payment Request" or when wallet balance is insufficient.
- **HTTP Method & Route:** `POST /api/v1/payments/request`
- **Request Payload:**
```json
{
  "orderId": "ORD-UWB-202610-8472",
  "paymentPurpose": "order_direct" | "wallet_topup",
  "paymentChannel": "agent" | "direct",
  "amountMinor": 4966500,
  "storeKey": "uwanbuy"
}
```
- **Response `data` (200 OK):**
  - If `paymentChannel === "agent"`: Returns designated local agent contact information (`agentName`, `agentPhone`, `whatsapp`, `hubCode`, `photoUrl`, `instructions`).
  - If `paymentChannel === "direct"`: Returns designated corporate bank account details (`bankName`, `accountNumber`, `accountName`, `instructions`).

#### 7.4.2 Generate Payment Reference
- **UI Trigger:** Clicking "Generate Payment Ref" in the Payment Request modal.
- **HTTP Method & Route:** `POST /api/v1/payments/generate-ref`
- **Request Payload:** `{ "orderId": "ORD-UWB-202610-8472", "storeKey": "uwanbuy", "amountMinor": 4966500 }`
- **Response `data` (201 Created):**
```json
{
  "paymentRef": "REF-UWB-202610-7712",
  "expiresAt": "2026-10-22T00:00:00Z",
  "orderId": "ORD-UWB-202610-8472",
  "amountMinor": 4966500
}
```

#### 7.4.3 Submit Payment Report Form
- **UI Trigger:** User clicks "Submit Payment Report" after making transfer to the agent or company bank account.
- **HTTP Method & Route:** `POST /api/v1/payments/report`
- **Request Payload:**
```json
{
  "paymentRef": "REF-UWB-202610-7712",
  "orderId": "ORD-UWB-202610-8472",
  "amountPaidMinor": 4966500,
  "bankPaidFrom": "Access Bank",
  "payerName": "Adebayo Salami",
  "paymentDate": "2026-10-21T09:30:00Z",
  "remarks": "Transfer for order ORD-UWB-202610-8472"
}
```
- **Response `data` (200 OK):** `{ "reportId": "rep_4091", "status": "submitted_pending_reconciliation" }`

#### 7.4.4 Payment Reconciliation Rules
- **Wallet Top-Up Path:** When admin/agent reconciles the report:
  - User wallet balance is credited with `amountPaidMinor`.
  - Notification sent to user: "Wallet funded! Proceed to complete your order."
- **Direct Order Payment Path:** When admin/agent reconciles the report:
  - Wallet balance remains untouched.
  - The order status atomically updates to `paid` and `confirmed`.
  - Delivery passcode generated and visible in order tracking.

#### 7.4.5 Unpaid Orders in Cart Top
- Validated orders awaiting payment reconciliation are automatically pinned to the **top of the shopping cart drawer** (`#cart-pending-orders-container`).
- Displays:
  - `Order ID: ORD-UWB-202610-8472`
  - Total amount and items count
  - Status badge: `Awaiting Payment`
  - Action button: **"Complete Purchase"** (re-opens the payment details or report modal).

---

### 7.5 Storefront Dedicated Admin Endpoints (`uwanbuy/admin/`)

Each storefront hosts its internal administration suite inside its project directory (e.g. `uwanbuy/admin/`).

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `GET /api/v1/admin/{storeKey}/auctions` | `GET` | List active, scheduled, and completed auctions |
| `POST /api/v1/admin/{storeKey}/auctions` | `POST` | Create an auction (Bid & Win, Flat-Rate, Wave, Stock Cap, Time Cap) with MOQ |
| `GET /api/v1/admin/{storeKey}/reconciliations` | `GET` | List submitted payment reports awaiting approval |
| `POST /api/v1/admin/{storeKey}/reconciliations/{reportId}/approve` | `POST` | Approve payment; credits wallet or marks order paid |
| `GET /api/v1/admin/{storeKey}/orders` | `GET` | View orders, delivery method, and passcode verification |
| `POST /api/v1/admin/{storeKey}/orders/{orderId}/verify-passcode` | `POST` | Verify customer handover passcode |

---

### 7.6 Post-Payment Bulk Delivery Tracking & 15-Minute Dispatch Contract

Once an order is confirmed and paid (`status: "paid_and_confirmed"`), delivery tracking requests are handled asynchronously through a **15-minute batch dispatch queue**:

#### 7.6.1 Customer Queue Tracking Request
- **UI Trigger:** Customer clicks "Track Delivery" / "Request Tracking Update" in the Purchased Orders drawer (`#boughtItemsOffcanvas`) or order completion notification.
- **HTTP Method & Route:** `POST /api/v1/orders/{orderId}/tracking/request`
- **Request Payload:**
```json
{
  "orderId": "ORD-UWB-202610-8472",
  "customerEmail": "customer@example.com",
  "customerPhone": "08034567890",
  "deliveryPasscode": "4892"
}
```
- **Response `data` (200 OK):**
```json
{
  "requestId": "TRK-REQ-17295012345",
  "orderId": "ORD-UWB-202610-8472",
  "status": "queued",
  "batchCycleMinutes": 15,
  "nextScheduledBatchAt": "2026-10-21T09:30:00Z",
  "message": "Tracking request queued. Automated email will be dispatched in the next 15-minute bulk cycle."
}
```

#### 7.6.2 Automated 15-Minute Bulk Batch Dispatch Engine
- **Trigger:** Server-side cron job running every 15 minutes, or manual operator trigger from the admin orders console (`#btnTriggerTrackingBatch` in `admin/orders.html`).
- **HTTP Method & Route:** `POST /api/v1/orders/tracking/bulk-dispatch`
- **Request Payload:**
```json
{
  "hubId": "hub_tanke_ilorin",
  "dispatchedBy": "admin_console_or_cron",
  "batchTimestamp": "2026-10-21T09:30:00Z"
}
```
- **Response `data` (200 OK):**
```json
{
  "batchId": "BATCH-TRK-20261021-004",
  "dispatchedCount": 8,
  "items": [
    {
      "orderId": "ORD-UWB-202610-8472",
      "customerEmail": "customer@example.com",
      "status": "in_transit",
      "rider": {
        "name": "Musa Garba",
        "phone": "+234 802 345 6789",
        "station": "Tanke Central Hub"
      },
      "estimatedDeliveryMins": 45,
      "emailNotificationSent": true
    }
  ]
}
```
- **Notification Rule:** When the bulk batch completes, an automated transactional email (`UwanBUY Hyperlocal Dispatch`) is sent to each customer containing live dispatch status, assigned rider details, delivery passcode reminder, and ETA.

---

### 7.7 Navigation Bar Wallet Top-Up & Reconciliation Workflow

Provides instant self-service wallet funding directly from the navigation bar (`#btnNavWallet`) across all storefront pages.

- **UI Trigger:** Customer clicks the Wallet balance badge in the header navigation.
- **Workflow:**
  1. Opens `#modal-fund-wallet` displaying current balance and quick funding amounts (₦5,000, ₦10,000, ₦20,000, ₦50,000, or custom amount $\ge ₦500$).
  2. Clicking "Proceed to Payment" routes into `#modal-payment-request` with `purpose: "wallet_topup"`.
  3. Generates verified reference (`REF-UWB-YYYYMM-XXXXX`) and prompts bank transfer or accredited agent payment.
  4. Customer submits payment report form (`POST /api/v1/payments/report`).
  5. Operator approves in `admin/reconciliation.html`, which atomically credits the user's wallet balance:
     ```
     Wallet New Balance = Wallet Old Balance + Amount Paid
     ```

---

### 7.8 Multi-Product Flat-Rate Auction Liquidation Pool

Transforms the flat-rate auction format from single-item sales into a **curated multi-product liquidation pool** selling a range of distinct products at the exact same flat price:

- **Catalog Endpoint:** `GET /api/v1/stores/{storeKey}/auctions/{auctionId}/flat-rate-pool`
- **Response `data` (200 OK):**
```json
{
  "auctionId": "uw_auc_flat_01",
  "title": "Multi-Product Liquidation Clearance Pool",
  "uniformFlatPriceMinor": 1250000,
  "poolCapacity": 50,
  "claimedSlots": 36,
  "remainingSlots": 14,
  "moq": 3,
  "eligibleProducts": [
    {
      "productId": "uw_auc_flat_kettle",
      "name": "Century 2.2L Stainless Electric Kettle",
      "category": "Appliances",
      "originalPriceMinor": 1850000,
      "flatPriceMinor": 1250000,
      "specs": "2.2L • 1800W • Detachable 360°"
    },
    {
      "productId": "uw_auc_flat_blender",
      "name": "Binatone 1.5L Heavy Duty Speed Blender",
      "category": "Appliances",
      "originalPriceMinor": 2200000,
      "flatPriceMinor": 1250000,
      "specs": "1.5L Jug • 450W • Dry Mill Grinder"
    },
    {
      "productId": "uw_auc_flat_pan",
      "name": "MasterChef 28cm Non-Stick Granite Pan",
      "category": "Cookware",
      "originalPriceMinor": 1950000,
      "flatPriceMinor": 1250000,
      "specs": "28cm Dia • Multi-layer Granite"
    },
    {
      "productId": "uw_auc_flat_iron",
      "name": "Philips EasySpeed Plus 2000W Steam Iron",
      "category": "Appliances",
      "originalPriceMinor": 2100000,
      "flatPriceMinor": 1250000,
      "specs": "2000W • Ceramic Soleplate • Calc-Clean"
    },
    {
      "productId": "uw_auc_flat_sneakers",
      "name": "Clean Minimalist Leather Low-Top Sneakers",
      "category": "Fashion",
      "originalPriceMinor": 2200000,
      "flatPriceMinor": 1250000,
      "specs": "Sizes 40-45 • Leather • Vulcanized"
    },
    {
      "productId": "uw_auc_flat_microwave",
      "name": "Nexus 20L Compact Solo Microwave Oven",
      "category": "Appliances",
      "originalPriceMinor": 2450000,
      "flatPriceMinor": 1250000,
      "specs": "20L • 700W • 5 Power Levels"
    }
  ]
}
```
- **Lock Batch Endpoint:** `POST /api/v1/stores/{storeKey}/auctions/{auctionId}/lock-flat-rate-batch`
  - Validates `sum(item.quantity) >= moq` (minimum 3 units across any combination of items in the pool).
  - Calculates total as `totalQuantity * 1250000 kobo`.
  - Atomically locks pool slots and transitions into checkout quote validation.

---

### 7.9 3-Level Taxonomy, Base Products vs Derived Variants, Modal Modes & Bazaar Variant Architecture

This section documents the unified data models and endpoint contracts introduced to govern product hierarchies, interactive inspection modals, subcategory querying, and live bazaar variant drops.

#### 7.9.1 3-Level Category Taxonomy Hierarchy
Categories are structured strictly up to 3 levels: `category` $\rightarrow$ `subCategory` $\rightarrow$ `subSubCategory`.
- **Schema Example:**
```json
{
  "id": "fashion",
  "name": "Fashion & Wears",
  "subCategories": [
    {
      "id": "mens-wear",
      "name": "Men's Wear",
      "subSubCategories": [
        { "id": "tops", "name": "Tops & Hoodies" },
        { "id": "trousers", "name": "Jeans & Trousers" },
        { "id": "footwear", "name": "Sneakers & Shoes" }
      ]
    },
    {
      "id": "womens-wear",
      "name": "Women's Wear",
      "subSubCategories": [
        { "id": "tops", "name": "Blouses & Knitwear" },
        { "id": "trousers", "name": "Pants & Skirts" }
      ]
    }
  ]
}
```

#### 7.9.2 Base Product vs Derived Product Variant Contract
All catalog items are categorized as either a **Base Product** or a derived **Product Variant**:
- **Base Product:** Represents the canonical product entity (e.g. `Redmi 13C Smartphone`, `Parboiled Long Grain Rice`, `Heavyweight Cotton Hoodie`). Contains high-level metadata, description, overall rating, and an array of `variants[]`. Single products without variants are cleanly expressed at the Base Product level (Mode C).
- **Product Variant:** Inherits from and derives from the Base Product. Specifies attributes (RAM, storage, color, pack size, pot volume, dimensions), individual SKU, price minor, comparison price, and variant-specific media.
- **Base Product Price Range Display:** On product cards across all landing page galleries, prices are computed as a range:
  $$\text{Price Display} = \min(\text{variant.price}) \text{ to } \max(\text{variant.price}) \quad (\text{e.g. } ₦2,200 - ₦45,000)$$
  If all variants share the same price or if there is only a single variant, a single formatted price is displayed.

#### 7.9.3 Category & Subcategory Querying (`category/subcategory`)
- **Query Format:** Storefront sections query products using compound keys:
  `GET /api/v1/stores/{storeKey}/products?section={category}/{subcategory}`
  Examples: `fashion/mens-wear`, `fashion/womens-wear`, `groceries/grains-staples`.
- **Landing Page Integration:** The landing page renders dedicated galleries for configured subcategories (e.g. `#fashionMensGalleryRow` and `#fashionWomensGalleryRow`) allowing shoppers to browse subcategories directly.

#### 7.9.4 Dual Inspection Modal Specifications
When a customer clicks "View Details", "Options & Specs", or an autocomplete suggestion, the storefront dynamically initializes one of three modal modes:
1. **Mode A — Groceries & Foodstuff (`modalType: "groceries_scroll_variants"`):**
   - **Left Panel:** Scrollable vertical list of all product variants (`1kg pack`, `2kg pack`, `5kg bag`, `10kg bag`, `50kg bag`, etc.) featuring variant thumbnails, pack sizes, badges, and variant prices.
   - **Right Panel:** Dynamically swaps upon selecting any variant to show that specific variant's verified price, nutritional/packaging specs, hub availability, and MOQ.
2. **Mode B — Fashion, Tech & Home (`modalType: "attribute_options"`):**
   - **Left Panel:** High-resolution Base Product media image.
   - **Right Panel:** Interactive attribute modifier pills (e.g. Color chips: Black, Navy, Grey; Size pills: S, M, L, XL; RAM/Storage chips: 4GB+128GB, 8GB+256GB). Selecting attributes dynamically recalculates and selects the matching variant, its exact SKU, price, and technical specifications table.
3. **Mode C — Single Base Products (No Variants):**
   - Clean, direct product presentation with singular price and instant quantity stepper.

#### 7.9.5 Bazaar Page Variant-Level Model (`uwanbuy/auctions/index.html`)
- **Variant-Level Gallery:** All items displayed on the Bazaar page are queried and displayed at the **Product Variant Level** (`GET /api/v1/stores/{storeKey}/bazaar-variants`).
- **No Up-Front Format Sorting:** The header gallery does not show format filtering tabs up-front.
- **Revealed Format Inspection Modal:** Clicking any product variant card opens `#modal-auction-inspect`, revealing:
  - The specific auction type: `Price Wave`, `Bid & Win`, `Flat-Rate Pool`, `Stock Cap`, or `Time Cap`.
  - Detailed lot specifications, countdown timer, and MOQ.
  - Action 1: **"Pay Immediately"** (`btn-pay-immediately`) $\rightarrow$ Routes directly to payment validation and order settlement.
  - Action 2: **"Add to Cart"** (`btn-add-auction-to-cart`) $\rightarrow$ Adds variant to cart stamped with `auctionExpiresAt`.
- **Cart Expiration Eviction Policy:** If an auction countdown timer expires while sitting in a user's cart without being paid for, the client automatically evicts the expired auction lot and notifies the shopper with an iziToast alert.

#### 7.9.6 Price Wave Single-Fetch Lifecycle & Crossover Surprise
1. **Single Backend Fetch:** To avoid server-taxing polling loops and continuous websocket overhead, Price Wave schedules are fetched **once** during page bootstrap (`GET /api/v1/stores/{storeKey}/price-waves`). Price changes update only upon manual browser refresh.
2. **Wave-Crossover Surprise:** During normal category browsing (Groceries, Tech, Fashion), the engine cross-references variant IDs against `ACTIVE_WAVE_VARIANTS`. If an active wave matches the variant being inspected, the customer is surprised with an active wave discount badge and wave price lock.

---

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

### 7.10 UWB-Adm Products, Variants, Auction Prep & Session Control Suite

This section documents the endpoints and data models for the autonomous storefront administration console (`uwanbuy/admin/products.html` and `uwanbuy/admin/auctions.html`), supporting category segment uploads, spreadsheet ingestion, variant management, and real-time live auction session orchestration.

#### 7.9.1 Admin Products & Variants Management (`products.html`)

##### A. Single Product Ingestion
- **HTTP Method & Route:** `POST /api/v1/admin/{storeKey}/products`
- **Request Payload:**
```json
{
  "title": "Binatone 1.5L Blender with Grinder Mill",
  "categoryId": "gadgets",
  "brand": "Binatone",
  "priceMinor": 1850000,
  "unitLabel": "unit",
  "stockQty": 30,
  "moq": 1,
  "description": "450W motor with overheat protection and dry mill attachment",
  "image": "assets/images/placeholders/water-boiler.svg",
  "published": true,
  "variants": [
    { "name": "Color", "value": "White/Blue", "priceDeltaMinor": 0, "stock": 15 },
    { "name": "Color", "value": "Stainless Black", "priceDeltaMinor": 150000, "stock": 15 }
  ]
}
```
- **Response `data` (201 Created):** Returns generated `productId` (`uw_adm_1729501234`), catalog segment assignment, and live status.

##### B. Mass Load Products from Excel / CSV
- **HTTP Method & Route:** `POST /api/v1/admin/{storeKey}/products/bulk-upload`
- **Supported Formats:** `.xlsx`, `.xls`, `.csv` (parsed client-side via SheetJS/PapaParse with optional server validation).
- **Template Schema:**
```csv
title,category,brand,price,stock,unitLabel,moq,description,variants
"Century 2.0L Kettle","appliances","Century",18500,30,"unit",1,"2200W Rapid Boil","Black:0:15|Silver:500:15"
"Pure Gold 5L Oil","groceries","Pure Gold",6800,50,"jerrycan",2,"Cholesterol free","Standard:0:50"
```
- **Response `data` (200 OK):**
```json
{
  "totalIngested": 25,
  "segments": { "groceries": 10, "gadgets": 8, "fashion": 4, "home": 3 },
  "validationErrors": []
}
```

##### C. Multi-Select Batch Action Endpoint
- **HTTP Method & Route:** `PATCH /api/v1/admin/{storeKey}/products/batch`
- **Actions Supported:**
  - `price_adjust`: Apply uniform price, fixed +/- delta, or percentage +/- delta.
  - `stock_status`: Set In Stock, Low Stock, or Out of Stock across selected IDs.
  - `publish_toggle`: Batch publish or draft.
  - `auction_export`: Flag products as active auction candidates.
- **Request Payload:**
```json
{
  "productIds": ["uw_gdt_101", "uw_gdt_102", "uw_adm_103"],
  "action": "price_adjust",
  "mode": "inc_percent",
  "value": 10
}
```

##### D. Stock Add / Drop Audit Adjustment
- **HTTP Method & Route:** `POST /api/v1/admin/{storeKey}/products/{productId}/stock-adjustment`
- **Request Payload:**
```json
{
  "type": "add" | "drop",
  "quantity": 15,
  "reason": "Restock from Supplier" | "Damaged Goods Write-off" | "Audit Count Correction" | "Transferred to Other Hub",
  "hubCode": "hub_tanke_01",
  "operatorId": "admin_ops_01"
}
```

---

#### 7.9.2 UWB-Adm Auction Prep & Item Staging (`auctions.html` Tab 1)

Allows operators to stage auction items containing complex product-variant bundles with split inventory allocation, diagnostic certificates, and internal pricing safeguard reserves.

- **HTTP Method & Route:** `POST /api/v1/admin/{storeKey}/auction-items`
- **Request Payload:**
```json
{
  "productId": "uw_gdt_101",
  "title": "4-Burner Glass-Top Gas Cooker Unit",
  "format": "bid_and_win" | "flat_rate" | "price_wave" | "stock_cap" | "time_cap",
  "variantAllocations": [
    { "variantId": "var_black_01", "name": "Black Glass", "allocatedQty": 8 },
    { "variantId": "var_silver_02", "name": "Silver Trim", "allocatedQty": 4 }
  ],
  "extras": "1-Yr Extended Warranty + Free Delivery Voucher",
  "pricing": {
    "format": "price_wave",
    "startingPriceMinor": 18500000,
    "floorPriceMinor": 15000000,
    "stepDropMinor": 250000,
    "stepIntervalSeconds": 25,
    "uniformFlatRateMinor": 1250000,
    "moq": 1
  },
  "conditionDiagnostics": {
    "physicalGrade": "Grade A (Pre-Inspected)",
    "checks": ["Burners 100% OK", "Auto-Ignition Spark Passed", "Safety Valve Seal Intact"],
    "specGrounded": "product-specs.pdf"
  },
  "internalAdminNotes": "Reserve floor: ₦150,000 wholesale safeguard. Sourced from Lagos distributor.",
  "assignedSessionId": "sess_uwb_202610_01"
}
```

---

#### 7.9.3 Build Auction Session List + Waves (`auctions.html` Tab 2)

- **Create / Update Session:** `POST /api/v1/admin/{storeKey}/auction-sessions`
- **Adopt Multiple Auction Items:** `POST /api/v1/admin/{storeKey}/auction-sessions/{sessionId}/adopt-items`
  - Payload: `{ "auctionItemIds": ["auc_item_101", "auc_item_102", "auc_item_103"] }`
- **Auto Wave Curve Generator:** `POST /api/v1/admin/{storeKey}/auction-sessions/{sessionId}/waves/auto-generate`
  - Automatically calculates 4 progressive downward steps towards floor reserve:
    - Step 1: Base Starting Price (0% drop)
    - Step 2: -10% progressive drop
    - Step 3: -20% progressive drop
    - Step 4: Reserve Floor Price (locked)

---

#### 7.9.4 Control Auction Sessions & Live Master Console (`auctions.html` Tab 3)

Real-time live session controller enabling operators to manage broadcast lifecycle, trigger manual wave drops, accept winning bids, and immediately lock inventory.

- **HTTP Method & Route:** `POST /api/v1/admin/{storeKey}/auction-sessions/{sessionId}/control`
- **Request Payload:**
```json
{
  "action": "start" | "pause" | "resume" | "advance_wave" | "accept_winning_bid" | "conclude",
  "activeLotId": "auc_item_103",
  "winningBidPayload": {
    "bidderName": "Ibrahim K.",
    "phone": "0803***8891",
    "acceptedPriceMinor": 18250000,
    "variantAllocated": "1.5HP Copper Inverter"
  }
}
```
- **Response `data` (200 OK):**
```json
{
  "sessionStatus": "LIVE",
  "activeLot": "auc_item_103",
  "currentWaveIndex": 2,
  "currentPriceMinor": 18250000,
  "orderGenerated": {
    "orderId": "ORD-UWB-202610-9921",
    "deliveryPasscode": "UWB-PASS-8821",
    "status": "confirmed_awaiting_payment"
  }
}
```

---

#### 7.9.5 Customer Storefront Product Galleries per Auction Format

- **Storefront Route:** `uwanbuy/auctions/index.html` (Admin summary card removed from customer view).
- **Galleries Structure:** 5 dedicated product galleries by auction format:
  1. `bid_and_win`: Competitive bidding lots with live bid count & timer.
  2. `flat_rate`: Configurable uniform liquidation pool with single flat price for range of products (e.g. ₦12,500 active pool).
  3. `price_wave`: Dynamic step-down items with live wave price vs floor reserve.
  4. `stock_cap`: Community collective volume pools with visual lock progress bar.
  5. `time_cap`: Strict deadline blitz lots with active countdown timers.
- **Landing Page Integration (`uwanbuy/index.html`):**
  - Section `#landingAuctionDealsRow` directly below hero banner.
  - Interactive filter pills (`All Live Auctions`, `Bid & Win`, `Flat-Rate Pool`, `Price Wave`, `Stock Cap`, `Time Cap`).

--------------------------------------------------------------------------------
## 7.10 Warehouse Management (WHM) Enterprise Operations & Logistics API Mapping

The Warehouse Management System (WHM) operates in the root directory (`/whm/`) decoupled from the storefront, providing full logistics lifecycle management for inventory, physical handling, order-line fulfillment, category collation, SBA sourcing procurement, and category-tailored QA inspections.

---

### 7.10.1 WHM Products Price Update

#### Single Product Price & Cost Floor Update
- **UI Trigger:** `whm/products-pricing.html` -> `#btnSavePriceModal` ("Save Price Changes").
- **HTTP Method & Route:** `PATCH /api/v1/whm/products/{productId}/price`
- **Request Headers:** `Content-Type: application/json`
- **Request Payload:**
```json
{
  "priceMinor": 85000000,
  "costFloorMinor": 72000000,
  "compareAtPriceMinor": 92000000,
  "reason": "supplier_rebate",
  "operatorId": "whm_staff_10",
  "notes": "Adjusted procurement benchmark based on latest wholesale distributor shipment",
  "variants": [
    {
      "variantId": "var_256gb_blk",
      "priceDeltaMinor": 0,
      "costFloorMinor": 72000000
    },
    {
      "variantId": "var_512gb_slv",
      "priceDeltaMinor": 12000000,
      "costFloorMinor": 81000000
    }
  ]
}
```
- **Response `data` (200 OK):**
```json
{
  "productId": "uw_prd_3001",
  "priceMinor": 85000000,
  "costFloorMinor": 72000000,
  "marginMinor": 13000000,
  "marginPercentage": 15.29,
  "updatedAt": "2026-10-21T14:35:00Z",
  "auditLogId": "aud_prc_9941"
}
```

#### Batch / Multi-Select Products Price Update
- **UI Trigger:** `whm/products-pricing.html` -> `#btnApplyBatchPrice` ("Apply Batch Adjustment").
- **HTTP Method & Route:** `POST /api/v1/whm/products/batch-price`
- **Request Payload:**
```json
{
  "productIds": ["uw_prd_3001", "uw_prd_3002", "uw_prd_3005"],
  "adjustmentType": "percentage",
  "adjustmentValue": 5.0,
  "roundToNearestMinor": 10000,
  "reason": "inflation_recalibration",
  "operatorId": "whm_staff_10"
}
```
- **Response `data` (200 OK):**
```json
{
  "updatedCount": 3,
  "adjustments": [
    {
      "productId": "uw_prd_3001",
      "oldPriceMinor": 85000000,
      "newPriceMinor": 89250000,
      "marginPercentage": 19.33
    }
  ]
}
```

---

### 7.10.2 WHM Product Inventory Update

#### Stock Add / Drop Adjustment
- **UI Trigger:** `whm/inventory.html` -> `#btnConfirmStockAdjustment` ("Apply Stock Delta").
- **HTTP Method & Route:** `POST /api/v1/whm/products/{productId}/stock/adjust`
- **Request Payload:**
```json
{
  "action": "add",
  "quantity": 15,
  "variantId": "var_256gb_blk",
  "reasonCode": "inbound_shipment",
  "warehouseZone": "Zone C - Gadgets",
  "binLocation": "C-04-B2-S1",
  "proofDocReference": "PO-WH-2026-881",
  "operatorId": "whm_staff_10"
}
```
- **Response `data` (200 OK):**
```json
{
  "productId": "uw_prd_3001",
  "variantId": "var_256gb_blk",
  "previousStock": 18,
  "newStock": 33,
  "reservedStock": 4,
  "availableStock": 29,
  "stockStatus": "in_stock",
  "binLocation": "C-04-B2-S1",
  "auditLogId": "aud_stk_1049"
}
```

#### Warehouse Location / Slotting Assignment
- **UI Trigger:** `whm/inventory.html` -> `#btnSaveLocation` ("Assign Bay/Bin Slot").
- **HTTP Method & Route:** `POST /api/v1/whm/products/{productId}/location`
- **Request Payload:**
```json
{
  "zone": "Zone A - Groceries & Foodstuff",
  "aisle": "02",
  "bay": "B4",
  "shelf": "S3",
  "bin": "12",
  "fullLocationCode": "A-02-B4-S3-12",
  "isPrimaryPickFace": true
}
```

---

### 7.10.3 WHM Product Handling Update

#### Physical Handling, Storage Conditions & Logistics Safety
- **UI Trigger:** `whm/handling.html` -> `#btnSaveHandlingSpecs` ("Update Handling Configuration").
- **HTTP Method & Route:** `PUT /api/v1/whm/products/{productId}/handling`
- **Request Payload:**
```json
{
  "storageCondition": "cold_chain",
  "temperatureTargetCelsius": { "min": 2, "max": 8 },
  "fragilityClass": "fragile_glass",
  "hazardClass": "none",
  "dimensionsCm": { "length": 25.0, "width": 15.0, "height": 30.0 },
  "grossWeightKg": 2.45,
  "heavyLiftRequired": false,
  "maxStackTiers": 4,
  "packagingRequirement": "bubble_wrap_box",
  "tamperEvidentSealRequired": true,
  "expiryTrackingEnabled": true,
  "shelfLifeDaysFromIntake": 180,
  "handlingNotes": "Keep upright; store away from direct sunlight."
}
```
- **Response `data` (200 OK):**
```json
{
  "productId": "uw_prd_3001",
  "handlingSpecs": {
    "storageCondition": "cold_chain",
    "grossWeightKg": 2.45,
    "maxStackTiers": 4,
    "handlingStatus": "configured"
  },
  "updatedAt": "2026-10-21T14:36:00Z"
}
```

---

### 7.10.4 WHM Order-Items Update

#### List Warehouse Order-Items Across Stores
- **UI Trigger:** `whm/order-items.html` table initialization.
- **HTTP Method & Route:** `GET /api/v1/whm/order-items`
- **Query Parameters:** `status?`, `categoryId?`, `urgency?` (`standard`|`express_tanke`), `orderId?`, `cursor?`, `limit?`.
- **Response `data` (200 OK):**
```json
{
  "items": [
    {
      "orderItemId": "uw_item_7719",
      "orderId": "ORD-UWB-202610-8812",
      "orderPasscode": "UWB-PASS-4412",
      "productId": "uw_prd_3001",
      "productTitle": "Smartphone Pro 256GB",
      "variantName": "Midnight Black",
      "categoryId": "gadgets",
      "quantity": 1,
      "allocatedBin": "C-04-B2-S1",
      "itemStatus": "pending_pick",
      "pickerId": null,
      "urgency": "express_tanke",
      "createdAt": "2026-10-21T14:10:00Z"
    }
  ],
  "meta": { "totalPending": 14, "totalPicking": 6, "totalPacked": 22 }
}
```

#### Update Order-Item Lifecycle State
- **UI Trigger:** `whm/order-items.html` -> Status Action buttons / Multi-select action bar.
- **HTTP Method & Route:** `PATCH /api/v1/whm/order-items/{orderItemId}/status`
- **Request Payload:**
```json
{
  "newStatus": "picked",
  "pickerId": "picker_tanke_04",
  "binScanned": "C-04-B2-S1",
  "verificationNotes": "Serial recorded and unit verified intact"
}
```

#### Report Shortage or Propose Substitution
- **UI Trigger:** `whm/order-items.html` -> `#btnItemSubstitute` ("Log Shortage / Substitute").
- **HTTP Method & Route:** `POST /api/v1/whm/order-items/{orderItemId}/substitute`
- **Request Payload:**
```json
{
  "substituteProductId": "uw_prd_3008",
  "substituteTitle": "Smartphone Plus 256GB (Space Grey)",
  "priceDifferenceMinor": 0,
  "reason": "original_variant_damaged_in_bin",
  "customerApprovalRequired": true,
  "operatorId": "whm_staff_10"
}
```

---

### 7.10.5 WHM Product Collation (per Categ)

#### Collation Aggregation Matrix per Category
- **UI Trigger:** `whm/collation.html` initialization & Category filter tabs.
- **HTTP Method & Route:** `GET /api/v1/whm/collation/by-category`
- **Response `data` (200 OK):**
```json
{
  "categories": [
    {
      "categoryId": "groceries",
      "categoryName": "Packaged Groceries",
      "totalItemsToCollate": 28,
      "collatedCount": 20,
      "pendingCount": 8,
      "batchPickListsActive": 2
    },
    {
      "categoryId": "foodstuff",
      "categoryName": "Foodstuff & Agro",
      "totalItemsToCollate": 34,
      "collatedCount": 31,
      "pendingCount": 3,
      "batchPickListsActive": 3
    },
    {
      "categoryId": "gadgets",
      "categoryName": "Gadgets & Accessories",
      "totalItemsToCollate": 12,
      "collatedCount": 11,
      "pendingCount": 1,
      "batchPickListsActive": 1
    }
  ],
  "activeOrdersCollation": [
    {
      "orderId": "ORD-UWB-202610-8812",
      "deliveryPasscode": "UWB-PASS-4412",
      "customerName": "Tolani Shittu",
      "assignedToteId": "TOTE-GR-09",
      "categoryProgress": {
        "groceries": { "total": 2, "collated": 2, "status": "completed" },
        "foodstuff": { "total": 1, "collated": 1, "status": "completed" },
        "gadgets": { "total": 1, "collated": 0, "status": "pending_pick" }
      },
      "overallCompletionPercentage": 75.0,
      "readyForPacking": false
    }
  ]
}
```

#### Assign Picked Category Items to Customer Order Tote (Pigeon-Hole)
- **UI Trigger:** `whm/collation.html` -> `#btnConfirmCollationSlot` ("Place in Order Tote").
- **HTTP Method & Route:** `POST /api/v1/whm/collation/totes/assign`
- **Request Payload:**
```json
{
  "orderId": "ORD-UWB-202610-8812",
  "orderItemId": "uw_item_7719",
  "toteId": "TOTE-GR-09",
  "collationStationId": "STATION_BAY_03",
  "collateOperatorId": "picker_tanke_04"
}
```

#### Complete Collation for Order
- **UI Trigger:** `whm/collation.html` -> `#btnReleaseOrderToPacking` ("Collation 100% -> Send to Packing & QA").
- **HTTP Method & Route:** `POST /api/v1/whm/collation/orders/{orderId}/complete`
- **Response `data` (200 OK):**
```json
{
  "orderId": "ORD-UWB-202610-8812",
  "allCategoriesCollated": true,
  "stagedForPackingAt": "2026-10-21T14:38:00Z",
  "nextStage": "whm_qa_inspection"
}
```

---

### 7.10.6 WHM Product Sourcing - Assign to SBA (per Categ)

#### Sourcing Deficit Aggregation per Category
- **UI Trigger:** `whm/sourcing.html` -> `#tabDeficitAggregation`.
- **HTTP Method & Route:** `GET /api/v1/whm/sourcing/deficits`
- **Response `data` (200 OK):**
```json
{
  "categoryDeficits": [
    {
      "categoryId": "foodstuff",
      "categoryName": "Foodstuff & Farm Produce",
      "recommendedSbaSpecialist": "SBA-AGRO-01",
      "deficitItems": [
        {
          "productId": "uw_prd_1004",
          "title": "Yam Tubers (Medium Size)",
          "currentPhysicalStock": 2,
          "orderDemandQty": 18,
          "netDeficitQty": 16,
          "benchmarkUnitCostMinor": 120000,
          "estimatedTotalCostMinor": 1920000,
          "suggestedOrigin": "Ipata Wholesale Market"
        }
      ]
    }
  ]
}
```

#### Create & Assign Procurement Batch to Sourcing & Buying Agent (SBA)
- **UI Trigger:** `whm/sourcing.html` -> `#btnCreateSbaBatch` ("Generate SBA Batch").
- **HTTP Method & Route:** `POST /api/v1/whm/sourcing/batches/create`
- **Request Payload:**
```json
{
  "sbaId": "sba_agro_kayode",
  "categoryId": "foodstuff",
  "targetMarket": "Ipata Market, Ilorin",
  "items": [
    {
      "productId": "uw_prd_1004",
      "targetQty": 16,
      "benchmarkUnitPriceMinor": 120000
    }
  ],
  "disbursementBudgetMinor": 1920000,
  "expectedReturnWarehouseTime": "2026-10-21T17:00:00Z",
  "operatorId": "whm_staff_10"
}
```
- **Response `data` (201 Created):**
```json
{
  "batchId": "SBA-BATCH-202610-044",
  "sbaId": "sba_agro_kayode",
  "sbaName": "Kayode Agro Sourcing",
  "categoryId": "foodstuff",
  "status": "assigned",
  "totalBudgetMinor": 1920000,
  "assignedAt": "2026-10-21T14:40:00Z"
}
```

#### SBA Delivery & Receiving at Warehouse Bay
- **UI Trigger:** `whm/sourcing.html` -> `#btnLogSbaSupply` ("Receive Inbound SBA Batch").
- **HTTP Method & Route:** `POST /api/v1/whm/sourcing/batches/{batchId}/supply`
- **Request Payload:**
```json
{
  "batchId": "SBA-BATCH-202610-044",
  "suppliedQtyMap": {
    "uw_prd_1004": 16
  },
  "actualTotalCostMinor": 1850000,
  "vendorReceiptRef": "RCPT-IPT-9920",
  "receivingBay": "Receiving Dock 2 (Perishables)",
  "receivingClerkId": "whm_staff_10"
}
```
- **Response `data` (200 OK):**
```json
{
  "batchId": "SBA-BATCH-202610-044",
  "status": "supplied_at_dock",
  "costVarianceMinor": -70000,
  "routedToQa": true,
  "qaBatchTicketId": "QA-TCK-202610-182"
}
```

---

### 7.10.7 WHM Product QA (per Categ)

#### Get Pending QA Inspection Queue
- **UI Trigger:** `whm/qa.html` initialization & Category filter buttons.
- **HTTP Method & Route:** `GET /api/v1/whm/qa/pending`
- **Query Parameters:** `categoryId?`, `sourceType?` (`sba_intake`|`order_pack_verify`).
- **Response `data` (200 OK):**
```json
{
  "pendingInspections": [
    {
      "qaTicketId": "QA-TCK-202610-182",
      "sourceType": "sba_intake",
      "batchId": "SBA-BATCH-202610-044",
      "productId": "uw_prd_1004",
      "productTitle": "Yam Tubers (Medium Size)",
      "categoryId": "foodstuff",
      "quantity": 16,
      "specBenchmarkDoc": "product-specs.pdf"
    },
    {
      "qaTicketId": "QA-TCK-202610-183",
      "sourceType": "order_pack_verify",
      "orderId": "ORD-UWB-202610-8812",
      "productId": "uw_prd_3001",
      "productTitle": "Smartphone Pro 256GB",
      "categoryId": "gadgets",
      "quantity": 1,
      "specBenchmarkDoc": "product-specs.pdf"
    }
  ]
}
```

#### Perform Category QA Inspection
- **UI Trigger:** `whm/qa.html` -> `#btnSubmitQaInspection` ("Record QA Decision").
- **HTTP Method & Route:** `POST /api/v1/whm/qa/inspect`
- **Request Payload:**
```json
{
  "qaTicketId": "QA-TCK-202610-183",
  "categoryId": "gadgets",
  "disposition": "pass_grade_a",
  "checklistEvaluation": {
    "powerOnTest": "pass",
    "screenIntegrity": "pass",
    "imeiLogged": "358941098234812",
    "ramStorageVerified": "8GB / 256GB matched",
    "batteryHealthIndicator": "100%",
    "accessoriesIncluded": ["charger_cable", "sim_ejector"],
    "factorySealOrInspectionStickerApplied": true
  },
  "defectsNoted": null,
  "inspectorId": "qa_inspector_02",
  "dispositionNotes": "Passed all diagnostics specified in product-specs.pdf; verified factory original."
}
```
- **Response `data` (200 OK):**
```json
{
  "qaTicketId": "QA-TCK-202610-183",
  "disposition": "pass_grade_a",
  "routedAction": "released_to_order_dispatch",
  "inspectedAt": "2026-10-21T14:42:00Z",
  "certificateRef": "QA-CERT-UWB-88192"
}
```

------------------------------------------------------------------------------------------------------------------------------------------------------
### 7.11 Field Regional Marketing (FRM) Operations & API Mapping

#### 7.11.1 Regional Product Listing & Algorithmic Suggested Pricing
- **UI Trigger:** `frm/product-listing.html` (Catalog Table & Daily Rate Card Generator).
- **HTTP Method & Route:** `GET /api/v1/frm/products`
- **Query Parameters:** `category={groceries|foodstuff|gadgets|fashion|home}`, `search={query}`, `stockStatus={in_stock|low_stock|all}`.
- **Backend Pricing Algorithm Note:** The price returned includes the `algorithmicSuggestedPriceMinor` computed from `baseCostFloorMinor` + physical handling breakdown (`transportationMinor`, `washingMinor`, `loadingMinor`, `baggingMinor`). This value is returned as a **recommendation/suggestion**, NOT a forced constraint on regional sales.
- **Response `data` (200 OK):**
```json
{
  "products": [
    {
      "id": "uw_prd_1001",
      "title": "Refined Pure Vegetable Cooking Oil 5L",
      "categoryId": "groceries",
      "unitLabel": "5L Jerrycan",
      "stockQuantity": 64,
      "baseCostFloorMinor": 1220000,
      "handlingCostBreakdown": {
        "transportationMinor": 30000,
        "washingMinor": 5000,
        "loadingMinor": 15000,
        "baggingMinor": 20000,
        "overheadMinor": 10000,
        "totalHandlingCostMinor": 80000
      },
      "effectiveCostFloorMinor": 1300000,
      "currentPriceMinor": 1450000,
      "algorithmicSuggestedPriceMinor": 1460000,
      "suggestedMarginMinor": 160000,
      "suggestedMarginPct": 10.96,
      "isSuggestionOnly": true
    }
  ]
}
```

#### 7.11.2 Field Customer Payment Report Submission & Audit
- **UI Trigger:** `frm/payment-report.html` -> `#modalNewPayment` ("Save Payment Report").
- **HTTP Method & Route:** `POST /api/v1/frm/payments/report`
- **Request Payload:**
```json
{
  "orderId": "ORD-FRM-50124",
  "customerName": "Madam Folake Alabi",
  "customerPhone": "0803-882-9901",
  "amountMinor": 14000000,
  "channel": "pos_terminal",
  "posTerminalId": "POS-TNK-091",
  "bankName": "Moniepoint MFB",
  "transactionRef": "MNP-TX-9921820",
  "agentId": "AGT-ILN-01",
  "agentName": "Kabir Olatunji",
  "receiptDoc": "moniepoint_slip_8801.png",
  "notes": "Full order payment collected via POS swipe."
}
```
- **Response `data` (201 Created):**
```json
{
  "reportId": "REP-PAY-8801",
  "orderId": "ORD-FRM-50124",
  "amountMinor": 14000000,
  "status": "verified",
  "remittanceStatus": "unremitted",
  "reportedAt": "2026-10-21T15:20:00Z"
}
```

#### 7.11.3 Corporate Bank Remittance Batch Creation & HQ Settlement
- **UI Trigger:** `frm/payment-remittance.html` -> `#modalRemittanceBatch` ("Submit Remittance to HQ").
- **HTTP Method & Route:** `POST /api/v1/frm/remittances`
- **Request Payload:**
```json
{
  "paymentReportIds": ["REP-PAY-8801", "REP-PAY-8803"],
  "agentId": "AGT-ILN-01",
  "hub": "Tanke Hub, Ilorin",
  "destinationBank": "First Bank of Nigeria (AreaBazaar Operations - 2038192810)",
  "bankTellerRef": "FBN-DEP-9921820",
  "depositSlipFile": "fbn_teller_scan_8801.jpg",
  "notes": "Friday field collections deposited at University Road branch."
}
```
- **Response `data` (201 Created):**
```json
{
  "batchId": "REM-BATCH-103",
  "batchCode": "REM-ILN-202610-02",
  "totalAmountMinor": 39000000,
  "status": "submitted",
  "remittedAt": "2026-10-21T15:45:00Z"
}
```

#### 7.11.4 Customer Order Direct Field Submission
- **UI Trigger:** `frm/order-submit.html` -> `#orderSubmitForm` ("Submit Customer Order").
- **HTTP Method & Route:** `POST /api/v1/frm/orders/submit`
- **Request Payload:**
```json
{
  "customerName": "Alhaji Bashir Mustapha",
  "customerPhone": "0814-555-8822",
  "customerAddress": "Plot 7, Fate River Basin Estate, Ilorin",
  "hub": "Fate Hub, Ilorin",
  "agentId": "AGT-ILN-02",
  "agentName": "Zainab Danladi",
  "items": [
    { "productId": "uw_prd_1004", "title": "Selected Fresh Yam Tubers", "quantity": 10, "unitPriceMinor": 180000 },
    { "productId": "uw_prd_1005", "title": "Premium Smoked Catfish Pack", "quantity": 2, "unitPriceMinor": 650000 }
  ],
  "totalAmountMinor": 3100000,
  "paymentMode": "pay_on_delivery"
}
```
- **Response `data` (201 Created):**
```json
{
  "orderId": "ORD-FRM-50125",
  "customerName": "Alhaji Bashir Mustapha",
  "totalAmountMinor": 3100000,
  "passcode": "4190",
  "paymentStatus": "pending",
  "fulfillmentStatus": "submitted",
  "createdAt": "2026-10-21T15:50:00Z"
}
```

#### 7.11.5 Customer Order Tracking & Fulfillment Pipeline
- **UI Trigger:** `frm/order-track.html` (Fulfillment Stepper Timeline).
- **HTTP Method & Route:** `GET /api/v1/frm/orders/track/{orderId}`
- **Response `data` (200 OK):**
```json
{
  "orderId": "ORD-FRM-50124",
  "customerName": "Madam Folake Alabi",
  "customerAddress": "14 University Road, Tanke, Ilorin",
  "hub": "Tanke Hub, Ilorin",
  "fulfillmentStatus": "out_for_delivery",
  "passcode": "6821",
  "timeline": [
    { "stage": "submitted", "timestamp": "2026-10-21T10:00:00Z" },
    { "stage": "collation", "timestamp": "2026-10-21T11:00:00Z" },
    { "stage": "warehouse_dispatched", "timestamp": "2026-10-21T12:00:00Z" },
    { "stage": "hub_arrived", "timestamp": "2026-10-21T13:30:00Z" },
    { "stage": "out_for_delivery", "timestamp": "2026-10-21T14:45:00Z" }
  ]
}
```

#### 7.11.6 Customer Delivery Passcode Verification & Proof of Delivery (POD)
- **UI Trigger:** `frm/order-delivery.html` -> `#podForm` ("Confirm & Complete Delivery").
- **HTTP Method & Route:** `POST /api/v1/frm/orders/{orderId}/deliver`
- **Request Payload:**
```json
{
  "orderId": "ORD-FRM-50124",
  "passcode": "6821",
  "recipientName": "Madam Folake Alabi",
  "recipientPhone": "0803-882-9901",
  "relationship": "Self (Customer)",
  "deliveredBy": "Kabir Olatunji (FRM Handover)",
  "deliveryNotes": "Delivered intact. Customer verified bags and cooking oil.",
  "photoProofRef": "pod_receipt_50124.jpg"
}
```
- **Response `data` (200 OK):**
```json
{
  "orderId": "ORD-FRM-50124",
  "fulfillmentStatus": "delivered",
  "paymentStatus": "paid",
  "deliveredAt": "2026-10-21T15:55:00Z",
  "podCertificateRef": "POD-CERT-ILN-99120"
}
```




