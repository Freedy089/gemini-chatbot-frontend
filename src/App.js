import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [rateLimit, setRateLimit] = useState({ limit: 15, remaining: 15, resetTime: null });

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            const response = await axios.post('https://gemini-chatbot-backend-tau.vercel.app/api/chat', {
                message: input,
            });
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages((prev) => [...prev, botMessage]);

            // Update informasi rate limit
            setRateLimit({
                limit: response.data.rateLimit.limit,
                remaining: response.data.rateLimit.remaining,
                resetTime: response.data.rateLimit.resetTime,
            });
        } catch (error) {
            const errorMessage = { sender: 'bot', text: 'Error: Could not get response from the server.' };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className="App">
            <h1>Gemini Chatbot</h1>
            <div className="rate-limit-info">
                <p>Requests Remaining: {rateLimit.remaining} / {rateLimit.limit}</p>
                <p>Resets at: {rateLimit.resetTime ? new Date(rateLimit.resetTime).toLocaleTimeString() : 'N/A'}</p>
            </div>
            <div className="chat-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default App;
