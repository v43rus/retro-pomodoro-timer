import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';

interface TimerProps {
    onResetCompletion: () => void;
}

const Timer: React.FC<TimerProps> = ({ onResetCompletion }) => {
    const [time, setTime] = useState<number>(5); // 25 minutes in seconds
    //[time, setTime] = useState<number>(60 * 25); // 25 minutes in seconds
    const [isActive, setIsActive] = useState<boolean>(false);

    // Load sound effects
    const lastSecondsSound = new Audio(`${process.env.PUBLIC_URL}/sounds/click.mp3`);
    const completionSound = new Audio(`${process.env.PUBLIC_URL}/sounds/ring.mp3`);
    lastSecondsSound.volume = 0.5;
    completionSound.volume = 0.5;

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    useEffect(() => {
        if (time <= 3 && time > 0) {
            lastSecondsSound.play();
        } else if (time === 0) {
            completionSound.play();
            resetOnCompletion();
        }
        if (time < 0) {
            setTime(0);
            setIsActive(false);
        }
    }, [time]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleStartPause = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(5);
    };

    const lowerTime = () => {
        if (time > 60 * 5)
            setTime(time - (60 * 5));
    };

    const raiseTime = () => {
        setTime(time + (60 * 5));
    };

    const resetOnCompletion = () => {
        setIsActive(false);
        setTime(5); // Reset to 25 minutes
        onResetCompletion(); // Emit event to parent
    };

    return (
        <div id="timer">
            <Row>
                <Col id="minus-button">
                    <button onClick={lowerTime} >
                        <i className='bi bi-dash-circle' id="minus-thing"></i>
                    </button>
                </Col>
                <Col>
                    <div id="text-time">{formatTime(time)}</div>
                </Col>
                <Col id="plus-button">
                    <button onClick={raiseTime}>
                        <i className='bi bi-plus-circle'></i>
                    </button>
                </Col>
            </Row>

            <Row>
                <Col id="start-button">
                    <button onClick={handleStartPause}>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                </Col>
                <Col id="reset-button">
                    <button onClick={handleReset}>Reset</button>
                </Col>
            </Row>
        </div>
    );
};

export default Timer;