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
