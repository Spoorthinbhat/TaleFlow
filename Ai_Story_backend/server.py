from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from pinecone import Pinecone
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load AI Models
model = SentenceTransformer("all-MiniLM-L6-v2")

# Configure Pinecone
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Configure Gemini AI
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

def retrieve_top_sentences(query):
    """Finds the most relevant sentence and includes the next two sentences for context."""
    query_embedding = model.encode([query], convert_to_numpy=True).tolist()
    results = index.query(vector=query_embedding, top_k=1, include_metadata=True)

    if results["matches"]:
        retrieved_story = results["matches"][0]["metadata"]["text"]
        sentences = retrieved_story.split('. ')  # Split story into sentences

        # Compute similarity between query and each sentence
        sentence_embeddings = model.encode(sentences, convert_to_numpy=True)
        query_embedding = np.array(query_embedding).reshape(1, -1)

        similarities = np.dot(sentence_embeddings, query_embedding.T).flatten()  # Cosine similarity

        # Find the most similar sentence
        most_similar_idx = np.argmax(similarities)

        # Retrieve the most similar sentence + the next two sentences
        start_idx = most_similar_idx
        end_idx = min(start_idx + 3, len(sentences))  # Ensure we don't go out of bounds
        top_sentences = sentences[start_idx:end_idx]

        return top_sentences
    else:
        return ["No matching snippet found."]

def query_gemini_story(story, retrieved_snippet):
    """Generates a continuation for a story using the given story and retrieved snippet as context.
    Ensures grammatical accuracy, logical continuity, and proper structure.
    If the story exceeds 500 characters, it guides it toward a natural conclusion,
    ending with 'THE END' if appropriate.
    The AI should generate only new content and not repeat existing text.
    """

    Gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

    should_end = len(story) > 500

    full_prompt = (
        "You are a skilled storyteller. Your task is to continue the given story by adding one more, next sentence to the story while maintaining "
        "grammatical accuracy, logical flow, and a consistent narrative style. "
        "Do not repeat any existing content.\n\n"
        f"### Story So Far:\n{story}\n\n"
        f"### Contextual Inspiration:\n{' '.join(retrieved_snippet)}\n\n"
        "Use the above inspiration as guidance but do not copy it. Ensure that the story flows naturally, humanize the response, use simpler tone. "
        "Only give the next continued sentence. Other than that do not have anything else in the response. Do not repeat previous text given."
        "maintaining the established tone and style.\n\n"
    )

    if should_end:
        full_prompt += (
            "The story has exceeded 500 characters, so begin guiding it toward a satisfying conclusion. "
            "If a natural ending is possible, conclude with 'THE END.' Otherwise, continue progressing the "
            "narrative while preparing for an eventual resolution."
        )
    else:
        full_prompt += "Continue the story in a coherent and engaging manner."

    response = Gemini_model.generate_content(full_prompt)

    return response.text.strip()

def format_story_with_ai(story_text):
    """Formats a story properly using a generative AI, ensuring correct paragraph structure, spacing, and readability."""

    Gemini_model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

    prompt = (
        "You are an expert at formatting stories for readability. "
        "Take the following story and format it properly, ensuring:\n"
        "- Correct paragraph breaks.\n"
        "- Proper indentation or spacing.\n"
        "- Clear dialogue formatting with quotes on new lines.\n"
        "- Consistent punctuation and capitalization.\n"
        "- A polished and professional appearance.\n\n"
        "Here is the story:\n\n"
        f"{story_text}\n\n"
        "Please return only the formatted story without adding explanations or extra commentary."
    )

    response = Gemini_model.generate_content(prompt)
    return response.text.strip()

@app.route("/generate", methods=["POST"])
@app.route("/generate", methods=["POST"])
def generate_story():
    """API Endpoint to handle story generation."""
    try:
        data = request.get_json()
        new_input = data.get("new_input", "")
        context = data.get("context", "")
        if not new_input:
            return jsonify({"error": "Invalid request, 'input' field is required"}), 400
        
        # user_input = data["input"]
        print(f"Received input: {new_input}")  # Debugging log
        print(f"Story so far: {context}")
        # Dummy AI Response (Replace with actual AI logic)
        retrieved_snippet = retrieve_top_sentences(new_input)
        ai_response = query_gemini_story(context, retrieved_snippet)
        # ai_story = f"{ai_response}"
        
        return jsonify({"response": ai_response})
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Server error"}), 500

# def generate_story():
#     data = request.json
#     story = data.get("story")

#     if not story:
#         return jsonify({"error": "No story provided"}), 400

#     # Retrieve relevant snippet from Pinecone
#     retrieved_snippet = retrieve_top_sentences(story)

#     # Continue story generation
#     story_continuation = query_gemini_story(story, retrieved_snippet)

#     return jsonify({"story_continuation": story_continuation})

@app.route("/format-story", methods=["POST"])
def format_story():
    data = request.json
    story_text = data.get("story_text")

    if not story_text:
        return jsonify({"error": "No story text provided"}), 400

    formatted_story = format_story_with_ai(story_text)

    return jsonify({"formatted_story": formatted_story})

if __name__ == "__main__":
    app.run(debug=True)
