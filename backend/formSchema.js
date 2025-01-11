const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    age: { type: String, required: true },
    gender: { type: String, required: true },
    fitnessLevel: { type: String, required: true },
    physicalActivity: { type: String, required: true },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    goal: { type: String, required: true },
    specificTarget: { type: String, required: true },
    medicalCondition: { type: String, required: true },
    diet: { type: String, required: true },
    medications: { type: String, required: true },
    workoutType: { type: String, required: true },
    workoutDays: { type: String, required: true },
    workoutLength: { type: String, required: true },
    dietRecommendations: { type: String, required: true },
    meals: { type: String, required: true },
    snacking: { type: String, required: true },
    progressFrequency: { type: String, required: true },
    progressMetrics: { type: String, required: true },
    motivation: { type: String, required: true },
    challenges: { type: String, required: true }
});

module.exports = mongoose.model("Form", formSchema);
