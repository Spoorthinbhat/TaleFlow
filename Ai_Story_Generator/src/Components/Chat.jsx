import { useState } from 'react';
import botProfile from '../assets/botProfile.svg';
import userProfile from '../assets/userProfile.png';

function Chat({ setDone, setStory }) {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [ended, setEnded] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || ended) return;

    const updatedConversation = [
      ...conversation,
      { sender: 'user', text: input },
    ];
    setConversation(updatedConversation);

    const updatedStory = updatedConversation
      .map((entry) => entry.text)
      .join(' ');
    setStory(updatedStory);
    setInput('');

    if (input.trim().endsWith('THE END')) {
      setDone(true);
      setEnded(true);
      return;
    }

    try {
      const response = await fetch('https://storyapi.poseidon0z.com/generate', { ///change later 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_input: input, context: updatedStory }),
      });

      const data = await response.json();
      if (data.response) {
        if (data.response.trim().endsWith('THE END')) {
          setDone(true);
          setEnded(true);
          setConversation((prev) => [
            ...prev,
            { sender: 'ai', text: data.response },
          ]);
          setStory((prev) => prev + ' ' + data.response);
          return;
        }

        const aiResponse = { sender: 'ai', text: data.response };
        setConversation((prev) => [...prev, aiResponse]);
        setStory((prev) => prev + ' ' + data.response);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-5/6 p-2 text-sm md:text-md">
      <div className="flex flex-col p-4 border rounded-lg bg-[#FFFFFFCC] shadow-md h-full">
        <div
          className={`${
            ended ? 'h-full' : 'h-11/12'
          } overflow-y-auto p-2 rounded-md`}
        >
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end pt-4 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <img
                  src={botProfile}
                  alt="AI"
                  className="w-5 md:w-8 h-5 md:h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`p-3 max-w-[65%] rounded-lg shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-[#D1E6FF]'
                    : 'bg-white border-2 border-[#D1E6FF]'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <img
                  src={userProfile}
                  alt="User"
                  className="w-5 md:w-8 h-5 md:h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}
        </div>
        {!ended && (
          <div className="h-1/12 flex items-center gap-2 mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 border rounded-lg w-5/6 bg-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
