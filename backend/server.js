const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Resource = require('./models/Resource');

dotenv.config();

const app = express();
const PORT = 8000;
const JWT_SECRET = "super_secret_hackathon_key_2026";

app.use(cors());
// Fix for image upload size limit
app.use(express.json({ limit: '50mb' }));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.error('❌ Database connection failed:', err));

// --- REGISTER ROUTE ---
app.post('/register', async (req, res) => {
    console.log("🔥 REGISTER ROUTE HIT! Data:", req.body);
    try {
        const { fullName, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword, role, trustScore: 100 });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// --- LOGIN ROUTE ---
app.post('/login', async (req, res) => {
    console.log("🔑 LOGIN ROUTE HIT! Data:", req.body);
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            message: "Login successful!", 
            token, 
            user: { 
                _id: user._id,
                fullName: user.fullName, 
                email: user.email, 
                role: user.role, 
                trustScore: user.trustScore 
            } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// --- GET ALL RESOURCES ---
app.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources" });
    }
});

// --- POST NEW RESOURCE ---
app.post('/resources', async (req, res) => {
    try {
        const { title, description, category, condition, image, ownerId, ownerName } = req.body;
        
        const newResource = new Resource({
            title,
            description,
            category,
            condition: condition || 'Good',
            image: image || '',
            ownerId,
            ownerName,
            status: 'available'
        });
        
        await newResource.save();
        res.status(201).json({ message: "Resource posted successfully!", resource: newResource });
    } catch (error) {
        console.error("Post Resource Error:", error);
        res.status(500).json({ message: "Error posting resource" });
    }
});

// --- REQUEST RESOURCE (Status: PENDING) ---
app.post('/resources/:id/request', async (req, res) => {
    try {
        const { requesterName, requesterId } = req.body;
        const resource = await Resource.findById(req.params.id);
        
        if (!resource) return res.status(404).json({ message: "Resource not found" });
        if (resource.status !== 'available') return res.status(400).json({ message: "Item not available" });

        resource.status = 'pending';
        resource.requesterName = requesterName;
        resource.requesterId = requesterId;
        await resource.save();

        res.json({ message: "Request sent! Waiting for owner approval.", resource });
    } catch (error) {
        res.status(500).json({ message: "Error requesting resource" });
    }
});

// --- APPROVE REQUEST ---
app.post('/resources/:id/approve', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        resource.status = 'rented';
        await resource.save();
        res.json({ message: "Request approved!", resource });
    } catch (error) {
        res.status(500).json({ message: "Error approving" });
    }
});

// --- REJECT REQUEST ---
app.post('/resources/:id/reject', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        resource.status = 'available';
        resource.requesterName = null;
        resource.requesterId = null;
        await resource.save();
        res.json({ message: "Request rejected.", resource });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting" });
    }
});

// --- STUDENT CHECK-IN (Student confirms they picked it up) ---
app.post('/resources/:id/checkin', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (resource.status !== 'rented') return res.status(400).json({ message: "Item not ready for pickup" });
        
        resource.status = 'picked_up';
        await resource.save();
        res.json({ message: "Check-in successful! Owner notified.", resource });
    } catch (error) {
        res.status(500).json({ message: "Error checking in" });
    }
});

// --- COMPLETE & REPORT CONDITION ---
app.post('/resources/:id/complete', async (req, res) => {
    try {
        const { conditionNotes } = req.body;
        const resource = await Resource.findById(req.params.id);
        
        resource.status = 'available';
        resource.requesterName = null;
        resource.requesterId = null;
        resource.conditionNotes = conditionNotes || 'Returned in good condition';
        await resource.save();

        const owner = await User.findById(resource.ownerId);
        let newScore = 100;
        if (owner) {
            if (owner.trustScore < 100) {
                owner.trustScore += 5;
                if (owner.trustScore > 100) owner.trustScore = 100;
            }
            await owner.save();
            newScore = owner.trustScore;
        }

        res.json({ message: "Transaction complete!", newTrustScore: newScore });
    } catch (error) {
        res.status(500).json({ message: "Error completing transaction" });
    }
});

// --- ROOT ROUTE ---
app.get('/', (req, res) => {
    res.json({ message: "ShareSpace Backend is running!" });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});