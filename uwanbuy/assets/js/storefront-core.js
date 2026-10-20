(function (window) {
    const STORAGE_KEY = 'area_bazaar_storefront_state';
    const USER_STORAGE_KEY = 'ab_user';
    const DEFAULT_LOCATION = 'Tanke Hub, Ilorin';

    const STORE_DEFAULTS = {
        betasup: { wallet: 15000 },
        uwanbuy: { wallet: 25000 },
        thriftz: { wallet: 1000 }
    };

    // Simulated Active AreaBazaar Hyperlocal Sessions
    const ACTIVE_BAZAAR_SESSIONS = [
        {
            hubId: 'Tanke Hub, Ilorin',
            hubName: 'Tanke Hub, Ilorin',
            title: 'Tanke Hyperlocal Live Wave',
            activeWave: 'Wave 2 (High Mid)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 45,
            activeDealsCount: 14
        }
    ];

    // Hub locations catalog
    const AVAILABLE_HUBS = [
        { id: 'Tanke Hub, Ilorin', name: 'Tanke Hub, Ilorin', city: 'Ilorin', state: 'Kwara State', hasLiveSession: true },
        { id: 'Ikeja Hub, Lagos', name: 'Ikeja Central Hub, Lagos', city: 'Ikeja', state: 'Lagos State', hasLiveSession: false },
        { id: 'Gwarinpa Hub, Abuja', name: 'Gwarinpa Hub, Abuja', city: 'Abuja', state: 'FCT', hasLiveSession: false },
        { id: 'Rumuokwuta Hub, Port Harcourt', name: 'Rumuokwuta Hub, Port Harcourt', city: 'Port Harcourt', state: 'Rivers State', hasLiveSession: false }
    ];

    // Canonical UwanBuy Product Catalog with Full Category Specs
    const UWANBUY_PRODUCTS = [
        {
            id: 'uw-101',
            name: 'Premium Parboiled Rice (50kg)',
            price: 45000,
            salePrice: 45000,
            compareAtPrice: 52000,
            category: 'groceries',
            categoryName: 'Groceries',
            subCategory: 'Grains & Foodstuff',
            image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
            brand: 'Mama Gold',
            sku: 'GRO-RIC-50KG',
            rating: 4.8,
            reviewsCount: 94,
            inStock: true,
            quantity: 32,
            unitLabel: 'bag (50kg)',
            description: 'Stone-free, well-milled long grain parboiled Nigerian rice. Ideal for family consumption and catering.',
            specifications: {
                netWeight: '50kg',
                grainType: 'Long Grain Parboiled',
                countryOfOrigin: 'Nigeria',
                packaging: 'Woven Polypropylene Sack',
                shelfLife: '24 Months'
            }
        },
        {
            id: 'uw-102',
            name: 'Golden Penny Vegetable Oil (5L)',
            price: 13500,
            salePrice: 13500,
            compareAtPrice: 15000,
            category: 'groceries',
            categoryName: 'Groceries',
            subCategory: 'Cooking Oils',
            image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
            brand: 'Golden Penny',
            sku: 'GRO-OIL-5L',
            rating: 4.9,
            reviewsCount: 142,
            inStock: true,
            quantity: 18,
            unitLabel: 'jerrycan',
            description: 'Triple-refined clear vegetable cooking oil, cholesterol-free and enriched with Vitamin A.',
            specifications: {
                volume: '5 Litres',
                cholesterol: '0mg',
                vitaminAEnriched: 'Yes',
                packageType: 'Tamper-proof Jerrycan',
                shelfLife: '18 Months'
            }
        },
        {
            id: 'uw-103',
            name: 'Smartphone Pro Max 256GB',
            price: 850000,
            salePrice: 850000,
            compareAtPrice: 920000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            subCategory: 'Smartphones',
            image: '../assetsecm/images/soups/afang-soup-roundbowl.png',
            brand: 'Apex Mobile',
            sku: 'GDT-PHN-256',
            rating: 4.9,
            reviewsCount: 57,
            inStock: true,
            quantity: 9,
            unitLabel: 'unit',
            description: 'Flagship powerhouse with 6.7-inch OLED display, 256GB high-speed NVMe storage, and 5000mAh battery.',
            specifications: {
                model: 'Apex Pro Max',
                screenInches: '6.7" OLED (120Hz)',
                storageGb: '256GB',
                memoryGb: '12GB RAM',
                battery: '5000mAh Fast Charging',
                connectivity: ['5G', 'Wi-Fi 6E', 'Bluetooth 5.3'],
                simType: 'Dual Nano-SIM + eSIM',
                warrantyMonths: '12 Months Official'
            }
        },
        {
            id: 'uw-104',
            name: 'Wireless Noise-Cancelling Headphones',
            price: 35000,
            salePrice: 35000,
            compareAtPrice: 42000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            subCategory: 'Audio & Accessories',
            image: '../assetsecm/images/soups/edikang-soup-roundbowl.png',
            brand: 'SonicWave',
            sku: 'GDT-AUD-ANC',
            rating: 4.7,
            reviewsCount: 38,
            inStock: true,
            quantity: 15,
            unitLabel: 'unit',
            description: 'Deep acoustic bass with hybrid active noise cancellation (ANC) and 40-hour wireless playtime.',
            specifications: {
                playbackHours: '40 Hours (ANC On)',
                driverSize: '40mm Neodymium',
                chargingPort: 'Type-C Quick Charge',
                microphone: 'Quad-mic Beamforming',
                weightGrams: '240g'
            }
        },
        {
            id: 'uw-105',
            name: 'Unisex Urban Oversized Cotton Hoodie',
            price: 14500,
            salePrice: 14500,
            compareAtPrice: 18000,
            category: 'fashion',
            categoryName: 'Wears & Fashion',
            subCategory: 'Streetwear',
            image: '../assetsecm/images/soups/efo-riro-roundbowl.png',
            brand: 'Bazaar Stitch',
            sku: 'FAS-HOD-BLK',
            rating: 4.8,
            reviewsCount: 63,
            inStock: true,
            quantity: 24,
            unitLabel: 'piece',
            description: 'Heavyweight 380gsm brushed fleece hoodie. Drop-shoulder streetwear cut with kangaroo pocket.',
            specifications: {
                material: '100% Combed Cotton Fleece',
                gsm: '380 GSM',
                availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
                care: 'Machine Wash Cold, Hang Dry',
                fit: 'Oversized Boxy Fit'
            }
        },
        {
            id: 'uw-106',
            name: 'Non-Stick Granite Cookware Set (7 Pieces)',
            price: 48000,
            salePrice: 48000,
            compareAtPrice: 58000,
            category: 'home',
            categoryName: 'Home Essentials',
            subCategory: 'Kitchen & Dining',
            image: '../assetsecm/images/soups/bitterleaf-soup-roundbowl.png',
            brand: 'ChefElite',
            sku: 'HOM-POT-7PC',
            rating: 4.9,
            reviewsCount: 81,
            inStock: true,
            quantity: 7,
            unitLabel: 'set',
            description: 'Multi-layer durable granite non-stick coating. Induction-ready stainless base with heat-resistant silicone grips.',
            specifications: {
                piecesCount: '7 Pieces (3 Pots, 1 Pan, 3 Tempered Lids)',
                coating: 'Swiss Granite PTFE/PFOA Free',
                stoveCompatibility: 'Gas, Electric, Induction',
                dishwasherSafe: 'Yes'
            }
        }
    ];

    // Canonical Thrift-Z Catalog with Full Specifications
    const THRIFTZ_PRODUCTS = [
        {
            id: 'tz-101',
            title: 'MacBook Air M1 2020 (8GB / 256GB)',
            price: 480000,
            originalPrice: 890000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            condition: 'Gently Used',
            conditionGrade: 'A-',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
            seller: 'TechRenew Ilorin',
            sellerRating: '4.9 ★',
            sellerVerified: true,
            description: 'Clean UK-used MacBook Air M1 with 91% battery health. No dents, screen pristine, original charger included.',
            specifications: {
                chip: 'Apple M1 (8-core CPU / 7-core GPU)',
                memory: '8GB Unified RAM',
                storage: '256GB Fast SSD',
                batteryHealth: '91% (214 cycles)',
                display: '13.3" Retina True Tone Display',
                accessories: 'Original 30W USB-C Power Brick & Cable'
            }
        },
        {
            id: 'tz-102',
            title: 'Vintage Oversized Carhartt Detroit Jacket',
            price: 18500,
            originalPrice: 45000,
            category: 'fashion',
            categoryName: 'Fashion & Accessories',
            condition: 'Like New',
            conditionGrade: 'A+',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
            seller: 'RetroVault NG',
            sellerRating: '4.8 ★',
            sellerVerified: true,
            description: 'Authentic heavy duck canvas work jacket with corduroy collar and blanket lining. Immaculate streetwear condition.',
            specifications: {
                size: 'Large (Chest 44")',
                material: '100% Heavy Duck Cotton',
                color: 'Carhartt Vintage Brown',
                distressing: 'Zero rips, immaculate zipper and cuffs',
                origin: 'Imported Authentic Grade-A Vintage'
            }
        },
        {
            id: 'tz-103',
            title: 'Sony WH-1000XM4 Wireless Headphones',
            price: 125000,
            originalPrice: 260000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            condition: 'Refurbished',
            conditionGrade: 'A',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            seller: 'AudioHub Ikeja',
            sellerRating: '4.9 ★',
            sellerVerified: true,
            description: 'Industry-leading noise cancellation. New sanitary ear-cushions installed, battery tested at 28 hours continuous playback.',
            specifications: {
                batteryLife: '28+ Hours Active ANC',
                connectivity: 'Bluetooth 5.0 Multipoint + 3.5mm Jack',
                accessories: 'Hard Travel Case, Audio Cable, Airline Adapter',
                codecSupport: 'LDAC, AAC, SBC'
            }
        },
        {
            id: 'tz-104',
            title: 'Philips Digital Air Fryer XL (4.2L)',
            price: 38000,
            originalPrice: 85000,
            category: 'home',
            categoryName: 'Home & Kitchen',
            condition: 'Gently Used',
            conditionGrade: 'B+',
            image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80',
            seller: 'CampusThrift Kwara',
            sellerRating: '4.7 ★',
            sellerVerified: true,
            description: 'Rapid Air technology. Tested heating element, cooks crisply with 90% less oil. Clean non-stick basket.',
            specifications: {
                capacity: '4.2 Litres (0.8kg fries batch)',
                powerRating: '1400 Watts Rapid Air',
                controls: 'Digital Touchscreen with 7 One-touch Presets',
                cleaning: 'Dishwasher Safe Removable Basket'
            }
        },
        {
            id: 'tz-105',
            title: 'Apple Watch Series 6 (44mm GPS)',
            price: 95000,
            originalPrice: 180000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            condition: 'Refurbished',
            conditionGrade: 'A',
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
            seller: 'WristTech Hub',
            sellerRating: '4.9 ★',
            sellerVerified: true,
            description: 'Refurbished with pristine OLED display, blood oxygen and ECG sensors, space grey aluminum case with black sport band.',
            specifications: {
                caseSize: '44mm Aluminum',
                sensors: 'Blood Oxygen (SpO2), ECG, Optical Heart Rate',
                batteryHealth: '89% All-Day Battery',
                included: 'Magnetic Fast Charging Cable + Extra Sport Strap'
            }
        },
        {
            id: 'tz-106',
            title: 'Vintage Nike Windbreaker Retro 90s',
            price: 12500,
            originalPrice: 32000,
            category: 'fashion',
            categoryName: 'Fashion & Accessories',
            condition: 'Like New',
            conditionGrade: 'A+',
            image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
            seller: 'KwaraThrift Central',
            sellerRating: '4.8 ★',
            sellerVerified: true,
            description: 'Classic colour-blocked Nike track jacket. Water-resistant ripstop nylon shell with breathable mesh lining.',
            specifications: {
                size: 'Medium / Large Unisex Fit',
                material: '100% Ripstop Nylon',
                conditionNotes: 'No stains, tears or zipper issues',
                care: 'Machine Wash Cold'
            }
        },
        {
            id: 'tz-107',
            title: 'Dell XPS 13 Core i7 4K Touch (16GB/512GB)',
            price: 260000,
            originalPrice: 480000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            condition: 'Gently Used',
            conditionGrade: 'A',
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
            seller: 'LagosPreloved Laptops',
            sellerRating: '5.0 ★',
            sellerVerified: true,
            description: 'Ultra-thin aluminum chassis with carbon fiber palm rest, vibrant 4K UHD InfinityEdge touchscreen, tested thermal performance.',
            specifications: {
                processor: 'Intel Core i7-1065G7 Quad-Core',
                ram: '16GB LPDDR4x 3733MHz',
                storage: '512GB NVMe PCIe M.2 SSD',
                screen: '13.3" 4K UHD (3840x2160) Touchscreen',
                charger: 'Dell 45W Type-C Adapter'
            }
        },
        {
            id: 'tz-108',
            title: 'Logitech MX Master 3 Ergonomic Mouse',
            price: 35000,
            originalPrice: 75000,
            category: 'gadgets',
            categoryName: 'Gadgets & Tech',
            condition: 'Gently Used',
            conditionGrade: 'A',
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
            seller: 'DevGear NG',
            sellerRating: '4.8 ★',
            sellerVerified: true,
            description: 'Ergonomic wireless mouse with ultra-fast electromagnetic MagSpeed scrolling. Works seamlessly across Mac, Windows, and iPad.',
            specifications: {
                sensor: 'Darkfield 4000 DPI (tracks on glass)',
                battery: 'Up to 70 days on full charge (USB-C)',
                connectivity: 'Bluetooth Low Energy & Unifying Receiver',
                buttons: '7 Custom programmable buttons'
            }
        },
        {
            id: 'tz-109',
            title: 'Instant Pot Duo 7-in-1 Pressure Cooker (6-Quart)',
            price: 28000,
            originalPrice: 65000,
            category: 'home',
            categoryName: 'Home & Kitchen',
            condition: 'Like New',
            conditionGrade: 'A+',
            image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80',
            seller: 'KitchenReady Lisa',
            sellerRating: '4.9 ★',
            sellerVerified: true,
            description: '6-Quart electric pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. Fully sanitized.',
            specifications: {
                capacity: '5.7 Litres (6 Quart)',
                features: '13 One-Touch Smart Cooking Programs',
                innerPot: 'Food-Grade Stainless Steel (18/8)',
                safety: '10+ Built-in Safety Features'
            }
        },
        {
            id: 'tz-110',
            title: 'Minimalist LED Ergonomic Desk Lamp with Qi Charger',
            price: 9500,
            originalPrice: 22000,
            category: 'home',
            categoryName: 'Home & Kitchen',
            condition: 'Like New',
            conditionGrade: 'A+',
            image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80',
            seller: 'DormDecor Chris',
            sellerRating: '4.6 ★',
            sellerVerified: true,
            description: 'Dimmable eye-caring LED desk lamp with 10W wireless charging base and touch controls. 5 brightness levels and 3 color temperatures.',
            specifications: {
                wirelessCharging: '10W Qi Fast Charge Base',
                colorTemperature: '3000K - 6000K (Warm to Cool White)',
                armAdjustment: '180° Foldable Multi-Angle Head',
                timer: '30 / 60 Min Auto-Off Timer'
            }
        },
        {
            id: 'tz-111',
            title: '5-Piece Heavy Stainless Steel Cookware Set',
            price: 24000,
            originalPrice: 55000,
            category: 'home',
            categoryName: 'Home & Kitchen',
            condition: 'Gently Used',
            conditionGrade: 'B+',
            image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
            seller: 'HomeEssentials Ben',
            sellerRating: '4.7 ★',
            sellerVerified: true,
            description: 'Includes 2 saucepans, 1 deep frying pan, and tempered glass vent lids. Heavy tri-ply encapsulated base compatible with gas and induction.',
            specifications: {
                pieces: '5 Pieces (2 Pots, 1 Pan, 2 Glass Lids)',
                material: 'Heavy 18/10 Stainless Steel',
                cooktopCompatibility: 'Induction, Gas, Electric, Ceramic',
                handles: 'Stay-Cool Riveted Stainless Steel'
            }
        },
        {
            id: 'tz-112',
            title: 'DeLonghi Compact 15-Bar Espresso Machine',
            price: 42000,
            originalPrice: 95000,
            category: 'home',
            categoryName: 'Home & Kitchen',
            condition: 'Like New',
            conditionGrade: 'A',
            image: 'https://images.unsplash.com/photo-1517668808822-9ebd02f2a888?auto=format&fit=crop&w=600&q=80',
            seller: 'CoffeeLovers Dorm',
            sellerRating: '5.0 ★',
            sellerVerified: true,
            description: '15-bar professional pump espresso machine. Advanced manual milk frother for rich cappuccinos and lattes. Heats up in 35 seconds.',
            specifications: {
                pumpPressure: '15 Bar Italian Pump',
                steamWand: 'Stainless Steel Manual Frother',
                waterTank: '1.1 Litre Removable Reservoir',
                filters: 'Single & Double Shot Portafilter Baskets'
            }
        }
    ];

    // Canonical Betasup Products
    const BETASUP_PRODUCTS = [
        {
            id: 101,
            name: 'DELTA BANGA Soup Pots',
            category: 'classic',
            categoryName: 'Classic Soups',
            tagline: 'Oghwo-Amiedi Palm Fruit Extraction',
            description: 'Rich slow-simmered palm fruit nectar infused with traditional Oburunbebe stick, dried bush meat morsels, and freshwater Catfish.',
            image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
            basePrice: 1800,
            rating: 4.9,
            variants: [
                { size: 'Mini 1L', price: 1800, volume: '1000ml' },
                { size: '1L Standard', price: 3500, volume: '1000ml' },
                { size: '2L Family', price: 6800, volume: '2000ml' },
                { size: '4L Feast', price: 13000, volume: '4000ml' }
            ],
            proteins: ['Freshwater Catfish', 'Assorted Meat', 'Goat Meat', 'Dry Fish & Stockfish'],
            swallows: [
                { name: 'None (Soup Pot Only)', price: 0 },
                { name: 'Starch (2 Wraps)', price: 400 },
                { name: 'Pounded Yam (2 Wraps)', price: 600 },
                { name: 'Eba / Garri (2 Wraps)', price: 400 }
            ],
            leadTime: '45 mins cooking lead time',
            ingredients: ['Palm Fruit Concentrate', 'Oburunbebe Stick', 'Beletete Leaves', 'Catfish', 'Crayfish', 'Stockfish']
        },
        {
            id: 102,
            name: 'IJEBU EGUSI-ELEFO Pots',
            category: 'classic',
            categoryName: 'Classic Soups',
            tagline: 'Toasted Melon Seeds with Waterleaf & Locust Beans',
            description: 'Coarsely ground melon seeds dry-roasted in hot palm oil with traditional fermented locust beans (Iru), smoked Catfish, and cow tripe.',
            image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
            basePrice: 1600,
            rating: 4.8,
            variants: [
                { size: 'Mini 1L', price: 1600, volume: '1000ml' },
                { size: '1L Standard', price: 3200, volume: '1000ml' },
                { size: '2L Family', price: 6200, volume: '2000ml' },
                { size: '4L Feast', price: 12000, volume: '4000ml' }
            ],
            proteins: ['Cow Tripe (Shaki) & Beef', 'Smoked Titus Fish', 'Assorted Meat'],
            swallows: [
                { name: 'None (Soup Pot Only)', price: 0 },
                { name: 'Eba / Garri (2 Wraps)', price: 400 },
                { name: 'Pounded Yam (2 Wraps)', price: 600 }
            ],
            leadTime: '35 mins cooking lead time',
            ingredients: ['Melon Seeds', 'Palm Oil', 'Iru (Locust Beans)', 'Waterleaf', 'Stockfish', 'Beef']
        },
        {
            id: 103,
            name: 'AFANG Soup Special Pots',
            category: 'delicacies',
            categoryName: 'Regional Delicacies',
            tagline: 'Pounded Okazi Leaf & Tender Waterleaves',
            description: 'Native Efik celebration soup. Fresh shredded Afang leaves pounded and simmered with tender waterleaves, periwinkles in shells, and stockfish head.',
            image: '../assetsecm/images/soups/afang-soup-roundbowl.png',
            basePrice: 2200,
            rating: 5.0,
            variants: [
                { size: 'Mini 1L', price: 2200, volume: '1000ml' },
                { size: '1L Standard', price: 4000, volume: '1000ml' },
                { size: '2L Family', price: 7500, volume: '2000ml' },
                { size: '4L Feast', price: 14500, volume: '4000ml' }
            ],
            proteins: ['Periwinkles & Stockfish', 'Assorted Meat', 'Goat Meat', 'Smoked Turkey'],
            swallows: [
                { name: 'None (Soup Pot Only)', price: 0 },
                { name: 'Pounded Yam (2 Wraps)', price: 600 },
                { name: 'Fufu (2 Wraps)', price: 400 }
            ],
            leadTime: '50 mins cooking lead time',
            ingredients: ['Afang (Ukazi) Leaves', 'Waterleaf', 'Periwinkles', 'Smoked Catfish', 'Palm Oil']
        },
        {
            id: 104,
            name: '10L Mega Party Cooler Package',
            category: 'packages',
            categoryName: 'Party Packages',
            tagline: 'Feeds 15-20 Guests with Serving Utensils Included',
            description: 'Insulated 10L stainless cooler packed with your choice of soup, 20 portions of assorted meat, and 20 wraps of swallow of your choice.',
            image: '../assetsecm/images/alvero/restaur-banner-main-02.png',
            basePrice: 45000,
            rating: 5.0,
            variants: [
                { size: '10L Party Cooler', price: 45000, volume: '10000ml' },
                { size: '25L Mega Cooler', price: 98000, volume: '25000ml' }
            ],
            proteins: ['40 Assorted Meat Cuts', 'Fried Croaker Fish', 'Smoked Turkey Morsels'],
            swallows: [
                { name: 'Mix: Pounded Yam + Amala (20 Wraps)', price: 0 },
                { name: 'Pounded Yam Only (20 Wraps)', price: 2000 }
            ],
            leadTime: '2 hours advance order notice required',
            ingredients: ['Catering Custom Selection', 'Insulated Cooler Provided', 'Utensils Included']
        },
        {
            id: 105,
            name: 'CHICKEN STEW Special Pots',
            category: 'stews',
            categoryName: 'Rich Stews',
            tagline: 'Fried Hard Local Chicken Tomato-Pepper Reduction',
            description: 'Sun-ripened tomatoes, roasted red bell peppers, and scotch bonnet peppers fried in seasoned vegetable oil with succulent hard chicken cuts.',
            image: '../assetsecm/images/soups/chicken-stew-roundbowl.png',
            basePrice: 2800,
            rating: 4.9,
            variants: [
                { size: 'Mini 1L', price: 2800, volume: '1000ml' },
                { size: '1L Standard', price: 5000, volume: '1000ml' },
                { size: '2L Family', price: 9500, volume: '2000ml' },
                { size: '4L Feast', price: 18000, volume: '4000ml' }
            ],
            proteins: ['Hard Chicken Laps', 'Full Fried Chicken', 'Smoked Chicken'],
            swallows: [
                { name: 'None (Stew Pot Only)', price: 0 },
                { name: 'White Rice Portion', price: 800 },
                { name: 'Boiled Yam Slices', price: 700 }
            ],
            leadTime: '40 mins cooking lead time',
            ingredients: ['Red Bell Peppers (Tatashe)', 'Tomatoes', 'Habanero Peppers (Rodo)', 'Hard Chicken', 'Seasoning Herbs']
        },
        {
            id: 106,
            name: 'DELTA FISHERMAN Soup Pots',
            category: 'delicacies',
            categoryName: 'Regional Delicacies',
            tagline: 'Fresh River Catfish, Prawns, Crabs & Ngolo',
            description: 'Riverine delicacy brewed with fresh sweet catfish steaks, giant river prawns, mangrove periwinkles, sea snails (Ngolo), and aromatic native spices.',
            image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
            basePrice: 3500,
            rating: 5.0,
            variants: [
                { size: 'Mini 1L', price: 3500, volume: '1000ml' },
                { size: '1L Standard', price: 6500, volume: '1000ml' },
                { size: '2L Family', price: 12500, volume: '2000ml' },
                { size: '4L Feast', price: 24000, volume: '4000ml' }
            ],
            proteins: ['Freshwater Catfish', 'Jumbo River Prawns', 'Crabs & Periwinkles', 'Dried Barramundi Fish'],
            swallows: [
                { name: 'None (Soup Pot Only)', price: 0 },
                { name: 'Starch (2 Wraps)', price: 400 },
                { name: 'Pounded Yam (2 Wraps)', price: 600 }
            ],
            leadTime: '55 mins cooking lead time',
            ingredients: ['Fresh Catfish', 'Jumbo Prawns', 'Crabs', 'Native Pepper Soup Spices', 'Uziza Leaves']
        }
    ];

    function safeNumber(value, fallback) {
        const num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    }

    function readState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function writeState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function detectStoreName() {
        const bodyStore = document.body && document.body.dataset && document.body.dataset.store;
        if (bodyStore) return bodyStore;

        const path = window.location.pathname.toLowerCase();
        if (path.includes('betasup')) return 'betasup';
        if (path.includes('uwanbuy')) return 'uwanbuy';
        if (path.includes('thriftz')) return 'thriftz';

        return 'uwanbuy';
    }

    function getUser() {
        try {
            const raw = localStorage.getItem(USER_STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function setUser(userData) {
        if (!userData) {
            localStorage.removeItem(USER_STORAGE_KEY);
        } else {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        }
        syncUI();
    }

    function getLocation() {
        const user = getUser();
        if (user && user.hub) return user.hub;
        const state = readState();
        return state.selectedLocation || DEFAULT_LOCATION;
    }

    function setLocation(hubId) {
        const state = readState();
        state.selectedLocation = hubId;
        writeState(state);

        const user = getUser();
        if (user) {
            user.hub = hubId;
            setUser(user);
        }

        syncLocationDisplays();
        checkActiveBazaarSession();
    }

    function getCartItemsFromStorage(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function getCartCount() {
        const sources = ['ab_cart', 'thriftz_cart', 'uwanbuy_cart'];
        let total = 0;

        sources.forEach((key) => {
            const cart = getCartItemsFromStorage(key);
            cart.forEach((item) => {
                total += safeNumber(item.quantity, safeNumber(item.qty, 1));
            });
        });

        return total;
    }

    function getWalletValue(storeName) {
        const currentUser = getUser();
        if (currentUser && safeNumber(currentUser.wallet, null) !== null) {
            return safeNumber(currentUser.wallet, 0);
        }

        if (typeof window.walletBalance === 'number') {
            return window.walletBalance;
        }

        const state = readState();
        const persisted = state[storeName] && typeof state[storeName].wallet === 'number'
            ? state[storeName].wallet
            : null;

        if (persisted !== null) {
            return persisted;
        }

        return STORE_DEFAULTS[storeName]?.wallet || 0;
    }

    function formatNaira(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function syncLocationDisplays() {
        const currentLoc = getLocation();
        document.querySelectorAll('.storefront-current-location, #navLocationText, #nav-location-label, #currentLocationLabel').forEach(el => {
            el.textContent = currentLoc;
        });
    }

    function syncUI() {
        const storeName = detectStoreName();
        const user = getUser();
        const wallet = getWalletValue(storeName);
        const cartCount = getCartCount();

        syncLocationDisplays();

        // Update Wallet Displays
        const walletText = formatNaira(wallet);
        const walletSelectors = [
            '#wallet-balance-display',
            '#modal-wallet-balance-text',
            '#navWalletBalance',
            '#walletModalBalance',
            '#modalCartWalletBal',
            '.user-wallet-display'
        ];
        walletSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.textContent = walletText);
        });

        // Update Cart Counts
        const cartSelectors = ['#cart-count-badge', '#cartBadge', '#cartCountBadge', '#boughtBadge'];
        cartSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.textContent = String(cartCount);
                if (cartCount > 0) el.classList.remove('d-none');
                else el.classList.add('d-none');
            });
        });

        // Update Auth State UI Elements
        const authActionButtons = document.querySelectorAll('.auth-user-name, #nav-user-name');
        authActionButtons.forEach(el => {
            el.textContent = user ? (user.name.split(' ')[0] || user.name) : 'Account';
        });

        if (user) {
            document.querySelectorAll('.auth-guest-only').forEach(el => el.classList.add('d-none'));
            document.querySelectorAll('.auth-logged-only').forEach(el => el.classList.remove('d-none'));
        } else {
            document.querySelectorAll('.auth-guest-only').forEach(el => el.classList.remove('d-none'));
            document.querySelectorAll('.auth-logged-only').forEach(el => el.classList.add('d-none'));
        }
    }

    function checkActiveBazaarSession() {
        const currentLoc = getLocation();
        const activeMatch = ACTIVE_BAZAAR_SESSIONS.find(s => s.hubId.toLowerCase() === currentLoc.toLowerCase());

        const modalEl = document.getElementById('modal-bazaar-session-alert');
        if (!modalEl) return;

        if (activeMatch) {
            // Update session alert content
            const titleEl = document.getElementById('bazaarSessionTitle');
            const waveEl = document.getElementById('bazaarSessionWave');
            const hubEl = document.getElementById('bazaarSessionHub');
            const btnEl = document.getElementById('btnEnterBazaarSession');

            if (titleEl) titleEl.textContent = activeMatch.title;
            if (waveEl) waveEl.textContent = activeMatch.activeWave;
            if (hubEl) hubEl.textContent = activeMatch.hubName;
            if (btnEl) {
                btnEl.href = activeMatch.bazaarPageUrl;
            }

            // If iziModal is initialized, open or notify
            if (window.jQuery && $(modalEl).data().iziModal) {
                // Avoid nagging constantly if user closed it in this session, unless explicitly invoked
                const dismissed = sessionStorage.getItem('dismissed_bazaar_session_' + activeMatch.hubId);
                if (!dismissed) {
                    setTimeout(() => {
                        $(modalEl).iziModal('open');
                    }, 800);
                }
            }
        }
    }

    function init() {
        const storeName = detectStoreName();
        if (document.body) {
            document.body.dataset.store = storeName;
        }
        syncUI();
        checkActiveBazaarSession();
    }

    // Export Storefront Core API
    window.AreaBazaarStorefront = {
        init,
        refresh: syncUI,
        detectStoreName,
        getUser,
        setUser,
        getLocation,
        setLocation,
        getWalletValue,
        getCartCount,
        formatNaira,
        checkActiveBazaarSession,
        AVAILABLE_HUBS,
        ACTIVE_BAZAAR_SESSIONS,
        UWANBUY_PRODUCTS,
        THRIFTZ_PRODUCTS,
        BETASUP_PRODUCTS
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})(window);
