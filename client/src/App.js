import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatMessage from './components/ChatMessage';
import BookingForm from './components/BookingForm';
import SearchForm from './components/SearchForm';
import BookingHistory from './components/BookingHistory';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const API_URL = 'http://localhost:5001/api';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Chat Component (extracted from App)
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Initial greeting with user's name
    const userName = user?.name || 'there';
    addMessage('bot', `Hello ${userName}! Welcome to Railway Booking System. I can help you search trains and book tickets. What would you like to do today?`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender, text, data = null) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      sender, 
      text, 
      data,
      timestamp: new Date() 
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    addMessage('user', userMessage);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await axios.post(`${API_URL}/chat`, {
        message: userMessage
      });

      setIsTyping(false);
      addMessage('bot', response.data.response);
    } catch (error) {
      setIsTyping(false);
      addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTrains = async (from, to) => {
    addMessage('user', `Search trains from ${from} to ${to}`);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/search-trains`, {
        from,
        to
      });

      addMessage('bot', response.data.message);
      
      if (response.data.trains && response.data.trains.length > 0) {
        addMessage('bot', 'Here are the available trains:', { trains: response.data.trains });
      }
    } catch (error) {
      addMessage('bot', 'Sorry, I could not search for trains. Please try again.');
    } finally {
      setIsLoading(false);
      setShowSearchForm(false);
    }
  };

  const handleBookTicket = async (bookingData) => {
    addMessage('user', `Book ticket for ${bookingData.passengerName} - ${bookingData.seats} seat(s)`);
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Add user email to booking data
      const bookingWithEmail = {
        ...bookingData,
        userEmail: user?.email
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.post(`${API_URL}/book-ticket`, bookingWithEmail);

      const booking = response.data.booking;
      setIsTyping(false);
      addMessage('bot', `✅ ${response.data.message}\n\n🎫 Booking ID: ${booking.bookingId}\n👤 Passenger: ${booking.passengerName}\n🚂 Train: ${booking.trainName}\n📍 From: ${booking.from} → ${booking.to}\n🕐 Time: ${booking.time}\n💺 Seats: ${booking.seats}\n💰 Total: ₹${booking.totalPrice}`);
    } catch (error) {
      setIsTyping(false);
      const errorMsg = error.response?.data?.error || 'Sorry, booking failed. Please try again.';
      addMessage('bot', errorMsg);
    } finally {
      setIsLoading(false);
      setShowBookingForm(false);
      setSelectedTrain(null);
    }
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setShowBookingForm(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with User Info and Logout */}
        <div className="bg-white rounded-t-2xl shadow-xl p-6 border-b-2 border-gradient">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Railway Booking Assistant
                </h1>
                <p className="text-gray-600">Book your train tickets easily</p>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{user?.name || user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="bg-white shadow-xl p-6 h-[500px] overflow-y-auto chat-container"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onTrainSelect={handleTrainSelect} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4 message-animation">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-5 py-3 shadow-lg border border-blue-200">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow-xl p-4 border-t border-gray-200 rounded-b-2xl">
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setShowSearchForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>Search Trains</span>
            </button>
            <button
              onClick={() => setShowBookingHistory(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>📜</span>
              <span>My Bookings</span>
            </button>
            <button
              onClick={() => addMessage('bot', 'Available stations: Delhi, Mumbai, Kolkata, Chennai, Bangalore, Lucknow, Chandigarh')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>📍</span>
              <span>Stations</span>
            </button>
            <button
              onClick={() => addMessage('bot', 'I can help you with:\n1. 🔍 Search trains between cities\n2. 🎫 Book train tickets\n3. 📜 View your booking history\n4. 📍 Check available stations\n\nJust click on the buttons or type your query!')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>❓</span>
              <span>Help</span>
            </button>
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSearchForm && (
        <SearchForm
          onSearch={handleSearchTrains}
          onClose={() => setShowSearchForm(false)}
        />
      )}

      {showBookingForm && selectedTrain && (
        <BookingForm
          train={selectedTrain}
          onBook={handleBookTicket}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedTrain(null);
          }}
        />
      )}

      {showBookingHistory && (
        <BookingHistory
          userEmail={user?.email}
          onClose={() => setShowBookingHistory(false)}
        />
      )}
    </div>
  );
};

// Main App Component with Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatApp />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
