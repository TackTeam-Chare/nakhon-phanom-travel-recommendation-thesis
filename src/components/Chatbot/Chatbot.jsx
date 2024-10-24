"use client";

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { FiChevronDown, FiSend, FiTrash, FiEye, FiEyeOff } from 'react-icons/fi'; // Added new icons
import { AiOutlineRobot } from 'react-icons/ai';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { fetchSuggestions } from '@/services/user/api';
import dynamic from 'next/dynamic';

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false });

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = Cookies.get('chatbotMessages');
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
    return [];
  });

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);
  const chatContainerRef = useRef(null); // Ref for chat container
  const dummyDivRef = useRef(null); // Ref for auto-scroll
  const [socket, setSocket] = useState(null);

  // Initialize socket inside useEffect
  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL);
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

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
    if (typeof window !== 'undefined' && navigator.geolocation) {
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
    if (socket) {
      socket.on('botMessage', (botMessage) => {
        const newMessage = { user: 'bot', text: botMessage, time: new Date().toLocaleTimeString() };
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          Cookies.set('chatbotMessages', JSON.stringify(updatedMessages), { expires: 7 });

          if (!isChatbotOpen) {
            setUnreadMessages((prevCount) => prevCount + 1);
          }
          return updatedMessages;
        });
        setIsLoading(false);
      });

      return () => {
        socket.off('botMessage');
      };
    }
  }, [socket, isChatbotOpen]);

  useEffect(() => {
    // Automatically scroll to the bottom when messages are updated
    if (dummyDivRef.current) {
      dummyDivRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (text.trim() && socket) {
      const userMessage = { user: 'user', text, time: new Date().toLocaleTimeString() };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMessage];
        Cookies.set('chatbotMessages', JSON.stringify(updatedMessages), { expires: 7 });
        return updatedMessages;
      });

      const messageData = { text, location: userLocation || null };
      socket.emit('userMessage', messageData);
      setMessage('');
      setIsLoading(true);
    }
  };

  const clearChatHistory = () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('chatbotMessages');
    }
    setMessages([]);
  };

  const createLinkInMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="text-blue-500 underline">${url}</a>`;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[10000]">
      {isChatbotOpen ? (
        <div className="w-full sm:max-w-md lg:max-w-lg h-80 sm:h-96 lg:h-[500px] border rounded-lg shadow-lg bg-white flex flex-col justify-between z-[10000]">
        <div className="bg-orange-600 text-white p-3 rounded-t-lg flex flex-col space-y-2">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <AiOutlineRobot className="text-2xl" />
      <h3 className="font-bold">แชตบอทเพื่อให้ข้อมูล</h3>
    </div>
    <button onClick={() => setIsChatbotOpen(false)} aria-label="Close chatbot">
      <FiChevronDown className="text-white text-2xl" />
    </button>
  </div>

    <p className="text-sm text-center">
      ข้อมูลที่ได้มาจากฐานข้อมูล หากไม่พบข้อมูลจะใช้จาก ChatGPT
    </p>

</div>


          <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto space-y-4 bg-gray-50">
            {/* Suggestions */}
            {isSuggestionsVisible && (
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
            )}

            {/* Chat Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-full flex ${
                  msg.user === 'user' ? 'bg-orange-500 text-white self-end' : 'bg-gray-200 text-black self-start'
                } items-center space-x-2 break-words whitespace-pre-wrap w-full`}
              >
                {msg.user === 'user' ? <FaUser className="text-white" /> : <AiOutlineRobot className="text-black" />}
                {msg.user === 'bot' ? (
                  <span dangerouslySetInnerHTML={{ __html: createLinkInMessage(msg.text) }} />
                ) : (
                  <span>{msg.text}</span>
                )}
                <span className={`text-base font-bold ml-2 ${msg.user === 'user' ? 'text-white' : 'text-black'}`}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="text-center text-gray-500 flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500"></div>
                <span>กำลังประมวลผล...</span>
              </div>
            )}

            {/* Dummy div for auto-scroll */}
            <div ref={dummyDivRef} />
          </div>

          <div className="p-3 border-t flex bg-white items-center">
            <button
              onClick={() => setIsSuggestionsVisible((prev) => !prev)}
              className="bg-gray-300 text-black p-2 mr-2 rounded-lg hover:bg-gray-400"
            >
              {isSuggestionsVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="พิมพ์คำถามที่นี่..."
              className="w-full p-2 border border-gray-300 rounded-lg mr-2"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(message)}
            />
            <button onClick={() => sendMessage(message)} className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700">
              <FiSend size={20} />
            </button>
            <button onClick={clearChatHistory} className="bg-red-600 text-white p-2 ml-2 rounded-lg hover:bg-red-700">
              <FiTrash size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          data-tip="เปิดแชตบอท"
          onClick={() => setIsChatbotOpen(true)}
          className="bg-orange-600 p-3 rounded-full shadow-lg flex items-center justify-center fixed bottom-5 right-5 md:bottom-5 md:right-5 z-[10000]"
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
