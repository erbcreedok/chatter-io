# Chatter Viewer - WhatsApp Chat Archive Reader

A modern React TypeScript application for viewing and analyzing WhatsApp chat exports. Parse, display, and explore your chat history with a beautiful, intuitive interface.

## Features

- 🚀 **Modern Tech Stack**: Built with React 19, TypeScript, and Vite
- 📱 **WhatsApp Chat Parser**: Automatically parses WhatsApp exported chat files
- 💬 **Rich Message Display**: Supports text, audio, video, images, stickers, calls, and system messages
- 🔍 **Advanced Search & Filter**: Search messages, filter by participants, sort by date/activity
- 📊 **Chat Statistics**: View comprehensive analytics about your chat history
- 🎨 **Beautiful UI**: Modern design with gradient backgrounds and smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔧 **TypeScript**: Full type safety and excellent developer experience
- ⚡ **Fast Performance**: Optimized for large chat archives
- 🧩 **Component Architecture**: Well-organized, maintainable codebase

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header with branding
│   ├── ChatContainer.tsx # Main chat viewer interface
│   ├── ChatSidebar.tsx # Chat list with search & filters
│   ├── MessageList.tsx # Messages display area
│   ├── MessageItem.tsx # Individual message rendering
│   ├── ChatStats.tsx   # Statistics and analytics
│   └── Footer.tsx      # Application footer
├── hooks/              # Custom React hooks
│   └── useChatData.ts  # Chat data management & state
├── types/              # TypeScript type definitions
│   └── index.ts        # Interfaces for parsed chat data
├── utils/              # Utility functions
│   ├── whatsappParser.ts # WhatsApp chat file parser
│   └── chatFileReader.ts # File reading and processing
├── data/               # Chat data directory
│   └── raw/           # WhatsApp exported files
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js (version 20.19+ or 22.12+ required for Vite 7)
- npm or yarn

**Note**: If you're using Node.js 18.x, you may encounter compatibility issues with Vite 7. Consider upgrading to Node.js 20+ or downgrading Vite to version 5.x for Node.js 18 compatibility.

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd chatter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern features
- **ESLint** - Code linting

## WhatsApp Chat Format Support

The application parses WhatsApp exported chat files with the following format:
```
[DD.MM.YYYY, HH:MM:SS] Sender Name: Message content
```

### Supported Message Types

- **Text Messages**: Regular chat messages
- **Media Messages**: Audio, video, images, documents (shows as "media omitted")
- **Stickers**: Emoji and sticker messages
- **Calls**: Voice and video calls with duration
- **System Messages**: Security notifications, group changes, etc.

### Data Structure

- **ParsedMessage**: Individual message with timestamp, sender, content, and type
- **ParsedChat**: Complete chat with participants, messages, and metadata
- **ChatCollection**: Collection of all parsed chats with statistics

## Component Overview

### Core Components

- **App**: Main application wrapper
- **Header**: Application branding and navigation
- **ChatContainer**: Main chat viewer with statistics
- **ChatSidebar**: Chat list with search, filtering, and sorting
- **MessageList**: Scrollable message display area
- **MessageItem**: Individual message with type-specific rendering
- **ChatStats**: Analytics dashboard with message statistics
- **Footer**: Application footer

### Custom Hooks

- **useChatData**: Manages parsed chat data, selection, and search functionality

### Utilities

- **WhatsAppParser**: Parses WhatsApp chat export format into structured data
- **ChatFileReader**: Handles file reading and chat collection management

## Features in Detail

### Chat Viewer Interface
- Clean, modern message bubbles with type-specific icons
- Timestamp and date display for each message
- Sender identification with color coding
- Support for all WhatsApp message types
- Responsive design for all screen sizes

### Advanced Sidebar
- Complete chat list with participant information
- Real-time search across chat names and participants
- Sorting options: by date, name, or message count
- Message count and media indicators
- Last message preview with timestamps

### Analytics Dashboard
- Total message and participant statistics
- Date range analysis across all chats
- Message type breakdown with visual indicators
- Interactive statistics when no chat is selected

### Message Type Support
- **Text**: Regular messages with full formatting
- **Media**: Audio, video, images with "omitted" indicators
- **Calls**: Video/voice calls with duration display
- **System**: Security and group notifications
- **Stickers**: Emoji and sticker messages

## Development

The application uses modern React patterns including:
- Functional components with hooks
- TypeScript for type safety
- CSS modules for styling
- Custom hooks for state management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Future Enhancements

- **File Upload**: Direct WhatsApp chat file upload functionality
- **Export Features**: Export filtered chats to various formats (JSON, CSV, PDF)
- **Advanced Analytics**: Message frequency charts, activity heatmaps, word clouds
- **Search Enhancement**: Full-text search with highlighting and filters
- **Media Preview**: Display actual media files when available
- **Dark Mode**: Theme switching for better user experience
- **Bulk Operations**: Select and process multiple chats at once
- **Data Visualization**: Interactive charts and graphs for chat patterns