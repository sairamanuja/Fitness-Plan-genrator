# Fitness Plan Generator

A web application that generates personalized fitness plans using AI, RAG (Retrieval-Augmented Generation), and vector databases based on user inputs such as goals, fitness level, and preferences.

## Overview

The Fitness Plan Generator is an advanced tool designed to create customized workout and nutrition plans tailored to individual needs. By integrating **AI** and **RAG (Retrieval-Augmented Generation)**, the application provides highly personalized and context-aware fitness recommendations. It also leverages a **vector database** for efficient storage and retrieval of fitness-related data.

## Features

- **AI-Powered Fitness Plans**: Generate workout and nutrition plans using AI models like Gemini.
- **RAG Integration**: Retrieve relevant fitness information and generate context-aware recommendations.
- **Vector Database**: Efficiently store and query fitness-related data for faster and more accurate results.
- **Personalized Recommendations**: Tailored plans based on user goals (e.g., weight loss, muscle gain, endurance).
- **Nutrition Guidance**: AI-generated nutrition recommendations to complement fitness plans.
- **User-Friendly Interface**: Easy-to-use form for inputting fitness goals, level, and preferences.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: 
  - MongoDB (for storing user data and plans)
  - Vector Database (for storing and querying fitness-related embeddings)
- **AI Integration**: 
  - Gemini API (for generating fitness and nutrition plans)
  - RAG (Retrieval-Augmented Generation for context-aware recommendations)
- **Libraries**:
  - `@google/generative-ai` (GoogleGenerativeAI for interacting with Gemini AI)
  - `langchain/text_splitter` (RecursiveCharacterTextSplitter for splitting text into chunks)
  - `langchain/vectorstores/memory` (MemoryVectorStore for in-memory vector storage)
  - `@langchain/google-genai` (GoogleGenerativeAIEmbeddings for generating embeddings using Gemini)
  
## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sairamanuja/Fitness-Plan-Generator.git
   cd Fitness-Plan-Generator

2. **Install dependencies**:
   ```bash
   npm install

3. **Start the app**:
    ```bash
   npm run dev
### 3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
   ```.env
MONGODB_URL=<your-mongodb-connection-string>
GEMINI_API_KEY=<your-gemini-api-key>
=
```   
