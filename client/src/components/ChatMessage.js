import React from 'react';
import TrainCard from './TrainCard';

const ChatMessage = ({ message, onTrainSelect }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 message-animation`}>
      <div className={`max-w-[70%] ${isBot ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'} rounded-2xl px-5 py-3 shadow-lg message-bubble transform transition-all hover:scale-102`}>
        {isBot && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md animate-pulse-slow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Assistant</span>
          </div>
        )}
        
        <p className="whitespace-pre-line text-sm">{message.text}</p>
        
        {/* Display trains if available in message data */}
        {message.data?.trains && (
          <div className="mt-3 space-y-2">
            {message.data.trains.map(train => (
              <TrainCard 
                key={train.id} 
                train={train} 
                onSelect={onTrainSelect}
              />
            ))}
          </div>
        )}
        
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
