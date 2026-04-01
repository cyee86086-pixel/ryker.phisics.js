# Ryker Physics JS

A comprehensive physics library for simulating basic physical interactions.

## Installation

To install the Ryker Physics JS library, you can use npm:

```bash
npm install ryker-physics-js
```

Or you can include it directly from a CDN:

```html
<script src="https://cdn.example.com/ryker-physics.js"></script>
```

## Quick Start Example

Here's a simple example to get you started:

```javascript
// Import the library
import { Physics } from 'ryker-physics-js';

// Create a new physics world
const world = new Physics();

// Create objects
const ball = world.addBall({ radius: 10, x: 50, y: 50 });
const ground = world.addGround({ y: 300 });

// Start the simulation
setInterval(() => {
    world.update(); // Update the physics world
    world.render(); // Render the world to the screen
}, 1000 / 60); // Runs at 60 FPS
```

## API Reference

### Physics
- **`new Physics()`**: Creates a new physics world.
  - **Methods**:
    - `addBall(options)`: Adds a ball to the world.
    - `addGround(options)`: Adds ground to the world.
    - `update()`: Updates the simulation state for the next frame.
    - `render()`: Renders the current state of the physics world.

### Ball
- **`options`**:
  - `radius`: The radius of the ball.
  - `x`: The initial x coordinate.
  - `y`: The initial y coordinate.

### Ground
- **`options`**:
  - `y`: The height of the ground.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
