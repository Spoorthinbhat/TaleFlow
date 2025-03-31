import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaRobot, FaTimes, FaUserCircle } from 'react-icons/fa';

function StoryGenerator() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef(null);
  const [storyContext, setStoryContext] = useState(''); // Holds the full conversation
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    console.log('Input', input);

    // Update the story context with the new user input BEFORE sending it to the API
    const updatedContext = storyContext + 'User: ' + input + '\n';
    setStoryContext(updatedContext);

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_input: input,
          context: updatedContext, // Send updated story context
        }),
      });

      const data = await response.json();
      const aiMessage = { text: data.response, sender: 'ai' };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      // Append AI's response to the story context correctly
      setStoryContext(
        (prevContext) => prevContext + 'AI: ' + data.response + '\n'
      );
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, input]);

  return (
    <div className="h-screen flex flex-col bg-white shadow-lg rounded-xl overflow-hidden max-w-2xl mx-auto w-full sm:w-3/4 lg:w-2/3">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 pb-20"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex  ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'ai' && (
              <FaRobot className="text-gray-500 mr-2 mt-1 text-3xl" />
            )}
            <div
              className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-xl text-m shadow-md break-words text-left  ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
            {message.sender === 'user' && (
              <FaUserCircle className="text-blue-500 ml-2 mt-1 text-3xl" />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 flex bg-gray-100 shadow-md fixed bottom-0 w-full max-w-2xl mx-auto left-1/2 transform -translate-x-1/2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Continue the story..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
        >
          <FaPaperPlane className="text-xl" />
        </button>
        <button
          onClick={() => setShowPopup(true)}
          className="ml-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
        >
          End
        </button>
      </div>

      {/* Popup for Full Story */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Full Story</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="mt-4 max-h-60 overflow-y-auto border p-3 rounded-md bg-gray-100">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {storyContext}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryGenerator;
