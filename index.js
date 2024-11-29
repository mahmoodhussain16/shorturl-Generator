const express=require('express');
const app=express()

const cookieParser = require('cookie-parser');

const urlRoute=require('./routes/url')
const path=require('path')

const port=8007
const {connectToMongoDb}=require('./connect')
const staticRoute=require('./routes/staticRouter')
const userRoute=require('./routes/user')
const { MongoClient } = require('mongodb');
const { restrictToLoggedInUserOnly, checkAuth } = require('./middleware/auth');
connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(()=>console.log('MongoDb connected'))  
const session = {};
// MongoDB Connection Setup
const client = new MongoClient('mongodb://127.0.0.1:27017');
let db;

client.connect()
    .then(() => {
        db = client.db('short-url');
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit the app if connection fails
    });

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))


app.use('/url',restrictToLoggedInUserOnly, urlRoute)
app.use('/',checkAuth, staticRoute)
app.use('/user',userRoute)


app.use((req, res, next) => {
    if (!db) {
        return res.status(503).json({ error: 'Database not initialized' });
    }
    req.db = db; // Attach db to request object
    next();
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usersCollection = req.db.collection('users'); // Access the users collection
        const user = await usersCollection.findOne({ email });

        // Check if user exists and password matches
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Save session
        const sessionKey = Date.now().toString();
        session[sessionKey] = user.email;
        console.log('Session after login:', session);
        console.log('Session key:', sessionKey); // Save user email in session store
        res.cookie('session_id', sessionKey, { httpOnly: true }); // Set session cookie
    
        return res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.use((req, res, next) => {
    if (req.path === '/login') {
        return next(); // Skip session check for login route
    }

    const sessionKey = req.cookies.session_id;

    // Check if session exists
    if (!sessionKey || !session[sessionKey]) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach user to request object
    req.user = { email: session[sessionKey] }; // Retrieve user email from session
    next();
});





app.listen(port,()=>console.log(`Server started at port ${port}`))