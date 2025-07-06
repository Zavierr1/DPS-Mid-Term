import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
  type UserCredential
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase.js';

/**
 * Registers a new user with email, password, and a display name.
 * Also creates a user profile in Firestore.
 */
export const signUpUser = async (
  email: string, 
  password: string, 
  username: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update the user's profile with display name
  await updateProfile(userCredential.user, {
    displayName: username
  });

  // Create user profile in Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    username: username,
    email: email,
    totalScore: 0,
    completedChallenges: [],
    streak: 0,
    country: 'Unknown',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    badges: ['Newbie Hacker']
  });

  return userCredential;
};

/**
 * Signs in an existing user with email and password.
 */
export const signInUser = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current user.
 */
export const logoutUser = (): Promise<void> => {
  return signOut(auth);
};

/**
 * Gets user profile data from Firestore
 */
export const getUserProfile = async (uid: string): Promise<any | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

/**
 * Updates user profile in Firestore
 */
export const updateUserProfile = async (uid: string, updates: any): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, updates, { merge: true });
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
