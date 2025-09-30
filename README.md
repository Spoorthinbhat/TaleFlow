# TaleFlow 📚✨

> An AI-powered collaborative storytelling platform that transforms creative writing into an interactive, gamified experience.

**Live Demo:** [https://taleflow.poseidon0z.com/](https://taleflow.poseidon0z.com/)

## 🎯 Overview and Purpose

TaleFlow is a web-based platform designed to transform creative writing into an interactive, collaborative, and engaging experience. Developed by **Spoorthi N Bhat**, **Aditya Prabhu**, and **Ravi Ranjan Raj**, the platform acts as a conversational writing partner, allowing users to co-create stories with an AI in real-time.

### The Core Problem We Solve

Many writers, especially beginners, face several obstacles:

- **Writer's Block and Anxiety**: The fear of starting with a blank page
- **Lack of Experience**: Difficulties with story structure, pacing, and character development
- **Absence of Feedback**: Solitary writing lacks instant feedback
- **Maintaining Momentum**: Short attention spans and confidence issues in the digital age

TaleFlow addresses these challenges by making storytelling more accessible, intuitive, and enjoyable for users of all skill levels.

## 🎮 How It Works

TaleFlow employs a gamified, turn-based interaction model that resembles "story tennis":

1. **Start the Story**: User writes the first sentence
2. **AI Responds**: Our AI contributes the next sentence, building upon the user's input
3. **Take Turns**: Alternating sentence-by-sentence exchange continues
4. **End the Story**: Type "THE END" to finish, or let our dynamic completion logic guide the story to a natural conclusion

This interactive format reduces writing pressure, encourages creativity, and helps overcome creative blocks through continuous inspiration and support.

## 🏗️ Technical Architecture

### AI Model and Framework

- **Retrieval-Augmented Generation (RAG)** model for enhanced narrative generation
- **Gemini 2.0 Flash** as the core language model for fluent, contextually aware responses
- **Semantic retrieval** mechanism for coherent and consistent AI contributions

### Data and Database

- **Dataset**: ~4,000 curated short stories from Reddit creative writing communities
- **Vectorization**: Stories converted to embeddings using `all-MiniLM-L6-v2` sentence transformer
- **Vector Database**: Pinecone for high-speed, scalable similarity searches

### System Architecture

```
React Frontend ↔ Flask Backend ↔ Gemini AI Service
                      ↓
              Pinecone Vector Database
```

## 📊 Performance Results

### Quantitative Metrics

- **Narrative Consistency**: High cosine similarity scores showing increasing consistency
- **Creativity**: Novelty scores demonstrating original AI contributions over time
- **Plot Progression**: Consistent introduction of new plot elements
- **Sentiment Flow**: Dynamic emotional arcs reflecting realistic narrative structures

### User Feedback

- **100%** of participants found it easier to write with TaleFlow
- **4.67/5** average rating for AI engagement
- **4.56/5** average rating for AI creativity

### Expert Analysis

- TaleFlow co-created story scored **9.2/10** (vs 7.6/10 for user-only stories)
- Superior performance in coherence, fluency, logicality, and interestingness

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Pinecone account
- Google Gemini API key

### Step 1: Setup Vector Database

1. Navigate to the `Collab stuff/` directory
2. Open `Ai_story_generator.ipynb`
3. Set your API keys in the notebook
4. Run all cells to upload the Reddit short stories dataset to Pinecone

### Step 2: Backend Setup

1. Navigate to the `Ai_Story_backend/` directory:

```bash
cd Ai_Story_backend
```

2. Create a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:

```env
PINECONE_API_KEY=your_pinecone_api_key
GENAI_API_KEY=your_gemini_api_key
PINECONE_INDEX_NAME=your_index_name
PORT=5000
```

5. Run the backend server:

```bash
python server.py
```

### Step 3: Frontend Setup

1. Navigate to the `Ai_Story_Generator/` directory:

```bash
cd Ai_Story_Generator
```

2. Install dependencies:

```bash
npm install
```

3. For development:

```bash
npm run dev
```

4. For production:

```bash
npm run build
npm run preview
```

The frontend will automatically connect to the backend using the address specified in your `.env` file.

## 📁 Project Structure

```
├── README.md
├── Ai_Story_backend/           # Flask backend server
│   ├── all_MiniLM_L12_v2.onnx # ONNX model for embeddings
│   ├── requirements.txt        # Python dependencies
│   └── server.py              # Main server file
├── Ai_Story_Generator/         # React frontend
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Chat.jsx       # Main chat interface
│   │   │   ├── FullStory.jsx  # Story display component
│   │   │   ├── Heading.jsx    # Header component
│   │   │   └── StoryInstructions.jsx
│   │   └── ...
│   └── ...
└── Collab stuff/
    ├── Ai_story_generator.ipynb # Dataset setup notebook
    └── reddit_short_stories.txt # Raw dataset
```

## 🛠️ Technologies Used

- **Frontend**: React, Vite, CSS3
- **Backend**: Flask, Python
- **AI/ML**: Gemini 2.0 Flash, ONNX, Sentence Transformers
- **Database**: Pinecone Vector Database
- **Dataset**: Reddit Short Stories (Kaggle)

## 🎯 Use Cases

- **Aspiring Writers**: Overcome writer's block and gain confidence
- **Creative Brainstorming**: Generate ideas and explore narrative possibilities
- **Educational**: Learn story structure and narrative techniques
- **Entertainment**: Enjoy collaborative storytelling as a fun activity

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Spoorthi N Bhat**
- **Aditya Prabhu**
- **Ravi Ranjan Raj**

## 🔗 Links

- **Live Demo**: [https://taleflow.poseidon0z.com/](https://taleflow.poseidon0z.com/)
- **Dataset**: Reddit Short Stories (Kaggle)

---

_TaleFlow - Where human creativity meets AI intelligence to craft extraordinary stories, one sentence at a time._ ✨
