# Quick Firebase Setup Guide 🚀

## 1. Create Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project"
- Name it "drop-target-game" (or whatever you prefer)

## 2. Enable Services

- **Authentication**: Go to Authentication > Sign-in method > Enable Email/Password
- **Firestore**: Go to Firestore Database > Create database > Start in test mode

## 3. Get Your Config

- Project Settings (gear icon) > General
- Scroll to "Your apps" section
- Click web app icon (</>)
- Register app and copy the config

## 4. Update Environment Files

Replace the placeholder values in:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

## 5. Set Firestore Rules

Go to Firestore > Rules and paste:

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

## 6. Run the Game!

```bash
npm start
```

Visit `http://localhost:4200` and start playing! 🎯
