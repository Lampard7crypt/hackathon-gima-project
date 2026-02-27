// ── Shop / Vendor Types ──────────────────────────────────────────────────────

export interface Vendor {
    id: string;
    name: string;
    logo: string; // emoji or image path
    description: string;
    rating: number;
    verified: boolean;
    joinedDate: string;
}

export interface Product {
    id: string;
    vendorId: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    category: 'Wheelchair' | 'Apparel' | 'Equipment' | 'Wearables' | 'Accessories';
    imageUrl: string;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    tags: string[];
    featured?: boolean;
}

// ── Mock Vendors ─────────────────────────────────────────────────────────────

export const mockVendors: Vendor[] = [
    {
        id: 'v1',
        name: 'RollPro Sports',
        logo: '🏅',
        description: 'Premium adaptive sports equipment engineered for wheelchair athletes. Trusted by Paralympians worldwide.',
        rating: 4.8,
        verified: true,
        joinedDate: '2022-01-15',
    },
    {
        id: 'v2',
        name: 'ApexWear',
        logo: '👕',
        description: 'High-performance adaptive sportswear designed for comfort, durability, and elite performance.',
        rating: 4.6,
        verified: true,
        joinedDate: '2021-08-20',
    },
    {
        id: 'v3',
        name: 'TechAthletes',
        logo: '📡',
        description: 'Cutting-edge wearable technology and performance trackers built specifically for adaptive sports athletes.',
        rating: 4.5,
        verified: false,
        joinedDate: '2023-03-10',
    },
    {
        id: 'v4',
        name: 'CourtGear Co.',
        logo: '🏀',
        description: 'Official game equipment and accessories for wheelchair basketball and rugby teams.',
        rating: 4.7,
        verified: true,
        joinedDate: '2020-05-01',
    },
];

// ── Mock Products ─────────────────────────────────────────────────────────────

export const mockProducts: Product[] = [
    {
        id: 'prod1',
        vendorId: 'v1',
        name: 'RollPro Elite X1 Sports Chair',
        description: 'The flagship competition wheelchair. Ultra-lightweight titanium frame, 4-cambered sport wheels, and a racing-tuned suspension for maximum maneuverability and speed on the court.',
        price: 2499.99,
        currency: 'USD',
        category: 'Wheelchair',
        imageUrl: '/products/wheelchair.png',
        inStock: true,
        rating: 4.9,
        reviewCount: 87,
        tags: ['Competition', 'Titanium', 'Lightweight'],
        featured: true,
    },
    {
        id: 'prod2',
        vendorId: 'v2',
        name: 'ApexWear Grip Pro Gloves',
        description: 'Professional-grade push gloves with anti-slip rubber palm coating, padded knuckle protection, and moisture-wicking lining. Preferred by 3 national teams.',
        price: 49.99,
        currency: 'USD',
        category: 'Accessories',
        imageUrl: '/products/gloves.png',
        inStock: true,
        rating: 4.7,
        reviewCount: 214,
        tags: ['Grip', 'Protection', 'Best Seller'],
    },
    {
        id: 'prod3',
        vendorId: 'v3',
        name: 'TechAthletes ProBand Elite',
        description: 'Advanced sports wearable tracking heart rate, sprint speed, fatigue index, and training load in real time. Syncs directly with your GIMA athlete profile.',
        price: 189.99,
        currency: 'USD',
        category: 'Wearables',
        imageUrl: '/products/tracker.png',
        inStock: true,
        rating: 4.5,
        reviewCount: 63,
        tags: ['Wearable', 'Analytics', 'GIMA Compatible'],
        featured: true,
    },
    {
        id: 'prod4',
        vendorId: 'v2',
        name: 'ApexWear FlexFit Jersey',
        description: '100% technical polyester breathable mesh jersey built for adaptive athletes. UV-resistant, sweat-wicking, and available in 12 team colors. Custom numbering available.',
        price: 79.99,
        currency: 'USD',
        category: 'Apparel',
        imageUrl: '/products/jersey.png',
        inStock: true,
        rating: 4.6,
        reviewCount: 142,
        tags: ['Jersey', 'Breathable', 'Custom'],
    },
    {
        id: 'prod5',
        vendorId: 'v1',
        name: 'RollPro Team Equipment Bag',
        description: 'Heavy-duty 120L team equipment bag. Waterproof 1000D nylon shell, padded compartments for chair accessories, reinforced carry handles, and lockable zipper.',
        price: 134.99,
        currency: 'USD',
        category: 'Accessories',
        imageUrl: '/products/bag.png',
        inStock: true,
        rating: 4.8,
        reviewCount: 95,
        tags: ['Team', 'Storage', 'Waterproof'],
    },
    {
        id: 'prod6',
        vendorId: 'v4',
        name: 'CourtGear Pro Basketball',
        description: 'Official IWBF-approved tournament basketball. Pebbled rubber outer shell for superior grip, optimized air retention, and consistent bounce across all court surfaces.',
        price: 39.99,
        currency: 'USD',
        category: 'Equipment',
        imageUrl: '/products/basketball.png',
        inStock: true,
        rating: 4.7,
        reviewCount: 176,
        tags: ['Official', 'IWBF Approved', 'Tournament'],
        featured: true,
    },
    {
        id: 'prod7',
        vendorId: 'v1',
        name: 'RollPro Quad Chair Q3',
        description: 'Purpose-built wheelchair rugby chair with reinforced front bumper, low-profile frame, and adjustable trunk support. Tested at international level.',
        price: 3199.99,
        currency: 'USD',
        category: 'Wheelchair',
        imageUrl: '/products/wheelchair.png',
        inStock: false,
        rating: 4.9,
        reviewCount: 52,
        tags: ['Rugby', 'Heavy-Duty', 'Adjustable'],
    },
    {
        id: 'prod8',
        vendorId: 'v3',
        name: 'TechAthletes Motion Sensor Kit',
        description: 'Clip-on wheel motion sensor kit. Tracks rotation speed, distance, push count, and propulsion efficiency. Pairs with the ProBand Elite or standalone app.',
        price: 89.99,
        currency: 'USD',
        category: 'Wearables',
        imageUrl: '/products/tracker.png',
        inStock: true,
        rating: 4.3,
        reviewCount: 38,
        tags: ['Sensor', 'Motion Tracking', 'Propulsion'],
    },
];
