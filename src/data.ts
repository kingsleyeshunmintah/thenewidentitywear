import { Product, Testimonial } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'tees', name: 'T-Shirts', slug: 'tees' },
  { id: 'hoodies', name: 'Hoodies & Crewnecks', slug: 'hoodies' },
  { id: 'caps', name: 'Caps & Beanies', slug: 'caps' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'New Creation Tee',
    slug: 'new-creation-tee',
    sku: 'TNI-NC-001',
    category: 'tees',
    price: 150.00,
    description: 'A heavyweight, drop-shoulder premium t-shirt inspired by 2 Corinthians 5:17. "The old is gone; the new has come." Featuring a minimal typography line layout on the chest and an expressive, hand-inked scripture emblem on the upper back.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage White', hex: '#FAF9F6' },
      { name: 'Slate Black', hex: '#1A1A1A' }
    ],
    gender: 'Unisex',
    status: 'Active',
    features: [
      '260 GSM Ultra-Heavyweight combed organic cotton',
      'Drop-shoulder boxy fitting designed for high durability and comfort',
      'High density puff screen-printed brand logo on chest',
      'Sustainably handcrafted in Accra, Ghana'
    ],
    specifications: {
      'Fabric': '100% Premium Organic Cotton',
      'Weave': 'Single Jersey Heavy Knit',
      'Fit': 'Signature Boxy Oversized',
      'Origin': 'Made in Ghana'
    },
    stock: 45,
    rating: 4.9,
    reviewsCount: 24
  },
  {
    id: 'prod-2',
    name: 'Bold Faith Hoodie',
    slug: 'bold-faith-hoodie',
    sku: 'TNI-BF-002',
    category: 'hoodies',
    price: 250.00,
    description: 'A structural, protective, fleece-lined luxury hoodie bearing the statement "Bold Faith" as a reminder of Romans 1:16. Tailored with a double-layered hood without drawstrings for a clean, editorial silhouette.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Deep Olive', hex: '#3B3C36' },
      { name: 'Charcoal Noir', hex: '#242424' }
    ],
    gender: 'Unisex',
    status: 'Active',
    features: [
      '420 GSM ultra-dense diagonal loopback terry cloth',
      'Double-lined seamless hood with no metallic drawstrings',
      'Kangaroo pouch front pocket with hidden custom phone pouch',
      'Elastic ribbed hem and sleeve cuffs for shape retention'
    ],
    specifications: {
      'Fabric': '85% Organic Cotton, 15% recycled polyester fleeced lining',
      'Weight': '420 GSM Heavyweight Terry',
      'Fit': 'Moderately Oversized, drop shoulder drape',
      'Care': 'Cold wash inside out, dry flat'
    },
    stock: 28,
    rating: 5.0,
    reviewsCount: 19
  },
  {
    id: 'prod-3',
    name: 'Scripture Cap',
    slug: 'scripture-cap',
    sku: 'TNI-SC-003',
    category: 'caps',
    price: 80.00,
    description: 'A classic 6-panel unstructured dad-cap made from vintage washed chino cotton. Embroidered with "Grace & Truth" on the dynamic front panel and a subtle "TNI" cross monogram above the strap.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Washed Black', hex: '#2D2D2D' },
      { name: 'Earthy Sand', hex: '#D2B48C' }
    ],
    gender: 'Unisex',
    status: 'Active',
    features: [
      '100% Chino washed cotton twill cap',
      'Low-profile 6-panel unstructured design',
      'Self-fabric adjustable strapback with premium brass buckle',
      'Breathable embroidered brass eyelets for continuous airflow'
    ],
    specifications: {
      'Fabric': '100% Cotton Twill',
      'Strap': 'Washed cotton strap with solid brass clasp',
      'Fit': 'Adjustable unstructured crown design',
      'Size': '54-62cm adjustable'
    },
    stock: 60,
    rating: 4.8,
    reviewsCount: 32
  },
  {
    id: 'prod-4',
    name: 'Walking Testimony Tee',
    slug: 'walking-testimony-tee',
    sku: 'TNI-WT-004',
    category: 'tees',
    price: 150.00,
    description: 'Transform passive apparel into active preaching. This custom-woven streetwear t-shirt features a bold text panel inspired by the early church. Clean, luxury visual design paired with bold witness.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Asphalt Gray', hex: '#4A4A4A' },
      { name: 'Vintage White', hex: '#FAF9F6' }
    ],
    gender: 'Unisex',
    status: 'Active',
    features: [
      '260 GSM combed cotton mock-neck streetwear cut',
      'Chunky 1.2-inch rib collar that will not stretch on washing',
      'Custom silk-screened scripture timeline detail',
      'Signature side slit seam with embroidered red tab details'
    ],
    specifications: {
      'Fabric': '100% Long-Staple Combed Cotton',
      'Neckline': 'High rise mock neck ribbed panel',
      'Fit': 'Heavyweight Relaxed box drape',
      'Colors': 'Natural vegetable dyed hues'
    },
    stock: 35,
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: 'prod-5',
    name: 'Kingdom Mindset Crewneck',
    slug: 'kingdom-mindset-crewneck',
    sku: 'TNI-KM-005',
    category: 'hoodies',
    price: 200.00,
    description: 'A heavyweight, minimal drop silhouette crewneck with subtle textured panels. Grounded in Colossians 3:2, bringing structure and elegance to daily life. Styled best with clean denim or utility cargos.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Warm Warm White', hex: '#EAE6DF' },
      { name: 'Charcoal Noir', hex: '#242424' }
    ],
    gender: 'Unisex',
    status: 'Active',
    features: [
      '380 GSM brushed interior fleece crewneck',
      'Reinforced v-stitch gusset detailing at cuffs and neckband',
      'Heavy embroidery front branding utilizing pure organic satin thread',
      'Extremely soft skin hydration feel fleece lining'
    ],
    specifications: {
      'Fabric': '90% Combed Cotton, 10% Linen blend',
      'Stitching': 'High density safety coverstitch seams',
      'Fit': 'Retro-modern dropped shoulder block',
      'Shrinkage': 'Pre-washed to avoid shrinkage'
    },
    stock: 15,
    rating: 5.0,
    reviewsCount: 8
  },
  {
    id: 'prod-6',
    name: 'Transformed Tote Bag',
    slug: 'transformed-tote-bag',
    sku: 'TNI-TT-006',
    category: 'accessories',
    price: 60.00,
    description: 'An oversized, structured heavy canvas utility tote bag built to carry your scriptures, notebooks, and day-to-day essentials. Features an elegant screen-printed brand crest highlighting 2 Corinthians 5:17.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Natural Oatmeal', hex: '#E6DFD3' },
      { name: 'Midnight Charcoal', hex: '#2E2D2B' }
    ],
    gender: 'Unisex',
    status: 'Active',
    features: [
      '18oz Ultra-Heavyweight duck canvas structure',
      'Extra long canvas shoulder straps reinforced with bar-tac brass rivets',
      'Inside dual pockets for your smartphone and keys',
      'Flat-folded storage base with high capacity dimensions'
    ],
    specifications: {
      'Fabric': '100% Heavy Organic Duck Canvas',
      'Rivet': 'Reinforced load-bearing steel components',
      'Dimensions': '45cm x 40cm x 15cm',
      'Capacity': '25 Litres'
    },
    stock: 50,
    rating: 4.7,
    reviewsCount: 41
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    customerName: 'David L.',
    role: 'Accra Creative Director',
    message: 'I bought the New Creation Tee for our youth fellowship group. The fabric weight is incredible, easily rivalling luxury streetwear brands in Accra. It sparks immediate questions whenever I wear it to meetings.',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test-2',
    customerName: 'Asantewaa O.',
    role: 'Worship Leader',
    message: 'The materials are top-tier. Extremely comfortable yet fits elegantly. The Bold Faith Hoodie has become my go-to evening comfort wear. I absolute love that every piece is tied to scripture! Highly recommended!',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test-3',
    customerName: 'Kofi E.',
    role: 'Slam Poet & Evangelist',
    message: 'These clothes are literally a walking sermon. I had three separate conversations about transformation when standing in line at a coffee shop on Ring Road. Essential everyday pieces built centered around Christ.',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  }
];

export const REGIONS_GHANA = [
  { name: 'Greater Accra', fee: 20 },
  { name: 'Ashanti (Kumasi)', fee: 35 },
  { name: 'Eastern (Koforidua)', fee: 30 },
  { name: 'Western (Takoradi)', fee: 35 },
  { name: 'Central (Cape Coast)', fee: 30 },
  { name: 'Northern (Tamale)', fee: 40 },
  { name: 'Brong Ahafo (Sunyani)', fee: 40 },
  { name: 'Volta (Ho)', fee: 35 }
];

export const FAQS = [
  {
    question: 'What is the philosophy behind The New Identity Wear?',
    answer: 'We design premium, heavy-weight streetwear that replaces the world\'s temporal labels with eternal, kingdom-focused truths. Inspired by 2 Corinthians 5:17, our apparel serves as modern, high-quality, conversation-starting witness.'
  },
  {
    question: 'How do I care for my heavyweight garments?',
    answer: 'Because of our premium heavy organic cotton (up to 420 GSM) and custom puff print finishes, we recommend washing inside out in cold water. Lay flat or hang dry to avoid any shrinkage and retain the structured silhouette.'
  },
  {
    question: 'Where do you deliver and what are the delivery costs?',
    answer: 'We offer express delivery across all regions in Ghana. Delivery inside Accra is GHC 20, but delivery inside Accra on orders over GHC 200 is completely FREE! Shipping to other regions varies between GHC 30-40 depending on location.'
  },
  {
    question: 'Can I exchange or return my items?',
    answer: 'Yes, we are pleased to offer hassle-free 30-day returns for any unworn pieces in their original bags with tags intact. Simply email us or call support at 0554312323 to arrange your exchange.'
  },
  {
    question: 'Are payments via Mobile Money secure?',
    answer: 'Absolutely. We process checkout payments securely using Paystack, supporting dynamic Mobile Money transactions (MTN Momo, Vodafone Cash, AirtelTigo) and Visa/Mastercard credit cards. Your money is completely protected.'
  }
];
