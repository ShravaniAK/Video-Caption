"use client"

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import CaptionInput from './components/CaptionInput';
import VideoPlayer from './components/VideoPlayer';
import CaptionList from './components/CaptionList';


export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [captions, setCaptions] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(true);
  
  useEffect(() => {
    const savedCaptions = localStorage.getItem('captions');
    const savedUrl = localStorage.getItem('videoUrl');
    
    if (savedCaptions) {
      setCaptions(JSON.parse(savedCaptions));
    }
    
    if (savedUrl) {
      setVideoUrl(savedUrl);
      setShowUrlInput(false);
    }
  }, []);
  
  // Save captions to localStorage whenever they change
  useEffect(() => {
    if (captions.length > 0) {
      localStorage.setItem('captions', JSON.stringify(captions));
    }
    
    if (videoUrl) {
      localStorage.setItem('videoUrl', videoUrl);
    }
  }, [captions, videoUrl]);
  
  const handleAddCaption = (newCaption) => {
    setCaptions([...captions, newCaption]);
  };
  
  const handleEditCaption = (index, updatedCaption) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index] = updatedCaption;
    setCaptions(updatedCaptions);
  };
  
  const handleDeleteCaption = (index) => {
    const updatedCaptions = captions.filter((_, i) => i !== index);
    setCaptions(updatedCaptions);
  };
  
  const handleVideoSubmit = (e) => {
    e.preventDefault();
    const url = e.target.videoUrl.value;
    if (isValidVideoUrl(url)) {
      setVideoUrl(url);
      setShowUrlInput(false);
    } else {
      alert('Please enter a valid video URL');
    }
  };
  
  const isValidVideoUrl = (url) => {
    try {
      new URL(url);
      return url.match(/\.(mp4|webm|ogg|mov)($|\?)/i) || 
             url.includes('youtube.com') || 
             url.includes('youtu.be') ||
             url.includes('vimeo.com');
    } catch (_) {
      return false;
    }
  };
  
  const handleReset = () => {
    if (confirm('Are you sure you want to reset? This will clear all captions.')) {
      setCaptions([]);
      setVideoUrl('');
      setShowUrlInput(true);
      localStorage.removeItem('captions');
      localStorage.removeItem('videoUrl');
    }
  };
  
  const exportCaptions = () => {
    // Create VTT format
    let vttContent = 'WEBVTT\n\n';
    
    captions.forEach((caption, index) => {
      const startTime = formatVttTime(caption.startTime);
      const endTime = formatVttTime(caption.endTime);
      
      vttContent += `${index + 1}\n`;
      vttContent += `${startTime} --> ${endTime}\n`;
      vttContent += `${caption.text}\n\n`;
    });
    
    // Create download link
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.vtt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const formatVttTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const secs = date.getUTCSeconds().toString().padStart(2, '0');
    const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
    
    return `${hours}:${minutes}:${secs}.${ms}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Video Captioning App</title>
        <meta name="description" content="Add captions to your videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Video Captioning App</h1>
          <div className="space-x-2">
            {!showUrlInput && (
              <>
                <button
                  onClick={exportCaptions}
                  className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded"
                >
                  Export Captions
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 bg-red-500 hover:bg-red-400 rounded"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 text-black">
        {showUrlInput ? (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Enter Video URL</h2>
            <form onSubmit={handleVideoSubmit}>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-gray-700 mb-2">
                  Video URL (MP4, WebM, YouTube, Vimeo):
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="https://example.com/video.mp4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition"
              >
                Load Video
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer
                url={videoUrl}
                captions={captions}
                onTimeUpdate={setCurrentTime}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <CaptionInput
                onAddCaption={handleAddCaption}
                currentTime={currentTime}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
              <CaptionList
                captions={captions}
                onEditCaption={handleEditCaption}
                onDeleteCaption={handleDeleteCaption}
                currentTime={currentTime}
              />
            </div>
          </div>
        )}
      </main>
      
  
    </div>
  );
}