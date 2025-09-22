import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "@/firebase/firebase"; 

// Логін користувача
export const login = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Реєстрація користувача
export const register = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Вихід користувача
export const logout = async (): Promise<void> => {
  return await auth.signOut();
};
