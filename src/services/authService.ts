import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth, db } from "@/firebase/firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";

// Логін користувача
export const login = async (email: string, password: string): Promise<any> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Отримуємо дані з Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    return { ...user, ...userSnap.data() }; 
  }

  return user; // fallback
};

// Реєстрація користувача + збереження у Firestore
export const register = async (
  email: string, 
  password: string,
  fullName: string 
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Зберігаємо дані користувача у Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    fullName: fullName || "", 
    role: "user",
    createdAt: new Date()
  });

  return userCredential;
};

// Вихід користувача
export const logout = async (): Promise<void> => {
  return await auth.signOut();
};
