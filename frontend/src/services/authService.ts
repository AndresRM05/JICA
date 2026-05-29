// /src/services/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function registerUser(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await sendEmailVerification(credential.user);
  return credential;
}

export async function logoutUser() {
  return signOut(firebaseAuth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(firebaseAuth, email);
}

export async function getIdToken(): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
export async function getUserRole(): Promise<UserRole | null> {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  const tokenResult = await user.getIdTokenResult();
  return (tokenResult.claims.role as UserRole) ?? null;
}