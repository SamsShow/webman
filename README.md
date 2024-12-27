# WebMan - Modern API Testing Tool

WebMan is a modern, feature-rich API testing tool built with Next.js and React. It provides a clean, intuitive interface for testing HTTP APIs with support for all common HTTP methods, request customization, and response visualization.



## Features

### Core Functionality

- 🚀 Support for all common HTTP methods (GET, POST, PUT, DELETE, PATCH)
- 📝 JSON request body editor
- 🔧 Custom headers management
- 👁️ Beautiful response visualization
- 🎨 Light/Dark theme support

### Request Management

- 📚 Save and load request collections
- 📱 Request history with persistence
- 📋 Easy request sharing
- 🔄 Quick request restoration from history

### User Experience

- 💫 Modern, clean interface
- 🌙 Dark mode support
- 📱 Responsive design
- 🔔 Toast notifications
- 🎯 Error handling with user-friendly messages

## Tech Stack

- ⚛️ Next.js 14 (App Router)
- 🎨 Tailwind CSS
- 🌗 next-themes for theme management
- 🔧 Modern JavaScript features
- 📦 Lightweight and fast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SamsShow/webman.git
cd webman
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Making Requests

1. Select the HTTP method from the dropdown
2. Enter the API URL
3. Add any required headers in the Headers tab
4. For POST/PUT/PATCH requests, add your JSON body in the Body tab
5. Click "Send" to make the request

### Managing Collections

- **Save Collection**: Click "Save Collection" to download your current request history
- **Load Collection**: Click "Load Collection" to import a previously saved collection
- **Share**: Click "Share" to copy the collection data to clipboard

### Theme Switching

Click the sun/moon icon in the navbar to switch between:

- Light theme
- Dark theme
- System preference

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

