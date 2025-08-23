# Firebase Configuration Example

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "drop-target-game")
4. Follow the setup wizard

## Step 2: Enable Services

### Authentication

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" provider
3. Click "Save"

### Firestore Database

1. Go to "Firestore Database" > "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users
4. Click "Done"

## Step 3: Get Configuration

1. Go to Project Settings (gear icon) > "General"
2. Scroll down to "Your apps" section
3. Click the web app icon (</>)
4. Register app with a nickname (e.g., "drop-game-web")
5. Copy the configuration object

## Step 4: Update Environment Files

Replace the placeholder values in these files:

**`src/environments/environment.ts`**

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC-your-actual-api-key-here',
    authDomain: 'your-project-id.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project-id.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef1234567890',
  },
};
```

**`src/environments/environment.prod.ts`**

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyC-your-actual-api-key-here',
    authDomain: 'your-project-id.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project-id.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef1234567890',
  },
};
```

## Step 5: Set Firestore Rules

In Firebase Console, go to "Firestore Database" > "Rules" and update with:

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

## Step 6: Test Configuration

1. Run `npm start`
2. Try to register a new user
3. Check Firebase Console > Authentication to see the user
4. Play a game and check Firestore to see the score data

## Security Notes

- Never commit real Firebase config to public repositories
- Use environment variables in production
- Consider using Firebase App Check for additional security
- Regularly review Firestore security rules

## Troubleshooting

**"Firebase: Error (auth/invalid-api-key)"**

- Check that your API key is correct
- Ensure the project is properly set up

**"Firebase: Error (auth/operation-not-allowed)"**

- Make sure Email/Password authentication is enabled
- Check if your project is in the correct region

**"Firestore: Missing or insufficient permissions"**

- Verify your Firestore security rules
- Check that the user is properly authenticated
