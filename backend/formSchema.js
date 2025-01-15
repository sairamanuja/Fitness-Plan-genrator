import mongoose from 'mongoose';

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
}, {
    timestamps: true
});

const Form = mongoose.model('Form', formSchema);
export default Form;
