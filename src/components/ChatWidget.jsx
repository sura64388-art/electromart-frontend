import React, { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    X,
    Send,
    Truck,
    RotateCcw,
    ShieldCheck,
    Phone,
    Clock,
    Image as ImageIcon,
    Mic,
    ChevronRight,
    Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";

const ChatWidget = () => {
    const { user } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    const [view, setView] = useState("home"); // home or chat
    const [messages, setMessages] = useState([
        { id: 1, text: "What's the warranty period on your products?", isUser: true },
        { id: 2, text: "All our products come with a standard 1-year warranty. To activate it or file a claim, please visit our Warranty section or contact support.", isUser: false },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, view]);

    const instantAnswers = [
        { text: "Track my order", icon: Truck, color: "text-orange-500", bg: "bg-orange-50" },
        { text: "Return Policy", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50" },
        { text: "Warranty Activation Process", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
        { text: "What are your shipping details?", icon: Truck, color: "text-orange-500", bg: "bg-orange-50" },
        { text: "Contact / Customer Care", icon: Phone, color: "text-pink-500", bg: "bg-pink-50" },
        { text: "What's the warranty period on your products?", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    ];


    const handleSendMessage = async (text = inputValue, type = "text") => {
        if (type === "text" && !text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: type === "text" ? text : "",
            image: type === "image" ? text : null,
            isUser: true
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setView("chat");

        if (type === "image") {
            setTimeout(() => {
                const systemMsg = {
                    id: Date.now() + 1,
                    text: "Received your image! Our team will look into it.",
                    isUser: false
                };
                setMessages(prev => [...prev, systemMsg]);
            }, 1000);
            return;
        }

        setIsTyping(true);
        try {
            // Prepare history in the format expected by the backend (Gemini-style adapter)
            const history = messages.slice(-10).map(msg => ({
                role: msg.isUser ? "user" : "model",
                parts: [{ text: msg.text }]
            }));

            const response = await axios.post("/chat", { message: text, history });

            const systemMsg = {
                id: Date.now() + 1,
                text: response.data.text,
                isUser: false
            };
            setMessages(prev => [...prev, systemMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            const systemMsg = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting to my brain. Please try again later!",
                isUser: false
            };
            setMessages(prev => [...prev, systemMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleSendMessage(reader.result, "image");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMicClick = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            const userMsg = { id: Date.now(), text: "🎤 Voice message recorded", isUser: true };
            setMessages(prev => [...prev, userMsg]);
            setView("chat");
        }, 2000);
    };

    const handleAnswerClick = (text) => {
        handleSendMessage(text);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
                    >
                        {/* Header */}
                        <div className="bg-[#007AFF] p-8 text-white relative shrink-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold">Chat with us</h2>
                            <p className="text-blue-50 text-sm mt-2 flex items-center gap-2">
                                <span className="animate-bounce">👋</span> Hi, message us with any questions. We're happy to help!
                            </p>
                        </div>

                        {/* Search/Input in Home View */}
                        {view === "home" && (
                            <div className="p-5 border-b dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
                                <div className={`flex items-center bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all ${isRecording ? 'animate-pulse ring-2 ring-red-500 bg-red-50' : ''}`}>
                                    {isRecording ? (
                                        <div className="flex-1 text-red-600 font-bold text-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                                            Listening...
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 mr-3 hover:text-blue-500 transition-colors">
                                                <ImageIcon size={20} />
                                            </button>
                                            <button onClick={handleMicClick} className="text-gray-400 mr-3 hover:text-blue-500 transition-colors">
                                                <Mic size={20} />
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Write message"
                                                className="flex-1 bg-transparent border-none focus:outline-none text-sm dark:text-white"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                            />
                                            <Send
                                                size={20}
                                                className="text-blue-500 ml-3 cursor-pointer hover:scale-110 transition-transform"
                                                onClick={() => handleSendMessage()}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-gray-50/30 dark:bg-gray-900"
                        >
                            {view === "home" ? (
                                <>
                                    <div className="py-2 text-center">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Instant answers</span>
                                    </div>
                                    <div className="space-y-3 pb-4">
                                        {instantAnswers.map((answer, index) => {
                                            const Icon = answer.icon;
                                            return (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ x: 5 }}
                                                    onClick={() => handleAnswerClick(answer.text)}
                                                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all text-left dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-900 shadow-sm"
                                                >
                                                    <div className={`p-2.5 rounded-xl ${answer.bg} dark:bg-opacity-10 shrink-0`}>
                                                        <Icon size={18} className={answer.color} />
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-200 flex-1">{answer.text}</span>
                                                    <ChevronRight size={16} className="text-gray-300" />
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-4 rounded-[20px] text-[14px] leading-relaxed shadow-lg ${msg.isUser
                                                    ? "bg-[#007AFF] text-white rounded-br-none"
                                                    : "bg-white text-gray-800 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-bl-none"
                                                    }`}
                                            >
                                                {msg.image && (
                                                    <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-w-full h-auto shadow-sm" />
                                                )}
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white p-4 rounded-[20px] rounded-bl-none border border-gray-100 dark:bg-gray-800 dark:border-gray-700 flex gap-1">
                                                <motion.span
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                ></motion.span>
                                                <motion.span
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                ></motion.span>
                                                <motion.span
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                ></motion.span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Bottom Input in Chat View */}
                        {view === "chat" && (
                            <div className="p-5 border-t dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                                <div className="flex items-center gap-3">
                                    <div className={`flex-1 flex items-center bg-gray-50 dark:bg-gray-800 rounded-full px-5 py-3 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all ${isRecording ? 'border-red-500 bg-red-50' : ''}`}>
                                        {isRecording ? (
                                            <div className="flex-1 text-red-600 font-bold text-sm">Listening...</div>
                                        ) : (
                                            <>
                                                <div className="flex gap-2.5 mr-3">
                                                    <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-blue-500 transition-colors">
                                                        <ImageIcon size={18} />
                                                    </button>
                                                    <button onClick={handleMicClick} className="text-gray-400 hover:text-blue-500 transition-colors">
                                                        <Mic size={18} />
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type a message..."
                                                    className="flex-1 bg-transparent border-none focus:outline-none text-[14px] dark:text-white"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleSendMessage()}
                                        className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shrink-0"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-[0_15px_35px_rgba(0,122,255,0.4)] transition-all duration-300 flex items-center justify-center ${isOpen ? 'bg-white text-[#007AFF]' : 'bg-[#007AFF] text-white'
                    }`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;

