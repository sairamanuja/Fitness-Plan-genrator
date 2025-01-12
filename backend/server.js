import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Form from './formSchema.js';
const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: 'https://fitness-plan-genrator-production.up.railway.app', // Replace with your actual frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// MongoDB connection string
const uri = "mongodb+srv://ramanuja39:sairama%40123@cluster0.580qe.mongodb.net/form";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose Schema

// Google AI Configuration
const genAI = new GoogleGenerativeAI("AIzaSyA81LE2JAgxYY78kftNJ312fhQg_7mmjKU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        // Save form data to MongoDB
        const form = new Form(req.body);
        const savedForm = await form.save();

        // Respond with the generated userId
        res.status(200).json({ userId: savedForm._id });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "Failed to save form data." });
    }
});

// Route to retrieve form data based on user ID
app.get('/retrieve/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID');
        }
        const userForm = await Form.findOne({ _id: userId });
        if (!userForm) {
            return res.status(404).send('User form not found');
        }
        res.status(200).json(userForm);
    } catch (err) {
        console.error('Error retrieving form data:', err);
        res.status(500).send('Error retrieving form data.');
    }
});

// Route to generate a personalized fitness plan using Google AI
app.get('/generate-fitness-plan/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userForm = await Form.findOne({ _id: userId });
        if (!userForm) {
            return res.status(404).send('User form not found');
        }

        const prompt = `Create a personalized fitness plan for the following user:
            - Age: ${userForm.age}
            - Gender: ${userForm.gender}
            - Fitness Level: ${userForm.fitnessLevel}
            - Physical Activity: ${userForm.physicalActivity}
            - Weight: ${userForm.weight}
            - Height: ${userForm.height}
            - Goal: ${userForm.goal}
            - Specific Target: ${userForm.specificTarget}
            - Medical Condition: ${userForm.medicalCondition}
            - Workout Type: ${userForm.workoutType}
            - Workout Days: ${userForm.workoutDays}
            - Workout Length: ${userForm.workoutLength}
            - Diet: ${userForm.diet}
            - Diet Recommendations: ${userForm.dietRecommendations}
            - Motivation: ${userForm.motivation}

           . Weekly and Day-wise Workout Schedule
Provide a 7-day plan with specific exercises, targeting different muscle groups and incorporating strength training, cardio, and flexibility.
Mention sets, reps, intensity levels (e.g., low, moderate, high), and rest periods for each exercise.
2. Customized Diet Plan
Create a day-wise meal plan for the entire week with meal timing for breakfast, lunch, dinner, and snacks.
Include macronutrient distribution (proteins, carbs, fats) tailored to fitness goals (e.g., fat loss, muscle gain).
3. Progress Tracking
Suggest weekly tracking methods (e.g., body weight, measurements, progress photos, strength benchmarks).
Include guidance on journaling workouts, nutrition, and energy levels to identify trends and adjust the plan as needed.
4. Safety Considerations
Provide safety recommendations for exercises and dietary adjustments, especially for individuals with common medical conditions (e.g., joint pain, hypertension, diabetes).
Include alternative exercises or meal substitutions if needed.
5. Motivation Tips and Strategies
Suggest day-specific motivational strategies to maintain adherence. For example, goal visualization, rewarding progress, or incorporating fun activities.
Provide tips for overcoming plateaus and staying committed long-term.
This plan should focus on creating a balanced and sustainable approach to fitness, addressing both physical and mental health.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.status(200).json({
            fitnessPlan: response.text(),
            metadata: {
                model: "gemini-1.5-pro",
                created: new Date().toISOString()
            }
        });

    } catch (err) {
        console.error('Error generating fitness plan:', err);
        res.status(500).json({
            error: 'Error generating fitness plan',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Route to update form data
app.put('/update/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID');
        }
        
        const updatedForm = await Form.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedForm) {
            return res.status(404).send('User form not found');
        }
        
        res.status(200).json(updatedForm);
    } catch (err) {
        console.error('Error updating form data:', err);
        res.status(500).send('Error updating form data.');
    }
});

// Route to delete form data
app.delete('/delete/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID');
        }
        
        const deletedForm = await Form.findByIdAndDelete(userId);
        
        if (!deletedForm) {
            return res.status(404).send('User form not found');
        }
        
        res.status(200).send('Form data deleted successfully');
    } catch (err) {
        console.error('Error deleting form data:', err);
        res.status(500).send('Error deleting form data.');
    }
});

// Route to serve index2.html
app.get('/fitness-plan', (req, res) => {
    res.sendFile('index2.html', { root: '../' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
