import React, { useState } from 'react';
import './App.css';
import Timer from './components/Timer';
import TimerPopup from './components/TimerPopup';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [chooseBreakActive, setChooseBreakActive] = useState(true);

  const handleReset = () => {
    setChooseBreakActive(true);
    setIsPopupOpen(true); // Show the popup
  };

  const handleClosePopup = () => {
    setChooseBreakActive(true);
    setIsPopupOpen(false); // Hide the popup
  };

  const handleBreak = () => {
    setChooseBreakActive(false);
  };

  return (
    <div className="App">
      <video autoPlay loop muted>
        <source src={`${process.env.PUBLIC_URL}/videos/retro-background.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <img id="pomodoro-logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
      <Timer onResetCompletion={handleReset} />
      <MusicPlayer />
      <TimerPopup isOpen={isPopupOpen} chooseBreak={chooseBreakActive} onClose={handleClosePopup} onChooseBreak={handleBreak} />
    </div>
  );
}

export default App;