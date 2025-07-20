import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useTimemapStore } from '../../store/timemapStore';
import { v4 as uuidv4 } from 'uuid';
import apiClient from '../../api';

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const { messages, addMessage, isLoading, setIsLoading } = useChatStore();
  const { addNode } = useTimemapStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleAiResponse = (response: any) => {
    // If the response is just a string, it's a conversational reply.
    if (typeof response === 'string') {
      addMessage({ id: uuidv4(), text: response, sender: 'ai' });
      return;
    }

    // If the response is an object, it's a command.
    const { action, payload, conversational_response } = response;

    if (action === 'add_node') {
      const newNode = {
        id: uuidv4(),
        x: Math.random() * 500,
        y: Math.random() * 300,
        radius: 25,
        color: 'purple',
        // In a real scenario, you'd parse the date to position the node correctly.
      };
      addNode(newNode);
    }
    
    // Always display the conversational response if it exists.
    if (conversational_response) {
      addMessage({ id: uuidv4(), text: conversational_response, sender: 'ai' });
    } else {
      // Fallback message if no specific conversational response is provided
      addMessage({ id: uuidv4(), text: "I'm not sure how to handle that action.", sender: 'ai' });
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { id: uuidv4(), text: inputValue, sender: 'user' as const };
    addMessage(userMessage);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/chat', { message: currentInput });
      handleAiResponse(res.data.response);
    } catch (error) {
      const errorMessage = { id: uuidv4(), text: 'Error communicating with AI. Please try again.', sender: 'ai' as const };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">AI Assistant</h3>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">Start by typing a command below.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && <div className="text-center text-gray-500">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="e.g., 'Add a node for the moon landing in 1969'"
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
