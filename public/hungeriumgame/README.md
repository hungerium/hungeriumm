# CoffyLapse - Coffee Shop Management Game

A strategic coffee shop management simulation game where players make decisions to grow their coffee empire from a local shop to a global corporation.

## Features

- 🏠 Progress from Local Cafe to Global Corporation
- ☕ Earn and claim COFFY tokens for successful management
- 🧠 Strategic decision-making with multiple metrics
- 📱 Responsive design for mobile and desktop
- 🎮 Dynamic events and character interactions
- 💼 Staff and equipment management

## Setup and Development

### Prerequisites

- Node.js 14+ and npm installed

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/coffylapse.git
   cd coffylapse
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Generate SVG assets (will be done automatically during build)
   ```bash
   npm run gen-svg
   ```

4. Run development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to play the game

### Build for Production

```bash
npm run build
```

## Deployment

### GitHub Pages Deployment

1. Build the project
   ```bash
   npm run build
   ```

2. Export static files
   ```bash
   npm run export
   ```

3. Push to GitHub
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

## Documentation

### Game Mechanics

- **Economy**: Financial health of your coffee empire
- **Customer Satisfaction**: Your reputation and service quality
- **Operations**: Supply chain and production efficiency
- **Sustainability**: Environmental impact and eco-friendliness

### Level Progression

1. **Local Cafe**: Your first CoffyCorp shop serving the local neighborhood
2. **City Favorite**: Expand to multiple locations across the city
3. **Regional Chain**: Become a recognized brand throughout the region
4. **National Brand**: Achieve nationwide presence and recognition
5. **Global Corporation**: Become an international coffee empire

## Game Audio

The game includes the following audio elements:

1. **Sound Effects**
   - Click sounds for interactions
   - Game over notification

2. **Background Music**
   - Ambient coffee shop background music

Audio files should be placed in the `public/sounds` directory:
- `/public/sounds/click.mp3`
- `/public/sounds/game-over.mp3`
- `/public/sounds/background-music.mp3`

These audio files are not included in the repository due to licensing considerations. You can add your own royalty-free sounds before building the project.

## Project Structure

- `/components` - React components
- `/pages` - Next.js pages/routes
- `/public` - Static assets and images
- `/store` - State management (Zustand)
- `/styles` - CSS and styling
- `/utils` - Utility functions
- `/game` - Game mechanics and data
- `/data` - Game scenarios and characters

## Credits

- SVG Characters - Custom designed for CoffyLapse
- Game Scenarios - Original content for CoffyLapse

## License

This project is licensed under the MIT License - see the LICENSE file for details.
