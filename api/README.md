# Gym Workout Management API

A RESTful API for managing gym workouts, exercises, and workout sharing functionality. Built with Node.js, Express, and SQLite.

## Features

- Exercise management (CRUD operations)
- Workout management (CRUD operations)
- Add exercises to workouts with specific reps and intervals
- Share workouts via unique links and QR codes
- Clean architecture (Controllers, Services, Repositories)
- SQLite database for data persistence

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gym-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
PORT=3000
BASE_URL=http://localhost:3000
```

## Running the Application

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:3000 (or the PORT specified in your .env file).

## Database Schema

### Exercises
- id (TEXT, Primary Key)
- name (TEXT, Not Null)
- muscle_group (TEXT, Optional)

### Workouts
- id (TEXT, Primary Key)
- name (TEXT, Not Null)
- description (TEXT, Optional)

### Workout Exercises (Junction Table)
- workout_id (TEXT, Foreign Key)
- exercise_id (TEXT, Foreign Key)
- reps (INTEGER)
- interval (INTEGER)

### Shared Workouts
- id (TEXT, Primary Key)
- workout_id (TEXT, Foreign Key)
- link (TEXT, Not Null)
- qr_code (TEXT, Not Null)

## API Documentation

### Exercises

#### Create Exercise
```http
POST /api/exercises
Content-Type: application/json

{
    "name": "Bench Press",
    "muscleGroup": "Chest"
}
```

#### Get All Exercises
```http
GET /api/exercises
```

#### Get Exercise by ID
```http
GET /api/exercises/:id
```

#### Update Exercise
```http
PUT /api/exercises/:id
Content-Type: application/json

{
    "name": "Incline Bench Press",
    "muscleGroup": "Upper Chest"
}
```

#### Delete Exercise
```http
DELETE /api/exercises/:id
```

### Workouts

#### Create Workout
```http
POST /api/workouts
Content-Type: application/json

{
    "name": "Upper Body Workout",
    "description": "Focus on chest, shoulders, and triceps"
}
```

#### Add Exercise to Workout
```http
POST /api/workouts/:workoutId/exercises
Content-Type: application/json

{
    "exerciseId": "exercise-id",
    "reps": 12,
    "interval": 60
}
```

#### Get All Workouts
```http
GET /api/workouts
```

#### Get Workout by ID
```http
GET /api/workouts/:id
```

#### Update Workout
```http
PUT /api/workouts/:id
Content-Type: application/json

{
    "name": "Updated Upper Body Workout",
    "description": "Focus on chest, shoulders, triceps, and back"
}
```

#### Delete Workout
```http
DELETE /api/workouts/:id
```

### Sharing

#### Share Workout
```http
POST /api/share/workouts/:workoutId
```

#### Get Shared Workout
```http
GET /api/share/:shareId
```

#### Delete Share
```http
DELETE /api/share/:shareId
```

## Project Structure

```
gym-app/
├── src/
│   ├── controllers/
│   │   ├── exerciseController.js
│   │   ├── workoutController.js
│   │   └── shareController.js
│   ├── services/
│   │   ├── exerciseService.js
│   │   ├── workoutService.js
│   │   └── shareService.js
│   ├── repositories/
│   │   ├── exerciseRepository.js
│   │   ├── workoutRepository.js
│   │   └── shareRepository.js
│   ├── routes/
│   │   ├── exerciseRoutes.js
│   │   ├── workoutRoutes.js
│   │   └── shareRoutes.js
│   ├── database/
│   │   └── config.js
│   └── app.js
├── requests/
│   ├── exercises.http
│   ├── workouts.http
│   └── share.http
├── .env
├── package.json
└── README.md
```

## Testing

The project includes `.http` files in the `requests` directory that can be used with VS Code's REST Client extension or as reference for testing with tools like Postman.

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses include a message explaining what went wrong.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 