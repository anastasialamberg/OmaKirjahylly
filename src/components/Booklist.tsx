import React, { useEffect, useState } from "react";
import { getFavorites, removeFromFavorites, type Book } from "./Favorites";
import { useNavigate } from "react-router-dom";

interface Props {
  userId: string;
}

const BookList: React.FC<Props> = ({ userId }) => {
  const [favorites, setFavorites] = useState<Book[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await getFavorites(userId);
        setFavorites(favs || []);
      } catch (err) {
        console.error("Suosikkien haku epäonnistui:", err);
      }
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
            <div key={book.id} className="border p-2 rounded shadow flex flex-col items-center text-center">
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <img src="/placeholder.png" alt="Ei kansikuvaa" />
              )}
              <h3 className="font-semibold mt-2">{book.title}</h3>
              <p>{book.authors?.join(", ")}</p>
              <p>{book.publishedDate}</p>
              <p>{book.publisher}</p>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => handleRemove(book.id)}
              >
                Poista
              </button>

               <button
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                 onClick={() => navigate(`/editbook/${book.id}`)}
              >
                 Lisää muistiinpano
              </button>

            
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
