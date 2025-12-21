const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data for trains
const trains = [
  { id: 1, name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', time: '06:00 AM', price: 1500, seats: 50 },
  { id: 2, name: 'Shatabdi Express', from: 'Delhi', to: 'Chandigarh', time: '07:15 AM', price: 800, seats: 30 },
  { id: 3, name: 'Duronto Express', from: 'Mumbai', to: 'Kolkata', time: '08:30 AM', price: 2000, seats: 40 },
  { id: 4, name: 'Garib Rath', from: 'Chennai', to: 'Bangalore', time: '09:00 AM', price: 600, seats: 60 },
  { id: 5, name: 'Humsafar Express', from: 'Delhi', to: 'Lucknow', time: '10:30 AM', price: 1200, seats: 45 },
  { id: 6, name: 'Chennai Express', from: 'Chennai', to: 'Mumbai', time: '11:00 AM', price: 1800, seats: 55 },
  { id: 7, name: 'Mumbai Chennai SF', from: 'Mumbai', to: 'Chennai', time: '12:30 PM', price: 1750, seats: 50 },
  { id: 8, name: 'Kolkata Mail', from: 'Delhi', to: 'Kolkata', time: '01:00 PM', price: 1600, seats: 45 },
  { id: 9, name: 'Bangalore Express', from: 'Mumbai', to: 'Bangalore', time: '02:15 PM', price: 1400, seats: 40 },
  { id: 10, name: 'Lucknow Express', from: 'Mumbai', to: 'Lucknow', time: '03:30 PM', price: 1300, seats: 35 },
  { id: 11, name: 'Golden Temple Mail', from: 'Mumbai', to: 'Chandigarh', time: '04:00 PM', price: 1500, seats: 40 },
  { id: 12, name: 'Bangalore Rajdhani', from: 'Delhi', to: 'Bangalore', time: '05:00 PM', price: 2200, seats: 50 },
  { id: 13, name: 'Chennai Rajdhani', from: 'Delhi', to: 'Chennai', time: '06:30 PM', price: 2100, seats: 45 },
  { id: 14, name: 'East Coast Express', from: 'Chennai', to: 'Kolkata', time: '07:00 PM', price: 1900, seats: 40 },
  { id: 15, name: 'Southern Express', from: 'Bangalore', to: 'Chennai', time: '08:15 PM', price: 550, seats: 60 }
];

// Mock bookings storage - organized by user email
const bookings = {};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Railway Booking Chatbot API' });
});

// Search trains
app.post('/api/search-trains', (req, res) => {
  const { from, to } = req.body;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Please provide both source and destination' });
  }

  const availableTrains = trains.filter(train => 
    train.from.toLowerCase().includes(from.toLowerCase()) && 
    train.to.toLowerCase().includes(to.toLowerCase())
  );

  if (availableTrains.length === 0) {
    return res.json({ 
      message: `Sorry, no trains found from ${from} to ${to}. Try different cities like Delhi, Mumbai, Kolkata, Chennai, Bangalore, or Lucknow.`,
      trains: []
    });
  }

  res.json({ 
    message: `Found ${availableTrains.length} train(s) from ${from} to ${to}`,
    trains: availableTrains 
  });
});

// Book ticket
app.post('/api/book-ticket', (req, res) => {
  const { trainId, passengerName, seats, userEmail } = req.body;

  if (!trainId || !passengerName || !seats || !userEmail) {
    return res.status(400).json({ error: 'Please provide train ID, passenger name, seats, and user email' });
  }

  const train = trains.find(t => t.id === parseInt(trainId));

  if (!train) {
    return res.status(404).json({ error: 'Train not found' });
  }

  if (train.seats < seats) {
    return res.status(400).json({ error: `Only ${train.seats} seats available` });
  }

  // Create booking
  const booking = {
    bookingId: `BK${Date.now()}`,
    trainId: train.id,
    trainName: train.name,
    from: train.from,
    to: train.to,
    time: train.time,
    passengerName,
    seats: parseInt(seats),
    totalPrice: train.price * parseInt(seats),
    bookingDate: new Date().toISOString(),
    status: 'confirmed',
    userEmail
  };

  // Store booking by user email
  if (!bookings[userEmail]) {
    bookings[userEmail] = [];
  }
  bookings[userEmail].push(booking);
  train.seats -= parseInt(seats);

  res.json({ 
    message: 'Ticket booked successfully!',
    booking 
  });
});

// Get booking details
app.get('/api/booking/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  
  let foundBooking = null;
  for (const userBookings of Object.values(bookings)) {
    foundBooking = userBookings.find(b => b.bookingId === bookingId);
    if (foundBooking) break;
  }

  if (!foundBooking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({ booking: foundBooking });
});

// Get user's booking history
app.get('/api/bookings/:userEmail', (req, res) => {
  const { userEmail } = req.params;
  
  const userBookings = bookings[userEmail] || [];
  
  res.json({ 
    bookings: userBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
  });
});

// Cancel booking
app.post('/api/cancel-booking', (req, res) => {
  const { bookingId, userEmail } = req.body;

  if (!bookingId || !userEmail) {
    return res.status(400).json({ error: 'Please provide booking ID and user email' });
  }

  const userBookings = bookings[userEmail];
  
  if (!userBookings) {
    return res.status(404).json({ error: 'No bookings found for this user' });
  }

  const bookingIndex = userBookings.findIndex(b => b.bookingId === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const booking = userBookings[bookingIndex];

  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'Booking already cancelled' });
  }

  // Update booking status
  booking.status = 'cancelled';
  booking.cancelledDate = new Date().toISOString();

  // Restore train seats
  const train = trains.find(t => t.id === booking.trainId);
  if (train) {
    train.seats += booking.seats;
  }

  res.json({ 
    message: 'Booking cancelled successfully',
    booking 
  });
});

// Get all stations
app.get('/api/stations', (req, res) => {
  const stations = [...new Set(trains.flatMap(train => [train.from, train.to]))];
  res.json({ stations });
});

// Helper function to extract city names from text
function extractCities(text) {
  const lowerText = text.toLowerCase();
  const allStations = [...new Set(trains.flatMap(train => [train.from, train.to]))];
  
  const foundCities = allStations.filter(station => 
    lowerText.includes(station.toLowerCase())
  );
  
  return foundCities;
}

// Helper function to detect train search patterns
function detectTrainSearchIntent(text) {
  const patterns = [
    /(?:search|find|show|check|look for|looking for)\s+(?:trains?|train tickets?)/i,
    /trains?\s+(?:from|between)/i,
    /(?:from|between)\s+(\w+)\s+(?:to|and)\s+(\w+)/i,
    /(\w+)\s+(?:to|and)\s+(\w+)/i
  ];
  
  return patterns.some(pattern => pattern.test(text));
}

// Helper function to detect booking intent
function detectBookingIntent(text) {
  const patterns = [
    /book\s+(?:a\s+)?(?:train\s+)?ticket/i,
    /book\s+train/i,
    /want\s+to\s+book/i,
    /need\s+to\s+book/i,
    /(?:make|create)\s+(?:a\s+)?booking/i,
    /reserve\s+(?:a\s+)?(?:train\s+)?ticket/i
  ];
  
  return patterns.some(pattern => pattern.test(text));
}

// Process chatbot message
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const lowerMessage = message.toLowerCase();

  // Intent detection - Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return res.json({ 
      response: 'Hello! Welcome to Railway Booking System. I can help you search trains and book tickets. What would you like to do today?',
      type: 'greeting'
    });
  }

  // Help intent
  if (lowerMessage.includes('help')) {
    return res.json({ 
      response: 'I can help you with:\n1. 🔍 Search trains between cities\n2. 🎫 Book train tickets\n3. 📜 View your booking history\n4. 📍 Check available stations\n\nJust click on the buttons or type your query!',
      type: 'help'
    });
  }

  // Available stations intent
  if (lowerMessage.includes('station') || lowerMessage.includes('city') || lowerMessage.includes('cities') || lowerMessage.includes('available')) {
    const stations = [...new Set(trains.flatMap(train => [train.from, train.to]))];
    return res.json({ 
      response: `Available stations: ${stations.join(', ')}`,
      type: 'stations',
      stations: stations
    });
  }

  // Booking history intent
  if (lowerMessage.includes('booking history') || lowerMessage.includes('my booking') || lowerMessage.includes('view booking')) {
    return res.json({ 
      response: 'Please use the "View Booking History" button to see all your bookings.',
      type: 'history'
    });
  }

  // Train search intent
  if (detectTrainSearchIntent(lowerMessage)) {
    const cities = extractCities(lowerMessage);
    
    if (cities.length >= 2) {
      // Found both source and destination
      return res.json({ 
        response: `Great! Let me search for trains from ${cities[0]} to ${cities[1]}. Click "Search Trains" button or use the search form above to see available trains.`,
        type: 'search_suggestion',
        from: cities[0],
        to: cities[1]
      });
    } else if (cities.length === 1) {
      return res.json({ 
        response: `I see you mentioned ${cities[0]}. Please specify both source and destination cities. For example: "Search trains from Delhi to Mumbai"`,
        type: 'search_incomplete'
      });
    } else {
      return res.json({ 
        response: 'To search for trains, please tell me the source and destination cities. For example: "Search trains from Delhi to Mumbai"\n\nAvailable cities: Delhi, Mumbai, Kolkata, Chennai, Bangalore, Lucknow, Chandigarh',
        type: 'search_help'
      });
    }
  }

  // Booking intent
  if (detectBookingIntent(lowerMessage)) {
    const cities = extractCities(lowerMessage);
    
    if (cities.length >= 2) {
      return res.json({ 
        response: `I can help you book a train from ${cities[0]} to ${cities[1]}! First, use the "Search Trains" button above to find available trains, then you can book your preferred train.`,
        type: 'booking_suggestion',
        from: cities[0],
        to: cities[1]
      });
    } else {
      return res.json({ 
        response: 'To book a train ticket:\n1. Use the "Search Trains" button to find available trains\n2. Click "Book Now" on your preferred train\n3. Fill in the booking details\n\nWhich cities would you like to travel between?',
        type: 'booking_help'
      });
    }
  }

  // City to city pattern (simple format like "delhi to mumbai")
  const cities = extractCities(lowerMessage);
  if (cities.length >= 2) {
    return res.json({ 
      response: `Found your query: ${cities[0]} to ${cities[1]}! Use the "Search Trains" button above to see all available trains for this route.`,
      type: 'route_detected',
      from: cities[0],
      to: cities[1]
    });
  }

  // Default fallback
  return res.json({ 
    response: 'I can help you with:\n1. 🔍 Search trains between cities\n2. 🎫 Book train tickets\n3. 📜 View your booking history\n4. 📍 Check available stations\n\nJust click on the buttons or type your query!',
    type: 'default'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
