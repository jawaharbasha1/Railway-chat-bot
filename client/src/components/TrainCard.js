import React from 'react';

const TrainCard = ({ train, onSelect }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{train.name}</h3>
          <p className="text-sm text-gray-600">Train #{train.id}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
          {train.seats} seats
        </span>
      </div>
      
      <div className="flex items-center space-x-2 mb-3 text-gray-700">
        <span className="font-medium">{train.from}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span className="font-medium">{train.to}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="block">🕐 {train.time}</span>
          <span className="block font-semibold text-blue-600">₹{train.price}/seat</span>
        </div>
        
        <button
          onClick={() => onSelect(train)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TrainCard;
