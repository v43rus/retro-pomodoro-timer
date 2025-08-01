import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Col, Row } from 'react-bootstrap';

interface Stream {
    id: string;
    name: string;
}

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        fontWeight: 'bold',
        width: '100%',
        maxWidth: '250px',
        minWidth: '200px',
        height: '50px',
        backgroundColor: 'rgba(163, 137, 162, 0.35)',
        border: '2px solid rgba(163, 137, 162, 0.6)',
        borderRadius: '20px',
        padding: '5px 10px',
        boxShadow: 
            '0 0 15px 0 #1A0C2B, ' +
            '0 0 25px 0 rgba(163, 137, 162, 0.4), ' +
            'inset 0 2px 10px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        '@media (max-width: 768px)': {
            width: '100%',
            maxWidth: '220px',
            height: '45px',
            fontSize: '1.3em',
        },
        '@media (max-width: 480px)': {
            width: '100%',
            maxWidth: '200px',
            height: '42px',
            fontSize: '1.2em',
        },
        '&:hover': {
            borderColor: 'rgba(163, 137, 162, 0.9)',
            boxShadow: 
                '0 0 20px 0 #A389A2, ' +
                '0 0 30px 0 #A01B42, ' +
                '0 0 35px 0 rgba(163, 137, 162, 0.6), ' +
                'inset 0 2px 15px rgba(255, 255, 255, 0.2)',
        }
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#1A0C2B',
        fontFamily: 'shockwave',
        fontSize: '1.5em',
        textShadow: '0 0 5px rgba(163, 137, 162, 0.8)',
        '@media (max-width: 768px)': {
            fontSize: '1.3em',
        },
        '@media (max-width: 480px)': {
            fontSize: '1.2em',
        },
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        height: '50px',
        width: '100%',
        fontFamily: 'shockwave',
        fontSize: '1.5em',
        color: state.isFocused ? '#A389A2' : '#A389A2',
        backgroundColor: state.isFocused ? 'rgba(26, 12, 43, 0.9)' : 'rgba(19, 12, 34, 0.9)',
        border: state.isFocused ? '2px solid rgba(163, 137, 162, 0.8)' : '1px solid rgba(163, 137, 162, 0.3)',
        borderRadius: '15px',
        padding: '5px 15px',
        margin: '3px 5px',
        boxShadow: state.isFocused ? 
            '0 0 15px 0 #A389A2, 0 0 20px 0 rgba(160, 27, 66, 0.5)' : 
            '0 0 8px 0 #1A0C2B',
        backdropFilter: 'blur(10px)',
        '@media (max-width: 768px)': {
            height: '45px',
            fontSize: '1.3em',
            padding: '5px 12px',
        },
        '@media (max-width: 480px)': {
            height: '42px',
            fontSize: '1.2em',
            padding: '5px 10px',
        },
        '&:active': {
            backgroundColor: 'rgba(160, 27, 66, 0.7)',
        }
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'transparent',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(163, 137, 162, 0.4)',
        borderRadius: '20px',
        boxShadow: '0 0 30px 0 rgba(19, 12, 34, 0.8)',
        zIndex: 9999,
    }),
    menuList: (provided: any) => ({
        ...provided,
        backgroundColor: 'transparent',
        padding: '10px',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
        '&::-webkit-scrollbar': {
            display: 'none', // Chrome/Safari
        },
    }),
};

interface StreamOption {
    value: string;
    label: string;
}

const MusicPlayer: React.FC = () => {
    const videoStreams: Stream[] = [
        { id: '4xDzrJKXOOY', name: 'Retrowave' },
        { id: 'HuFYqnbVbzY', name: 'LoFi Jazz' },
        { id: 'jfKfPfyJRdk', name: 'LoFi Hip Hop' },
    ];

    // Convert videoStreams into react-select options.
    const streamOptions: StreamOption[] = videoStreams.map((stream) => ({
        value: stream.id,
        label: stream.name,
    }));

    const [selectedStream, setSelectedStream] = useState<string>(videoStreams[0].id);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(25);
    const [player, setPlayer] = useState<YT.Player | null>(null);
    const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

    // Reset isPlayerReady when stream changes.
    useEffect(() => {
        setIsPlayerReady(false);
    }, [selectedStream]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        setPlayer(event.target);
        event.target.setVolume(volume);
        event.target.pauseVideo();
        setIsPlayerReady(true);
    };

    const onPlayerError: YouTubeProps['onError'] = (error) => {
        console.error('YouTube Player Error:', error);
    };

    useEffect(() => {
        if (player) {
            try {
                player.setVolume(volume);
            } catch (err) {
                return;
            }
        }
    }, [volume, player]);

    useEffect(() => {
        if (player && isPlayerReady) {
            try {
                player.loadVideoById(selectedStream);
                player.pauseVideo();
                setIsPlaying(false);
            } catch (err) {
                return;
            }
        }
    }, [selectedStream, player, isPlayerReady]);

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                setIsPlaying(true);
                break;
            case YT.PlayerState.PAUSED:
            case YT.PlayerState.ENDED:
                setIsPlaying(false);
                break;
            default:
                break;
        }
    };

    const togglePlay = () => {
        if (!player) return;
        try {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            setIsPlaying(!isPlaying);
        } catch (err) {
            return;
        }
    };

    // Find the currently selected option for react-select.
    const selectedOption = streamOptions.find(option => option.value === selectedStream);

    return (
        <div>
            <div className="player-container">
                <Row className="player-controls mb-4">
                    {/* Stream selection using react-select */}
                    <Col>
                        <Select
                            id="streamSelect"
                            value={selectedOption}
                            onChange={(option) => {
                                if (option) {
                                    setSelectedStream(option.value);
                                }
                            }}
                            options={streamOptions}
                            styles={customStyles}
                        />
                    </Col>

                    {/* Toggle Play/Pause Button */}
                    <Col>
                        <button id="play-button" onClick={togglePlay} disabled={!isPlayerReady}>
                            {!isPlayerReady ? <i className=' bi bi-arrow-clockwise'></i> : (isPlaying ? <i className="bi bi-pause-fill"></i> : <i className="bi bi-play-fill"></i>)}
                        </button>
                    </Col>
                </Row>

                <Row className="player-controls">
                    {/* Volume Slider */}
                    <Col>
                        <input
                            id="volumeControl"
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                        />
                    </Col>
                </Row>
            </div>

            {/* Hidden YouTube player with minimal dimensions */}
            <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', left: '-9999px' }}>
                <YouTube
                    key={selectedStream} // forces remount on stream change
                    videoId={selectedStream}
                    opts={{
                        playerVars: {
                            autoplay: 0,
                            controls: 0,
                            modestbranding: 1,
                            playsinline: 1,
                            origin: window.location.origin,
                        },
                    }}
                    onReady={onPlayerReady}
                    onError={onPlayerError}
                    onStateChange={onPlayerStateChange}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;