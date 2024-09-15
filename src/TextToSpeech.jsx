import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {axiosInstance, BASE_URL} from './api/index.js';
function TextToSpeech({ clientId }) {
    const [selectedService, setSelectedService] = useState('azure');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const inputRef = useRef(null);
    const [mp3Url, setMp3Url] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Updated mp3Url:', mp3Url);
    }, [mp3Url]);

    const voicesData = {
        'aws-polly': {
            English: ['Joanna'],
        },
        'azure': {
            English: ['Andrew', 'Emma', 'Brian'],
            Vietnamese: ['HoaiMy', 'NamMinh'],
        },
    };

    const handleServiceChange = (e) => {
        setSelectedService(e.target.id);
        setSelectedLanguage('');
        setAvailableVoices([]);
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.id);
        if (selectedService && voicesData[selectedService][e.target.id]) {
            setAvailableVoices(voicesData[selectedService][e.target.id]);
        } else {
            setAvailableVoices([]);
        }
    };

    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.id);
    };

    async function handleSendText() {
        const text = inputRef.current.value;
        const service = selectedService;
        const language = selectedLanguage;
        const voice = selectedVoice;
        if (!text.trim() || !service.trim() || !language.trim() || !voice.trim()) {
            let errorMessage = 'Vui lòng kiểm tra các trường sau:\n';

            if (!text.trim()) {
                errorMessage += '- Nội dung văn bản.\n';
            }
            if (!service.trim()) {
                errorMessage += '- Dịch vụ chuyển đổi.\n';
            }
            if (!language.trim()) {
                errorMessage += '- Ngôn ngữ.\n';
            }
            if (!voice.trim()) {
                errorMessage += '- Giọng nói.\n';
            }

            alert(errorMessage);

        }else{


        setMp3Url('');

        try {
            const response = await axiosInstance.post('/api/texttospeech', { clientId, service, language, voice, text }, { responseType: 'blob' });
            console.log('Response:', response);

            if (response.data) {
                const audioUrl = URL.createObjectURL(response.data);
                setMp3Url(audioUrl);
                console.log('mp3Url after set:', audioUrl);
            }
        } catch (error) {
            setError('Lỗi khi gửi yêu cầu: ' + error.message);
            console.error('Error sending URL:', error);
        }
    }

    }

    return (
        <div className='info'>
            <div className='flex my-2px '>
                <div className=''>
                    <h3>Service</h3>
                    <div className="checkbox-group">
                        <div className="flex checkbox-item">
                            <input
                                type="radio"
                                name="service"
                                id="azure"
                                onChange={handleServiceChange}
                                checked={selectedService === 'azure'}
                            />
                            <label htmlFor="azure">Microsoft Azure</label>
                        </div>
                        <div className="flex checkbox-item">
                            <input
                                type="radio"
                                name="service"
                                id="aws-polly"
                                onChange={handleServiceChange}
                                checked={selectedService === 'aws-polly'}
                            />
                            <label htmlFor="aws-polly">Aws Polly</label>
                        </div>
                    </div>
                </div>

                {selectedService && (
                    <div className=''>
                        <h3>Ngôn ngữ</h3>
                        <div className="checkbox-group">
                            {selectedService === 'aws-polly' && (
                                <div className="flex checkbox-item">
                                    <input
                                        type="radio"
                                        name="language"
                                        id="English"
                                        onChange={handleLanguageChange}
                                        checked={selectedLanguage === 'English'}
                                    />
                                    <label htmlFor="English">Tiếng Anh</label>
                                </div>
                            )}

                            {selectedService === 'azure' && (
                                <>
                                    <div className="flex checkbox-item">
                                        <input
                                            type="radio"
                                            name="language"
                                            id="English"
                                            onChange={handleLanguageChange}
                                            checked={selectedLanguage === 'English'}
                                        />
                                        <label htmlFor="English">Tiếng Anh</label>
                                    </div>
                                    <div className="flex checkbox-item">
                                        <input
                                            type="radio"
                                            name="language"
                                            id="Vietnamese"
                                            onChange={handleLanguageChange}
                                            checked={selectedLanguage === 'Vietnamese'}
                                        />
                                        <label htmlFor="Vietnamese">Tiếng Việt</label>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {availableVoices.length > 0 && (
                    <div className=''>
                        <h3>Giọng đọc</h3>
                        <div className="checkbox-group">
                            {availableVoices.map((voice, index) => (
                                <div key={index} className="flex checkbox-item">
                                    <input
                                        type="radio"
                                        name="voicename"
                                        id={voice}
                                        onChange={handleVoiceChange}
                                        checked={selectedVoice === voice}
                                    />
                                    <label htmlFor={voice}>{voice}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            <p className=''>Đề nghị: Sử dụng Aws Polly cho tiếng Anh vì việc upload file của Microsoft không được ổn định, có thể sẽ thiếu độ dài.</p>
            <p className=''>Voice Tiếng Anh của Microsoft có thể dùng Tiếng Việt. Nếu file âm thanh bị thiếu, hãy click nhiều lần cho đến khi đủ, chúc bạn may mắn</p>
            <p className=''>Lưu ý: Các dịch vụ TTS trên được dùng với phiên bản miễn phí có giới hạn. Vì vậy, xin hãy dùng tiết kiệm. Xin cảm hơn</p>
            <div id="form">
                <input ref={inputRef} id="urlInput" type="url" placeholder="Enter your own text here and click the play button to hear the voice." />
                <button onClick={handleSendText} id="sendButton">Play</button>
            </div>
            {mp3Url && (
                <div id='divmp3'>
                    <audio controls>
                        <source src={mp3Url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <a href={mp3Url} download="speech.mp3">
                        Download MP3
                    </a>
                </div>
            )}
        </div>
    );
}

export default TextToSpeech;
