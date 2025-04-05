import React from 'react';

function Heading() {
  return (
    <div className="h-1/6 flex flex-col justify-center p-2">
      <div className="p-4 border-2 border-teal-600 rounded-2xl bg-white">
        <div className="text-2xl md:text-4xl comic-neue-bold text-center">
          TaleFlow
        </div>
        <div className="text-md md:text-xl comic-neue-regular text-center">
          Write stories, differently.
        </div>
      </div>
    </div>
  );
}

export default Heading;
