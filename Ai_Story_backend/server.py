from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import onnxruntime as ort  # ONNX Runtime
from onnxruntime_extensions import get_library_path  # Import extensions
import google.generativeai as genai
from pinecone import Pinecone
import os
from dotenv import load_dotenv
from waitress import serve
from transformers import AutoTokenizer

# Load environment variables
load_dotenv()
PORT = int(os.getenv("PORT", 5000))

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load ONNX Model with Extensions
ONNX_MODEL_PATH = "./all_MiniLM_L12_v2.onnx"  # Ensure this is the correct path
session_options = ort.SessionOptions()
session_options.register_custom_ops_library(
    get_library_path()
)  # Register ONNX Extensions

onnx_session = ort.InferenceSession(
    ONNX_MODEL_PATH,
    sess_options=session_options,
    providers=["CPUExecutionProvider"],
)

# Configure Pinecone
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
pc =Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Configure Gemini AI
genai.configure(api_key=os.getenv("GENAI_API_KEY"))
Gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

# Load Tokenizer
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L12-v2")


def encode_text_onnx(text):
    """Encodes text into embeddings using the ONNX model."""
    # ONNX model expects raw text as input, not tokenized IDs
    onnx_input_dict = {
        onnx_session.get_inputs()[0].name: np.array([text], dtype=object)
    }

    # Run inference on ONNX model
    ort_output = onnx_session.run(None, onnx_input_dict)
    embedding = ort_output[0]  # Extract the first output (embedding)

    return embedding.flatten().tolist()


def retrieve_top_sentences(query):
    """Finds the most relevant sentence and includes the next two sentences for context."""
    query_embedding = encode_text_onnx(query)
    results = index.query(vector=query_embedding, top_k=1, include_metadata=True)

    if results["matches"]:
        retrieved_story = results["matches"][0]["metadata"]["text"]
        sentences = retrieved_story.split(". ")  # Split story into sentences

        # Compute similarity between query and each sentence
        sentence_embeddings = [encode_text_onnx(sent) for sent in sentences]
        query_embedding = np.array(query_embedding).reshape(1, -1)

        similarities = np.dot(
            sentence_embeddings, query_embedding.T
        ).flatten()  # Cosine similarity

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
    """Generates a continuation for a story using the given story and retrieved snippet as context."""

    should_end = len(story) > 500

    full_prompt = (
        "You are a skilled storyteller. Your task is to continue the given story by adding one more sentence while maintaining "
        "grammatical accuracy, logical flow, and a consistent narrative style. "
        "Do not repeat any existing content.\n\n"
        f"### Story So Far:\n{story}\n\n"
        f"### Contextual Inspiration:\n{' '.join(retrieved_snippet)}\n\n"
        "Use the above inspiration as guidance but do not copy it. Ensure that the story flows naturally, humanize the response, use a simpler tone. "
        "Only generate the next sentence. Do not repeat previous text given."
    )

    if should_end:
        full_prompt += "The story is over 500 characters, so guide it toward a natural ending. If appropriate, conclude with 'THE END.'"

    response = Gemini_model.generate_content(full_prompt)

    return response.text.strip()


def format_story_with_ai(story_text):
    """Formats a story properly using a generative AI, ensuring correct paragraph structure, spacing, and readability."""

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


def get_title(story_text):
    """Generates a story title using a generative AI."""

    prompt = (
        "You are an expert at giving titles to stories. "
        "Take the followig story and give it a relevant title."
        "Here is the story:\n\n"
        f"{story_text}\n\n"
        "Please return only the title without adding explanations or extra commentary."
    )

    response = Gemini_model.generate_content(prompt)
    return response.text.strip()


@app.route("/generate", methods=["POST"])
def generate_story():
    """API Endpoint to handle story generation."""
    try:
        data = request.get_json()
        new_input = data.get("new_input", "")
        context = data.get("context", "")
        if not new_input:
            return (
                jsonify({"error": "Invalid request, 'new_input' field is required"}),
                400,
            )

        retrieved_snippet = retrieve_top_sentences(new_input)
        ai_response = query_gemini_story(context, retrieved_snippet)

        return jsonify({"response": ai_response})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Server error"}), 500


@app.route("/format-story", methods=["POST"])
def format_story():
    data = request.json
    story_text = data.get("story_text")

    if not story_text:
        return jsonify({"error": "No story text provided"}), 400

    formatted_story = format_story_with_ai(story_text)
    story_title = get_title(story_text)

    return jsonify({"title": story_title, "formatted_story": formatted_story})


@app.route("/", methods=["GET"])
def default():
    return "<h1>Hello world</h1>"


if __name__ == "__main__":
    print(f"Serving the server on port: {PORT}")
    serve(app, host="0.0.0.0", port=PORT)
