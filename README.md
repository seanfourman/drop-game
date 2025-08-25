# 🎯 Drop Target Game

<div align="center">

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)

**A skill-based reaction game where precision meets physics!** 🚀

[Live Demo](#) • [Report Bug](https://github.com/seanfourman/drop-game/issues) • [Request Feature](https://github.com/seanfourman/drop-game/issues)

</div>

---

## ✨ Features

- 🎮 **Interactive Physics Engine** - Realistic ball movement and gravity simulation
- 🎯 **Precision Scoring** - Points based on landing proximity to target
- 🔐 **User Authentication** - Secure login/registration with Firebase
- 📊 **Score Tracking** - Personal high scores and game history
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Real-time Updates** - Live score updates and game state management
- 🎨 **Modern UI/UX** - Beautiful animations and smooth interactions

## 🎮 How to Play

1. **Start** - Register or login to your account
2. **Watch** - Observe the ball moving side-to-side at the top
3. **Time** - Click "Drop Ball" when you think it's perfectly positioned
4. **Score** - Land closer to the target center for higher points
5. **Compete** - Beat your high score and climb the leaderboard!

### 🏆 Scoring System

| Distance from Target | Points | Achievement   |
| -------------------- | ------ | ------------- |
| 0-5 units            | 100    | 🥇 Perfect!   |
| 6-10 units           | 75     | 🥈 Great!     |
| 11-15 units          | 50     | 🥉 Good!      |
| 16-20 units          | 25     | 👍 Close!     |
| 20+ units            | 0      | 💪 Try again! |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Firebase** account ([Sign up](https://firebase.google.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/seanfourman/drop-game.git
cd drop-game

# Install dependencies
npm install

# Start development server
npm start
```

The game will open at `http://localhost:4200` 🎯

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable **Authentication** and **Firestore Database**

### 2. Configure Authentication

- In Firebase Console → Authentication → Sign-in method
- Enable **Email/Password** provider

### 3. Set Up Firestore

- Go to Firestore Database → Create database
- Start in **test mode** for development

### 4. Update Environment

Copy your Firebase config to `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id',
  },
};
```

### 5. Security Rules

Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{document} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🛠️ Tech Stack

| Technology     | Version | Purpose                  |
| -------------- | ------- | ------------------------ |
| **Angular**    | 20.2.0  | Frontend framework       |
| **Firebase**   | 11.10.0 | Backend & authentication |
| **TypeScript** | 5.9.2   | Type-safe JavaScript     |
| **SCSS**       | -       | Advanced styling         |
| **RxJS**       | 7.8.0   | Reactive programming     |

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── game/           # 🎮 Main game component
│   │   ├── login/          # 🔐 Authentication
│   │   └── register/       # 📝 User registration
│   ├── services/
│   │   ├── auth.service.ts # 🔑 User authentication
│   │   ├── game.service.ts # 🎯 Game logic & physics
│   │   └── score.service.ts # 📊 Score management
│   └── environments/       # ⚙️ Configuration files
├── styles/                 # 🎨 Global styles & themes
└── main.ts                # 🚀 Application entry point
```

## 🧪 Development

### Available Commands

```bash
# Development server with hot reload
npm start

# Production build
npm run build

# Run unit tests
npm test

# Build and watch for changes
npm run watch
```

### Code Quality

- **Prettier** configuration for consistent formatting
- **ESLint** for code quality checks
- **TypeScript** strict mode enabled

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow Angular style guide
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design works
- Test on multiple devices

## 🐛 Known Issues

- None currently reported

## 🔮 Roadmap

- [ ] Multiplayer mode
- [ ] Power-ups and special balls
- [ ] Different target shapes
- [ ] Sound effects and music
- [ ] Mobile app version
- [ ] Global leaderboards

## 📱 Browser Support

| Browser | Version | Status  |
| ------- | ------- | ------- |
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the **Yooz** developer position
- Inspired by classic arcade games
- Thanks to the Angular and Firebase communities

---

<div align="center">

**Made with ❤️ and ☕ by Sean Fourman**

[⭐ Star this repo](https://github.com/seanfourman/drop-game) • [🐛 Report issues](https://github.com/seanfourman/drop-game/issues) • [💡 Request features](https://github.com/seanfourman/drop-game/issues)

**Happy gaming! 🎯✨**

</div>
