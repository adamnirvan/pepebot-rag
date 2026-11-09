import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function ChatIndex() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Halo Warga! Saya PepeBot, asisten virtual Desa Pepe. Ada yang bisa saya bantu terkait layanan atau dokumen desa?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll ke pesan terbaru
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => scrollToBottom(), [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setInput('');
        setIsLoading(true);

        try {
            // Memanggil REST API WebChatController yang baru saja dibuat
            const response = await axios.post('/api/chat', { message: userText });
            
            setMessages(prev => [...prev, { 
                sender: 'bot', 
                text: response.data.answer,
                isFallback: response.data.is_fallback
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                sender: 'bot', 
                text: error.response?.data?.error || 'Maaf, terjadi kesalahan jaringan. Silakan coba lagi.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
            <Head title="PepeBot - Layanan Desa Pepe" />
            
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col h-[80vh]">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 mr-4">
                        PB
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">PepeBot</h1>
                        <p className="text-blue-200 text-sm">Asisten Virtual Desa Pepe</p>
                    </div>
                </div>

                {/* Area Pesan */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-5 py-3 whitespace-pre-wrap ${
                                msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : msg.isFallback 
                                        ? 'bg-red-100 text-red-900 border border-red-200 rounded-bl-none'
                                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-500 rounded-2xl px-5 py-3 rounded-bl-none animate-pulse">
                                PepeBot sedang mengetik...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Form Input */}
                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tulis pertanyaan Anda di sini..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Kirim
                    </button>
                </form>
            </div>
        </div>
    );
}