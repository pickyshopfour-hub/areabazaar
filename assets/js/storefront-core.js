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
        },
        {
            hubId: 'Taiwo Road Hub, Ilorin',
            hubName: 'Taiwo Road Hub, Ilorin',
            title: 'Taiwo Road Live Market Wave',
            activeWave: 'Wave 1 (Early Bird)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 35,
            activeDealsCount: 11
        },
        {
            hubId: 'Malete Campus Hub, Kwara',
            hubName: 'Malete Campus Hub, Kwara',
            title: 'KWASU Campus Student Wave',
            activeWave: 'Wave 2 (Student Deals)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 50,
            activeDealsCount: 9
        },
        {
            hubId: 'Yaba Tech Hub, Lagos',
            hubName: 'Yaba Tech Hub, Lagos',
            title: 'Yaba Hyperlocal Flash Wave',
            activeWave: 'Wave 2 (High Mid)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 28,
            activeDealsCount: 16
        },
        {
            hubId: 'Wuse 2 Hub, Abuja',
            hubName: 'Wuse 2 Hub, Abuja',
            title: 'Wuse 2 Central Live Wave',
            activeWave: 'Wave 2 (High Mid)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 40,
            activeDealsCount: 12
        },
        {
            hubId: 'GRA Phase 2 Hub, Port Harcourt',
            hubName: 'GRA Phase 2 Hub, Port Harcourt',
            title: 'New GRA Hyperlocal Wave',
            activeWave: 'Wave 1 (Early Bird)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 32,
            activeDealsCount: 10
        },
        {
            hubId: 'Bodija & UI Hub, Ibadan',
            hubName: 'Bodija & UI Hub, Ibadan',
            title: 'Bodija & UI Campus Live Wave',
            activeWave: 'Wave 2 (High Mid)',
            bazaarPageUrl: '../Tanke/ch-frm-bazaar-page-sample.html',
            productRangeUrl: '../Tanke/product-range.php',
            landingUrl: '../public/landing.php',
            endsAtMinutes: 38,
            activeDealsCount: 13
        }
    ];

    // Hub locations catalog (Expanded hyperlocal areas across cities & states)
    const AVAILABLE_HUBS = [
        // Kwara State (Ilorin & Environs)
        { id: 'Tanke Hub, Ilorin', name: 'Tanke Hub, Ilorin', area: 'Tanke / University Rd', street: 'University Road, Oke-Odo, Tanke', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: true, waveLabel: 'Active Wave', deliveryEta: '45-90 mins' },
        { id: 'Taiwo Road Hub, Ilorin', name: 'Taiwo Road Hub, Ilorin', area: 'Taiwo Road / Oko Erin', street: 'Upper Taiwo Road, Beside CBN Quarters', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: true, waveLabel: 'Active Wave', deliveryEta: '60-120 mins' },
        { id: 'Gaa Akanbi Hub, Ilorin', name: 'Gaa Akanbi Hub, Ilorin', area: 'Gaa Akanbi / Pipeline', street: 'Pipeline Road & Gaa Akanbi Roundabout', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'GRA Fate Hub, Ilorin', name: 'GRA Fate Hub, Ilorin', area: 'Fate / Basin / GRA', street: 'Fate Roundabout, Shoprite Axis, GRA', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: false, waveLabel: '', deliveryEta: '1-2 hours' },
        { id: 'Challenge & Unity Hub, Ilorin', name: 'Challenge & Unity Hub, Ilorin', area: 'Challenge / Unity Rd', street: 'Unity Road by Challenge Bookshop', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Kulende & Sango Hub, Ilorin', name: 'Kulende & Sango Hub, Ilorin', area: 'Sango / Kulende / Maraba', street: 'Old Jebba Road, Kulende Market Junction', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Adewole Estate Hub, Ilorin', name: 'Adewole Estate Hub, Ilorin', area: 'Adewole / Oloje / Mandate', street: 'Adewole Roundabout, Near Mandate Market', city: 'Ilorin', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },
        { id: 'Malete Campus Hub, Kwara', name: 'Malete Campus Hub, Kwara', area: 'Malete / KWASU Campus', street: 'KWASU Safari Road, Malete', city: 'Malete', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: true, waveLabel: 'Campus Wave', deliveryEta: '45-90 mins' },
        { id: 'Offa Central Hub, Kwara', name: 'Offa Central Hub, Kwara', area: 'Offa / Owode Market', street: 'Olofa Way, Opposite Federal Poly Gate', city: 'Offa', state: 'Kwara State', regionGroup: 'ilorin', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },

        // Lagos State
        { id: 'Ikeja Hub, Lagos', name: 'Ikeja Central Hub, Lagos', area: 'Ikeja / Allen / Alausa', street: 'Allen Avenue, Ikeja', city: 'Ikeja', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Yaba Tech Hub, Lagos', name: 'Yaba Tech Hub, Lagos', area: 'Yaba / Akoka / Sabo', street: 'Herbert Macaulay Way, Sabo Yaba', city: 'Yaba', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: true, waveLabel: 'Active Wave', deliveryEta: '60-90 mins' },
        { id: 'Lekki Phase 1 Hub, Lagos', name: 'Lekki Phase 1 Hub, Lagos', area: 'Lekki Phase 1 / Marwa', street: 'Admiralty Way, Lekki Phase 1', city: 'Lekki', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Surulere Hub, Lagos', name: 'Surulere Hub, Lagos', area: 'Surulere / Bode Thomas', street: 'Adeniran Ogunsanya Street, Surulere', city: 'Surulere', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Festac Town Hub, Lagos', name: 'Festac Town Hub, Lagos', area: 'Festac / Amuwo Odofin', street: '23 Road, Festac Town', city: 'Festac', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },
        { id: 'Ajah & Sangotedo Hub, Lagos', name: 'Ajah & Sangotedo Hub, Lagos', area: 'Ajah / Abraham Adesanya', street: 'Lekki-Epe Expressway, Ajah Jubilee Bridge', city: 'Ajah', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },
        { id: 'Ikorodu Central Hub, Lagos', name: 'Ikorodu Central Hub, Lagos', area: 'Ikorodu / Benson / Agric', street: 'Lagos Road, Benson Bus Stop, Ikorodu', city: 'Ikorodu', state: 'Lagos State', regionGroup: 'lagos', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },

        // Abuja (FCT)
        { id: 'Gwarinpa Hub, Abuja', name: 'Gwarinpa Hub, Abuja', area: 'Gwarinpa / Life Camp', street: '3rd Avenue, Gwarinpa Estate', city: 'Abuja', state: 'FCT', regionGroup: 'abuja', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Wuse 2 Hub, Abuja', name: 'Wuse 2 Hub, Abuja', area: 'Wuse 2 / Maitama / Banex', street: 'Aminu Kano Crescent, Wuse 2', city: 'Abuja', state: 'FCT', regionGroup: 'abuja', hasLiveSession: true, waveLabel: 'Active Wave', deliveryEta: '60-90 mins' },
        { id: 'Kubwa Hub, Abuja', name: 'Kubwa Hub, Abuja', area: 'Kubwa Phase 4 / Arab Rd', street: 'Gado Nasko Road, Kubwa', city: 'Abuja', state: 'FCT', regionGroup: 'abuja', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },
        { id: 'Lugbe Airport Road Hub, Abuja', name: 'Lugbe Airport Road Hub, Abuja', area: 'Lugbe / FHA Estate', street: 'FHA Estate Junction, Airport Road, Lugbe', city: 'Abuja', state: 'FCT', regionGroup: 'abuja', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },

        // Rivers State (Port Harcourt)
        { id: 'Rumuokwuta Hub, Port Harcourt', name: 'Rumuokwuta Hub, Port Harcourt', area: 'Rumuokwuta / Rumuola', street: 'Ikwerre Road, Rumuokwuta', city: 'Port Harcourt', state: 'Rivers State', regionGroup: 'ph', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'GRA Phase 2 Hub, Port Harcourt', name: 'GRA Phase 2 Hub, Port Harcourt', area: 'New GRA / Tombia / Peter Odili', street: 'Tombia Street, GRA Phase 2', city: 'Port Harcourt', state: 'Rivers State', regionGroup: 'ph', hasLiveSession: true, waveLabel: 'Active Wave', deliveryEta: '60-120 mins' },
        { id: 'Choba UniPort Hub, Port Harcourt', name: 'Choba UniPort Hub, Port Harcourt', area: 'Choba / Alakahia / UniPort', street: 'East-West Road, Choba Junction', city: 'Port Harcourt', state: 'Rivers State', regionGroup: 'ph', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },

        // Oyo State (Ibadan) & Other Major Cities
        { id: 'Bodija & UI Hub, Ibadan', name: 'Bodija & UI Hub, Ibadan', area: 'Bodija / Agbowo / UI Gate', street: 'Awolowo Avenue, Old Bodija, Ibadan', city: 'Ibadan', state: 'Oyo State', regionGroup: 'other', hasLiveSession: true, waveLabel: 'Active Wave', deliveryEta: '60-120 mins' },
        { id: 'Ring Road & Challenge Hub, Ibadan', name: 'Ring Road & Challenge Hub, Ibadan', area: 'Ring Road / Oluyole / Challenge', street: 'MKO Abiola Way, Ring Road, Ibadan', city: 'Ibadan', state: 'Oyo State', regionGroup: 'other', hasLiveSession: false, waveLabel: '', deliveryEta: '2-3 hours' },
        { id: 'Independence Layout Hub, Enugu', name: 'Independence Layout Hub, Enugu', area: 'Independence Layout / New Haven', street: 'Bisalla Road, Independence Layout, Enugu', city: 'Enugu', state: 'Enugu State', regionGroup: 'other', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' },
        { id: 'Nassarawa GRA Hub, Kano', name: 'Nassarawa GRA Hub, Kano', area: 'Nassarawa GRA / Tarauni', street: 'Ahmadu Bello Way, Nassarawa GRA, Kano', city: 'Kano', state: 'Kano State', regionGroup: 'other', hasLiveSession: false, waveLabel: '', deliveryEta: '2-4 hours' }
    ];

    // 3-Level Category Taxonomy Hierarchy (category -> subCategory -> subSubCategory)
    const UWANBUY_CATEGORIES = [
        {
            id: 'groceries',
            name: 'Groceries & Foodstuff',
            icon: 'bi-basket2-fill',
            description: 'Parboiled rice, 1k packages, cooking oils, grains and fresh market staples',
            subCategories: [
                {
                    id: 'grains-staples',
                    name: 'Grains & Foodstuff',
                    subSubCategories: [
                        { id: 'packaged-rice', name: 'Parboiled Rice & Grains' },
                        { id: 'yam-tubers', name: 'Fresh Yam & Tubers' },
                        { id: 'beans-flour', name: 'Beans & Flours' }
                    ]
                },
                {
                    id: 'cooking-oils',
                    name: 'Cooking Oils & Condiments',
                    subSubCategories: [
                        { id: 'vegetable-oil', name: 'Pure Vegetable Oils' },
                        { id: 'palm-oil', name: 'Special Palm Oils' }
                    ]
                }
            ]
        },
        {
            id: 'fashion',
            name: 'Fashion & Wears',
            icon: 'bi-person-arms-up',
            description: 'Streetwear, heavyweight hoodies, denim trousers and casual fashion',
            subCategories: [
                {
                    id: 'mens-wear',
                    name: "Men's Wears",
                    subSubCategories: [
                        { id: 'tops', name: 'Tops & Hoodies' },
                        { id: 'trousers', name: 'Jeans & Trousers' },
                        { id: 'footwear', name: 'Sneakers & Shoes' }
                    ]
                },
                {
                    id: 'womens-wear',
                    name: "Women's Wears",
                    subSubCategories: [
                        { id: 'tops', name: 'Blouses & Knitwear' },
                        { id: 'trousers', name: 'Pants & Skirts' }
                    ]
                },
                {
                    id: 'childrens-wear',
                    name: "Children's Wear",
                    subSubCategories: [
                        { id: 'kids-sets', name: 'Casual Sets' }
                    ]
                }
            ]
        },
        {
            id: 'gadgets',
            name: 'Gadgets & Tech',
            icon: 'bi-phone-fill',
            description: 'Smartphones, verified home appliances, cooling & computing devices',
            subCategories: [
                {
                    id: 'smartphones',
                    name: 'Smartphones & Mobile',
                    subSubCategories: [
                        { id: 'android-phones', name: 'Android Smartphones' },
                        { id: 'ios-phones', name: 'Apple iPhones' }
                    ]
                },
                {
                    id: 'appliances',
                    name: 'Home & Kitchen Appliances',
                    subSubCategories: [
                        { id: 'cooling', name: 'Inverter Air Conditioners' },
                        { id: 'cooking-appliances', name: 'Gas Cookers & Boilers' }
                    ]
                },
                {
                    id: 'audio-accessories',
                    name: 'Audio & Tech Accessories',
                    subSubCategories: [
                        { id: 'headphones', name: 'Wireless Headphones' }
                    ]
                }
            ]
        },
        {
            id: 'home',
            name: 'Home Essentials',
            icon: 'bi-house-door-fill',
            description: 'Cookware sets, utensils, living & kitchen accessories',
            subCategories: [
                {
                    id: 'kitchen-dining',
                    name: 'Kitchen & Dining',
                    subSubCategories: [
                        { id: 'cookware-sets', name: 'Non-Stick Cookware Sets' },
                        { id: 'induction-cookers', name: 'Induction Units' }
                    ]
                }
            ]
        }
    ];

    // Active Wave Variant Registry for Wave-Crossover Surprise & Live Auction Deals
    const ACTIVE_WAVE_VARIANTS = {
        'var_rice_50kg': {
            variantId: 'var_rice_50kg',
            baseProductId: 'uw_prd_1001',
            auctionType: 'Flat-Rate Pool',
            auctionTypeSlug: 'flat-rate',
            title: 'Mama Gold 50kg Parboiled Rice Bag',
            originalPrice: 45000,
            wavePrice: 41500,
            discountKobo: 350000,
            timerMinutesLeft: 42,
            moq: 1,
            badge: '⚡ Community Drop',
            description: 'Uniform flat-rate pool allocation. Subsidized direct fulfillment from Tanke Hub.'
        },
        'var_oil_5l': {
            variantId: 'var_oil_5l',
            baseProductId: 'uw_prd_1002',
            auctionType: 'Stock Cap',
            auctionTypeSlug: 'stock-cap',
            title: 'Devon King\'s 5L Pure Vegetable Oil Jerrycan',
            originalPrice: 13500,
            wavePrice: 11800,
            discountKobo: 170000,
            timerMinutesLeft: 28,
            moq: 2,
            badge: '⚡ Stock Drop',
            description: 'Collective volume discount drop. Claim before stock allocation sells out.'
        },
        'var_redmi_8_256_blk': {
            variantId: 'var_redmi_8_256_blk',
            baseProductId: 'uw_prd_3001',
            auctionType: 'Price Wave',
            auctionTypeSlug: 'price-wave',
            title: 'Redmi 13C (8GB/256GB) Midnight Black',
            originalPrice: 135000,
            wavePrice: 122000,
            discountKobo: 1300000,
            timerMinutesLeft: 19,
            moq: 1,
            badge: '⚡ Price Wave',
            description: 'Dropping price wave. Current price locked for immediate payment or 19-minute cart reserve.'
        },
        'var_hoodie_blk_l': {
            variantId: 'var_hoodie_blk_l',
            baseProductId: 'uw_prd_2001',
            auctionType: 'Time Cap',
            auctionTypeSlug: 'time-cap',
            title: 'Heavyweight Streetwear Hoodie - Black / Large',
            originalPrice: 16500,
            wavePrice: 13500,
            discountKobo: 300000,
            timerMinutesLeft: 14,
            moq: 1,
            badge: '⚡ Flash Wave',
            description: 'Strict 14-minute flash deal reserved for Tanke hub shoppers.'
        },
        'var_pot_7pc': {
            variantId: 'var_pot_7pc',
            baseProductId: 'uw_prd_4002',
            auctionType: 'Stock Cap',
            auctionTypeSlug: 'stock-cap',
            title: 'Granite Cookware 7-Piece Family Set',
            originalPrice: 52000,
            wavePrice: 44000,
            discountKobo: 800000,
            timerMinutesLeft: 31,
            moq: 1,
            badge: '⚡ Volume Deal',
            description: 'Wholesale collective stock cap. 84% filled in Tanke Central Zone.'
        },
        'var_ac_15hp': {
            variantId: 'var_ac_15hp',
            baseProductId: 'uw_prd_3002',
            auctionType: 'Price Wave',
            auctionTypeSlug: 'price-wave',
            title: 'Smart Inverter Split AC 1.5HP Copper Core',
            originalPrice: 285000,
            wavePrice: 252000,
            discountKobo: 3300000,
            timerMinutesLeft: 22,
            moq: 1,
            badge: '⚡ Dropping Deal',
            description: 'Verified hardware direct drop. Price scheduled drop with full 2-year warranty.'
        },
        'var_kettle_2l': {
            variantId: 'var_kettle_2l',
            baseProductId: 'uw_prd_3003',
            auctionType: 'Flat-Rate Pool',
            auctionTypeSlug: 'flat-rate',
            title: 'Century 2.0L Fast-Boil Electric Kettle (Silver)',
            originalPrice: 18500,
            wavePrice: 12500,
            discountKobo: 600000,
            timerMinutesLeft: 36,
            moq: 1,
            badge: '⚡ Hub Pool',
            description: 'Uniform flat-rate subsidy. Direct delivery or instant hub pickup.'
        },
        'var_dress_floral_m': {
            variantId: 'var_dress_floral_m',
            baseProductId: 'uw_prd_2003',
            auctionType: 'Time Cap',
            auctionTypeSlug: 'time-cap',
            title: 'Chiffon Floral Wrap Maxi Dress - Navy Floral / M',
            originalPrice: 19500,
            wavePrice: 15200,
            discountKobo: 430000,
            timerMinutesLeft: 18,
            moq: 1,
            badge: '⚡ Flash Deal',
            description: 'Boutique wardrobe flash deal. Limited stock batch from Tanke showroom.'
        }
    };

    // Canonical UwanBuy Product Catalog: BASE PRODUCTS with Derived PRODUCT VARIANTS
    const UWANBUY_PRODUCTS = [
        // 1. Foodstuff / Groceries (Mode A: scrollable variant list on modal left)
        {
            id: 'uw_prd_1001',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Mama Gold Pure Parboiled Rice',
            title: 'Mama Gold Pure Parboiled Rice',
            brand: 'Mama Gold',
            category: 'groceries',
            categoryId: 'groceries',
            categoryName: 'Groceries & Foodstuff',
            subCategory: 'grains-staples',
            subSubCategory: 'packaged-rice',
            image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/egusi-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/egusi-soup-roundbowl.png' }
            ],
            description: 'Stone-free, well-milled long grain parboiled Nigerian rice. Sourced locally according to orders in multiple standard packs.',
            rating: 4.9,
            reviewsCount: 184,
            unitLabel: 'pack / bag',
            modalType: 'groceries_scroll_variants',
            variants: [
                {
                    id: 'var_rice_1kg',
                    name: '1kg Handy Kitchen Pack',
                    sku: 'RIC-1KG-MAMA',
                    price: 1200,
                    priceMinor: 120000,
                    compareAtPrice: 1500,
                    compareAtPriceMinor: 150000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 1,
                    quantityUnit: 'kg',
                    stock: { quantity: 120, status: 'in_stock', moq: 1 },
                    specifications: {
                        packSize: '1kg Sealed Pouch',
                        grainType: 'Long Grain Parboiled',
                        origin: 'Nigeria (Milled in Kwara)',
                        shelfLife: '12 Months'
                    }
                },
                {
                    id: 'var_rice_2kg',
                    name: '2kg Family Meal Pack',
                    sku: 'RIC-2KG-MAMA',
                    price: 2350,
                    priceMinor: 235000,
                    compareAtPrice: 2800,
                    compareAtPriceMinor: 280000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 2,
                    quantityUnit: 'kg',
                    stock: { quantity: 80, status: 'in_stock', moq: 1 },
                    specifications: {
                        packSize: '2kg Seal Bag',
                        grainType: 'Long Grain Parboiled',
                        origin: 'Nigeria',
                        shelfLife: '12 Months'
                    }
                },
                {
                    id: 'var_rice_5kg',
                    name: '5kg Kitchen Bag',
                    sku: 'RIC-5KG-MAMA',
                    price: 5500,
                    priceMinor: 550000,
                    compareAtPrice: 6200,
                    compareAtPriceMinor: 620000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 5,
                    quantityUnit: 'kg',
                    stock: { quantity: 60, status: 'in_stock', moq: 1 },
                    specifications: {
                        packSize: '5kg Handled Bag',
                        grainType: 'Long Grain Parboiled',
                        shelfLife: '18 Months'
                    }
                },
                {
                    id: 'var_rice_10kg',
                    name: '10kg Caterer Bag',
                    sku: 'RIC-10KG-MAMA',
                    price: 10500,
                    priceMinor: 1050000,
                    compareAtPrice: 12000,
                    compareAtPriceMinor: 1200000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 10,
                    quantityUnit: 'kg',
                    stock: { quantity: 35, status: 'in_stock', moq: 1 },
                    specifications: {
                        packSize: '10kg Polypropylene Bag',
                        grainType: 'Long Grain Parboiled',
                        shelfLife: '18 Months'
                    }
                },
                {
                    id: 'var_rice_50kg',
                    name: '50kg Full Wholesale Sack',
                    sku: 'RIC-50KG-MAMA',
                    price: 45000,
                    priceMinor: 4500000,
                    compareAtPrice: 52000,
                    compareAtPriceMinor: 5200000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 50,
                    quantityUnit: 'kg',
                    stock: { quantity: 18, status: 'in_stock', moq: 1 },
                    specifications: {
                        packSize: '50kg Woven Sack',
                        grainType: 'Long Grain Parboiled',
                        shelfLife: '24 Months'
                    }
                }
            ]
        },

        // 2. Groceries: Devon King's Vegetable Oil
        {
            id: 'uw_prd_1002',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Devon King\'s Pure Vegetable Oil',
            title: 'Devon King\'s Pure Vegetable Oil',
            brand: 'Devon King\'s',
            category: 'groceries',
            categoryId: 'groceries',
            categoryName: 'Groceries & Foodstuff',
            subCategory: 'cooking-oils',
            subSubCategory: 'vegetable-oil',
            image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/banga-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/banga-soup-roundbowl.png' }
            ],
            description: 'Triple-refined, cholesterol-free cooking vegetable oil enriched with Vitamin A. Available from 500ml pouch up to 5L family jerrycan.',
            rating: 4.9,
            reviewsCount: 142,
            unitLabel: 'pack / bottle',
            modalType: 'groceries_scroll_variants',
            variants: [
                {
                    id: 'var_oil_500ml',
                    name: '500ml Pillow Pouch',
                    sku: 'OIL-500ML-DK',
                    price: 1500,
                    priceMinor: 150000,
                    compareAtPrice: 1800,
                    compareAtPriceMinor: 180000,
                    image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
                    quantityValue: 0.5,
                    quantityUnit: 'L',
                    stock: { quantity: 150, status: 'in_stock', moq: 1 },
                    specifications: {
                        volume: '500 Millilitres',
                        packaging: 'Tamper-evident Pillow Pouch',
                        vitaminA: 'Fortified'
                    }
                },
                {
                    id: 'var_oil_1l',
                    name: '1 Litre PET Bottle',
                    sku: 'OIL-1L-DK',
                    price: 2900,
                    priceMinor: 290000,
                    compareAtPrice: 3400,
                    compareAtPriceMinor: 340000,
                    image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
                    quantityValue: 1,
                    quantityUnit: 'L',
                    stock: { quantity: 90, status: 'in_stock', moq: 1 },
                    specifications: {
                        volume: '1.0 Litre',
                        packaging: 'Ribbed PET Bottle',
                        vitaminA: 'Fortified'
                    }
                },
                {
                    id: 'var_oil_2l',
                    name: '2 Litres Jerrycan with Handle',
                    sku: 'OIL-2L-DK',
                    price: 5600,
                    priceMinor: 560000,
                    compareAtPrice: 6300,
                    compareAtPriceMinor: 630000,
                    image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
                    quantityValue: 2,
                    quantityUnit: 'L',
                    stock: { quantity: 45, status: 'in_stock', moq: 1 },
                    specifications: {
                        volume: '2.0 Litres',
                        packaging: 'Heavy HDPE Jerrycan',
                        vitaminA: 'Fortified'
                    }
                },
                {
                    id: 'var_oil_5l',
                    name: '5 Litres Master Jerrycan',
                    sku: 'OIL-5L-DK',
                    price: 13500,
                    priceMinor: 1350000,
                    compareAtPrice: 15000,
                    compareAtPriceMinor: 1500000,
                    image: '../assetsecm/images/soups/banga-soup-roundbowl.png',
                    quantityValue: 5,
                    quantityUnit: 'L',
                    stock: { quantity: 24, status: 'in_stock', moq: 1 },
                    specifications: {
                        volume: '5.0 Litres',
                        packaging: 'Reinforced 5L Jerrycan with Security Cap',
                        vitaminA: 'Fortified'
                    }
                }
            ]
        },

        // 3. Groceries: Selected Fresh Yam Tubers
        {
            id: 'uw_prd_1004',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Selected Fresh White Yam Tubers',
            title: 'Selected Fresh White Yam Tubers',
            brand: 'Ipata Farmers Hub',
            category: 'groceries',
            categoryId: 'groceries',
            categoryName: 'Groceries & Foodstuff',
            subCategory: 'grains-staples',
            subSubCategory: 'yam-tubers',
            image: '../assetsecm/images/soups/ogbono-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/ogbono-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/ogbono-soup-roundbowl.png' }
            ],
            description: 'Dry, sweet pounded-yam quality white yam tubers straight from local farm supply associates.',
            rating: 4.8,
            reviewsCount: 76,
            unitLabel: 'tuber / bundle',
            modalType: 'groceries_scroll_variants',
            variants: [
                {
                    id: 'var_yam_single',
                    name: '1 Medium Yam Tuber (~3kg)',
                    sku: 'YAM-1TB-IPATA',
                    price: 1800,
                    priceMinor: 180000,
                    compareAtPrice: 2200,
                    compareAtPriceMinor: 220000,
                    image: '../assetsecm/images/soups/ogbono-soup-roundbowl.png',
                    quantityValue: 1,
                    quantityUnit: 'tuber',
                    stock: { quantity: 40, status: 'in_stock', moq: 1 },
                    specifications: {
                        averageWeight: '2.8kg - 3.2kg',
                        variety: 'White Abuja Yam',
                        condition: 'Dry & Firm'
                    }
                },
                {
                    id: 'var_yam_pack3',
                    name: '3 Tubers Family Bundle',
                    sku: 'YAM-3TB-IPATA',
                    price: 5200,
                    priceMinor: 520000,
                    compareAtPrice: 6200,
                    compareAtPriceMinor: 620000,
                    image: '../assetsecm/images/soups/ogbono-soup-roundbowl.png',
                    quantityValue: 3,
                    quantityUnit: 'tubers',
                    stock: { quantity: 20, status: 'in_stock', moq: 1 },
                    specifications: {
                        bundleCount: '3 Tubers',
                        averageWeight: '9.0kg Total',
                        variety: 'White Yam'
                    }
                },
                {
                    id: 'var_yam_pack5',
                    name: '5 Tubers Wholesale Bundle',
                    sku: 'YAM-5TB-IPATA',
                    price: 8500,
                    priceMinor: 850000,
                    compareAtPrice: 10000,
                    compareAtPriceMinor: 1000000,
                    image: '../assetsecm/images/soups/ogbono-soup-roundbowl.png',
                    quantityValue: 5,
                    quantityUnit: 'tubers',
                    stock: { quantity: 15, status: 'in_stock', moq: 1 },
                    specifications: {
                        bundleCount: '5 Tubers',
                        averageWeight: '15.5kg Total',
                        variety: 'White Yam'
                    }
                }
            ]
        },

        // 4. Fashion & Wears: Men's Tops -> Heavyweight Hoodie (Mode B: Option buttons on right)
        {
            id: 'uw_prd_2001',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Classic Heavyweight Cotton Streetwear Hoodie',
            title: 'Classic Heavyweight Cotton Streetwear Hoodie',
            brand: 'Urban Stitch NG',
            category: 'fashion',
            categoryId: 'fashion',
            categoryName: 'Fashion & Wears',
            subCategory: 'mens-wear',
            subSubCategory: 'tops',
            image: '../assetsecm/images/soups/efo-riro-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/efo-riro-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/efo-riro-roundbowl.png' }
            ],
            description: 'Premium 380 GSM combed cotton fleece hoodie. Pre-shrunk drop-shoulder fit with double-layered hood and kangaroo front pocket.',
            rating: 4.8,
            reviewsCount: 93,
            unitLabel: 'piece',
            modalType: 'attribute_options',
            attributes: [
                { key: 'color', label: 'Color', values: ['Midnight Black', 'Heather Grey', 'Burgundy'] },
                { key: 'size', label: 'Size', values: ['S', 'M', 'L', 'XL'] }
            ],
            variants: [
                {
                    id: 'var_hoodie_blk_s',
                    name: 'Midnight Black - Small (S)',
                    sku: 'HOD-BLK-S',
                    color: 'Midnight Black',
                    size: 'S',
                    price: 15000,
                    priceMinor: 1500000,
                    compareAtPrice: 18000,
                    compareAtPriceMinor: 1800000,
                    stock: { quantity: 12, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                },
                {
                    id: 'var_hoodie_blk_m',
                    name: 'Midnight Black - Medium (M)',
                    sku: 'HOD-BLK-M',
                    color: 'Midnight Black',
                    size: 'M',
                    price: 15500,
                    priceMinor: 1550000,
                    compareAtPrice: 18500,
                    compareAtPriceMinor: 1850000,
                    stock: { quantity: 15, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                },
                {
                    id: 'var_hoodie_blk_l',
                    name: 'Midnight Black - Large (L)',
                    sku: 'HOD-BLK-L',
                    color: 'Midnight Black',
                    size: 'L',
                    price: 16500,
                    priceMinor: 1650000,
                    compareAtPrice: 19500,
                    compareAtPriceMinor: 1950000,
                    stock: { quantity: 18, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                },
                {
                    id: 'var_hoodie_blk_xl',
                    name: 'Midnight Black - Extra Large (XL)',
                    sku: 'HOD-BLK-XL',
                    color: 'Midnight Black',
                    size: 'XL',
                    price: 17500,
                    priceMinor: 1750000,
                    compareAtPrice: 21000,
                    compareAtPriceMinor: 2100000,
                    stock: { quantity: 8, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                },
                {
                    id: 'var_hoodie_gry_m',
                    name: 'Heather Grey - Medium (M)',
                    sku: 'HOD-GRY-M',
                    color: 'Heather Grey',
                    size: 'M',
                    price: 15500,
                    priceMinor: 1550000,
                    compareAtPrice: 18500,
                    compareAtPriceMinor: 1850000,
                    stock: { quantity: 14, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                },
                {
                    id: 'var_hoodie_gry_l',
                    name: 'Heather Grey - Large (L)',
                    sku: 'HOD-GRY-L',
                    color: 'Heather Grey',
                    size: 'L',
                    price: 16500,
                    priceMinor: 1650000,
                    compareAtPrice: 19500,
                    compareAtPriceMinor: 1950000,
                    stock: { quantity: 10, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                },
                {
                    id: 'var_hoodie_bur_l',
                    name: 'Burgundy - Large (L)',
                    sku: 'HOD-BUR-L',
                    color: 'Burgundy',
                    size: 'L',
                    price: 16500,
                    priceMinor: 1650000,
                    compareAtPrice: 19500,
                    compareAtPriceMinor: 1950000,
                    stock: { quantity: 6, status: 'in_stock', moq: 1 },
                    specifications: { material: '100% Combed Cotton', gsm: '380 GSM', fit: 'Relaxed Streetwear Fit' }
                }
            ]
        },

        // 5. Fashion & Wears: Men's Trousers -> Slim Denim Jeans
        {
            id: 'uw_prd_2002',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Slim-Fit Comfort Stretch Denim Jeans',
            title: 'Slim-Fit Comfort Stretch Denim Jeans',
            brand: 'Indigo Crafter',
            category: 'fashion',
            categoryId: 'fashion',
            categoryName: 'Fashion & Wears',
            subCategory: 'mens-wear',
            subSubCategory: 'trousers',
            image: '../assetsecm/images/soups/edikang-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/edikang-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/edikang-soup-roundbowl.png' }
            ],
            description: '12.5oz cotton denim engineered with 2% elastane for unrestricted stretch and shape retention.',
            rating: 4.7,
            reviewsCount: 52,
            unitLabel: 'piece',
            modalType: 'attribute_options',
            attributes: [
                { key: 'color', label: 'Wash', values: ['Deep Indigo', 'Washed Black'] },
                { key: 'size', label: 'Waist Size', values: ['30', '32', '34', '36'] }
            ],
            variants: [
                {
                    id: 'var_jeans_ind_30',
                    name: 'Deep Indigo - Waist 30',
                    sku: 'JNS-IND-30',
                    color: 'Deep Indigo',
                    size: '30',
                    price: 16500,
                    priceMinor: 1650000,
                    compareAtPrice: 19000,
                    compareAtPriceMinor: 1900000,
                    stock: { quantity: 10, status: 'in_stock', moq: 1 },
                    specifications: { fabric: '98% Cotton 2% Elastane', fit: 'Slim Tapered', wash: 'Deep Indigo Raw Wash' }
                },
                {
                    id: 'var_jeans_ind_32',
                    name: 'Deep Indigo - Waist 32',
                    sku: 'JNS-IND-32',
                    color: 'Deep Indigo',
                    size: '32',
                    price: 17000,
                    priceMinor: 1700000,
                    compareAtPrice: 19500,
                    compareAtPriceMinor: 1950000,
                    stock: { quantity: 15, status: 'in_stock', moq: 1 },
                    specifications: { fabric: '98% Cotton 2% Elastane', fit: 'Slim Tapered', wash: 'Deep Indigo Raw Wash' }
                },
                {
                    id: 'var_jeans_ind_34',
                    name: 'Deep Indigo - Waist 34',
                    sku: 'JNS-IND-34',
                    color: 'Deep Indigo',
                    size: '34',
                    price: 17500,
                    priceMinor: 1750000,
                    compareAtPrice: 20000,
                    compareAtPriceMinor: 2000000,
                    stock: { quantity: 14, status: 'in_stock', moq: 1 },
                    specifications: { fabric: '98% Cotton 2% Elastane', fit: 'Slim Tapered', wash: 'Deep Indigo Raw Wash' }
                },
                {
                    id: 'var_jeans_blk_32',
                    name: 'Washed Black - Waist 32',
                    sku: 'JNS-BLK-32',
                    color: 'Washed Black',
                    size: '32',
                    price: 17000,
                    priceMinor: 1700000,
                    compareAtPrice: 19500,
                    compareAtPriceMinor: 1950000,
                    stock: { quantity: 12, status: 'in_stock', moq: 1 },
                    specifications: { fabric: '98% Cotton 2% Elastane', fit: 'Slim Tapered', wash: 'Vintage Washed Black' }
                }
            ]
        },

        // 6. Gadgets & Tech: Redmi 13C Mobile Phone (Mode B)
        {
            id: 'uw_prd_3001',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Redmi 13C 4G Dual SIM Smartphone',
            title: 'Redmi 13C 4G Dual SIM Smartphone',
            brand: 'Xiaomi Redmi',
            category: 'gadgets',
            categoryId: 'gadgets',
            categoryName: 'Gadgets & Tech',
            subCategory: 'smartphones',
            subSubCategory: 'android-phones',
            image: '../assetsecm/images/soups/afang-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/afang-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/afang-soup-roundbowl.png' }
            ],
            description: 'Massive 6.74" 90Hz Dot Drop display with 50MP AI triple camera and 5000mAh battery supporting 18W fast charge.',
            rating: 4.8,
            reviewsCount: 128,
            unitLabel: 'unit',
            modalType: 'attribute_options',
            attributes: [
                { key: 'memoryStorage', label: 'Memory / Storage', values: ['4GB RAM + 128GB', '8GB RAM + 256GB'] },
                { key: 'color', label: 'Color', values: ['Clover Green', 'Midnight Black', 'Glacier White'] }
            ],
            variants: [
                {
                    id: 'var_redmi_4_128_grn',
                    name: '4GB RAM + 128GB Storage - Clover Green',
                    sku: 'RDM-13C-4-128-GRN',
                    memoryStorage: '4GB RAM + 128GB',
                    color: 'Clover Green',
                    price: 115000,
                    priceMinor: 11500000,
                    compareAtPrice: 125000,
                    compareAtPriceMinor: 12500000,
                    stock: { quantity: 18, status: 'in_stock', moq: 1 },
                    specifications: {
                        screenInches: '6.74" 90Hz IPS Display',
                        camera: '50MP AI Main + 2MP Macro',
                        processor: 'MediaTek Helio G85',
                        battery: '5000mAh (18W)',
                        warrantyMonths: 12
                    }
                },
                {
                    id: 'var_redmi_4_128_blk',
                    name: '4GB RAM + 128GB Storage - Midnight Black',
                    sku: 'RDM-13C-4-128-BLK',
                    memoryStorage: '4GB RAM + 128GB',
                    color: 'Midnight Black',
                    price: 115000,
                    priceMinor: 11500000,
                    compareAtPrice: 125000,
                    compareAtPriceMinor: 12500000,
                    stock: { quantity: 22, status: 'in_stock', moq: 1 },
                    specifications: {
                        screenInches: '6.74" 90Hz IPS Display',
                        camera: '50MP AI Main',
                        processor: 'MediaTek Helio G85',
                        battery: '5000mAh',
                        warrantyMonths: 12
                    }
                },
                {
                    id: 'var_redmi_8_256_blk',
                    name: '8GB RAM + 256GB Storage - Midnight Black',
                    sku: 'RDM-13C-8-256-BLK',
                    memoryStorage: '8GB RAM + 256GB',
                    color: 'Midnight Black',
                    price: 135000,
                    priceMinor: 13500000,
                    compareAtPrice: 145000,
                    compareAtPriceMinor: 14500000,
                    stock: { quantity: 14, status: 'in_stock', moq: 1 },
                    specifications: {
                        screenInches: '6.74" 90Hz IPS Display',
                        camera: '50MP AI Main + 2MP Macro',
                        processor: 'MediaTek Helio G85 Turbo',
                        battery: '5000mAh',
                        warrantyMonths: 12
                    }
                },
                {
                    id: 'var_redmi_8_256_blu',
                    name: '8GB RAM + 256GB Storage - Glacier White',
                    sku: 'RDM-13C-8-256-WHT',
                    memoryStorage: '8GB RAM + 256GB',
                    color: 'Glacier White',
                    price: 135000,
                    priceMinor: 13500000,
                    compareAtPrice: 145000,
                    compareAtPriceMinor: 14500000,
                    stock: { quantity: 9, status: 'in_stock', moq: 1 },
                    specifications: {
                        screenInches: '6.74" 90Hz IPS Display',
                        camera: '50MP AI Main',
                        battery: '5000mAh',
                        warrantyMonths: 12
                    }
                }
            ]
        },

        // 7. Gadgets & Appliances: Smart Inverter Air Conditioner (Mode B)
        {
            id: 'uw_prd_3002',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Smart Dual-Inverter Split Air Conditioner',
            title: 'Smart Dual-Inverter Split Air Conditioner',
            brand: 'LG Electronics',
            category: 'gadgets',
            categoryId: 'gadgets',
            categoryName: 'Gadgets & Tech',
            subCategory: 'appliances',
            subSubCategory: 'cooling',
            image: '../assetsecm/images/soups/afang-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/afang-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/afang-soup-roundbowl.png' }
            ],
            description: 'Energy-saving 70% dual inverter cooling compressor with 100% pure copper installation pipe kit and turbo cooling.',
            rating: 4.9,
            reviewsCount: 47,
            unitLabel: 'unit',
            modalType: 'attribute_options',
            attributes: [
                { key: 'horsepower', label: 'Capacity (Horsepower)', values: ['1.0 HP Inverter', '1.5 HP Inverter', '2.0 HP Turbo'] }
            ],
            variants: [
                {
                    id: 'var_ac_1hp',
                    name: '1.0 HP Dual Inverter Pure Copper',
                    sku: 'AC-LG-10HP',
                    horsepower: '1.0 HP Inverter',
                    price: 195000,
                    priceMinor: 19500000,
                    compareAtPrice: 220000,
                    compareAtPriceMinor: 22000000,
                    stock: { quantity: 8, status: 'in_stock', moq: 1 },
                    specifications: { capacity: '1.0 Horsepower', compressor: 'Dual Inverter (10yr warranty)', refrigerant: 'Eco R410A' }
                },
                {
                    id: 'var_ac_15hp',
                    name: '1.5 HP Dual Inverter Pure Copper',
                    sku: 'AC-LG-15HP',
                    horsepower: '1.5 HP Inverter',
                    price: 245000,
                    priceMinor: 24500000,
                    compareAtPrice: 275000,
                    compareAtPriceMinor: 27500000,
                    stock: { quantity: 12, status: 'in_stock', moq: 1 },
                    specifications: { capacity: '1.5 Horsepower', compressor: 'Dual Inverter (10yr warranty)', refrigerant: 'Eco R410A' }
                },
                {
                    id: 'var_ac_2hp',
                    name: '2.0 HP Turbo Inverter Pure Copper',
                    sku: 'AC-LG-20HP',
                    horsepower: '2.0 HP Turbo',
                    price: 315000,
                    priceMinor: 31500000,
                    compareAtPrice: 350000,
                    compareAtPriceMinor: 35000000,
                    stock: { quantity: 6, status: 'in_stock', moq: 1 },
                    specifications: { capacity: '2.0 Horsepower', compressor: 'Dual Inverter Turbo', refrigerant: 'Eco R410A' }
                }
            ]
        },

        // 8. Home Essentials: Stainless Induction Cooker (Single Base Product - No variants)
        {
            id: 'uw_prd_4001',
            isBaseProduct: true,
            hasVariants: false,
            name: 'Double Induction Glass Cooker 2200W',
            title: 'Double Induction Glass Cooker 2200W',
            brand: 'MasterChef Prime',
            category: 'home',
            categoryId: 'home',
            categoryName: 'Home Essentials',
            subCategory: 'kitchen-dining',
            subSubCategory: 'induction-cookers',
            image: 'assets/images/placeholders/gas-cooker.svg',
            media: [
                { url: 'assets/images/placeholders/gas-cooker.svg', thumbnailUrl: 'assets/images/placeholders/gas-cooker.svg' }
            ],
            price: 48000,
            priceMinor: 4800000,
            compareAtPrice: 55000,
            compareAtPriceMinor: 5500000,
            description: 'Ultra-slim dual surface induction cooker with electromagnetic touch sensors, 8 cooking presets, and auto-shutoff security.',
            rating: 4.9,
            reviewsCount: 39,
            unitLabel: 'unit',
            stock: { quantity: 15, status: 'in_stock', moq: 1 },
            specifications: {
                power: '2200 Watts Dual Burner',
                surface: 'Black Microcrystalline Ceramic Glass',
                voltage: '220V - 240V (50Hz)',
                safety: 'Overheat & Auto-Pan Detection Protection'
            },
            variants: []
        },

        // 9. Home Essentials: Non-Stick Granite Cookware Set (Mode B)
        {
            id: 'uw_prd_4002',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Non-Stick Granite Cookware Pots & Pans Set',
            title: 'Non-Stick Granite Cookware Pots & Pans Set',
            brand: 'ChefElite Heritage',
            category: 'home',
            categoryId: 'home',
            categoryName: 'Home Essentials',
            subCategory: 'kitchen-dining',
            subSubCategory: 'cookware-sets',
            image: '../assetsecm/images/soups/bitterleaf-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/bitterleaf-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/bitterleaf-soup-roundbowl.png' }
            ],
            description: 'Heavy gauge forged aluminum cookware coated with natural granite non-stick layer. Compatible with gas, electric, and induction stoves.',
            rating: 4.9,
            reviewsCount: 88,
            unitLabel: 'set',
            modalType: 'attribute_options',
            attributes: [
                { key: 'setTier', label: 'Cookware Set Size', values: ['5-Piece Starter Set', '7-Piece Family Set', '10-Piece Chef Collection'] }
            ],
            variants: [
                {
                    id: 'var_pot_5pc',
                    name: '5-Piece Starter Set (2 Pots + 1 Pan + 2 Lids)',
                    sku: 'POT-SET-5PC',
                    setTier: '5-Piece Starter Set',
                    price: 32000,
                    priceMinor: 3200000,
                    compareAtPrice: 38000,
                    compareAtPriceMinor: 3800000,
                    stock: { quantity: 15, status: 'in_stock', moq: 1 },
                    specifications: { pieces: '5 Pieces', coating: 'Granite Non-Stick', lids: 'Tempered Glass' }
                },
                {
                    id: 'var_pot_7pc',
                    name: '7-Piece Family Set (3 Pots + 1 Pan + 3 Lids)',
                    sku: 'POT-SET-7PC',
                    setTier: '7-Piece Family Set',
                    price: 48000,
                    priceMinor: 4800000,
                    compareAtPrice: 56000,
                    compareAtPriceMinor: 5600000,
                    stock: { quantity: 18, status: 'in_stock', moq: 1 },
                    specifications: { pieces: '7 Pieces', coating: 'Granite Non-Stick', lids: 'Tempered Glass with Steam Vent' }
                },
                {
                    id: 'var_pot_10pc',
                    name: '10-Piece Luxury Chef Collection',
                    sku: 'POT-SET-10PC',
                    setTier: '10-Piece Chef Collection',
                    price: 68000,
                    priceMinor: 6800000,
                    compareAtPrice: 80000,
                    compareAtPriceMinor: 8000000,
                    stock: { quantity: 7, status: 'in_stock', moq: 1 },
                    specifications: { pieces: '10 Pieces Complete', coating: 'Swiss Granite PTFE/PFOA Free', handles: 'Stay-Cool Ergonomic Wood Grain' }
                }
            ]
        },

        // 10. Groceries: Granulated Sugar (Mode A: scrollable variants)
        {
            id: 'uw_prd_1003',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Golden Penny Pure White Granulated Sugar',
            title: 'Golden Penny Pure White Granulated Sugar',
            brand: 'Golden Penny',
            category: 'groceries',
            categoryId: 'groceries',
            categoryName: 'Groceries & Foodstuff',
            subCategory: 'baking-sugar',
            subSubCategory: 'refined-sugar',
            image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
            media: [
                { url: '../assetsecm/images/soups/egusi-soup-roundbowl.png', thumbnailUrl: '../assetsecm/images/soups/egusi-soup-roundbowl.png' }
            ],
            description: 'Pure, quick-dissolving white granulated sugar. Refined to pharmaceutical grade for household baking, tea, and catering.',
            rating: 4.8,
            reviewsCount: 94,
            unitLabel: 'pack / bag',
            modalType: 'groceries_scroll_variants',
            variants: [
                {
                    id: 'var_sugar_1kg',
                    name: '1kg Sachet Pack',
                    sku: 'SUG-1KG-GP',
                    price: 1800,
                    priceMinor: 180000,
                    compareAtPrice: 2100,
                    compareAtPriceMinor: 210000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 1,
                    quantityUnit: 'kg',
                    stock: { quantity: 150, status: 'in_stock', moq: 1 },
                    specifications: { packSize: '1kg Moisture-Proof Sachet', purity: '99.8% Cane Sugar' }
                },
                {
                    id: 'var_sugar_5kg',
                    name: '5kg Handy Family Pack',
                    sku: 'SUG-5KG-GP',
                    price: 8500,
                    priceMinor: 850000,
                    compareAtPrice: 9500,
                    compareAtPriceMinor: 950000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 5,
                    quantityUnit: 'kg',
                    stock: { quantity: 45, status: 'in_stock', moq: 1 },
                    specifications: { packSize: '5kg Woven Bag with Handle', purity: '99.8% Cane Sugar' }
                },
                {
                    id: 'var_sugar_50kg',
                    name: '50kg Commercial Wholesale Bag',
                    sku: 'SUG-50KG-GP',
                    price: 82000,
                    priceMinor: 8200000,
                    compareAtPrice: 88000,
                    compareAtPriceMinor: 8800000,
                    image: '../assetsecm/images/soups/egusi-soup-roundbowl.png',
                    quantityValue: 50,
                    quantityUnit: 'kg',
                    stock: { quantity: 20, status: 'in_stock', moq: 1 },
                    specifications: { packSize: '50kg Commercial Polypropylene Bag', purity: 'Catering Wholesale Grade' }
                }
            ]
        },

        // 11. Fashion: Women's Wear - Floral Chiffon Maxi Dress (Mode B)
        {
            id: 'uw_prd_2003',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Chiffon Floral Tiered Wrap Maxi Dress',
            title: 'Chiffon Floral Tiered Wrap Maxi Dress',
            brand: 'ZaraBella Studio',
            category: 'fashion',
            categoryId: 'fashion',
            categoryName: 'Fashion & Wears',
            subCategory: 'womens-wear',
            subSubCategory: 'dresses',
            image: 'assets/images/placeholders/streetwear-sneakers.svg',
            media: [
                { url: 'assets/images/placeholders/streetwear-sneakers.svg', thumbnailUrl: 'assets/images/placeholders/streetwear-sneakers.svg' }
            ],
            description: 'Breezy lightweight chiffon wrap maxi dress with flowing tiered ruffled hem and adjustable waist tie. Perfect for casual outings and semi-formal events.',
            rating: 4.9,
            reviewsCount: 76,
            unitLabel: 'piece',
            modalType: 'attribute_options',
            attributes: [
                { key: 'size', label: 'Dress Size', values: ['Small (UK 8)', 'Medium (UK 10-12)', 'Large (UK 14)', 'XL (UK 16)'] }
            ],
            variants: [
                {
                    id: 'var_dress_floral_s',
                    name: 'Small (UK 8)',
                    sku: 'DRS-FLR-S',
                    size: 'Small (UK 8)',
                    price: 18500,
                    priceMinor: 1850000,
                    compareAtPrice: 22000,
                    compareAtPriceMinor: 2200000,
                    image: 'assets/images/placeholders/streetwear-sneakers.svg',
                    stock: { quantity: 8, status: 'in_stock', moq: 1 },
                    specifications: { material: 'Chiffon Polyester Blend', length: 'Maxi 54 inches', fit: 'True to Size' }
                },
                {
                    id: 'var_dress_floral_m',
                    name: 'Medium (UK 10-12)',
                    sku: 'DRS-FLR-M',
                    size: 'Medium (UK 10-12)',
                    price: 19500,
                    priceMinor: 1950000,
                    compareAtPrice: 23000,
                    compareAtPriceMinor: 2300000,
                    image: 'assets/images/placeholders/streetwear-sneakers.svg',
                    stock: { quantity: 14, status: 'in_stock', moq: 1 },
                    specifications: { material: 'Chiffon Polyester Blend', length: 'Maxi 55 inches', fit: 'True to Size' }
                },
                {
                    id: 'var_dress_floral_l',
                    name: 'Large (UK 14)',
                    sku: 'DRS-FLR-L',
                    size: 'Large (UK 14)',
                    price: 19500,
                    priceMinor: 1950000,
                    compareAtPrice: 23000,
                    compareAtPriceMinor: 2300000,
                    image: 'assets/images/placeholders/streetwear-sneakers.svg',
                    stock: { quantity: 9, status: 'in_stock', moq: 1 },
                    specifications: { material: 'Chiffon Polyester Blend', length: 'Maxi 56 inches', fit: 'True to Size' }
                }
            ]
        },

        // 12. Fashion: Women's Wear - Oversized Knit Cardigan (Mode B)
        {
            id: 'uw_prd_2004',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Oversized Cashmere-Blend Knit Cardigan',
            title: 'Oversized Cashmere-Blend Knit Cardigan',
            brand: 'UrbanElegance',
            category: 'fashion',
            categoryId: 'fashion',
            categoryName: 'Fashion & Wears',
            subCategory: 'womens-wear',
            subSubCategory: 'knitwear',
            image: 'assets/images/placeholders/streetwear-sneakers.svg',
            media: [
                { url: 'assets/images/placeholders/streetwear-sneakers.svg', thumbnailUrl: 'assets/images/placeholders/streetwear-sneakers.svg' }
            ],
            description: 'Ultra-soft chunky knit cardigan with ribbed cuffs and tortoiseshell buttons. Cosy layering for daily wear.',
            rating: 4.8,
            reviewsCount: 52,
            unitLabel: 'piece',
            modalType: 'attribute_options',
            attributes: [
                { key: 'color', label: 'Color Shade', values: ['Warm Cream', 'Charcoal Grey', 'Olive Moss'] }
            ],
            variants: [
                {
                    id: 'var_cardigan_crm',
                    name: 'Warm Cream',
                    sku: 'CRD-KNT-CRM',
                    color: 'Warm Cream',
                    price: 15500,
                    priceMinor: 1550000,
                    compareAtPrice: 19000,
                    compareAtPriceMinor: 1900000,
                    image: 'assets/images/placeholders/streetwear-sneakers.svg',
                    stock: { quantity: 11, status: 'in_stock', moq: 1 },
                    specifications: { knitGauge: 'Chunky 7-Gauge', material: 'Cashmere-Cotton Blend', care: 'Machine Wash Delicate' }
                },
                {
                    id: 'var_cardigan_gry',
                    name: 'Charcoal Grey',
                    sku: 'CRD-KNT-GRY',
                    color: 'Charcoal Grey',
                    price: 15500,
                    priceMinor: 1550000,
                    compareAtPrice: 19000,
                    compareAtPriceMinor: 1900000,
                    image: 'assets/images/placeholders/streetwear-sneakers.svg',
                    stock: { quantity: 8, status: 'in_stock', moq: 1 },
                    specifications: { knitGauge: 'Chunky 7-Gauge', material: 'Cashmere-Cotton Blend', care: 'Machine Wash Delicate' }
                }
            ]
        },

        // 13. Gadgets: Electric Kettle (Mode B)
        {
            id: 'uw_prd_3003',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Century 2.0L Fast-Boil Stainless Electric Kettle',
            title: 'Century 2.0L Fast-Boil Stainless Electric Kettle',
            brand: 'Century Home',
            category: 'gadgets',
            categoryId: 'gadgets',
            categoryName: 'Gadgets & Tech',
            subCategory: 'appliances',
            subSubCategory: 'cooking-appliances',
            image: 'assets/images/placeholders/water-boiler.svg',
            media: [
                { url: 'assets/images/placeholders/water-boiler.svg', thumbnailUrl: 'assets/images/placeholders/water-boiler.svg' }
            ],
            description: 'Food grade SUS304 stainless steel electric kettle with 1800W rapid boiling technology, 360-degree cordless swivel base, and auto shut-off.',
            rating: 4.8,
            reviewsCount: 112,
            unitLabel: 'unit',
            modalType: 'attribute_options',
            attributes: [
                { key: 'capacity', label: 'Kettle Capacity', values: ['2.0 Liters (Standard)', '2.5 Liters (Large Family)'] }
            ],
            variants: [
                {
                    id: 'var_kettle_2l',
                    name: '2.0 Liters (Standard)',
                    sku: 'KET-2L-SS',
                    capacity: '2.0 Liters (Standard)',
                    price: 14500,
                    priceMinor: 1450000,
                    compareAtPrice: 18500,
                    compareAtPriceMinor: 1850000,
                    image: 'assets/images/placeholders/water-boiler.svg',
                    stock: { quantity: 24, status: 'in_stock', moq: 1 },
                    specifications: { power: '1800W', body: 'SUS304 Stainless Steel', safety: 'Boil-Dry Protection & Auto-Off' }
                },
                {
                    id: 'var_kettle_2_5l',
                    name: '2.5 Liters (Large Family)',
                    sku: 'KET-25L-SS',
                    capacity: '2.5 Liters (Large Family)',
                    price: 17500,
                    priceMinor: 1750000,
                    compareAtPrice: 22000,
                    compareAtPriceMinor: 2200000,
                    image: 'assets/images/placeholders/water-boiler.svg',
                    stock: { quantity: 15, status: 'in_stock', moq: 1 },
                    specifications: { power: '2000W', body: 'SUS304 Stainless Steel', safety: 'Boil-Dry Protection & Auto-Off' }
                }
            ]
        },

        // 14. Gadgets: Blender with Grinder (Mode B)
        {
            id: 'uw_prd_3004',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Binatone 1.5L Blender with Dry Mill Grinder',
            title: 'Binatone 1.5L Blender with Dry Mill Grinder',
            brand: 'Binatone Electronics',
            category: 'gadgets',
            categoryId: 'gadgets',
            categoryName: 'Gadgets & Tech',
            subCategory: 'appliances',
            subSubCategory: 'cooking-appliances',
            image: 'assets/images/placeholders/blender.svg',
            media: [
                { url: 'assets/images/placeholders/blender.svg', thumbnailUrl: 'assets/images/placeholders/blender.svg' }
            ],
            description: '450W pure copper motor blender with stainless steel ice-crushing blades and dedicated dry spice/coffee grinder cup.',
            rating: 4.9,
            reviewsCount: 84,
            unitLabel: 'unit',
            modalType: 'attribute_options',
            attributes: [
                { key: 'jarMaterial', label: 'Blending Jar Material', values: ['Unbreakable Polycarbonate', 'Heavy Duty Glass'] }
            ],
            variants: [
                {
                    id: 'var_blender_poly',
                    name: 'Unbreakable Polycarbonate',
                    sku: 'BLN-POLY-15',
                    jarMaterial: 'Unbreakable Polycarbonate',
                    price: 24500,
                    priceMinor: 2450000,
                    compareAtPrice: 28500,
                    compareAtPriceMinor: 2850000,
                    image: 'assets/images/placeholders/blender.svg',
                    stock: { quantity: 18, status: 'in_stock', moq: 1 },
                    specifications: { motor: '450W Pure Copper', speeds: '2 Speeds + Pulse', jar: '1.5L BPA-Free Polycarbonate' }
                },
                {
                    id: 'var_blender_glass',
                    name: 'Heavy Duty Glass',
                    sku: 'BLN-GLS-15',
                    jarMaterial: 'Heavy Duty Glass',
                    price: 29500,
                    priceMinor: 2950000,
                    compareAtPrice: 34000,
                    compareAtPriceMinor: 3400000,
                    image: 'assets/images/placeholders/blender.svg',
                    stock: { quantity: 10, status: 'in_stock', moq: 1 },
                    specifications: { motor: '500W Pure Copper', speeds: '2 Speeds + Pulse', jar: '1.5L Thermal Shock Proof Glass' }
                }
            ]
        },

        // 15. Home: Heavy-Duty Voltage Stabilizer (Mode B)
        {
            id: 'uw_prd_4003',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Heavy-Duty 3.5kVA Pure Copper Voltage Stabilizer',
            title: 'Heavy-Duty 3.5kVA Pure Copper Voltage Stabilizer',
            brand: 'Century Power Systems',
            category: 'home',
            categoryId: 'home',
            categoryName: 'Home Essentials',
            subCategory: 'appliances',
            subSubCategory: 'electrical-power',
            image: 'assets/images/placeholders/voltage-stabilizer.svg',
            media: [
                { url: 'assets/images/placeholders/voltage-stabilizer.svg', thumbnailUrl: 'assets/images/placeholders/voltage-stabilizer.svg' }
            ],
            description: 'Rugged automatic servo voltage regulator for refrigerators, deep freezers, and sensitive AC units with input range 100V - 260V.',
            rating: 4.9,
            reviewsCount: 65,
            unitLabel: 'unit',
            modalType: 'attribute_options',
            attributes: [
                { key: 'powerRating', label: 'Power Rating Capacity', values: ['3.5kVA Relay Type', '5.0kVA Servo Motor'] }
            ],
            variants: [
                {
                    id: 'var_stab_35kva',
                    name: '3.5kVA Relay Type',
                    sku: 'STB-35KVA-RLY',
                    powerRating: '3.5kVA Relay Type',
                    price: 42000,
                    priceMinor: 4200000,
                    compareAtPrice: 48000,
                    compareAtPriceMinor: 4800000,
                    image: 'assets/images/placeholders/voltage-stabilizer.svg',
                    stock: { quantity: 14, status: 'in_stock', moq: 1 },
                    specifications: { capacity: '3500 Watts Max', inputVoltage: '100V - 260V AC', outputVoltage: '220V +/- 8%' }
                },
                {
                    id: 'var_stab_5kva',
                    name: '5.0kVA Servo Motor',
                    sku: 'STB-50KVA-SRV',
                    powerRating: '5.0kVA Servo Motor',
                    price: 68000,
                    priceMinor: 6800000,
                    compareAtPrice: 76000,
                    compareAtPriceMinor: 7600000,
                    image: 'assets/images/placeholders/voltage-stabilizer.svg',
                    stock: { quantity: 8, status: 'in_stock', moq: 1 },
                    specifications: { capacity: '5000 Watts Max', inputVoltage: '95V - 270V AC', outputVoltage: '220V +/- 3% High Precision' }
                }
            ]
        },

        // Home Essentials: Cookers & Living -> Scanfrost 4-Burner Cooker
        {
            id: 'uw_prd_4004',
            isBaseProduct: true,
            hasVariants: true,
            name: 'Scanfrost 4-Burner Stainless Steel Tabletop Gas Cooker',
            title: 'Scanfrost 4-Burner Stainless Steel Tabletop Gas Cooker',
            brand: 'Scanfrost',
            category: 'home',
            categoryId: 'home',
            categoryName: 'Home Essentials',
            subCategory: 'appliances',
            subSubCategory: 'cookers',
            image: 'assets/images/placeholders/gas-cooker.svg',
            media: [
                { url: 'assets/images/placeholders/gas-cooker.svg', thumbnailUrl: 'assets/images/placeholders/gas-cooker.svg' }
            ],
            description: 'Heavy-gauge stainless steel tabletop cooker with high-efficiency blue flame brass burners and auto-ignition push knob.',
            rating: 4.8,
            reviewsCount: 47,
            unitLabel: 'unit',
            modalType: 'attribute_options',
            attributes: [
                { key: 'finish', label: 'Exterior Finish', values: ['Polished Stainless Steel', 'Matte Black Coated'] }
            ],
            variants: [
                {
                    id: 'var_cooker_ss',
                    name: 'Polished Stainless Steel (Silver)',
                    sku: 'SCN-4B-SS',
                    finish: 'Polished Stainless Steel',
                    price: 48500,
                    priceMinor: 4850000,
                    compareAtPrice: 58000,
                    compareAtPriceMinor: 5800000,
                    image: 'assets/images/placeholders/gas-cooker.svg',
                    stock: { quantity: 12, status: 'in_stock', moq: 1 },
                    specifications: { burners: '4 Heavy Duty Brass Burners', material: 'Anti-Rust Mirror Stainless Steel', ignition: 'Piezo Auto Push Spark' }
                },
                {
                    id: 'var_cooker_blk',
                    name: 'Matte Black Coated Edition',
                    sku: 'SCN-4B-BLK',
                    finish: 'Matte Black Coated',
                    price: 52000,
                    priceMinor: 5200000,
                    compareAtPrice: 62000,
                    compareAtPriceMinor: 6200000,
                    image: 'assets/images/placeholders/gas-cooker.svg',
                    stock: { quantity: 9, status: 'in_stock', moq: 1 },
                    specifications: { burners: '4 Heavy Duty Brass Burners', material: 'Heat-Resistant Powder Matte Black', ignition: 'Piezo Auto Push Spark' }
                }
            ]
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
        document.querySelectorAll('.storefront-current-location, #navLocationText, #nav-location-label, #currentLocationLabel, #abCornerHubLabel, #modalCurrentHubBadge').forEach(el => {
            el.textContent = currentLoc;
        });
        const activeHubObj = AVAILABLE_HUBS.find(h => h.id.toLowerCase() === currentLoc.toLowerCase());
        document.querySelectorAll('#abCornerWaveDot').forEach(el => {
            if (activeHubObj && activeHubObj.hasLiveSession) {
                el.classList.add('is-live');
            } else {
                el.classList.remove('is-live');
            }
        });
    }

    function filterHubs(query = '', regionFilter = 'all') {
        const q = String(query || '').trim().toLowerCase();
        const rf = String(regionFilter || 'all').trim().toLowerCase();

        return AVAILABLE_HUBS.filter(hub => {
            if (rf === 'live' && !hub.hasLiveSession) return false;
            if (rf !== 'all' && rf !== 'live') {
                const groupMatch = (hub.regionGroup || '').toLowerCase() === rf ||
                    (hub.city || '').toLowerCase().includes(rf) ||
                    (hub.state || '').toLowerCase().includes(rf);
                if (!groupMatch) return false;
            }
            if (!q) return true;
            const haystack = [
                hub.id,
                hub.name,
                hub.area || '',
                hub.street || '',
                hub.city || '',
                hub.state || ''
            ].join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }

    let currentHubSearchQuery = '';
    let currentHubRegionFilter = 'all';

    function buildHubItemHtml(hub, currentLoc) {
        const isSelected = hub.id.toLowerCase() === String(currentLoc || '').toLowerCase();
        const statusHtml = hub.hasLiveSession
            ? `<span class="text-success fw-bold"><i class="bi bi-broadcast-pin me-1"></i>Live Session Running</span>`
            : `<span>Normal Fulfillment (${hub.deliveryEta || '2-4 hrs'})</span>`;
        const rightBadgeHtml = hub.hasLiveSession
            ? `<span class="badge bg-danger rounded-pill text-nowrap">${hub.waveLabel || 'Active Wave'}</span>`
            : `<span class="badge bg-light text-secondary border rounded-pill text-nowrap">${hub.city}</span>`;

        return `
            <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 hub-select-item ${isSelected ? 'active-hub-selected' : ''}" data-hub="${hub.id}">
                <div class="pe-2 text-start">
                    <div class="d-flex align-items-center flex-wrap gap-2">
                        <span class="fw-bold text-dark">${hub.name}</span>
                        ${isSelected ? '<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill text-xs"><i class="bi bi-check-circle-fill me-1"></i>Selected</span>' : ''}
                    </div>
                    <small class="text-muted d-block mt-1">
                        <i class="bi bi-signpost-split me-1"></i>${hub.street || hub.area || hub.city} • ${statusHtml}
                    </small>
                </div>
                <div class="d-flex align-items-center gap-2 flex-shrink-0">
                    ${rightBadgeHtml}
                    <i class="bi ${isSelected ? 'bi-check2-circle text-success fs-5' : 'bi-chevron-right text-muted'}"></i>
                </div>
            </button>
        `;
    }

    function renderHubListItems() {
        if (typeof document === 'undefined' || !document.getElementById) return;
        const listEl = document.getElementById('hubsListGroup');
        if (!listEl) return;

        const currentLoc = getLocation();
        const matches = filterHubs(currentHubSearchQuery, currentHubRegionFilter);
        const countBadge = document.getElementById('hubSearchCountBadge');
        if (countBadge) {
            countBadge.textContent = `Showing ${matches.length} of ${AVAILABLE_HUBS.length} hubs`;
        }

        if (matches.length === 0) {
            const escapedQuery = String(currentHubSearchQuery || '').replace(/[<>"'&]/g, '');
            listEl.innerHTML = `
                <div class="text-center p-4 bg-light rounded-3 border">
                    <i class="bi bi-geo-alt text-muted fs-2 d-block mb-2"></i>
                    <h6 class="fw-bold text-dark mb-1">No matching hub found for "${escapedQuery}"</h6>
                    <p class="text-muted small mb-0">Try searching another neighborhood, street, city, or state filter above.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = matches.map(h => buildHubItemHtml(h, currentLoc)).join('');
    }

    function enhanceLocationSwitcherModal() {
        if (typeof document === 'undefined' || !document.getElementById) return;
        const modalEl = document.getElementById('modal-location-switcher');
        if (!modalEl) return;

        // Look for the content wrapper inside #modal-location-switcher (Wait until iziModal or DOM is ready)
        const contentWrap = modalEl.querySelector('.iziModal-content > .p-4') || modalEl.querySelector('.p-4') || modalEl;
        if (!contentWrap) return;

        // If not yet upgraded with #hubSearchInput, inject the full searchable area switcher UI
        if (!modalEl.querySelector('#hubSearchInput')) {
            const currentLoc = getLocation();
            contentWrap.innerHTML = `
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-geo-alt-fill text-danger me-2"></i>Select Your Shopping Hub</h5>
                    <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 small">
                        <i class="bi bi-pin-map-fill me-1"></i>Current: <strong id="modalCurrentHubBadge">${currentLoc}</strong>
                    </span>
                </div>
                <p class="text-muted small mb-3">Search by neighborhood, street, city, or state to see real-time inventory and live wave sessions in your area.</p>

                <!-- Search Input Bar -->
                <div class="input-group mb-2 shadow-xs">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" id="hubSearchInput" class="form-control border-start-0 ps-0" placeholder="Search area, street, city or state (e.g. Tanke, Lekki, Wuse, Bodija)..." autocomplete="off">
                    <button class="btn btn-outline-secondary d-none" type="button" id="btnClearHubSearch" title="Clear search"><i class="bi bi-x-lg"></i></button>
                </div>

                <!-- Region / Live Wave Filter Pills -->
                <div class="d-flex flex-wrap align-items-center gap-1 mb-2" id="hubRegionFilterBar">
                    <button type="button" class="btn btn-xs hub-filter-pill active" data-region="all">All Areas (${AVAILABLE_HUBS.length})</button>
                    <button type="button" class="btn btn-xs hub-filter-pill" data-region="live"><i class="bi bi-lightning-charge-fill text-danger me-1"></i>Active Wave</button>
                    <button type="button" class="btn btn-xs hub-filter-pill" data-region="ilorin">Ilorin / Kwara</button>
                    <button type="button" class="btn btn-xs hub-filter-pill" data-region="lagos">Lagos</button>
                    <button type="button" class="btn btn-xs hub-filter-pill" data-region="abuja">Abuja</button>
                    <button type="button" class="btn btn-xs hub-filter-pill" data-region="ph">Port Harcourt</button>
                    <button type="button" class="btn btn-xs hub-filter-pill" data-region="other">Ibadan / Enugu / Kano</button>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted fw-semibold" id="hubSearchCountBadge">Showing ${AVAILABLE_HUBS.length} of ${AVAILABLE_HUBS.length} hubs</small>
                </div>

                <!-- Scrollable Hubs List -->
                <div class="list-group mb-0 hub-scrollable-list" id="hubsListGroup"></div>
            `;
        }

        renderHubListItems();
    }

    function populateRegistrationHubSelects() {
        if (typeof document === 'undefined' || !document.querySelectorAll) return;
        const currentLoc = getLocation();
        document.querySelectorAll('#reg-hub').forEach(selectEl => {
            if (!selectEl || selectEl.dataset.hubsPopulated === 'true') return;
            selectEl.innerHTML = AVAILABLE_HUBS.map(h => {
                const sel = h.id === currentLoc ? 'selected' : '';
                const liveTag = h.hasLiveSession ? ' (⚡ Active Wave)' : '';
                return `<option value="${h.id}" ${sel}>${h.name} — ${h.state}${liveTag}</option>`;
            }).join('');
            selectEl.dataset.hubsPopulated = 'true';
        });
    }

    function injectStorefrontStyles() {
        if (typeof document === 'undefined' || !document.head || typeof document.createElement !== 'function') return;
        if (document.getElementById('ab-storefront-core-styles')) return;

        const styleEl = document.createElement('style');
        styleEl.id = 'ab-storefront-core-styles';
        styleEl.textContent = `
            /* ==========================================================================
               1. DESKTOP & TABLET NAVIGATION FIXES (NO MULTI-LINE WRAPPING)
               ========================================================================== */
            .navbar .navbar-brand {
                flex-shrink: 0 !important;
                white-space: nowrap !important;
            }
            .navbar-nav .nav-link,
            .navbar .dropdown-toggle,
            .navbar .btn,
            .navbar .nav-pill-btn,
            .navbar .btn-wallet-badge,
            #btnNavWallet,
            #nav-wallet,
            #nav-cart,
            #openWalletBtn {
                white-space: nowrap !important;
                flex-shrink: 0 !important;
            }
            .navbar button[data-bs-target="#cartOffcanvas"],
            .navbar #btn-login-trigger,
            .navbar #btn-register-trigger {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                white-space: nowrap !important;
                flex-shrink: 0 !important;
                line-height: 1.2 !important;
            }
            /* Desktop lg (992px - 1199px): compact spacing so all nav items & utilities fit on 1 row */
            @media (min-width: 992px) and (max-width: 1199.98px) {
                .navbar > .container {
                    max-width: 100% !important;
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                    flex-wrap: nowrap !important;
                }
                .navbar .navbar-brand {
                    margin-right: 0.5rem !important;
                }
                .navbar .navbar-brand img {
                    height: 30px !important;
                    width: auto !important;
                }
                .navbar .navbar-collapse {
                    flex-wrap: nowrap !important;
                }
                .navbar .navbar-nav {
                    margin-left: 0.4rem !important;
                    margin-right: auto !important;
                    flex-wrap: nowrap !important;
                    gap: 0.1rem !important;
                }
                .navbar .navbar-nav .nav-link {
                    padding-left: 0.45rem !important;
                    padding-right: 0.45rem !important;
                    font-size: 0.82rem !important;
                }
                #btnNavWallet,
                .navbar .btn-wallet-badge,
                .navbar .nav-pill-btn {
                    padding: 0.35rem 0.65rem !important;
                    font-size: 0.8rem !important;
                }
                .navbar .btn {
                    padding: 0.35rem 0.65rem !important;
                    font-size: 0.8rem !important;
                }
            }
            /* Desktop xl (1200px - 1399px): balanced single-row spacing */
            @media (min-width: 1200px) and (max-width: 1399.98px) {
                .navbar .navbar-nav {
                    margin-left: 0.75rem !important;
                    flex-wrap: nowrap !important;
                }
                .navbar .navbar-nav .nav-link {
                    padding-left: 0.6rem !important;
                    padding-right: 0.6rem !important;
                    font-size: 0.88rem !important;
                }
                #btnNavWallet,
                .navbar .btn-wallet-badge,
                .navbar .nav-pill-btn {
                    padding: 0.4rem 0.8rem !important;
                    font-size: 0.85rem !important;
                }
            }
            /* Tablet & Mobile (< 992px): structured card drawer & clean 2-column tablet nav */
            @media (max-width: 991.98px) {
                .navbar .navbar-collapse {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 0.9rem 1rem;
                    margin-top: 0.65rem;
                    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
                }
                @media (min-width: 576px) and (max-width: 991.98px) {
                    .navbar .navbar-nav {
                        display: grid !important;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 0.25rem 0.75rem;
                        margin-bottom: 0.75rem !important;
                    }
                }
                .navbar .navbar-collapse > .d-flex {
                    flex-wrap: wrap !important;
                    justify-content: flex-start !important;
                    padding-top: 0.65rem;
                    border-top: 1px solid #f1f5f9;
                    gap: 0.5rem !important;
                }
            }

            /* ==========================================================================
               2. SEARCHABLE LOCATION SWITCHER MODAL STYLES
               ========================================================================== */
            .hub-scrollable-list {
                max-height: 310px;
                overflow-y: auto;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
            }
            .hub-scrollable-list .hub-select-item {
                border-left: none;
                border-right: none;
                transition: background-color 0.15s ease;
            }
            .hub-scrollable-list .hub-select-item:first-child {
                border-top: none;
            }
            .hub-scrollable-list .hub-select-item:last-child {
                border-bottom: none;
            }
            .hub-scrollable-list .hub-select-item.active-hub-selected {
                background-color: #f0fdf4;
                border-left: 4px solid #16a34a !important;
            }
            .hub-filter-pill {
                font-size: 0.75rem;
                font-weight: 600;
                padding: 4px 10px;
                border-radius: 50px;
                border: 1px solid #cbd5e1;
                background: #f8fafc;
                color: #475569;
                transition: all 0.18s ease;
            }
            .hub-filter-pill:hover {
                border-color: #0f172a;
                color: #0f172a;
            }
            .hub-filter-pill.active {
                background: #0f172a;
                color: #ffffff;
                border-color: #0f172a;
            }

            /* Hide legacy top sub-nav bar completely */
            .top-hyperlocal-bar {
                display: none !important;
            }

            /* ==========================================================================
               3. BOTTOM-CORNER FLOATING WIDGETS (LEFT & RIGHT DOCKS)
               ========================================================================== */
            .ab-corner-dock-left {
                position: fixed;
                bottom: 18px;
                left: 18px;
                z-index: 1035;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .ab-corner-dock-right {
                position: fixed;
                bottom: 18px;
                right: 18px;
                z-index: 1035;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 8px;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .ab-corner-drawer {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                box-shadow: 0 18px 38px rgba(15, 23, 42, 0.18);
                padding: 12px;
                width: 265px;
                display: none;
                animation: abSlideUpFade 0.2s ease-out;
            }
            .ab-corner-drawer.open {
                display: block;
            }
            @keyframes abSlideUpFade {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .ab-corner-action-btn {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                text-align: left;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 8px 10px;
                margin-bottom: 6px;
                font-size: 0.8rem;
                font-weight: 600;
                color: #1e293b;
                text-decoration: none;
                transition: all 0.18s ease;
                cursor: pointer;
            }
            .ab-corner-action-btn:last-child {
                margin-bottom: 0;
            }
            .ab-corner-action-btn:hover {
                background: #fff1f2;
                border-color: #fecdd3;
                color: #be123c;
                transform: translateX(2px);
            }
            .ab-corner-action-icon {
                width: 30px;
                height: 30px;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 0.95rem;
            }
            .ab-corner-pill-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #0f172a;
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 50px;
                padding: 9px 15px;
                font-size: 0.82rem;
                font-weight: 700;
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            }
            .ab-corner-pill-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 14px 28px rgba(15, 23, 42, 0.3);
            }
            .ab-live-dot {
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #94a3b8;
                display: inline-block;
            }
            .ab-live-dot.is-live {
                background: #22c55e;
                box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.25);
            }
            /* Right Corner Storefronts & Auctions Floating Widget */
            .ab-storefronts-widget-card {
                background: rgba(15, 23, 42, 0.96);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.14);
                border-radius: 16px;
                padding: 8px;
                box-shadow: 0 14px 32px rgba(15, 23, 42, 0.28);
                display: flex;
                flex-direction: column;
                gap: 6px;
                min-width: 195px;
            }
            .ab-storefronts-widget-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2px 6px 4px 6px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 0.68rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #94a3b8;
            }
            .ab-storefront-chip-link {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding: 7px 11px;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 700;
                text-decoration: none !important;
                transition: all 0.18s ease;
                white-space: nowrap;
            }
            .ab-storefront-chip-link.chip-auctions {
                background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
                color: #ffffff !important;
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            }
            .ab-storefront-chip-link.chip-thriftz {
                background: rgba(255, 255, 255, 0.09);
                color: #f8fafc !important;
                border: 1px solid rgba(78, 248, 150, 0.25);
            }
            .ab-storefront-chip-link.chip-thriftz:hover {
                background: #0a6810;
                color: #ffffff !important;
                border-color: #4ef896;
            }
            .ab-storefront-chip-link.chip-betasup {
                background: rgba(255, 255, 255, 0.09);
                color: #f8fafc !important;
                border: 1px solid rgba(255, 140, 0, 0.3);
            }
            .ab-storefront-chip-link.chip-betasup:hover {
                background: #ea580c;
                color: #ffffff !important;
                border-color: #fdba74;
            }
            .ab-storefront-chip-link.chip-uwanbuy {
                background: rgba(255, 255, 255, 0.09);
                color: #f8fafc !important;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            .ab-storefront-chip-link.chip-uwanbuy:hover {
                background: #dc2626;
                color: #ffffff !important;
            }
            .ab-storefront-chip-link:hover {
                transform: translateX(-2px);
            }
            .ab-scroll-top-fab {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: #ffffff;
                color: #0f172a;
                border: 1px solid #cbd5e1;
                box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .ab-scroll-top-fab:hover {
                background: #0f172a;
                color: #ffffff;
                transform: translateY(-2px);
            }
            @media (max-width: 575.98px) {
                .ab-corner-dock-left {
                    bottom: 12px;
                    left: 12px;
                }
                .ab-corner-dock-right {
                    bottom: 12px;
                    right: 12px;
                }
                .ab-corner-pill-btn {
                    padding: 8px 12px;
                    font-size: 0.76rem;
                }
                .ab-storefronts-widget-card {
                    min-width: 170px;
                    padding: 6px;
                }
                .ab-storefront-chip-link {
                    padding: 6px 9px;
                    font-size: 0.74rem;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }

    function resolveStorefrontWidgetLinks() {
        const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname)
            ? window.location.pathname.replace(/\\/g, '/').toLowerCase()
            : '';
        const isInAuctionsSubdir = pathname.includes('/auctions/');
        const storeName = detectStoreName();

        if (isInAuctionsSubdir) {
            return {
                storeName,
                uwanbuyHref: '../index.html',
                thriftzHref: '../../thriftz/index.html',
                betasupHref: '../../betasup/index.html',
                auctionsHref: 'index.html'
            };
        }
        if (storeName === 'thriftz' || storeName === 'betasup') {
            return {
                storeName,
                uwanbuyHref: '../uwanbuy/index.html',
                thriftzHref: '../thriftz/index.html',
                betasupHref: '../betasup/index.html',
                auctionsHref: '#auctionArenaSection'
            };
        }
        return {
            storeName,
            uwanbuyHref: 'index.html',
            thriftzHref: '../thriftz/index.html',
            betasupHref: '../betasup/index.html',
            auctionsHref: 'auctions/index.html'
        };
    }

    function injectBottomCornerWidgets() {
        if (typeof document === 'undefined' || !document.body || typeof document.createElement !== 'function') return;
        if (document.getElementById('ab-corner-widget-left')) return;

        const currentLoc = getLocation();
        const activeHubObj = AVAILABLE_HUBS.find(h => h.id.toLowerCase() === currentLoc.toLowerCase());
        const isLive = activeHubObj && activeHubObj.hasLiveSession;
        const links = resolveStorefrontWidgetLinks();

        // Bottom-Left Widget: Hyperlocal Hub Location Selector & Support Concierge (NO Include My Area)
        const leftDock = document.createElement('div');
        leftDock.id = 'ab-corner-widget-left';
        leftDock.className = 'ab-corner-dock-left';
        leftDock.innerHTML = `
            <div class="ab-corner-drawer" id="abCornerLeftDrawer">
                <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                        <span class="text-xs fw-bold text-uppercase text-danger d-block">Hyperlocal Hub & Help</span>
                        <strong class="small text-dark storefront-current-location">${currentLoc}</strong>
                    </div>
                    <button type="button" class="btn-close small" id="btnCloseCornerDrawer" style="font-size: 0.65rem;"></button>
                </div>
                <button type="button" class="ab-corner-action-btn" id="btnCornerSwitchHub">
                    <span class="ab-corner-action-icon bg-danger-subtle text-danger"><i class="bi bi-geo-alt-fill"></i></span>
                    <div>
                        <div>Switch Shopping Hub</div>
                        <small class="text-muted fw-normal d-block" style="font-size: 0.7rem;">Search ${AVAILABLE_HUBS.length} available areas</small>
                    </div>
                </button>
                <button type="button" class="ab-corner-action-btn trigger-addMine">
                    <span class="ab-corner-action-icon bg-warning-subtle text-warning-emphasis"><i class="bi bi-heart-fill"></i></span>
                    <div>
                        <div>Add My Favorite</div>
                        <small class="text-muted fw-normal d-block" style="font-size: 0.7rem;">Suggest an item or soup pot</small>
                    </div>
                </button>
                <button type="button" class="ab-corner-action-btn trigger-askQ">
                    <span class="ab-corner-action-icon bg-success-subtle text-success"><i class="bi bi-chat-dots-fill"></i></span>
                    <div>
                        <div>I Have A Question</div>
                        <small class="text-muted fw-normal d-block" style="font-size: 0.7rem;">Ask hub support or local agent</small>
                    </div>
                </button>
            </div>
            <div class="d-flex align-items-center gap-1">
                <button type="button" class="ab-corner-pill-btn" id="btnChangeLocation" title="Click to search and switch your Hyperlocal Hub">
                    <span class="ab-live-dot ${isLive ? 'is-live' : ''}" id="abCornerWaveDot"></span>
                    <i class="bi bi-geo-alt-fill text-danger"></i>
                    <span id="currentLocationLabel" class="storefront-current-location">${currentLoc}</span>
                    <i class="bi bi-chevron-up ms-1 text-white-50"></i>
                </button>
                <button type="button" class="ab-scroll-top-fab bg-dark text-white border-secondary" id="btnToggleCornerLeft" title="Quick Hub Help">
                    <i class="bi bi-chat-dots-fill"></i>
                </button>
            </div>
        `;

        // Build cross-store links for Bottom-Right Storefronts & Auctions Widget (replaces floating cart widget)
        const crossStoreLinksHtml = [];
        crossStoreLinksHtml.push(`
            <a href="${links.auctionsHref}" class="ab-storefront-chip-link chip-auctions" id="abWidgetLinkAuctions">
                <span><i class="bi bi-lightning-charge-fill me-1"></i>Auctions & Deals</span>
                <i class="bi bi-arrow-up-right small"></i>
            </a>
        `);
        if (links.storeName !== 'uwanbuy') {
            crossStoreLinksHtml.push(`
                <a href="${links.uwanbuyHref}" class="ab-storefront-chip-link chip-uwanbuy" id="abWidgetLinkUwanbuy">
                    <span><i class="bi bi-bag-check-fill text-danger me-1"></i>UwanBuy Market</span>
                    <i class="bi bi-chevron-right small opacity-75"></i>
                </a>
            `);
        }
        if (links.storeName !== 'thriftz') {
            crossStoreLinksHtml.push(`
                <a href="${links.thriftzHref}" class="ab-storefront-chip-link chip-thriftz" id="abWidgetLinkThriftz">
                    <span><i class="bi bi-recycle text-success me-1"></i>Thrift-Z Market</span>
                    <i class="bi bi-chevron-right small opacity-75"></i>
                </a>
            `);
        }
        if (links.storeName !== 'betasup') {
            crossStoreLinksHtml.push(`
                <a href="${links.betasupHref}" class="ab-storefront-chip-link chip-betasup" id="abWidgetLinkBetasup">
                    <span><i class="bi bi-fire text-warning me-1"></i>Betasup Soups</span>
                    <i class="bi bi-chevron-right small opacity-75"></i>
                </a>
            `);
        }

        // Bottom-Right Widget: Storefronts & Auctions Switcher (Thrift-Z, Betasup, Auctions & Deals) + Scroll-to-Top
        const rightDock = document.createElement('div');
        rightDock.id = 'ab-corner-widget-right';
        rightDock.className = 'ab-corner-dock-right';
        rightDock.innerHTML = `
            <div class="ab-storefronts-widget-card" id="abStorefrontsWidgetCard">
                <div class="ab-storefronts-widget-header">
                    <span><i class="bi bi-grid-fill text-danger me-1"></i>Storefronts & Deals</span>
                    <button type="button" class="btn btn-link p-0 text-white-50 text-decoration-none" id="btnMinimizeStorefrontsWidget" title="Minimize" style="font-size: 0.72rem; line-height: 1;">
                        <i class="bi bi-dash-lg"></i>
                    </button>
                </div>
                ${crossStoreLinksHtml.join('')}
            </div>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="ab-corner-pill-btn d-none" id="btnExpandStorefrontsWidget" title="Open Storefronts & Auctions">
                    <i class="bi bi-lightning-charge-fill text-danger"></i>
                    <span>Storefronts & Deals</span>
                </button>
                <button type="button" class="ab-scroll-top-fab scroll-to-top" id="abScrollToTopBtn" title="Scroll to top">
                    <i class="bi bi-chevron-up fw-bold"></i>
                </button>
            </div>
        `;

        document.body.appendChild(leftDock);
        document.body.appendChild(rightDock);
    }

    function openLocationSwitcherModal() {
        enhanceLocationSwitcherModal();
        const modalEl = document.getElementById('modal-location-switcher');
        if (!modalEl) return;
        if (window.jQuery && $(modalEl).data && $(modalEl).data().iziModal) {
            $(modalEl).iziModal('open');
        } else if (window.jQuery && $.fn && $.fn.iziModal) {
            $(modalEl).iziModal({
                title: 'Hyperlocal Hub Location',
                subtitle: 'Search and select your local AreaBazaar fulfillment center',
                headerColor: '#0f172a',
                width: 560,
                radius: 14,
                padding: 0
            });
            $(modalEl).iziModal('open');
        }
        setTimeout(() => {
            enhanceLocationSwitcherModal();
            const searchInput = document.getElementById('hubSearchInput');
            if (searchInput) searchInput.focus();
        }, 120);
    }

    function triggerQuickFeedbackPrompt(type, prefillValue = '') {
        if (!window.iziToast) return;
        const configs = {
            addMine: {
                title: "Add Your Favorite Item",
                message: "What staple product, gadget, or soup pot would you like stocked in your hub?",
                placeholder1: "Favorite Item / Dish Name",
                placeholder2: "Your Phone or Email Address",
                btnText: "Submit Favorite",
                successMsg: (v1, v2) => `"${v1 || 'Your favorite item'}" has been sent to your local hub inventory team!`
            },
            askQ: {
                title: "Ask Hub Support",
                message: "Have a question about bulk orders, live waves, or delivery?",
                placeholder1: "Type your question...",
                placeholder2: "Your Phone or WhatsApp Number",
                btnText: "Send Question",
                successMsg: (v1, v2) => `Thanks! A local AreaBazaar agent will reply to ${v2 || 'you'} shortly.`
            }
        };
        const cfg = configs[type] || configs.askQ;
        let val1 = prefillValue || '';
        let val2 = '';

        iziToast.info({
            timeout: 20000,
            overlay: true,
            displayMode: 1,
            id: 'ab-concierge-' + type,
            zindex: 99999,
            title: cfg.title,
            message: cfg.message,
            position: 'center',
            drag: false,
            inputs: [
                [`<input type="text" placeholder="${cfg.placeholder1}" value="${val1.replace(/"/g, '&quot;')}">`, 'keyup', function (instance, toast, input) {
                    val1 = input.value;
                }, true],
                [`<input type="text" placeholder="${cfg.placeholder2}">`, 'keyup', function (instance, toast, input) {
                    val2 = input.value;
                }, false]
            ],
            buttons: [
                [`<button><b>${cfg.btnText}</b></button>`, function (instance, toast, button, e, inputs) {
                    const v1 = (inputs && inputs[0] && inputs[0].value) || val1;
                    const v2 = (inputs && inputs[1] && inputs[1].value) || val2;
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    iziToast.success({
                        title: 'Received!',
                        message: cfg.successMsg(v1, v2),
                        position: 'topRight',
                        timeout: 4500
                    });
                }, false]
            ]
        });
    }

    let globalEventsBound = false;
    function bindGlobalStorefrontEvents() {
        if (globalEventsBound || typeof document === 'undefined' || !document.addEventListener) return;
        globalEventsBound = true;

        // Delegated input handler for #hubSearchInput
        document.addEventListener('input', function (e) {
            const target = e.target;
            if (target && target.id === 'hubSearchInput') {
                currentHubSearchQuery = target.value || '';
                const clearBtn = document.getElementById('btnClearHubSearch');
                if (clearBtn) {
                    if (currentHubSearchQuery.trim().length > 0) clearBtn.classList.remove('d-none');
                    else clearBtn.classList.add('d-none');
                }
                renderHubListItems();
            }
        });

        // Delegated click handler for location switcher, filter pills, and bottom corner widgets
        document.addEventListener('click', function (e) {
            const target = e.target;
            if (!target || typeof target.closest !== 'function') return;

            // 1. Clear hub search button
            const clearBtn = target.closest('#btnClearHubSearch');
            if (clearBtn) {
                e.preventDefault();
                currentHubSearchQuery = '';
                const searchInput = document.getElementById('hubSearchInput');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                clearBtn.classList.add('d-none');
                renderHubListItems();
                return;
            }

            // 2. Hub region filter pill
            const filterPill = target.closest('.hub-filter-pill');
            if (filterPill) {
                e.preventDefault();
                currentHubRegionFilter = filterPill.getAttribute('data-region') || 'all';
                document.querySelectorAll('.hub-filter-pill').forEach(btn => btn.classList.remove('active'));
                filterPill.classList.add('active');
                renderHubListItems();
                return;
            }

            // 3. Hub selection item (.hub-select-item)
            const hubItem = target.closest('.hub-select-item');
            if (hubItem) {
                e.preventDefault();
                const hubId = hubItem.getAttribute('data-hub');
                if (hubId) {
                    setLocation(hubId);
                    renderHubListItems();
                    const modalEl = document.getElementById('modal-location-switcher');
                    if (modalEl && window.jQuery && $(modalEl).data && $(modalEl).data().iziModal) {
                        $(modalEl).iziModal('close');
                    }
                    if (window.iziToast) {
                        iziToast.success({
                            title: 'Shopping Hub Updated',
                            message: `Fulfillment hub switched to ${hubId}`,
                            position: 'topRight',
                            timeout: 3000
                        });
                    }
                    const hubObj = AVAILABLE_HUBS.find(h => h.id.toLowerCase() === hubId.toLowerCase());
                    const liveBadge = document.getElementById('liveBazaarBannerBadge');
                    if (liveBadge) {
                        liveBadge.style.display = (hubObj && hubObj.hasLiveSession) ? 'inline-block' : 'none';
                    }
                }
                return;
            }

            // 4. Open Location Switcher triggers
            const changeLocTrigger = target.closest('#btnChangeLocation, #btnFooterChangeLoc, #btnCornerSwitchHub');
            if (changeLocTrigger) {
                e.preventDefault();
                const leftDrawer = document.getElementById('abCornerLeftDrawer');
                if (leftDrawer) leftDrawer.classList.remove('open');
                openLocationSwitcherModal();
                return;
            }

            // 5. Toggle Bottom-Left Concierge Drawer
            const toggleLeftBtn = target.closest('#btnToggleCornerLeft');
            if (toggleLeftBtn) {
                e.preventDefault();
                const leftDrawer = document.getElementById('abCornerLeftDrawer');
                if (leftDrawer) leftDrawer.classList.toggle('open');
                return;
            }

            const closeLeftBtn = target.closest('#btnCloseCornerDrawer');
            if (closeLeftBtn) {
                e.preventDefault();
                const leftDrawer = document.getElementById('abCornerLeftDrawer');
                if (leftDrawer) leftDrawer.classList.remove('open');
                return;
            }

            // 6. Concierge triggers (.trigger-addMine, .trigger-askQ)
            const addMineBtn = target.closest('.trigger-addMine');
            if (addMineBtn) {
                e.preventDefault();
                const leftDrawer = document.getElementById('abCornerLeftDrawer');
                if (leftDrawer) leftDrawer.classList.remove('open');
                triggerQuickFeedbackPrompt('addMine');
                return;
            }

            const askQBtn = target.closest('.trigger-askQ');
            if (askQBtn) {
                e.preventDefault();
                const leftDrawer = document.getElementById('abCornerLeftDrawer');
                if (leftDrawer) leftDrawer.classList.remove('open');
                triggerQuickFeedbackPrompt('askQ');
                return;
            }

            // 7. Bottom-Right Storefronts & Auctions Widget minimize / expand
            const minStorefrontsBtn = target.closest('#btnMinimizeStorefrontsWidget');
            if (minStorefrontsBtn) {
                e.preventDefault();
                const card = document.getElementById('abStorefrontsWidgetCard');
                const expandBtn = document.getElementById('btnExpandStorefrontsWidget');
                if (card) card.classList.add('d-none');
                if (expandBtn) expandBtn.classList.remove('d-none');
                return;
            }

            const expandStorefrontsBtn = target.closest('#btnExpandStorefrontsWidget');
            if (expandStorefrontsBtn) {
                e.preventDefault();
                const card = document.getElementById('abStorefrontsWidgetCard');
                if (card) card.classList.remove('d-none');
                expandStorefrontsBtn.classList.add('d-none');
                return;
            }

            // 8. Scroll to Top Button
            const scrollTopBtn = target.closest('#abScrollToTopBtn, .scroll-to-top');
            if (scrollTopBtn) {
                e.preventDefault();
                if (typeof window.scrollTo === 'function') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                return;
            }

            // Close corner drawer when clicking outside
            const leftDrawer = document.getElementById('abCornerLeftDrawer');
            if (leftDrawer && leftDrawer.classList.contains('open') && !target.closest('#ab-corner-widget-left')) {
                leftDrawer.classList.remove('open');
            }
        });
    }

    function registerUser(profileData = {}) {
        const storeName = detectStoreName();
        const bonusWallet = STORE_DEFAULTS[storeName]?.wallet || 15000;
        const newUser = {
            name: profileData.fullName || profileData.name || 'Valued Shopper',
            phone: profileData.phone || '',
            email: profileData.email || '',
            pin: profileData.pin || '1234',
            hub: profileData.hub || getLocation(),
            address: {
                addressLine1: profileData.addressLine1 || '',
                addressLine2: profileData.addressLine2 || '',
                landmark: profileData.landmark || '',
                city: profileData.city || '',
                state: profileData.state || '',
                instructions: profileData.instructions || ''
            },
            agentCode: profileData.agentCode || '',
            wallet: bonusWallet
        };
        setUser(newUser);
        if (newUser.hub) setLocation(newUser.hub);
        return newUser;
    }

    function loginUser(identifier = '') {
        let existing = getUser();
        if (!existing) {
            const storeName = detectStoreName();
            existing = {
                name: identifier.includes('@') ? identifier.split('@')[0] : 'Valued Customer',
                phone: identifier,
                email: identifier.includes('@') ? identifier : '',
                hub: getLocation(),
                wallet: STORE_DEFAULTS[storeName]?.wallet || 15000
            };
        }
        setUser(existing);
        return existing;
    }

    function logoutUser() {
        setUser(null);
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
        const cartSelectors = ['#cart-count-badge', '#cartBadge', '#cartCountBadge', '#boughtBadge', '#abFloatingCartBadge'];
        cartSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.textContent = String(cartCount);
                if (sel === '#abFloatingCartBadge') {
                    el.classList.remove('d-none');
                } else if (cartCount > 0) {
                    el.classList.remove('d-none');
                } else {
                    el.classList.add('d-none');
                }
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
        injectStorefrontStyles();
        injectBottomCornerWidgets();
        enhanceLocationSwitcherModal();
        populateRegistrationHubSelects();
        bindGlobalStorefrontEvents();
        syncUI();
        checkActiveBazaarSession();
        // Re-enhance after page scripts initialize iziModal
        setTimeout(() => {
            enhanceLocationSwitcherModal();
            populateRegistrationHubSelects();
            syncUI();
        }, 250);
    }

    // Export Storefront Core API
    window.AreaBazaarStorefront = {
        init,
        refresh: syncUI,
        detectStoreName,
        getUser,
        setUser,
        register: registerUser,
        login: loginUser,
        logout: logoutUser,
        getLocation,
        setLocation,
        filterHubs,
        openLocationSwitcherModal,
        enhanceLocationSwitcherModal,
        getWalletValue,
        getCartCount,
        formatNaira,
        checkActiveBazaarSession,
        AVAILABLE_HUBS,
        ACTIVE_BAZAAR_SESSIONS,
        UWANBUY_PRODUCTS,
        UWANBUY_CATEGORIES,
        ACTIVE_WAVE_VARIANTS,
        THRIFTZ_PRODUCTS,
        BETASUP_PRODUCTS
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})(window);
