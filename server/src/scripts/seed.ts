import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';

const SEED_PRODUCTS = [
  // Men's — Sherwanis
  {
    name: 'Nawab-e-Alam Sherwani',
    slug: 'nawab-e-alam-sherwani',
    description: 'An opulent off-white sherwani adorned with intricate gold zari embroidery across the chest and cuffs. Crafted from premium silk-cotton blend with hand-stitched details by Lucknow artisans.',
    shortDescription: 'Zari-embroidered silk sherwani in off-white',
    price: 28500,
    compareAtPrice: 34000,
    category: 'mens',
    subcategory: 'Sherwanis',
    images: [
      { url: '/nawabiyat.jpg', alt: 'Nawab-e-Alam Sherwani front', isPrimary: true },
    ],
    fabric: 'Silk-Cotton Blend',
    colors: ['Off-White', 'Ivory'],
    sizes: ['38', '40', '42', '44', '46'],
    specifications: { craftTechnique: 'Zari embroidery, Lucknow', careInstructions: 'Dry clean only', origin: 'Lucknow, UP' },
    artisanStory: 'Hand-embroidered by master karigars in Lucknow\'s Aminabad district, where this craft has been passed down for over six generations.',
    stock: 15,
    isFeatured: true,
    tags: ['sherwani', 'wedding', 'zari', 'silk', 'mens'],
  },
  {
    name: 'Shahenshah Bandhgala',
    slug: 'shahenshah-bandhgala',
    description: 'A refined midnight-blue bandhgala suit with subtle self-embossed brocade pattern. Features Nehru collar, gold buttons, and straight trousers with matching dupatta.',
    shortDescription: 'Midnight blue brocade bandhgala with gold buttons',
    price: 18900,
    compareAtPrice: 22000,
    category: 'mens',
    subcategory: 'Bandhgalas',
    images: [
      { url: '/shabaz.jpg', alt: 'Shahenshah Bandhgala', isPrimary: true },
    ],
    fabric: 'Jacquard Brocade',
    colors: ['Midnight Blue', 'Bottle Green', 'Burgundy'],
    sizes: ['38', '40', '42', '44', '46'],
    specifications: { craftTechnique: 'Brocade weave, Varanasi', careInstructions: 'Dry clean only', origin: 'Varanasi, UP' },
    artisanStory: 'Woven on handlooms that have operated in the narrow lanes of Varanasi for over a century.',
    stock: 20,
    isFeatured: true,
    tags: ['bandhgala', 'formal', 'brocade', 'mens'],
  },
  {
    name: 'Darbar Kurta Set',
    slug: 'darbar-kurta-set',
    description: 'An everyday luxury kurta in pure mul cotton with hand-block printed Mughal motifs. Paired with straight churidar and embroidered nehru jacket.',
    shortDescription: 'Block-printed cotton kurta with nehru jacket',
    price: 8900,
    compareAtPrice: 11000,
    category: 'mens',
    subcategory: 'Kurta Sets',
    images: [
      { url: '/zarif.jpg', alt: 'Darbar Kurta Set', isPrimary: true },
    ],
    fabric: 'Mul Cotton',
    colors: ['Ivory', 'Sky Blue', 'Sage Green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: { craftTechnique: 'Hand block print, Sanganer', careInstructions: 'Cold hand wash', origin: 'Sanganer, Rajasthan' },
    stock: 40,
    tags: ['kurta', 'casual', 'block-print', 'cotton', 'mens'],
  },
  {
    name: 'Virasat Nehru Jacket',
    slug: 'virasat-nehru-jacket',
    description: 'A standalone Nehru jacket in rich crimson velvet with gold passementerie trim. Pairs effortlessly over any kurta to elevate an everyday look.',
    shortDescription: 'Crimson velvet Nehru jacket with gold trim',
    price: 6500,
    category: 'mens',
    subcategory: 'Nehru Jackets',
    images: [
      { url: '/virasat.jpg', alt: 'Virasat Nehru Jacket', isPrimary: true },
    ],
    fabric: 'Velvet',
    colors: ['Crimson', 'Royal Blue', 'Forest Green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: { craftTechnique: 'Passementerie trim, hand-finished', careInstructions: 'Dry clean only', origin: 'Surat, Gujarat' },
    stock: 30,
    tags: ['nehru jacket', 'velvet', 'mens', 'festive'],
  },

  // Women's
  {
    name: 'Noor Jahan Lehenga',
    slug: 'noor-jahan-lehenga',
    description: 'A statement lehenga choli in raw silk with hand-painted meenakari motifs and French-knotted embroidery. The dupatta is finished with antique gold gota border.',
    shortDescription: 'Meenakari silk lehenga with gold gota dupatta',
    price: 42000,
    compareAtPrice: 52000,
    category: 'womens',
    subcategory: 'Lehengas',
    images: [
      { url: '/noor_jahan.jpg', alt: 'Noor Jahan Lehenga', isPrimary: true },
    ],
    fabric: 'Raw Silk',
    colors: ['Marigold', 'Rani Pink', 'Peacock Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: 'Meenakari, French knot embroidery', careInstructions: 'Dry clean only', origin: 'Jaipur, Rajasthan' },
    artisanStory: 'Inspired by the jewellery and art patronised by Empress Nur Jahan, who elevated Mughal craftsmanship to its highest expression.',
    stock: 8,
    isFeatured: true,
    tags: ['lehenga', 'bridal', 'meenakari', 'silk', 'womens'],
  },
  {
    name: 'Gulrez Anarkali',
    slug: 'gulrez-anarkali',
    description: 'A floor-sweeping anarkali in rose-pink georgette with intricate resham threadwork across the yoke and hem. Comes with matching churidar and organza dupatta.',
    shortDescription: 'Rose-pink georgette anarkali with resham embroidery',
    price: 14500,
    category: 'womens',
    subcategory: 'Anarkalis',
    images: [
      { url: '/gulrez.jpg', alt: 'Gulrez Anarkali', isPrimary: true },
    ],
    fabric: 'Georgette',
    colors: ['Rose Pink', 'Lavender', 'Ivory'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    specifications: { craftTechnique: 'Resham threadwork', careInstructions: 'Dry clean only', origin: 'Hyderabad' },
    stock: 18,
    isFeatured: true,
    tags: ['anarkali', 'georgette', 'party', 'womens'],
  },
  {
    name: 'Nishat Sharara Set',
    slug: 'nishat-sharara-set',
    description: 'Contemporary sharara in flared silhouette crafted from handwoven chanderi with subtle silver zari stripe. Features a cropped kurta with mirror-work neckline.',
    shortDescription: 'Chanderi sharara set with mirror-work kurta',
    price: 11200,
    category: 'womens',
    subcategory: 'Sharara Sets',
    images: [
      { url: '/nishat.jpg', alt: 'Nishat Sharara Set', isPrimary: true },
    ],
    fabric: 'Chanderi',
    colors: ['Sage Green', 'Blush', 'Midnight'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: 'Handwoven chanderi, mirror work', careInstructions: 'Hand wash cold', origin: 'Chanderi, MP' },
    stock: 22,
    tags: ['sharara', 'chanderi', 'festive', 'womens'],
  },
  {
    name: 'Meher Gown',
    slug: 'meher-gown',
    description: 'An Indo-western evening gown in deep burgundy velvet with a heavily embroidered cape overlay. Structured bodice with flared skirt — the modern royal silhouette.',
    shortDescription: 'Burgundy velvet gown with embroidered cape',
    price: 23800,
    category: 'womens',
    subcategory: 'Gowns',
    images: [
      { url: '/meher.jpg', alt: 'Meher Gown', isPrimary: true },
    ],
    fabric: 'Velvet',
    colors: ['Burgundy', 'Emerald', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: 'Hand embroidery on cape', careInstructions: 'Dry clean only', origin: 'Mumbai' },
    stock: 10,
    isFeatured: true,
    tags: ['gown', 'velvet', 'indo-western', 'party', 'womens'],
  },

  // Accessories
  {
    name: 'Shahi Guluband Necklace',
    slug: 'shahi-guluband-necklace',
    description: 'A choker-style guluband in 22kt gold-plated brass with hand-set kundan stones and champagne enamel detailing. Includes matching maang tikka.',
    shortDescription: 'Kundan choker necklace with maang tikka',
    price: 4800,
    category: 'accessories',
    subcategory: 'Necklaces',
    images: [
      { url: '/shahi_guluband.jpg', alt: 'Shahi Guluband Necklace', isPrimary: true },
    ],
    fabric: 'n/a',
    colors: ['Gold', 'Silver'],
    sizes: ['One Size'],
    specifications: { craftTechnique: 'Kundan setting, enamel work', careInstructions: 'Wipe clean, store in pouch', origin: 'Jaipur, Rajasthan' },
    stock: 35,
    isFeatured: true,
    tags: ['necklace', 'kundan', 'jewellery', 'bridal'],
  },
  {
    name: 'Nageen Mala',
    slug: 'nageen-mala',
    description: 'A long opera-length mala in semi-precious aventurine and jade beads, interspersed with antique gold caps and a polki pendant centrepiece.',
    shortDescription: 'Opera-length semi-precious mala with polki pendant',
    price: 3200,
    category: 'accessories',
    subcategory: 'Necklaces',
    images: [
      { url: '/nageen_mala.jpg', alt: 'Nageen Mala', isPrimary: true },
    ],
    fabric: 'n/a',
    colors: ['Green', 'Blue'],
    sizes: ['One Size'],
    specifications: { craftTechnique: 'Bead stringing, polki setting', careInstructions: 'Store flat, avoid moisture', origin: 'Jaipur, Rajasthan' },
    stock: 28,
    tags: ['mala', 'beaded', 'semi-precious', 'jewellery'],
  },
  {
    name: 'Rajkumari Noor Clutch',
    slug: 'rajkumari-noor-clutch',
    description: 'An heirloom-quality potli clutch in ivory silk, hand-embroidered with gold and silver zardozi. Interior lined in pure silk with one card slot.',
    shortDescription: 'Zardozi-embroidered silk potli clutch',
    price: 2900,
    category: 'accessories',
    subcategory: 'Brooches',
    images: [
      { url: '/rajkumari_noor_clucth.jpg', alt: 'Rajkumari Noor Clutch', isPrimary: true },
    ],
    fabric: 'Silk',
    colors: ['Ivory Gold', 'Dusty Rose'],
    sizes: ['One Size'],
    specifications: { craftTechnique: 'Zardozi embroidery', careInstructions: 'Dry clean only, avoid direct sunlight', origin: 'Lucknow, UP' },
    stock: 20,
    tags: ['clutch', 'potli', 'zardozi', 'evening bag'],
  },

  // Women's — The Queen's Grace & Zeb-un-Nissa
  {
    name: "The Queen's Grace Saree",
    slug: 'the-queens-grace-saree',
    description: 'A handwoven Banarasi pure silk saree in ivory and gold with a six-inch zari border. The pallu features Mughal jaal motif in pure gold thread.',
    shortDescription: 'Banarasi pure silk saree with zari Mughal jaal',
    price: 18000,
    category: 'womens',
    subcategory: 'Sarees',
    images: [
      { url: '/the_queens_grace.jpg', alt: "The Queen's Grace Saree", isPrimary: true },
    ],
    fabric: 'Pure Banarasi Silk',
    colors: ['Ivory Gold', 'Red Gold'],
    sizes: ['One Size'],
    specifications: { craftTechnique: 'Handwoven Banarasi, pure zari border', careInstructions: 'Dry clean only', origin: 'Varanasi, UP' },
    artisanStory: 'Woven on pit looms by hereditary Banarasi weavers — each saree takes 8–12 days to complete.',
    stock: 12,
    isFeatured: true,
    tags: ['saree', 'banarasi', 'silk', 'bridal', 'zari'],
  },
  {
    name: 'Zeb-un-Nissa Anarkali',
    slug: 'zeb-un-nissa-anarkali',
    description: 'Named after the Mughal poetess, this black georgette anarkali is embellished with silver sequin embroidery forming calligraphic verse across the hemline.',
    shortDescription: 'Black georgette anarkali with silver calligraphy embroidery',
    price: 16800,
    category: 'womens',
    subcategory: 'Anarkalis',
    images: [
      { url: '/the_zeb_un_nissa.jpg', alt: 'Zeb-un-Nissa Anarkali', isPrimary: true },
    ],
    fabric: 'Georgette',
    colors: ['Black Silver', 'Navy Gold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: 'Calligraphic sequin embroidery', careInstructions: 'Dry clean only', origin: 'Hyderabad' },
    stock: 14,
    tags: ['anarkali', 'georgette', 'evening', 'womens'],
  },

  // Additional products
  {
    name: 'Heer-e-Mughal Lehenga',
    slug: 'heer-e-mughal-lehenga',
    description: 'Deep emerald lehenga in pure organza with 3D floral appliqué and hand-sewn sequin trails. The matching blouse features dramatic cold-shoulder sleeves.',
    shortDescription: 'Emerald organza lehenga with 3D floral appliqué',
    price: 32000,
    category: 'womens',
    subcategory: 'Lehengas',
    images: [
      { url: '/heer-e-mughal.jpg', alt: 'Heer-e-Mughal Lehenga', isPrimary: true },
    ],
    fabric: 'Organza',
    colors: ['Emerald', 'Sapphire', 'Ruby'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: '3D appliqué, sequin work', careInstructions: 'Dry clean only', origin: 'Mumbai' },
    stock: 6,
    tags: ['lehenga', 'organza', 'bridal', 'womens'],
  },
  {
    name: 'Taj-e-Zar Maang Tikka',
    slug: 'taj-e-zar-maang-tikka',
    description: 'A statement maang tikka in rose-gold plated brass set with ruby-red and champagne kundan stones. Adjustable chain with cultured pearl drop at centre.',
    shortDescription: 'Rose-gold maang tikka with kundan and pearl drop',
    price: 2100,
    category: 'accessories',
    subcategory: 'Maang Tikka',
    images: [
      { url: '/taj-e-zar.jpg', alt: 'Taj-e-Zar Maang Tikka', isPrimary: true },
    ],
    fabric: 'n/a',
    colors: ['Rose Gold', 'Gold'],
    sizes: ['One Size'],
    specifications: { craftTechnique: 'Kundan setting with pearl drop', careInstructions: 'Wipe clean, store in pouch', origin: 'Jaipur, Rajasthan' },
    stock: 50,
    tags: ['maang tikka', 'kundan', 'bridal', 'jewellery'],
  },
  {
    name: 'Ayat-e-Zar Earrings',
    slug: 'ayat-e-zar-earrings',
    description: 'Long Chandbali earrings in antique gold with turquoise enamel panels and dangling freshwater pearls. Lightweight despite their dramatic appearance.',
    shortDescription: 'Antique gold chandbali earrings with turquoise and pearls',
    price: 1800,
    category: 'accessories',
    subcategory: 'Earrings',
    images: [
      { url: '/ayat-e-zar.jpg', alt: 'Ayat-e-Zar Earrings', isPrimary: true },
    ],
    fabric: 'n/a',
    colors: ['Gold Turquoise'],
    sizes: ['One Size'],
    specifications: { craftTechnique: 'Enamel work, pearl setting', careInstructions: 'Wipe clean, store in pouch', origin: 'Jaipur, Rajasthan' },
    stock: 45,
    tags: ['earrings', 'chandbali', 'enamel', 'bridal'],
  },
  {
    name: 'Izhaar Nur Anarkali',
    slug: 'izhaar-nur-anarkali',
    description: 'A celebration of light — champagne net anarkali with hand-applied crystal rhinestones forming floral jaal. Perfect for receptions and festive evenings.',
    shortDescription: 'Champagne net anarkali with crystal rhinestone jaal',
    price: 19500,
    category: 'womens',
    subcategory: 'Anarkalis',
    images: [
      { url: '/izhaar.jpg', alt: 'Izhaar Nur Anarkali', isPrimary: true },
    ],
    fabric: 'Net',
    colors: ['Champagne', 'Silver'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: 'Crystal rhinestone appliqué', careInstructions: 'Dry clean only', origin: 'Delhi' },
    stock: 9,
    tags: ['anarkali', 'net', 'crystal', 'party', 'womens'],
  },
  {
    name: 'Nayab Bekhudi Sharara',
    slug: 'nayab-bekhudi-sharara',
    description: 'Bridal sharara set in deep raspberry pink with hand-cut mirror work, gotta patti border, and a dramatic trail kurta with asymmetric hemline.',
    shortDescription: 'Raspberry pink sharara with mirror work and gotta patti',
    price: 21000,
    category: 'womens',
    subcategory: 'Sharara Sets',
    images: [
      { url: '/nayab.jpg', alt: 'Nayab Bekhudi Sharara', isPrimary: true },
    ],
    fabric: 'Raw Silk',
    colors: ['Raspberry', 'Fuchsia'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specifications: { craftTechnique: 'Mirror work, gotta patti', careInstructions: 'Dry clean only', origin: 'Jaipur, Rajasthan' },
    stock: 7,
    tags: ['sharara', 'mirror work', 'bridal', 'womens'],
  },
];

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI not set in .env');

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // Create admin user
  const adminEmail = 'admin@darbar.in';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      firstName: 'Darbar',
      lastName: 'Admin',
      email: adminEmail,
      passwordHash: 'Admin@123456',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log('Admin user created:', adminEmail, '/ Admin@123456');
  } else {
    console.log('Admin user already exists');
  }

  // Create seller user
  const sellerEmail = 'seller@darbar.in';
  let seller = await User.findOne({ email: sellerEmail });
  if (!seller) {
    seller = await User.create({
      firstName: 'Darbar',
      lastName: 'Seller',
      email: sellerEmail,
      passwordHash: 'Seller@123456',
      role: 'seller',
      isEmailVerified: true,
    });
    console.log('Seller user created:', sellerEmail, '/ Seller@123456');
  } else {
    console.log('Seller user already exists');
  }

  // Seed products
  const existingCount = await Product.countDocuments();
  if (existingCount === 0) {
    const productsWithSeller = SEED_PRODUCTS.map(p => ({ ...p, sellerId: seller!._id }));
    await Product.insertMany(productsWithSeller);
    console.log(`Seeded ${SEED_PRODUCTS.length} products`);
  } else {
    console.log(`Products already exist (${existingCount}), skipping`);
  }

  // Seed sample coupon
  const { Coupon } = await import('../models/Coupon');
  const existingCoupon = await Coupon.findOne({ code: 'ROYAL10' });
  if (!existingCoupon) {
    await Coupon.create({
      code: 'ROYAL10',
      type: 'percentage',
      value: 10,
      minPurchase: 5000,
      maxDiscount: 2000,
      maxUses: 100,
    });
    console.log('Sample coupon created: ROYAL10 (10% off, min ₹5000)');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
};

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
