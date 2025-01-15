import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import Form from './formSchema.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

// MongoDB Connection
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// AI Model Initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

// Vector Store Initialization
let vectorStore;

async function initializeVectorStore() {
    try {
        // Read the knowledge base
        const fitnessKnowledge = await fs.readFile('./data/fitness_knowledge.txt', 'utf8');
        
        // Split text into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        
        const docs = await textSplitter.createDocuments([fitnessKnowledge]);
        
        // Create vector store
        vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
        console.log('Vector store initialized successfully');
    } catch (error) {
        console.error('Error initializing vector store:', error);
    }
}

// Initialize vector store when server starts
initializeVectorStore();

// Routes
app.post('/submit', async (req, res) => {
    try {
        const form = new Form(req.body);
        const savedForm = await form.save();
        res.status(200).json({ userId: savedForm._id });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "Failed to save form data." });
    }
});

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

app.get('/generate-fitness-plan/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userForm = await Form.findOne({ _id: userId });
        if (!userForm) {
            return res.status(404).send('User form not found');
        }

        // Create search query based on user's profile
        const searchQuery = `${userForm.goal} ${userForm.fitnessLevel} ${userForm.workoutType} ${userForm.medicalCondition}`;

        // Get relevant context from vector store
        const similarDocs = await vectorStore.similaritySearch(searchQuery, 3);
        const relevantContext = similarDocs.map(doc => doc.pageContent).join('\n\n');

        const prompt = `Based on the following relevant fitness information:
${relevantContext}

Create a detailed, personalized fitness plan for this user:
Age: ${userForm.age}
Gender: ${userForm.gender}
Fitness Level: ${userForm.fitnessLevel}
Physical Activity: ${userForm.physicalActivity}
Weight: ${userForm.weight}
Height: ${userForm.height}
Goal: ${userForm.goal}
Specific Target: ${userForm.specificTarget}
Medical Condition: ${userForm.medicalCondition}
Workout Type: ${userForm.workoutType}
Workout Days: ${userForm.workoutDays}
Workout Length: ${userForm.workoutLength}
Diet: ${userForm.diet}
Diet Recommendations: ${userForm.dietRecommendations}
Motivation: ${userForm.motivation}

Please provide:
1. Weekly Workout Schedule
- Day-by-day exercise plan
- Sets, reps, and intensity for each exercise
- Rest periods and recovery recommendations

2. Nutrition Plan
- Daily meal structure
- Macronutrient distribution
- Specific food recommendations
- Meal timing

3. Progress Tracking
- Weekly measurement methods
- Progress indicators
- Adjustment guidelines

4. Safety Guidelines
- Exercise form tips
- Medical condition considerations
- Warning signs to watch for

5. Motivation Strategy
- Daily motivation tips
- Adherence techniques
- Progress celebration points`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.status(200).json({
            fitnessPlan: response.text(),
            metadata: {
                model: "gemini-1.5-pro",
                created: new Date().toISOString(),
                relevantSources: similarDocs.length
            }
        });

    } catch (err) {
        console.error('Error generating fitness plan:', err);
        res.status(500).json({
            error: 'Error generating fitness plan',
            details: err.message
        });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
