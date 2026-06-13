import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persistent database storage
const DB_FILE = path.join(process.cwd(), 'data_store.json');

// Helper to initialize or read our file-based database store
function readDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    // Write dynamic seed database with default settings
    const initialDB = {
      subscribers: [] as string[],
      users: [
        {
          id: 'usr-admin',
          name: 'The New Identity Admin',
          email: 'admin@thenewidentitywear.com',
          phone: '0554312323',
          passwordHash: crypto.createHash('sha256').update('AdminSecure2026').digest('hex'),
          role: 'super-admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'usr-customer',
          name: 'Kwame Mensah',
          email: 'kwame@example.com',
          phone: '0202011311',
          passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
          role: 'customer',
          createdAt: new Date().toISOString()
        }
      ],
      orders: [
        {
          id: 'ord-1',
          orderNumber: 'TNI-98312',
          status: 'Processing',
          items: [
            {
              id: 'prod-1_M_Vintage White',
              productId: 'prod-1',
              productName: 'New Creation Tee',
              productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
              price: 150.00,
              size: 'M',
              color: { name: 'Vintage White', hex: '#FAF9F6' },
              quantity: 1
            }
          ],
          subtotal: 150.00,
          shippingFee: 20.00,
          discountAmount: 0,
          total: 170.00,
          shippingAddress: {
            fullName: 'Kwame Mensah',
            phone: '0202011311',
            addressLine: 'House 42, Spintex Road',
            city: 'Accra',
            region: 'Greater Accra'
          },
          paymentMethod: 'Mobile Money',
          paymentStatus: 'Completed',
          paymentReference: 'pstk_ref_98231023',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
        }
      ],
      testimonials: [] as any[],
      coupons: [
        { code: 'NEWCREATION10', type: 'percentage', value: 10 },
        { code: 'TNI20', type: 'percentage', value: 20 },
        { code: 'ACCRAFREE', type: 'fixed', value: 20, minSpend: 150 }
      ],
      contacts: [] as any[],
      settings: {
        shippingFeeDefault: 20,
        taxRate: 0,
        contactPhone: '0554312323',
        contactEmail: 'thenewidentitywear@gmail.com',
        whatsAppNumber: '233554312323'
      }
    };
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDatabase(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// 1. Live product search & catalog endpoints
// Note: We return direct catalog products (from our unified data module). 
// You can also add products or update them dynamically through admin endpoints.
import { PRODUCTS } from './src/data.js';

app.get('/api/products', (req, res) => {
  res.json({ success: true, count: PRODUCTS.length, products: PRODUCTS });
});

app.get('/api/search', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  const filtered = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query) ||
    p.sku.toLowerCase().includes(query)
  );
  res.json({ success: true, count: filtered.length, products: filtered });
});

// 2. Newsletter subscriber registration
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email address provided.' });
  }
  
  const db = readDatabase();
  if (db.subscribers.includes(email)) {
    return res.json({ success: true, code: 'exists', message: 'You are already registered in our newsletter.' });
  }
  
  db.subscribers.push(email);
  writeDatabase(db);
  res.json({ success: true, code: 'success', message: 'Hallelujah! You are successfully registered.' });
});

// 3. Contact message queue
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and message.' });
  }

  const db = readDatabase();
  const contactMsg = {
    id: 'msg-' + Date.now(),
    name,
    email,
    subject: subject || 'General Query',
    message,
    createdAt: new Date().toISOString()
  };

  db.contacts.push(contactMsg);
  writeDatabase(db);

  res.json({ success: true, message: 'Your message has been safely delivered to our Ministry team! Seek Grace!' });
});

// 4. Coupons Validation
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Invalid or missing coupon code.' });
  }

  const db = readDatabase();
  const coupon = db.coupons.find((c: any) => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon code not found.' });
  }

  if (coupon.minSpend && subtotal < coupon.minSpend) {
    return res.status(400).json({ success: false, message: `This coupon requires a minimum spend of GHC ${coupon.minSpend}.` });
  }

  res.json({ success: true, coupon });
});

// 5. Customer / Admin Registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Required fields missing: name, email, password are required.' });
  }

  const db = readDatabase();
  const exists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: 'A user account with this email address already exists.' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDatabase(db);

  const { passwordHash, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser, message: 'Account successfully registered!' });
});

// 6. Customer / Admin Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing email or password.' });
  }

  const db = readDatabase();
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email address or word verification password.' });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token: 'session_tni_' + safeUser.id });
});

// 7. Orders Listing / Placement
app.post('/api/orders/create', (req, res) => {
  const { items, subtotal, shippingFee, discountAmount, total, shippingAddress, paymentMethod, email } = req.body;
  if (!items || items.length === 0 || !shippingAddress) {
    return res.status(400).json({ success: false, message: 'Invalid order structure or empty items.' });
  }

  const db = readDatabase();
  const orderNum = 'TNI-' + Math.floor(10000 + Math.random() * 90000);
  
  // Create user order record
  const newOrder = {
    id: 'ord-' + Date.now(),
    orderNumber: orderNum,
    status: 'Pending',
    items,
    subtotal,
    shippingFee,
    discountAmount: discountAmount || 0,
    total,
    shippingAddress,
    paymentMethod,
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDatabase(db);

  res.json({ success: true, order: newOrder });
});

app.get('/api/orders/track', (req, res) => {
  const number = (req.query.number as string || '').trim().toUpperCase();
  if (!number) {
    return res.status(400).json({ success: false, message: 'Missing order tracker reference number.' });
  }

  const db = readDatabase();
  const order = db.orders.find((o: any) => o.orderNumber === number);

  if (!order) {
    return res.status(404).json({ success: false, message: `No active order found with locator code: ${number}` });
  }

  res.json({ success: true, order });
});

// Fetch user history
app.get('/api/orders/history', (req, res) => {
  const email = (req.query.email as string || '').toLowerCase();
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const db = readDatabase();
  // Filter by matching user record or manual shipping address match
  const filtered = db.orders.filter((o: any) => 
    (o.shippingAddress.email && o.shippingAddress.email.toLowerCase() === email) ||
    o.shippingAddress.phone === email || // support looking up by phone too!
    db.users.find((u: any) => u.email === email && u.id === o.userId)
  );

  res.json({ success: true, orders: filtered });
});

// ----------------------------------------------------
// PAYSTACK INTEGRATION
// Handles cards, mobile money (MTN, Vodafone), banks
// ----------------------------------------------------
app.post('/api/checkout/initialize-paystack', async (req, res) => {
  const { email, amount, orderId, phone } = req.body;
  if (!email || !amount || !orderId) {
    return res.status(400).json({ success: false, message: 'Missing payment metadata details.' });
  }

  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  const db = readDatabase();
  const orderObj = db.orders.find((o: any) => o.id === orderId);

  if (!orderObj) {
    return res.status(404).json({ success: false, message: 'Order structure mismatch.' });
  }

  // Paystack accepts amount in GHC Pesewas (x100)
  const amountInPesewas = Math.round(Number(amount) * 100);
  const transactionRef = 'tni_' + orderObj.orderNumber + '_' + Date.now().toString().slice(-6);

  // Update order with reference
  orderObj.paymentReference = transactionRef;
  writeDatabase(db);

  // Check if we have dynamic keys setup
  if (paystackKey && paystackKey !== 'MY_PAYSTACK_SECRET_KEY') {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          amount: amountInPesewas,
          reference: transactionRef,
          callback_url: `${process.env.APP_URL || 'http://localhost:3000'}/order-success?ref=${transactionRef}&order=${orderId}`,
          metadata: {
            orderId: orderId,
            orderNumber: orderObj.orderNumber,
            custom_fields: [
              { display_name: "Phone Number", variable_name: "phone_number", value: phone || "" }
            ]
          },
          channels: ['card', 'mobile_money', 'bank_transfer']
        })
      });

      const data = await response.json();
      if (data.status) {
        return res.json({
          success: true,
          authorization_url: data.data.authorization_url,
          reference: data.data.reference,
          isMock: false
        });
      } else {
        console.error('Paystack initialization failure:', data);
        // Fallback to elegant simulation so user preview works perfectly
      }
    } catch (e) {
      console.error('Paystack cURL error:', e);
      // Fallback
    }
  }

  // PREVIEW SIMULATOR FALLBACK (Always allow dynamic checkout test inside standard preview frame)
  // Let's return a special mock authorization URL that points directly to order success
  const targetUrl = `${req.headers.origin || 'http://localhost:3000'}/?page=order-success&ref=${transactionRef}&order=${orderId}`;
  res.json({
    success: true,
    authorization_url: targetUrl,
    reference: transactionRef,
    isMock: true,
    message: "Using interactive sandbox payment simulator. Seamless, no live money required."
  });
});

// Paystack manual verification verification
app.post('/api/checkout/verify', async (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ success: false, message: 'Missing transaction tracking reference.' });
  }

  const db = readDatabase();
  const orderObj = db.orders.find((o: any) => o.paymentReference === reference);

  if (!orderObj) {
    return res.status(404).json({ success: false, message: 'Order reference not matching.' });
  }

  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  let paymentCompleted = false;

  if (paystackKey && paystackKey !== 'MY_PAYSTACK_SECRET_KEY') {
    try {
      const resp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackKey}`
        }
      });
      const data = await resp.json();
      if (data.status && data.data.status === 'success') {
        paymentCompleted = true;
      }
    } catch (e) {
      console.error('Paystack verification error:', e);
    }
  } else {
    // In simulator mode, automatically verify as Completed!
    paymentCompleted = true;
  }

  if (paymentCompleted) {
    orderObj.paymentStatus = 'Completed';
    orderObj.status = 'Processing';
    writeDatabase(db);
    res.json({ success: true, status: 'Completed', order: orderObj });
  } else {
    res.json({ success: false, status: 'Pending', order: orderObj });
  }
});

// Webhook listener
app.post('/api/checkout/webhook', (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;

  if (paystackKey && paystackKey !== 'MY_PAYSTACK_SECRET_KEY' && signature) {
    const hash = crypto.createHmac('sha512', paystackKey).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== signature) {
      return res.status(401).json({ status: 'unauthorized' });
    }
  }

  const event = req.body;
  if (event && event.event === 'charge.success') {
    const reference = event.data.reference;
    const db = readDatabase();
    const orderObj = db.orders.find((o: any) => o.paymentReference === reference);
    if (orderObj) {
      orderObj.paymentStatus = 'Completed';
      orderObj.status = 'Processing';
      writeDatabase(db);
    }
  }

  res.json({ status: 'ok' });
});

// ----------------------------------------------------
// ADMIN OPERATIONS ENDPOINTS
// ----------------------------------------------------
app.get('/api/admin/stats', (req, res) => {
  const db = readDatabase();
  const totalSales = db.orders
    .filter((o: any) => o.paymentStatus === 'Completed')
    .reduce((sum: number, o: any) => sum + o.total, 0);

  const totalOrders = db.orders.length;
  const totalSubscribers = db.subscribers.length;
  const totalCustomers = db.users.filter((u: any) => u.role === 'customer').length;

  // Let's calculate low stock alerts from standard static products
  const lowStockThreshold = 15;
  const lowStockCount = PRODUCTS.filter(p => p.stock < lowStockThreshold).length;

  res.json({
    success: true,
    stats: {
      totalSales: totalSales,
      totalOrders,
      totalSubscribers,
      totalCustomers,
      lowStockCount
    },
    recentOrders: db.orders.slice(-5).reverse()
  });
});

app.post('/api/admin/orders/update-status', (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status) {
    return res.status(400).json({ success: false, message: 'Missing parameters.' });
  }

  const db = readDatabase();
  const order = db.orders.find((o: any) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  order.status = status;
  writeDatabase(db);
  res.json({ success: true, order, message: `Order status upgraded to ${status}!` });
});

// GET all orders for administration
app.get('/api/admin/orders', (req, res) => {
  const db = readDatabase();
  // Return all orders sorted by date descending style
  const sortedOrders = [...db.orders].reverse();
  res.json({ success: true, orders: sortedOrders });
});

// GET all users (customer, sub-admin, admin, super-admin)
app.get('/api/admin/users', (req, res) => {
  const db = readDatabase();
  // Strip password hash details before streaming to client
  const safeUsers = db.users.map((u: any) => {
    const { passwordHash, ...rest } = u;
    return rest;
  });
  res.json({ success: true, users: safeUsers });
});

// CREATE sub-admin or super-admin account
app.post('/api/admin/users/create', (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, password and selected role.' });
  }

  const db = readDatabase();
  const exists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: 'User account with this email already exists.' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
    role: role, // 'sub-admin' | 'admin' | 'super-admin'
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDatabase(db);

  const { passwordHash, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser, message: `Successfully registered new ${role} team member.` });
});

// UPDATE user usage and access role based controls
app.post('/api/admin/users/update-role', (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ success: false, message: 'Missing userId or role parameter.' });
  }

  const db = readDatabase();
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Target team member or user not found.' });
  }

  // Set the role
  user.role = role;
  writeDatabase(db);
  res.json({ success: true, userId, role, message: `Access role changed to ${role} successfully.` });
});

// CREATE promo coupon
app.post('/api/admin/coupons/create', (req, res) => {
  const { code, type, value, minSpend } = req.body;
  if (!code || !type || value === undefined) {
    return res.status(400).json({ success: false, message: 'Missing core coupon fields.' });
  }

  const db = readDatabase();
  const uppercaseCode = code.toUpperCase().trim();
  const exists = db.coupons.find((c: any) => c.code === uppercaseCode);
  if (exists) {
    return res.status(400).json({ success: false, message: 'Coupon with this code is already active!' });
  }

  const newCoupon = {
    code: uppercaseCode,
    type,
    value: Number(value),
    minSpend: minSpend ? Number(minSpend) : undefined
  };

  db.coupons.push(newCoupon);
  writeDatabase(db);
  res.json({ success: true, coupon: newCoupon, message: `Coupon code ${uppercaseCode} activated.` });
});

// GET all active newsletter subscribers list
app.get('/api/admin/subscribers', (req, res) => {
  const db = readDatabase();
  res.json({ success: true, subscribers: db.subscribers || [] });
});

// GET all contact inquiry ticket listings
app.get('/api/admin/contacts', (req, res) => {
  const db = readDatabase();
  const sortedContacts = [...(db.contacts || [])].reverse();
  res.json({ success: true, contacts: sortedContacts });
});

// Configure Vite integration or client delivery
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[THE NEW IDENTITY WEAR] Full-Stack server is successfully running at http://localhost:${PORT}`);
  });
}

startServer();
