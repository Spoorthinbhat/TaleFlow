import { useState } from 'react';
import './App.css';
import Chat from './Components/Chat';
import StoryInstructions from './Components/StoryInstructions';
import Heading from './Components/Heading';
import FullStory from './Components/FullStory';

function App() {
  const [story, setStory] = useState('');
  const [done, setDone] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 comic-neue-medium h-full text-[#555758]">
        <div className="flex flex-col w-full md:w-1/2 h-screen p-4">
          <Heading />
          <Chat setDone={setDone} setStory={setStory} />
        </div>
        <div className="w-full md:w-1/2 h-screen p-6">
          {done ? <FullStory storyText={story} /> : <StoryInstructions />}
        </div>
      </div>
    </>
  );
}

export default App;
