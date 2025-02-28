import { useState } from 'react';

export default function CaptionList({ captions, onEditCaption, onDeleteCaption, currentTime }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editStartTime, setEditStartTime] = useState(0);
  const [editEndTime, setEditEndTime] = useState(0);
  
  const handleEdit = (index) => {
    const caption = captions[index];
    setEditIndex(index);
    setEditText(caption.text);
    setEditStartTime(caption.startTime);
    setEditEndTime(caption.endTime);
  };
  
  const handleCancelEdit = () => {
    setEditIndex(null);
  };
  
  const handleSaveEdit = () => {
    if (!editText.trim()) {
      alert('Caption text cannot be empty');
      return;
    }
    
    if (editStartTime >= editEndTime) {
      alert('End time must be greater than start time');
      return;
    }
    
    const updatedCaption = {
      text: editText.trim(),
      startTime: editStartTime,
      endTime: editEndTime
    };
    
    onEditCaption(editIndex, updatedCaption);
    setEditIndex(null);
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
  
  const isActiveCaptionIndex = (index) => {
    const caption = captions[index];
    return currentTime >= caption.startTime && currentTime <= caption.endTime;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Captions ({captions.length})</h2>
      
      {captions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No captions added yet</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {captions.map((caption, index) => (
            <div 
              key={index} 
              className={`p-3 border rounded ${
                isActiveCaptionIndex(index) 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200'
              }`}
            >
              {editIndex === index ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    rows="2"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Start Time:</label>
                      <input
                        type="text"
                        value={formatTimeForDisplay(editStartTime)}
                        onChange={(e) => {
                          const parsedTime = parseTimeInput(e.target.value);
                          if (parsedTime !== null) {
                            setEditStartTime(parsedTime);
                          }
                        }}
                        className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        pattern="\d{2}:\d{2}\.\d{3}"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">End Time:</label>
                      <input
                        type="text"
                        value={formatTimeForDisplay(editEndTime)}
                        onChange={(e) => {
                          const parsedTime = parseTimeInput(e.target.value);
                          if (parsedTime !== null) {
                            setEditEndTime(parsedTime);
                          }
                        }}
                        className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        pattern="\d{2}:\d{2}\.\d{3}"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
          
                <div>
                  <p className="mb-2">{caption.text}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {formatTimeForDisplay(caption.startTime)} → {formatTimeForDisplay(caption.endTime)}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteCaption(index)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}