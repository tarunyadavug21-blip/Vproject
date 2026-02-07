import React, { useState, useEffect, useCallback } from 'react';

const RoseDayGame = () => {
  // Game State
  const [guyPos, setGuyPos] = useState({ x: 10, y: 50 }); // Start on left (Percent)
  const [girlPos] = useState({ x: 85, y: 50 }); // Girl Position (Percent)
  const [hasWon, setHasWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const [isFocused, setIsFocused] = useState(false); // To track if user clicked window

  // Constants
  const STEP_SIZE = 5; 
  const COLLISION_THRESHOLD = 8; // Slightly easier collision

  // --- MOVEMENT LOGIC (Wrapped in useCallback to fix bugs) ---
  const move = useCallback((direction) => {
    if (hasWon) return;

    setGuyPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      // Update position based on direction
      if (direction === 'UP') newY = Math.max(5, prev.y - STEP_SIZE);
      if (direction === 'DOWN') newY = Math.min(90, prev.y + STEP_SIZE);
      if (direction === 'LEFT') newX = Math.max(5, prev.x - STEP_SIZE);
      if (direction === 'RIGHT') newX = Math.min(90, prev.x + STEP_SIZE);

      return { x: newX, y: newY };
    });

    setSteps((s) => s + 1);
  }, [hasWon]);

  // --- KEYBOARD LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp') move('UP');
      if (e.key === 'ArrowDown') move('DOWN');
      if (e.key === 'ArrowLeft') move('LEFT');
      if (e.key === 'ArrowRight') move('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]); // Re-bind listener if move function updates

  // --- WIN CONDITION CHECK ---
  useEffect(() => {
    const dx = Math.abs(guyPos.x - girlPos.x);
    const dy = Math.abs(guyPos.y - girlPos.y);

    if (dx < COLLISION_THRESHOLD && dy < COLLISION_THRESHOLD) {
      setHasWon(true);
    }
  }, [guyPos, girlPos]);

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen w-screen bg-green-100 overflow-hidden font-sans touch-none"
      onClick={() => setIsFocused(true)} // Handle focus on click
    >
      
      {/* HEADER */}
      <h1 className="absolute top-8 text-2xl md:text-3xl font-bold text-green-800 z-10 text-center px-4">
        {hasWon ? "Happy Rose Day! 🌹" : "Help him reach her! 🌹"}
      </h1>
      
      {/* FOCUS REMINDER (Only shows if haven't clicked yet) */}
      {!isFocused && !hasWon && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
          <div className="bg-white px-6 py-4 rounded-xl animate-bounce font-bold text-green-700 shadow-xl">
            👆 Click here to Start!
          </div>
        </div>
      )}

      {/* GAME AREA */}
      <div className="relative w-full max-w-2xl h-80 md:h-96 bg-green-200 border-4 border-green-400 rounded-xl shadow-2xl overflow-hidden m-4">
        
        {/* DECORATION */}
        <div className="absolute top-10 left-10 text-xl opacity-50">🌸</div>
        <div className="absolute bottom-20 right-40 text-xl opacity-50">🌻</div>

        {/* THE GUY */}
        <div 
          className="absolute text-5xl transition-all duration-200 ease-linear"
          style={{ 
            left: `${guyPos.x}%`, 
            top: `${guyPos.y}%`,
            transform: 'translate(-50%, -50%)' 
          }}
        >
          {hasWon ? '🥰' : '🏃‍♂️'}
        </div>

        {/* THE ROSE */}
        {!hasWon && (
          <div 
            className="absolute text-2xl transition-all duration-200 ease-linear"
            style={{ 
              left: `${guyPos.x + 2}%`, 
              top: `${guyPos.y - 2}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            🌹
          </div>
        )}

        {/* THE GIRL */}
        <div 
          className="absolute text-5xl transition-all duration-500"
          style={{ 
            left: `${girlPos.x}%`, 
            top: `${girlPos.y}%`,
            transform: `translate(-50%, -50%) scale(${hasWon ? 1.2 : 1})`
          }}
        >
          {hasWon ? '👩' : '💃'}
        </div>

      </div>

      {/* MOBILE CONTROLS (Always visible for backup) */}
      {!hasWon && (
        <div className="grid grid-cols-3 gap-2 mt-2 z-20">
          <div></div>
          <button onPointerDown={() => move('UP')} className="w-14 h-14 bg-white rounded-full shadow-lg active:bg-gray-200 text-2xl">⬆️</button>
          <div></div>
          <button onPointerDown={() => move('LEFT')} className="w-14 h-14 bg-white rounded-full shadow-lg active:bg-gray-200 text-2xl">⬅️</button>
          <button onPointerDown={() => move('DOWN')} className="w-14 h-14 bg-white rounded-full shadow-lg active:bg-gray-200 text-2xl">⬇️</button>
          <button onPointerDown={() => move('RIGHT')} className="w-14 h-14 bg-white rounded-full shadow-lg active:bg-gray-200 text-2xl">➡️</button>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {hasWon && (
        <div className="absolute inset-0 bg-pink-500/30 flex flex-col items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">💍</div>
            <h2 className="text-3xl md:text-5xl font-bold text-pink-600 mb-2">She said YES!</h2>
            <p className="text-gray-600 mb-6">Happy Rose Day ❤️</p>
            <button 
              onClick={() => { setHasWon(false); setGuyPos({x:10, y:50}); setSteps(0); }}
              className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-bold transition-transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoseDayGame;