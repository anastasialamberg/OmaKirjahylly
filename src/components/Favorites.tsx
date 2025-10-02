import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export interface Book {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string | null;
  publishedDate?: string;
  publisher?: string;
}

export const getYear = (publishedDate?: string): string | null => {
  if (!publishedDate) return null;
  return publishedDate.slice(0, 4);
};

export const addToFavorites = async (book: Book, userId: string) => {
  if (!book?.id) return;
  await setDoc(doc(db, "users", userId, "favorites", book.id), book);
};

export const removeFromFavorites = async (bookId: string, userId: string) => {
  if (!bookId) return;
  await deleteDoc(doc(db, "users", userId, "favorites", bookId));
};

export const getFavorites = async (userId: string): Promise<Book[]> => {
  const snapshot = await getDocs(collection(db, "users", userId, "favorites"));
  return snapshot.docs.map((doc) => doc.data() as Book);
};

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}
export interface Note {
  id?: string;
  favCharacter: string;
  bestQuote: string;
  created: Date | FirestoreTimestamp;
  note: string;
  bookId?: string;
}

export const addNote = async (note: Omit<Note, "id">, userId: string) => {
  const docRef = doc(collection(db, "users", userId, "notes"));
  await setDoc(docRef, { 
    ...note, 
    bookId: note.bookId,
    created: new Date()
  });
};


export const removeNote = async (noteId: string, userId: string) => {
  if (!noteId) return;
  await deleteDoc(doc(db, "users", userId, "notes", noteId));
};

export const getNotesByBook = async (userId: string, bookId: string): Promise<Note[]> => {
  const q = query(
    collection(db, "users", userId, "notes"),
    where("bookId", "==", bookId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];
};
