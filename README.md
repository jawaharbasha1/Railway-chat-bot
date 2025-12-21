# Railway Booking Chatbot

A full-stack railway booking chatbot application built with React, Node.js, Express, and Tailwind CSS.

## Features

- 🤖 Interactive chatbot interface
- 🔍 Search trains between cities
- 🎫 Book train tickets
- 💬 Natural language conversation
- 📱 Responsive design with Tailwind CSS
- ✨ Modern UI with smooth animations

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Axios
- HTML5

**Backend:**
- Node.js
- Express.js
- CORS
- Body Parser

## Project Structure

```
railway-booking-chatbot/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.js
│   │   │   ├── TrainCard.js
│   │   │   ├── SearchForm.js
│   │   │   └── BookingForm.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Node.js backend
│   └── index.js
├── package.json
├── .env
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd "/Users/apple/Desktop/SEM 5/Project_sem5"
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Variables:**
   The `.env` file is already created with default values:
   ```
   PORT=5000
   ```

## Running the Application

### Option 1: Run Both (Recommended)
Run both frontend and backend concurrently:
```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```
Server will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run client
```
Frontend will run on http://localhost:3000

## Usage

1. **Open the application** at http://localhost:3000
2. **Chat with the bot** - Type messages or use quick action buttons
3. **Search Trains:**
   - Click "Search Trains" button
   - Enter source and destination cities
   - View available trains
4. **Book Tickets:**
   - Click "Book Now" on any train card
   - Enter passenger name and number of seats
   - Confirm booking
5. **View Stations** - Click to see all available stations

## Available API Endpoints

### Backend API (Port 5000)

- `GET /` - API status check
- `POST /api/chat` - Process chatbot messages
- `POST /api/search-trains` - Search trains
  ```json
  {
    "from": "Delhi",
    "to": "Mumbai"
  }
  ```
- `POST /api/book-ticket` - Book a ticket
  ```json
  {
    "trainId": 1,
    "passengerName": "John Doe",
    "seats": 2
  }
  ```
- `GET /api/booking/:bookingId` - Get booking details
- `GET /api/stations` - Get all available stations

## Available Cities

- Delhi
- Mumbai
- Kolkata
- Chennai
- Bangalore
- Lucknow
- Chandigarh

## Features in Detail

### Chatbot Capabilities
- Natural language understanding
- Greeting responses
- Help commands
- Station information
- Train search assistance

### Train Search
- Search by source and destination
- View train details (name, time, price, available seats)
- Real-time availability updates

### Ticket Booking
- Select trains from search results
- Enter passenger information
- Choose number of seats
- Instant booking confirmation with booking ID
- Total price calculation

### UI Features
- Responsive design for all screen sizes
- Smooth animations
- Loading indicators
- Modal forms for search and booking
- Message timestamps
- Auto-scroll chat

## Customization

### Adding More Trains
Edit `server/index.js` and add trains to the `trains` array:
```javascript
const trains = [
  { 
    id: 6, 
    name: 'New Express', 
    from: 'City1', 
    to: 'City2', 
    time: '11:00 AM', 
    price: 1000, 
    seats: 50 
  }
];
```

### Styling
Modify Tailwind classes in component files or update `client/tailwind.config.js` for custom theme.

### Color Scheme
Update colors in `client/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

## Troubleshooting

**Port already in use:**
- Change PORT in `.env` file
- Kill process using the port: `lsof -ti:5000 | xargs kill`

**CORS errors:**
- Ensure backend is running
- Check API_URL in `client/src/App.js`

**Dependencies not found:**
- Run `npm install` in root and client folders
- Clear cache: `npm cache clean --force`

## Future Enhancements

- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Train schedule by date
- [ ] Seat selection (window/aisle)
- [ ] Booking history
- [ ] Email confirmations
- [ ] Real-time train tracking
- [ ] Multi-language support
- [ ] Database integration (MongoDB/PostgreSQL)

## License

MIT License - Feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please create an issue in the repository.

---

**Developed with ❤️ using React, Node.js, and Tailwind CSS**
