import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import TextToSpeech from "./TextToSpeech.jsx"
import {axiosInstance, BASE_URL} from './api/index.js';
function App() {
  const [messages, setMessages] = useState('');
  const inputRef = useRef(null);
  const [clientId, setClientId] = useState(null);
  const textareaRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false)
  const [selectedNumChapter, setSelectedChapter] = useState(1);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState('')
  const [page, setPage] = useState('Crawl')
  useEffect(() => {
    const newClientId = uuidv4();
    setClientId(newClientId);
    // const eventSource = new EventSource(`http://localhost:3000/events/${newClientId}`);
    const eventSource = new EventSource(`${BASE_URL}/api/events/${newClientId}`);
    let chunks = [];

    eventSource.onmessage = (event) => {
      setIsConnected(true);

      // Xử lý log
      try {
        const log = JSON.parse(event.data);
        if (log.type === 'log') {
          setMessages(prevMessages => prevMessages + log.message + '\n'); // Cập nhật state với log nhận được
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      } catch (error) {
        console.error('Lỗi khi phân tích cú pháp log:', error);
      }

      // Xử lý file ZIP
      if (event.data === 'END') {
        const blob = new Blob(chunks, { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        setDownloadLink(url);
        console.log('Tải xuống tại URL:', url);
        eventSource.close();
      } else if (event.data === 'ERROR') {
        setError('Lỗi khi nhận file qua SSE');
      } else {
        try {
          const parsedData = JSON.parse(event.data);
          const base64Data = parsedData.base64Data;

          // Kiểm tra base64Data có hợp lệ không
          if (base64Data.match(/^[A-Za-z0-9+/=]+$/)) {
            const decodedData = atob(base64Data);
            const byteArray = new Uint8Array(decodedData.split('').map(char => char.charCodeAt(0)));
            chunks.push(byteArray);
          } else {
            console.error('Dữ liệu base64 không hợp lệ:', base64Data);
            setError('Dữ liệu base64 không hợp lệ');
          }
        } catch (error) {
          console.error('Lỗi khi xử lý chunk:', error);
          setError('Lỗi khi xử lý chunk dữ liệu');
        }
      }
    };

    eventSource.onerror = (error) => {
      setIsConnected(false);
      console.error('Error with SSE:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  
  async function handlerSendUrl() {
    const url = inputRef.current.value;
    setName(url.split('/').slice(-1)[0])
    console.log(url);
    try {
      const response = await axiosInstance.post('/api/url', { url, clientId, selectedNumChapter });
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error sending URL:', error);
    }
  }

  async function handlerStopGenerate() {
    try {
      console.log('Stopppppppppppppppppp')
      const response = await axiosInstance.post(`/api/stop/${clientId}`);
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error sending URL:', error);
    }
  }
  const items = [1, 5, 10, 20, 50, 100, 200]
  const handleChange = (event) => {
    setSelectedChapter(event.target.value);
    console.log(selectedNumChapter) // Cập nhật giá trị đã chọn
  };

  function handleTransPageCrawl() {
    setPage('Crawl')
  }
  function handleTransPageSpeech() {
    setPage('Speech')
  }


  return (
    <div>
      <div id="parent">
        <div id="child">
          <div className='flex' id='title'>
          <div className={`title-child ${page === 'Crawl' ? 'title-selected' : ''}`}onClick={handleTransPageCrawl}>Crawl to txt</div>
          <div className={`title-child ${page === 'Speech' ? 'title-selected' : ''}`} onClick={handleTransPageSpeech}>Text to speech</div>
          </div>
          {page==='Crawl' && <div>
          <div id='info'>
            <div>
              <h3>Web hỗ trợ:</h3>
              <ul>
                <li className='my-2px'>metruyencv.com</li>
                <li className='my-2px'>vtruyen.com</li>
              </ul>
            </div>
            <div>
              <h3>Tùy chọn chức năng:</h3>
              <div className='flex ml-20px my-2px'>
                <TiTick size={20} color='#31A24C' />
                Số chương trong 1 file:
                <select
                  type="number"
                  name=""
                  value={selectedNumChapter} // Giá trị hiện tại của `select`
                  onChange={handleChange} // Lắng nghe sự kiện thay đổi
                >
                  {
                    items.map(item => (
                      <option value={item} key={item}>{item}</option>
                    ))
                  }
                </select>
              </div>
              <div className='flex ml-20px my-2px'>
              <IoMdClose size={21} color='#F42F2F'/> Generate audio
              </div>
            </div>
          </div>
          <div id="form">
            <input ref={inputRef} id="urlInput" type="url" placeholder="Nhập url tại đây" />
            <button onClick={handlerSendUrl} id="sendButton">Start</button>
            <button onClick={handlerStopGenerate} id="sendStop">Stop</button>
          </div>
          
          </div>}
          {page==='Speech' && <TextToSpeech clientId={clientId} />}
          <div id="logdiv">
            <textarea readOnly name="" id="logarea" value={messages} ref={textareaRef}></textarea>
          </div>
          
          <div id='statusConnection' className={`${isConnected ? 'text-blue' : 'text-red'}`}>

            {isConnected ? <h4>Connected</h4> : <h4>Disconnected</h4>}
            {downloadLink && (
              <a id='downloadUrl' href={downloadLink} download={`${name}.zip`}>
                <h4>Tải xuống file zip</h4>
              </a>
            )}
          </div>
          <div>

          </div>
        </div>
      </div >
    </div >
  );
}

export default App;
