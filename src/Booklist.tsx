import React, { useEffect, useState } from "react";
import { getFavorites, type Book, removeFromFavorites } from "./Favorites";

interface Props {
  userId: string;
}
interface LocalBook {
  id: string;
  title: string;
  authors?: string[];
  thumbnail?: string;
}

const BookList: React.FC<Props> = ({ userId }) => {
  const [favorites, setFavorites] = useState<LocalBook[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavorites(userId);
      setFavorites(favs);
    };
    fetchFavorites();
  }, [userId]);

  const handleRemove = async (bookId: string) => {
    await removeFromFavorites(bookId, userId);
    setFavorites((prev) => prev.filter((b) => b.id !== bookId));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">⭐ Omat suosikit</h2>
      {favorites.length === 0 ? (
        <p>Ei vielä suosikkeja.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {favorites.map((book) => (
            <div key={book.id} className="border p-2 rounded shadow">
              {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
              <h3 className="font-semibold">{book.title}</h3>
              <p>{book.authors?.join(", ")}</p>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => handleRemove(book.id)}
              >
                ❌ Poista
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
