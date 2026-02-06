import React, { useState } from 'react';

const ValentinePage = () => {
  // State for the "Success" banner
  const [accepted, setAccepted] = useState(false);
  
  // State to toggle between the two templates (false = Moving No, true = Growing Yes)
  const [useGrowingTemplate, setUseGrowingTemplate] = useState(false);

  // --- Logic for Template 1 (Moving "No") ---
  const [noPosition, setNoPosition] = useState({ top: 'auto', left: 'auto' });
  
  const moveButton = () => {
    // Generate random coordinates within the viewable window
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoPosition({ position: 'absolute', left: `${x}px`, top: `${y}px` });
  };

  // --- Logic for Template 2 (Growing "Yes") ---
  const [noCount, setNoCount] = useState(0);
  const phrases = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You're breaking my heart 💔",
    "I'll be very sad...",
    "I'll be very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, please say yes! ❤️",
    "I'll make you matcha!",
    "PLEASE??",
    "PRETTY PLEASE??",
    "No is not an option anymore!",
  ];

  // Logic to handle the "No" click in Template 2
  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  // Calculate the text for the "No" button
  const getNoButtonText = () => {
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  // Reset everything
  const reset = () => {
    setAccepted(false);
    setNoCount(0);
    setNoPosition({ top: 'auto', left: 'auto' });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-pink-100 overflow-hidden relative transition-all duration-500">
      
      {/* Template Toggle Switch (Top Right) */}
      {!accepted && (
        <div className="absolute top-4 right-4 flex gap-2 z-50">
           <button 
             onClick={() => { setUseGrowingTemplate(!useGrowingTemplate); reset(); }}
             className="px-3 py-1 bg-white/50 rounded-full text-xs font-bold hover:bg-white text-pink-500 transition-colors"
           >
             Switch to: {useGrowingTemplate ? "Moving Button Mode" : "Guilt Trip Mode"}
           </button>
        </div>
      )}

      {accepted ? (
        // --- SUCCESS STATE ---
        <div className="flex flex-col items-center justify-center text-center animate-bounce">
          <img 
            src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" 
            alt="Bear Kissing" 
            className="w-64 h-64 object-cover mb-4"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600">Yay! I knew you'd say yes! ❤️</h1>
          <button onClick={reset} className="mt-8 text-pink-400 underline text-sm">Reset</button>
        </div>
      ) : (
        // --- QUESTION STATE ---
        <div className="flex flex-col items-center text-center z-10">
          <img 
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif" 
            alt="Cute bear" 
            className="h-48 mb-6"
          />
          
          <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-8">
            Will you be my Valentine Nikita?
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            
            {/* YES BUTTON */}
            <button
              onClick={() => setAccepted(true)}
              className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg mr-10`}
              style={
                useGrowingTemplate 
                  ? { fontSize: `${noCount * 20 + 16}px` } // Grow logic
                  : {} // Normal logic
              }
            >
              Yes
            </button>

            {/* NO BUTTON */}
            <button
              // Events for Template 1 (Hover move)
              onMouseEnter={!useGrowingTemplate ? moveButton : undefined}
              
              // Events for Template 2 (Click text change)
              onClick={useGrowingTemplate ? handleNoClick : moveButton}
              
              className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg ${!useGrowingTemplate ? 'absolute md:static' : ''}`}
              style={
                !useGrowingTemplate 
                  ? { ...noPosition, transition: 'top 0.2s, left 0.2s' } // Apply moving coordinates
                  : {} 
              }
            >
              {useGrowingTemplate ? getNoButtonText() : "No"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValentinePage;