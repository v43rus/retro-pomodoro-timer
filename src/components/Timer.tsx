import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';

interface TimerProps {
    onResetCompletion: () => void;
}

const Timer: React.FC<TimerProps> = ({ onResetCompletion }) => {
    // Timer durations in seconds
    const WORK_TIME = 1500; // 25 minutes
    const SHORT_BREAK_TIME = 300; // 5 minutes
    const LONG_BREAK_TIME = 900; // 15 minutes

    const [time, setTime] = useState<number>(WORK_TIME);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isBreak, setIsBreak] = useState<boolean>(false);
    const [completedSessions, setCompletedSessions] = useState<number>(0);

    // Load sound effects
    const lastSecondsSound = useMemo(() => {
        const sound = new Audio(`${process.env.PUBLIC_URL}/sounds/click.mp3`);
        sound.volume = 0.2;
        return sound;
    }, []);
    
    const completionSound = useMemo(() => {
        const sound = new Audio(`${process.env.PUBLIC_URL}/sounds/ring.mp3`);
        sound.volume = 0.2;
        return sound;
    }, []);

    const resetOnCompletion = useCallback(() => {
        setIsActive(false);
        
        if (!isBreak) {
            // Work session completed, start break
            const newCompletedSessions = completedSessions + 1;
            setCompletedSessions(newCompletedSessions);
            setIsBreak(true);
            
            // Every 4th session gets a long break
            if (newCompletedSessions % 4 === 0) {
                setTime(LONG_BREAK_TIME);
            } else {
                setTime(SHORT_BREAK_TIME);
            }
        } else {
            // Break completed, start work session
            setIsBreak(false);
            setTime(WORK_TIME);
        }
        
        onResetCompletion(); // Emit event to parent
    }, [isBreak, completedSessions, onResetCompletion, WORK_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME]);

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
    }, [time, lastSecondsSound, completionSound, resetOnCompletion]);

    // Update document title based on timer state
    useEffect(() => {
        if (time === 0 || isBreak) {
            document.title = 'PT - Break!';
        } else if (isActive) {
            document.title = `PT - ${formatTime(time)}`;
        } else {
            document.title = `PT - ${formatTime(time)} (Paused)`;
        }
    }, [time, isActive, isBreak]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleStartPause = () => {
        setIsActive(!isActive);
        setIsBreak(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setIsBreak(false);
        setTime(WORK_TIME);
    };

    const lowerTime = () => {
        if (time > 60 * 5)
            setTime(time - (60 * 5));
    };

    const raiseTime = () => {
        setTime(time + (60 * 5));
    };

    return (
        <div id="timer">
            <Row>
                <Col>
                    <button onClick={lowerTime} >
                        <i className='bi bi-dash-circle' id="minus-thing"></i>
                    </button>
                </Col>
                <Col>
                    <div id="text-time">{formatTime(time)}</div>
                </Col>
                <Col>
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