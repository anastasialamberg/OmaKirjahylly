import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

export interface Book {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
}

export const addToFavorites = async (book: Book, userId: string) => {
  if (!book?.id) return; // tarkistus, että id on olemassa
  await setDoc(doc(db, "users", userId, "favorites", book.id), book);
};


// Poista kirja suosikeista Firebasesta
export const removeFromFavorites = async (bookId: string, userId: string) => {
  if (!bookId) return;
  await deleteDoc(doc(db, "users", userId, "favorites", bookId));
};

// Hae käyttäjän suosikit Firebasesta
export const getFavorites = async (userId: string): Promise<Book[]> => {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));
  return snapshot.docs.map((doc) => doc.data() as Book);
};
