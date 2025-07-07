import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type UserCredential
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase.js';

/**
 * Registers a new user with email, password, and username
 * Works with any email (even fake ones like johndoe@gmail.com)
 */
export const signUpUser = async (
  email: string,
  password: string,
  username: string
): Promise<UserCredential> => {
  // Validate inputs
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters.');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  
  // Create user with Firebase Auth (works with any email)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update the user's display name
  await updateProfile(userCredential.user, {
    displayName: username,
    // No photoURL - let the app handle avatars if needed
  });
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    username: username,
    email: email,
    totalScore: 0,
    completedChallenges: [],
    streak: 0,
    country: 'Unknown',
    avatar: '', // Empty avatar - let the app handle this
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    badges: ['Newbie Hacker']
  });
  
  return userCredential;
};

/**
 * Signs in an existing user with email and password
 */
export const signInUser = async (email: string, password: string): Promise<UserCredential> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential;
};

/**
 * Gets user profile data from Firestore
 */
export const getUserProfile = async (uid: string): Promise<any | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Updates user profile in Firestore
 */
export const updateUserProfile = async (uid: string, updates: any): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, updates, { merge: true });
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Gets ID token for the current user
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

/**
 * Signs out the current user
 */
export const logoutUser = (): Promise<void> => {
  return signOut(auth);
};
