# Scribble - Premium Whiteboard

A modern, feature-rich whiteboard application built with vanilla JavaScript, HTML, and CSS. Perfect for sketching, brainstorming, and digital note-taking with a sleek glass-morphism design.

## Features

- **Drawing Tools**
  - Pencil tool for freehand drawing
  - Eraser tool for corrections
  - Customizable brush size
  - Color picker for selecting any color

- **Board Management**
  - Create new blank boards
  - Save boards locally with custom names
  - View and manage saved boards in a sidebar
  - Persistent storage using browser LocalStorage

- **User Interface**
  - Modern glass-morphism design
  - Responsive toolbar with icon buttons
  - Full-screen canvas for maximum drawing space
  - Intuitive sidebar for board management
  - Smooth transitions and animations

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No external dependencies required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start drawing!

## Usage

### Basic Drawing
1. **Select Tool**: Use the toolbar buttons to switch between pencil and eraser
2. **Choose Color**: Click the color picker to select your drawing color
3. **Adjust Size**: Use the brush size slider to change pen/eraser thickness
4. **Draw**: Click and drag on the canvas to draw

### Managing Boards
- **New Board**: Click the "New Board" button to start fresh
- **Save Board**: Click the "Save Board" button and enter a name for your board
- **View Saved**: Click the menu icon to open the sidebar and view all saved boards
- **Load Board**: Click any board in the sidebar to load it
- **Clear Canvas**: Use the clear button to erase the current board

## Project Structure

```
├── index.html      # Main HTML structure
├── script.js       # JavaScript logic and event handlers
├── style.css       # Styling and layout
└── README.md       # Project documentation
```

## Technologies Used

- **HTML5**: Canvas API for drawing
- **CSS3**: Glass-morphism design, flexbox layout, CSS variables
- **JavaScript**: Event handling, Canvas drawing, LocalStorage API

## Key Files

- **index.html**: Contains the canvas element, toolbar with controls, and sidebar for saved boards
- **script.js**: Handles drawing logic, board management, and LocalStorage persistence
- **style.css**: Defines the visual design with modern CSS patterns

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features in Development

- Undo/Redo functionality
- Multiple layers support
- Export boards as PNG/JPG
- Collaborative drawing
- Touch support for mobile devices

## License

This project is open source and available under the MIT License.

## Author

Created as a personal project for modern web development.
