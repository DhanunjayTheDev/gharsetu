import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './modules/auth/auth.model';
import { Property } from './modules/properties/property.model';
import { connectDB } from './config/database';

dotenv.config();

const SALT_ROUNDS = 12;

interface SeedUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

const seedUsers: SeedUser[] = [
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

interface SeedProperty {
  title: string;
  description: string;
  type: string;
  purpose: string;
  price: number;
  priceUnit: string;
  area: { value: number; unit: string };
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearBuilt?: number;
  furnishing?: string;
  amenities: string[];
  images: string[];
  location: {
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
    pincode: string;
    locality: string;
    landmark?: string;
  };
  features: Record<string, boolean>;
  owner: string;
}

const seedProperties = (ownerId: string): SeedProperty[] => [
  {
    title: 'Luxury 3BHK Apartment in Bandra',
    description:
      'Spacious and well-maintained 3-bedroom apartment with modern amenities in the heart of Mumbai. Close to schools, hospitals, and shopping centers.',
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
    description:
      'Modern 2-bedroom apartment with excellent connectivity to IT parks and commercial areas.',
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
    description:
      'Luxurious 4-bedroom villa with private garden, swimming pool, and modern architecture.',
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
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Check if seed data already exists
    const existingUserCount = await User.countDocuments();
    if (existingUserCount > 0) {
      console.log(`⚠ Database already has ${existingUserCount} users.`);
      const answer = await new Promise((resolve) => {
        process.stdout.write(
          'Do you want to clear existing data and reseed? (yes/no): '
        );
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase());
        });
      });

      if (answer !== 'yes' && answer !== 'y') {
        console.log('Seeding cancelled.');
        process.exit(0);
      }

      // Clear existing data
      await User.deleteMany({});
      await Property.deleteMany({});
      console.log('✓ Cleared existing data');
    }

    // Create seed users
    const createdUsers: any[] = [];
    for (const seedUser of seedUsers) {
      const hashedPassword = await bcryptjs.hash(seedUser.password, SALT_ROUNDS);

      const user = new User({
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
    const propertyOwner = createdUsers.find(
      (u) => u.role === 'property_owner'
    );
    if (propertyOwner) {
      const properties = seedProperties(propertyOwner._id.toString());
      for (const propData of properties) {
        const property = new Property(propData);
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
  } catch (error) {
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
