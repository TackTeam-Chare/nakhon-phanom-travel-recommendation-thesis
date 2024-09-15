"use client"
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // ฟังข้อความจาก bot
    socket.on('botMessage', (botMessage) => {
      setMessages((prevMessages) => [...prevMessages, { user: 'bot', text: botMessage }]);
    });

    return () => {
      socket.off('botMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      // ส่งข้อความไปยัง server
      socket.emit('userMessage', message);
      setMessages((prevMessages) => [...prevMessages, { user: 'user', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 h-96 border rounded-lg shadow-lg bg-white flex flex-col justify-between">
      <div className="bg-orange-600 text-white p-3 rounded-t-lg">
        <h3 className="font-bold">เเชทบอทสด</h3>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              msg.user === 'user' ? 'bg-orange-500 text-white self-end' : 'bg-gray-200 text-black self-start'
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="พิมพ์คำถามเลย!"
          className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
