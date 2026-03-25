"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_model_1 = require("./modules/auth/auth.model");
const property_model_1 = require("./modules/properties/property.model");
const database_1 = require("./config/database");
dotenv_1.default.config();
const SALT_ROUNDS = 12;
const seedUsers = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gharsetu.com',
        phone: '+91-98765-43210',
        password: 'Password@123',
        role: 'admin',
    },
    {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'owner@gharsetu.com',
        phone: '+91-98765-43211',
        password: 'Password@123',
        role: 'property_owner',
    },
    {
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'buyer@gharsetu.com',
        phone: '+91-98765-43212',
        password: 'Password@123',
        role: 'buyer',
    },
    {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'tenant@gharsetu.com',
        phone: '+91-98765-43213',
        password: 'Password@123',
        role: 'tenant',
    },
    {
        firstName: 'Dr. Anita',
        lastName: 'Sharma',
        email: 'advisor@gharsetu.com',
        phone: '+91-98765-43214',
        password: 'Password@123',
        role: 'legal_advisor',
    },
    {
        firstName: 'Vikram',
        lastName: 'Desai',
        email: 'builder@gharsetu.com',
        phone: '+91-98765-43215',
        password: 'Password@123',
        role: 'builder',
    },
    {
        firstName: 'Movers',
        lastName: 'Express',
        email: 'packers@gharsetu.com',
        phone: '+91-98765-43216',
        password: 'Password@123',
        role: 'packers_movers',
    },
    {
        firstName: 'Suresh',
        lastName: 'Verma',
        email: 'manager@gharsetu.com',
        phone: '+91-98765-43217',
        password: 'Password@123',
        role: 'property_manager',
    },
    {
        firstName: 'Marketing',
        lastName: 'Pro',
        email: 'marketing@gharsetu.com',
        phone: '+91-98765-43218',
        password: 'Password@123',
        role: 'marketing_partner',
    },
];
const seedProperties = (ownerId) => [
    {
        title: 'Luxury 3BHK Apartment in Bandra',
        description: 'Spacious and well-maintained 3-bedroom apartment with modern amenities in the heart of Mumbai. Close to schools, hospitals, and shopping centers.',
        type: 'apartment',
        purpose: 'sale',
        price: 15000000,
        priceUnit: 'total',
        area: { value: 1800, unit: 'sqft' },
        bedrooms: 3,
        bathrooms: 2,
        floors: 5,
        yearBuilt: 2018,
        furnishing: 'semi_furnished',
        amenities: [
            'parking',
            'gym',
            'pool',
            'security',
            'garden',
            'balcony',
            'ac',
            'wifi',
        ],
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        ],
        location: {
            coordinates: [72.8329, 19.0596],
            address: '123 Marine Drive, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            locality: 'Bandra',
            landmark: 'Near Bandstand',
        },
        features: {
            balcony: true,
            parking: true,
            gym: true,
            pool: true,
            security: true,
            playground: false,
        },
        owner: ownerId,
    },
    {
        title: 'Cozy 2BHK Flat in Pune',
        description: 'Modern 2-bedroom apartment with excellent connectivity to IT parks and commercial areas.',
        type: 'apartment',
        purpose: 'rent',
        price: 25000,
        priceUnit: 'per_month',
        area: { value: 950, unit: 'sqft' },
        bedrooms: 2,
        bathrooms: 1,
        floors: 3,
        yearBuilt: 2020,
        furnishing: 'fully_furnished',
        amenities: ['parking', 'security', 'water-tank', 'elevator'],
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        ],
        location: {
            coordinates: [73.8567, 18.5204],
            address: '456 Viman Nagar Road',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411014',
            locality: 'Viman Nagar',
            landmark: 'Near Airport Road',
        },
        features: {
            balcony: true,
            parking: true,
            gym: false,
            security: true,
            playground: true,
        },
        owner: ownerId,
    },
    {
        title: 'Spacious Villa in Bangalore',
        description: 'Luxurious 4-bedroom villa with private garden, swimming pool, and modern architecture.',
        type: 'villa',
        purpose: 'sale',
        price: 25000000,
        priceUnit: 'total',
        area: { value: 4500, unit: 'sqft' },
        bedrooms: 4,
        bathrooms: 3,
        floors: 2,
        yearBuilt: 2019,
        furnishing: 'unfurnished',
        amenities: ['pool', 'garden', 'parking', 'gym', 'security', 'playground'],
        images: [
            'https://images.unsplash.com/photo-1613490493976-7e88a73ce338?w=800',
        ],
        location: {
            coordinates: [77.594, 12.9716],
            address: '789 Koramangala Villa Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560034',
            locality: 'Koramangala',
            landmark: 'Near Tech Park',
        },
        features: {
            balcony: true,
            parking: true,
            gym: true,
            pool: true,
            security: true,
            playground: true,
        },
        owner: ownerId,
    },
];
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDB)();
        console.log('✓ Connected to MongoDB');
        // Check if seed data already exists
        const existingUserCount = await auth_model_1.User.countDocuments();
        if (existingUserCount > 0) {
            console.log(`⚠ Database already has ${existingUserCount} users.`);
            const answer = await new Promise((resolve) => {
                process.stdout.write('Do you want to clear existing data and reseed? (yes/no): ');
                process.stdin.once('data', (data) => {
                    resolve(data.toString().trim().toLowerCase());
                });
            });
            if (answer !== 'yes' && answer !== 'y') {
                console.log('Seeding cancelled.');
                process.exit(0);
            }
            // Clear existing data
            await auth_model_1.User.deleteMany({});
            await property_model_1.Property.deleteMany({});
            console.log('✓ Cleared existing data');
        }
        // Create seed users
        const createdUsers = [];
        for (const seedUser of seedUsers) {
            const hashedPassword = await bcryptjs_1.default.hash(seedUser.password, SALT_ROUNDS);
            const user = new auth_model_1.User({
                firstName: seedUser.firstName,
                lastName: seedUser.lastName,
                email: seedUser.email,
                phone: seedUser.phone,
                password: hashedPassword,
                role: seedUser.role,
                isActive: true,
                isVerified: true,
                kyc: {
                    status: 'verified',
                    documents: [],
                    verifiedAt: new Date(),
                },
                address: {
                    street: '123 Sample Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    country: 'India',
                },
                preferences: {
                    language: 'en',
                    notifications: {
                        email: true,
                        inApp: true,
                    },
                },
            });
            await user.save();
            createdUsers.push(user);
            console.log(`✓ Created ${seedUser.role} user: ${seedUser.email}`);
        }
        // Create sample properties for property_owner
        const propertyOwner = createdUsers.find((u) => u.role === 'property_owner');
        if (propertyOwner) {
            const properties = seedProperties(propertyOwner._id.toString());
            for (const propData of properties) {
                const property = new property_model_1.Property(propData);
                await property.save();
                console.log(`✓ Created property: ${propData.title}`);
            }
        }
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📝 Test Login Credentials:');
        console.log('─'.repeat(60));
        seedUsers.forEach((user) => {
            console.log(`\n${user.role.toUpperCase()}`);
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${user.password}`);
        });
        console.log('\n' + '─'.repeat(60));
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
// Handle termination gracefully
process.on('SIGINT', async () => {
    console.log('\n⚠ Seeding interrupted');
    process.exit(0);
});
// Run seeding
seedDatabase();
//# sourceMappingURL=seed.js.map