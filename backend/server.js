const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Assuming Gemini SDK (replace with actual SDK package name)
const { Gemini } = require('google-gemini-sdk');  // Gemini for text generation

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection string
const uri = "mongodb+srv://ramanuja39:sairama%40123@cluster0.580qe.mongodb.net/form";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose Schema
const formSchema = new mongoose.Schema({
    age: String,
    gender: String,
    fitnessLevel: String,
    physicalActivity: String,
    weight: String,
    height: String,
    goal: String,
    specificTarget: String,
    medicalCondition: String,
    diet: String,
    medications: String,
    workoutType: String,
    workoutDays: String,
    workoutLength: String,
    dietRecommendations: String,
    meals: String,
    snacking: String,
    progressFrequency: String,
    progressMetrics: String,
    motivation: String,
    challenges: String
});

// Create a Mongoose model
const Form = mongoose.model('Form', formSchema);

// Gemini client setup (hypothetical example)
const geminiClient = new Gemini({
    apiKey: 'AIzaSyA81LE2JAgxYY78kftNJ312fhQg_7mmjKU',  // Replace with your actual Gemini API key
});

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        const formData = new Form(req.body);
        await formData.save();
        res.status(200).send('Form data saved successfully!');
    } catch (err) {
        console.error('Error saving form data:', err);
        res.status(500).send('Error saving form data.');
    }
});

// Route to retrieve form data based on user ID
app.get('/retrieve/:userId', async (req, res) => {
    let userId = req.params.userId.trim();  // Trim any extra whitespace or newline characters

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

// Route to generate a personalized fitness plan using Gemini
app.get('/generate-fitness-plan/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userForm = await Form.findOne({ _id: userId });

        if (!userForm) {
            return res.status(404).send('User form not found');
        }

        const prompt = `
            Create a personalized fitness plan for the following user:
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

            Generate a workout and diet plan tailored to these needs.
        `;

        // Call Gemini API (this is a placeholder as Gemini API may differ)
        const response = await geminiClient.generateText({
            prompt: prompt,
            model: 'gemini-3b',  // Assuming Gemini model variant name
        });

        res.status(200).json({ fitnessPlan: response.generatedText.trim() });
    } catch (err) {
        console.error('Error generating fitness plan:', err);
        res.status(500).send('Error generating fitness plan.');
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
