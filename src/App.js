import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Tambahkan pesan pengguna ke daftar
        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            // Kirim pesan ke backend
            const response = await axios.post('https://gemini-chatbot-backend.vercel.app/api/chat', {
                message: input,
            });
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { sender: 'bot', text: 'Error: Could not get response from the server.' };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className="App">
            <h1>Gemini Chatbot</h1>
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
