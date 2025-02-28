# Video Captioning Web App

A Next.js application that allows users to add captions to hosted videos, with precise timestamp control and a seamless viewing experience.

## Features

- Load videos from URLs (supports MP4, WebM, OGG, YouTube, Vimeo)
- Add captions with precise start and end timestamps
- Live caption display while watching the video
- Edit and delete existing captions
- Export captions to VTT format
- Keyboard shortcuts for enhanced usability
- Responsive design for all device sizes
- Automatic saving of work-in-progress

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Video Playback**: react-player
- **State Management**: React Hooks
- **Persistence**: localStorage

## Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShravaniAK/Video-Caption
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1. **Enter a Video URL** - Start by entering a URL to a hosted video (MP4, WebM, YouTube, etc.)
2. **Add Captions** - Use the caption form to enter text and set timestamps
   - You can pause/play the video while adding captions
   - Use the "Now" buttons to quickly set timestamps to the current video time
3. **Edit Captions** - Click "Edit" on any caption to modify its text or timestamps
4. **Export** - Click "Export Captions" to download your captions in VTT format

### Keyboard Shortcuts

- **Space** - Play/Pause the video
- **Left/Right Arrow** - Skip backward/forward 5 seconds
- **M** - Mute/Unmute the video

## Technical Decisions Documentation

### Architecture

The application follows a component-based architecture with clear separation of concerns:

- **VideoPlayer**: Handles video playback and displaying captions
- **CaptionInput**: Manages the creation of new captions
- **CaptionList**: Displays, edits, and deletes existing captions
- **Main Page**: Coordinates communication between components and manages global state

This modular approach makes the code maintainable and extensible, allowing for future enhancements without significant refactoring.

### State Management

I chose to use React's built-in hooks (useState, useEffect) instead of external state management libraries to keep the application lightweight and reduce dependencies. The state is structured as follows:

- **Video state**: URL, playback position, playing status
- **Captions**: Array of caption objects with text, startTime, and endTime
- **UI states**: editing mode, current input values, etc.

This approach provides sufficient organization for the current requirements while maintaining simplicity.

### User Experience Considerations

1. **Immediate Feedback**: 
   - Active captions are highlighted in the list
   - The caption input form shows the current video time
   - Visual confirmation when actions are performed

2. **Efficiency Features**:
   - "Now" buttons to quickly capture current timestamp
   - Keyboard shortcuts for common actions
   - Sequential captioning (start time defaults to previous end time)

3. **Persistence**:
   - Automatic saving to localStorage prevents work loss
   - Export functionality for finished captions

4. **Responsive Design**:
   - Works on all screen sizes
   - Column layout on mobile, side-by-side on desktop

### Trade-offs and Considerations

1. **Video Format Support**:
   - Used react-player for broad format support instead of the native HTML5 video element
   - Trade-off: Added dependency but gained support for YouTube, Vimeo, etc.

2. **Caption Format**:
   - Implemented VTT export only (not SRT or other formats)
   - Rationale: VTT is widely supported and sufficient for most use cases

3. **Data Persistence**:
   - Used localStorage instead of a backend database
   - Trade-off: Simplicity vs. long-term storage and sharing capabilities

4. **Timing Precision**:
   - Used millisecond precision for timestamps
   - Trade-off: Added complexity but provided professional-grade accuracy

### Future Enhancements

Given more time, I would implement:

1. **Advanced Features**:
   - User accounts with cloud storage
   - Caption template library
   - Batch import/export of captions
   - Multi-language support

2. **UX Improvements**:
   - Drag-and-drop timing adjustment
   - Waveform visualization for precise timing
   - Caption styles customization (font, color, position)
   - AI-assisted caption generation

3. **Technical Enhancements**:
   - Server-side rendering for better SEO
   - Unit and integration tests
   - Performance optimizations for large caption sets
   - Support for additional caption formats (SRT, ASS, etc.)

## Conclusion

This video captioning app provides a complete solution for adding captions to videos with a focus on usability and efficiency. The application achieves a balance between feature richness and simplicity, making it accessible to users while providing the necessary tools for professional-grade captioning.
