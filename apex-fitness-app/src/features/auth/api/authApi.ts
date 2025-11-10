import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole } from '@/types';

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user with email and password
 */
export async function registerUser(data: RegisterData): Promise<User> {
  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  // Update display name in Firebase Auth
  await updateProfile(userCredential.user, {
    displayName: data.displayName,
  });

  // Create user document in Firestore
  const userData: Omit<User, 'id'> = {
    email: data.email,
    displayName: data.displayName,
    role: 'member' as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: userCredential.user.uid,
    ...userData,
  };
}

/**
 * Login user with email and password
 */
export async function loginUser(data: LoginData): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  // Fetch user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }

  const userData = userDoc.data();

  return {
    id: userCredential.user.uid,
    email: userData.email,
    displayName: userData.displayName,
    role: userData.role,
    createdAt: userData.createdAt?.toDate() || new Date(),
    updatedAt: userData.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Get user data from Firestore by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (!userDoc.exists()) {
    return null;
  }

  const userData = userDoc.data();

  return {
    id: userDoc.id,
    email: userData.email,
    displayName: userData.displayName,
    role: userData.role,
    createdAt: userData.createdAt?.toDate() || new Date(),
    updatedAt: userData.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Send email verification to current user
 */
export async function sendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }
  await sendEmailVerification(user);
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  displayName?: string;
}): Promise<User> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  // Update Firebase Auth profile
  if (data.displayName) {
    await updateProfile(user, {
      displayName: data.displayName,
    });
  }

  // Update Firestore document
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  // Fetch and return updated user data
  const updatedUser = await getUserById(user.uid);
  if (!updatedUser) {
    throw new Error('Failed to fetch updated user data');
  }

  return updatedUser;
}

/**
 * Change user password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user is currently signed in');
  }

  // Re-authenticate user with current password
  const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Update password
  await updatePassword(user, data.newPassword);
}
