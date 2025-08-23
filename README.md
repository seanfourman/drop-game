# Drop Target Game 🎯

A fun and engaging reaction and skill game built with Angular and Firebase, where players drop a ball and try to land it as close as possible to a target for points.

## 🎮 Game Features

- **Interactive Ball Physics**: Ball moves side-to-side until dropped, then falls with realistic gravity
- **Scoring System**: Points based on how close the ball lands to the target center
- **User Authentication**: Secure login/registration with Firebase Auth
- **Score Tracking**: Personal score history stored in Firestore
- **Modern UI**: Beautiful, responsive design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd drop-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

   Enable the following services:

   - Authentication (Email/Password)
   - Firestore Database

   Get your Firebase configuration:

   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web app icon (</>)
   - Copy the config object

4. **Configure Firebase**

   Update the Firebase configuration in:

   ```
   src/environments/environment.ts
   src/environments/environment.prod.ts
   ```

   Replace the placeholder values with your actual Firebase config:

   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: 'your-actual-api-key',
       authDomain: 'your-project.firebaseapp.com',
       projectId: 'your-project-id',
       storageBucket: 'your-project.appspot.com',
       messagingSenderId: 'your-sender-id',
       appId: 'your-app-id',
     },
   };
   ```

5. **Firestore Rules**

   Set up Firestore security rules to allow authenticated users to read/write their own data:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /gameResults/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

6. **Run the application**

   ```bash
   npm start
   ```

   The app will open at `http://localhost:4200`

## 🎯 How to Play

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Watch the Ball**: The ball moves side-to-side at the top of the screen
3. **Drop the Ball**: Click "Drop Ball" when you think it's positioned correctly
4. **Score Points**: The closer the ball lands to the target center, the more points you earn
5. **Track Progress**: View your personal score history and high score
6. **Play Again**: Click "New Game" to try for a better score

## 🏆 Scoring System

- **100 points**: Ball lands within 5 units of target center
- **75 points**: Ball lands within 10 units of target center
- **50 points**: Ball lands within 15 units of target center
- **25 points**: Ball lands within 20 units of target center
- **0 points**: Ball lands more than 20 units from target center

## 🛠️ Technical Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: SCSS with modern CSS features
- **Game Engine**: Custom physics engine with Canvas API
- **State Management**: RxJS Observables and BehaviorSubjects

## 📱 Responsive Design

The game is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices
- Touch-enabled devices

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Login component
│   │   ├── register/       # Registration component
│   │   └── game/           # Main game component
│   ├── services/
│   │   ├── auth.service.ts # Authentication service
│   │   ├── game.service.ts # Game logic service
│   │   └── score.service.ts # Score management service
│   └── environments/       # Firebase configuration
```

### Build Commands

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Built for the Yooz developer position task
- Demonstrates Angular, Firebase, and game development skills
- Features modern web development practices and responsive design

---

**Good luck and have fun playing! 🎯✨**
