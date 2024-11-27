const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database'); // เพิ่มบรรทัดนี้
const aiRoutes = require('./routes/aiRoutes');


// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const repairRoutes = require('./routes/repair');
const partsRoutes = require('./routes/parts');

const app = express();
const trackRoutes = require('./routes/track');
app.use('/', trackRoutes);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/ai', aiRoutes);
// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    delete req.session.error;
    delete req.session.success;
    next();
});

// Routes
app.use('/', authRoutes);              
app.use('/dashboard', dashboardRoutes); 
app.use('/repair', repairRoutes);      
app.use('/parts', partsRoutes);        

// Default Route
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Route สำหรับค้นหาลูกค้า
app.get('/api/customers/search', (req, res) => {
    const phone = req.query.phone?.trim();

    if (!phone) {
        return res.status(400).json({
            success: false,
            message: 'กรุณาระบุเบอร์โทรศัพท์'
        });
    }

    const query = `
        SELECT 
            id, 
            first_name, 
            last_name, 
            phone_number 
        FROM customer 
        WHERE phone_number = ?
    `;
    
    db.query(query, [phone], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล'
            });
        }

        // ล็อกผลลัพธ์เพื่อดีบัก
        console.log('Search results:', results);

        res.json({
            success: true,
            customer: results[0] || null
        });
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).render('error', {
        title: 'ไม่พบหน้าที่คุณต้องการ',
        message: 'ขออภัย ไม่พบหน้าที่คุณต้องการ',
        error: {
            status: 404
        }
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        title: 'เกิดข้อผิดพลาด',
        message: err.message || 'เกิดข้อผิดพลาดบางอย่าง',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});