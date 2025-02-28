import { useState, useEffect } from 'react';

export default function CaptionInput({ onAddCaption, currentTime, isPlaying, setIsPlaying }) {
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  
  const handleSetStartTime = () => {
    setStartTime(currentTime);
  };
  
  const handleSetEndTime = () => {
    setEndTime(currentTime);
  };
  
  const formatTimeForDisplay = (seconds) => {
    if (isNaN(seconds)) return '00:00.000';
    
    const date = new Date(seconds * 1000);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const secs = date.getUTCSeconds().toString().padStart(2, '0');
    const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
    
    return `${minutes}:${secs}.${ms}`;
  };
  
  const parseTimeInput = (timeStr) => {
    const pattern = /^(\d{2}):(\d{2})\.(\d{3})$/;
    const match = timeStr.match(pattern);
    
    if (!match) return null;
    
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const milliseconds = parseInt(match[3], 10);
    
    return minutes * 60 + seconds + milliseconds / 1000;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('Please enter caption text');
      return;
    }
    
    if (startTime >= endTime) {
      alert('End time must be greater than start time');
      return;
    }
    
    const newCaption = {
      text: text.trim(),
      startTime,
      endTime
    };
    
    onAddCaption(newCaption);
    setText('');
    setStartTime(endTime); 
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Add Caption</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="captionText" className="block text-gray-700 mb-1">
            Caption Text:
          </label>
          <textarea
            id="captionText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            rows="3"
            placeholder="Enter caption text here..."
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startTime" className="block text-gray-700 mb-1">
              Start Time:
            </label>
            <div className="flex">
              <input
                id="startTime"
                type="text"
                value={formatTimeForDisplay(startTime)}
                onChange={(e) => {
                  const parsedTime = parseTimeInput(e.target.value);
                  if (parsedTime !== null) {
                    setStartTime(parsedTime);
                  }
                }}
                className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-400"
                pattern="\d{2}:\d{2}\.\d{3}"
                placeholder="00:00.000"
                required
              />
              <button
                type="button"
                onClick={handleSetStartTime}
                className="bg-gray-200 px-2 rounded-r hover:bg-gray-300"
              >
                Now
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-gray-700 mb-1">
              End Time:
            </label>
            <div className="flex">
              <input
                id="endTime"
                type="text"
                value={formatTimeForDisplay(endTime)}
                onChange={(e) => {
                  const parsedTime = parseTimeInput(e.target.value);
                  if (parsedTime !== null) {
                    setEndTime(parsedTime);
                  }
                }}
                className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-400"
                pattern="\d{2}:\d{2}\.\d{3}"
                placeholder="00:00.000"
                required
              />
              <button
                type="button"
                onClick={handleSetEndTime}
                className="bg-gray-200 px-2 rounded-r hover:bg-gray-300"
              >
                Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Add Caption
          </button>
        </div>
      </form>
    </div>
  );
}