import React, { useState, useEffect } from 'react';
import './TimerPopup.css';

interface TimerPopupProps {
    isOpen: boolean;
    chooseBreak: boolean;
    onClose: () => void;
    onChooseBreak: () => void;
}

const TimerPopup: React.FC<TimerPopupProps> = ({ isOpen, onClose, chooseBreak, onChooseBreak }) => {
    const startSound = new Audio(`${process.env.PUBLIC_URL}/sounds/start.mp3`);
    const [time, setTime] = useState<number>(5);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [selectedQuote, setSelectedQuote] = useState<string>('');

    const motivationalQuotes = [
        'The only way to do great work is to love what you do.',
        'Success is not the key to happiness. Happiness is the key to success.',
        'The best way to predict the future is to create it.',
        'The only limit to our realization of tomorrow will be our doubts of today.',
        'The best preparation for tomorrow is doing your best today.',
        'The future belongs to those who believe in the beauty of their dreams.',
        'The secret of getting ahead is getting started.',
        'You are never too old to set another goal or to dream a new dream.',
        'The best way to get something done is to begin.',
    ];

    startSound.volume = 0.5;

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsActive(false);
            closeBreakTimer();
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    useEffect(() => {
        if (!chooseBreak) {
            setSelectedQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        }
    }, [chooseBreak]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const closeBreakTimer = () => {
        console.log('Closing timer');
        setIsActive(false);
        startSound.play();
        onClose();
    };

    const breakSetup = (time: number) => {
        setTime(time);
        onChooseBreak();
        setIsActive(true);
        console.log('Short break setup');
    };

    return (
        <div id="timer-window" className={isOpen ? 'popup-open' : 'popup-closed'}>
            {isOpen && chooseBreak && <div id="timer-popup">
                <h1>Time for a Break!</h1>
                <p>Would you prefer a short or a long break?</p>

                <button onClick={() => breakSetup(300)}>Short Break (5min)</button>
                <button onClick={() => breakSetup(900)}>Long Break (15min)</button>
            </div>}

            {isOpen && !chooseBreak && <div id="timer-popup">
                <h1>Well done!</h1>
                <p>{selectedQuote}</p>

                <div id="text-time">{formatTime(time)}</div>
                <button onClick={closeBreakTimer}>Close</button>
            </div>}
        </div>
    );
};

export default TimerPopup;