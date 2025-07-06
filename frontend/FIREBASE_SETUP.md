# Firebase Setup Guide for HackQuest

## 🔥 Firebase Configuration Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use existing project
3. Follow the setup wizard

### Step 2: Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### Step 3: Enable Firestore Database
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Get Your Firebase Config
1. In Firebase Console → Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register your app with name "HackQuest"
5. Copy the firebaseConfig object

### Step 5: Update Configuration
Replace the placeholder config in `frontend/src/firebase/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 6: Test the Setup
1. Start your development server: `npm run dev`
2. Try registering a new user
3. Check Firebase Console → Authentication to see the user
4. Check Firestore → Data to see user profile created

## ✅ What's Now Working

- **Firebase Authentication**: Email/password registration and login
- **User Profiles**: Automatically created in Firestore
- **Real-time Leaderboard**: Shows actual registered users
- **TypeScript Support**: Full type safety for Firebase functions
- **Error Handling**: User-friendly error messages
- **Security**: Proper password handling and validation

## 🚀 Features Implemented

### Login Component (`Login.tsx`)
- ✅ Email + Password authentication
- ✅ Registration with username (callsign)
- ✅ Real-time validation
- ✅ Loading states and error handling
- ✅ Beautiful UI with cyber theme

### User Profiles in Firestore
- ✅ Username (callsign)
- ✅ Email
- ✅ Total score
- ✅ Completed challenges
- ✅ Streak counter
- ✅ Country
- ✅ Avatar (auto-generated)
- ✅ Join date
- ✅ Last active timestamp
- ✅ Badges system

### Authentication Functions (`auth.ts`)
- ✅ `signUpUser()` - Register new users
- ✅ `signInUser()` - Login existing users  
- ✅ `logoutUser()` - Sign out users
- ✅ `getUserProfile()` - Get user data from Firestore
- ✅ `updateUserProfile()` - Update user data
- ✅ `onAuthStateChange()` - Monitor auth state

## 🎯 Next Steps

1. **Update Firebase config** with your actual credentials
2. **Test user registration** and login
3. **Integrate with your existing GameContext** to use Firebase users
4. **Deploy to production** when ready

## 🔧 Troubleshooting

### Common Issues:
- **"Firebase config not found"**: Update `firebase.ts` with your config
- **"Permission denied"**: Check Firestore security rules
- **"Auth domain not authorized"**: Add your domain in Firebase Console

### Firebase Console Links:
- Authentication: `https://console.firebase.google.com/project/YOUR_PROJECT/authentication`
- Firestore: `https://console.firebase.google.com/project/YOUR_PROJECT/firestore`
- Project Settings: `https://console.firebase.google.com/project/YOUR_PROJECT/settings/general`

---

🎉 **Your HackQuest app now has professional Firebase authentication!**
