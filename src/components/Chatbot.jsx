import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { FiChevronDown } from 'react-icons/fi';
import { AiOutlineRobot } from 'react-icons/ai';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import { fetchSuggestions } from '@/services/user/api';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL);

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatbotMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchSuggestionsData = async () => {
      try {
        const data = await fetchSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    fetchSuggestionsData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    socket.on('botMessage', (botMessage) => {
      const newMessage = { user: 'bot', text: botMessage };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem('chatbotMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setIsLoading(false);

      if (!isChatbotOpen) {
        setUnreadMessages((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off('botMessage');
    };
  }, [isChatbotOpen]);

  // Send a message to the chatbot with location data if available
  const sendMessage = (text) => {
    if (text.trim()) {
      const userMessage = { user: 'user', text };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMessage];
        localStorage.setItem('chatbotMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      // Attach user's location (latitude, longitude) to the message
      const messageData = { text, location: userLocation || null };
      socket.emit('userMessage', messageData);

      setMessage('');
      setIsLoading(true);
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem('chatbotMessages');
    setMessages([]);
  };

  const formatMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split('\n').map((part, index) => (
      <span key={index}>
        {part.split(' ').map((word, i) =>
          urlRegex.test(word) ? (
            <a key={i} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {word}
            </a>
          ) : (
            <span key={i}>{word} </span>
          )
        )}
        <br />
      </span>
    ));
  };

  const handleChatbotOpen = () => {
    setIsChatbotOpen(true);
    setUnreadMessages(0);
  };

  const handleChatbotClose = () => {
    setIsChatbotOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[10000]"> {/* Increase z-index */}
      {isChatbotOpen ? (
        <div className="w-full max-w-xs h-96 border rounded-lg shadow-lg bg-white flex flex-col justify-between z-[10000]"> {/* z-index adjustment */}
          <div className="bg-orange-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AiOutlineRobot className="text-2xl" />
              <h3 className="font-bold">แชทบอทช่วยเหลือ</h3>
            </div>
            <button onClick={handleChatbotClose} aria-label="Close chatbot">
              <FiChevronDown className="text-white text-2xl" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-full flex ${
                  msg.user === 'user' ? 'bg-orange-500 text-white self-end flex-row-reverse' : 'bg-gray-200 text-black self-start'
                } items-center space-x-2 space-x-reverse`}
              >
                {msg.user === 'user' ? <FaUser className="text-white" /> : <AiOutlineRobot className="text-black" />}
                <span className="break-words">{formatMessage(msg.text)}</span>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-500 flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500"></div>
                <span>กำลังประมวลผล...</span>
              </div>
            )}

            {/* Display chatbot suggestions */}
            <div className="mt-4 flex flex-wrap">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion.suggestion_text)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg m-1 hover:bg-blue-600"
                >
                  {suggestion.suggestion_text}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t flex bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="พิมพ์คำถามที่นี่..."
              className="w-full p-2 border border-gray-300 rounded-lg mr-2"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(message)}
            />
            <button onClick={() => sendMessage(message)} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              ส่ง
            </button>
            <button onClick={clearChatHistory} className="bg-red-600 text-white px-4 py-2 ml-2 rounded-lg hover:bg-red-700">
              ล้างประวัติ
            </button>
          </div>
        </div>
      ) : (
        <button
          data-tip="เปิดแชทบอท"
          onClick={handleChatbotOpen}
          className="bg-orange-600 p-3 rounded-full shadow-lg flex items-center justify-center fixed bottom-5 right-5 md:bottom-5 md:right-5 z-[10000]" // Increase z-index and ensure fixed positioning
          aria-label="Open chatbot"
        >
          <BiMessageRoundedDots className="text-white text-3xl" />
          {unreadMessages > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </button>
      )}
      <ReactTooltip />
    </div>
  );
};

export default Chatbot;
