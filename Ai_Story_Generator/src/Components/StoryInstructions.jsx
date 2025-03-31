import React from 'react';

function StoryInstructions() {
  return (
    <div className="max-w-3xl mx-auto p-6 border-4 border-yellow-600 rounded-2xl shadow-lg bg-white text-gray-900 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-yellow-700 text-center mb-4">
        This Will Be Your Story Title
      </h2>
      <p className="text-lg text-gray-700 mb-4 text-center">
        Unleash your creativity in this dynamic storytelling game! Here’s how it
        works:
      </p>
      <ol className="list-decimal list-inside space-y-3 text-gray-800">
        <li>
          <strong>Start the Story</strong> – Type the first sentence to begin
          your adventure.
        </li>
        <li>
          <strong>AI Responds</strong> – The AI will continue the story with its
          own sentence.
        </li>
        <li>
          <strong>Take Turns</strong> – Keep alternating sentences with the AI
          to build the narrative together.
        </li>
        <li>
          <strong>End the Story</strong> – When you feel the story has reached a
          satisfying conclusion, type <strong>"THE END"</strong> at the end of
          your sentence. The AI may also decide to end the story in the same way
          if it feels complete.
        </li>
      </ol>
      <p className="text-lg text-gray-700 mt-6 text-center font-semibold">
        Let the story unfold in exciting and unexpected ways—start your journey
        now!
      </p>
      <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-gray-800">
        <h3 className="text-xl font-semibold mb-2">
          Tips for Crafting Great Stories:
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Be creative! The more unexpected, the better.</li>
          <li>Keep your sentences open-ended to let the story flow.</li>
          <li>
            Experiment with different genres—mystery, sci-fi, adventure, and
            more!
          </li>
          <li>Don’t be afraid to take twists and turns.</li>
        </ul>
      </div>
    </div>
  );
}

export default StoryInstructions;
