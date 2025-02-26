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
        width: '250px',
        height: '50px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '20px',
        padding: '5px 10px',
        boxShadow: '0 0 10px 0 #1A0C2B',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#1a0c2b',
        fontFamily: 'shockwave',
        fontSize: '1.5em',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        height: '50px',
        fontFamily: 'shockwave',
        fontSize: '1.5em',
        color: state.isFocused ? '#A1A1A1' : '#A21DA2',
        backgroundColor: state.isFocused ? '#1A0C2Bee' : '#1A0C2Baa',
        border: state.isFocused ? '2px solid #A1A1A1' : 'none',
        borderRadius: '20px',
        padding: '5px 10px',
        margin: '5px 0',
        boxShadow: '0 0 10px 0 #1A0C2B',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'transparent',
    }),
    menuList: (provided: any) => ({
        ...provided,
        backgroundColor: 'transparent',
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