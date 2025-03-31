import React, { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa';

function FullStory({ storyText }) {
  const [story, setStory] = useState({ title: '', formattedStory: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/format-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ story_text: storyText }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }

        const data = await response.json();
        setStory({ title: data.title, formattedStory: data.formatted_story });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storyText) {
      fetchStory();
    }
  }, [storyText]);

  const copyToClipboard = () => {
    const textToCopy = `${story.title}\n\n${story.formattedStory}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert('Story copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading story...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 border-4 border-yellow-600 rounded-2xl shadow-lg bg-white text-gray-900 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-yellow-700 text-center flex-grow">
          {story.title}
        </h2>
        <button
          onClick={copyToClipboard}
          className="ml-4 p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-md"
        >
          <FaCopy size={20} />
        </button>
      </div>
      <pre className="text-lg text-gray-700 mb-4 whitespace-pre-wrap">
        {story.formattedStory}
      </pre>
    </div>
  );
}

export default FullStory;
