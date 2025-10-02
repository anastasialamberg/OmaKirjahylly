import React, { useState, useEffect } from "react";
import { addNote, getNotesByBook, removeNote, type Note } from "./Favorites";
import { useParams } from "react-router-dom";

interface Props {
  userId: string;
}

const EditBook: React.FC<Props> = ({ userId }) => {
  const { bookId } = useParams<{ bookId: string }>();

  if (!bookId) return <p>Kirjan tunnistetta ei löytynyt.</p>;
  const [favCharacter, setFavCharacter] = useState("");
  const [bestQuote, setBestQuote] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!bookId) {
        setMessage("Kirjan tunniste puuttuu.");
        return;
      }
      try {
        const notes = await getNotesByBook(userId, bookId);
        setNotes(notes);
      } catch (err) {
        console.error("Virhe haettaessa muistiinpanoja:", err);
        setMessage("Muistiinpanojen haku epäonnistui.");
      }
    };
    fetchNotes();
  }, [userId, bookId]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNote(
        {
          bookId,
          favCharacter,
          bestQuote,
          created: new Date(),
          note,
        },
        userId
      );
      setMessage("Muistiinpano tallennettu!");
      setFavCharacter("");
      setBestQuote("");
      setNote("");
      const allNotes = await getNotesByBook(userId, bookId);
      setNotes(allNotes);
    } catch (error) {
      setMessage("Tallennus epäonnistui.");
    }
  };

  const handleRemove = async (noteId?: string) => {
    if (!noteId) return;
    try {
      await removeNote(noteId, userId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      setMessage("Muistiinpanon poisto epäonnistui.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Lisää muistiinpano kirjaan</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-4 space-y-4"
      >
        <div>
          <label className="block font-semibold mb-1">Lempi hahmo:</label>
          <input
            type="text"
            value={favCharacter}
            onChange={(e) => setFavCharacter(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Paras sitaatti:</label>
          <input
            type="text"
            value={bestQuote}
            onChange={(e) => setBestQuote(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Oma muistiinpano:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
        >
          💾 Tallenna
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center font-medium text-green-600">{message}</p>
      )}

      <h3 className="mt-8 mb-3 text-xl font-bold">Muistiinpanosi</h3>
      <ul className="space-y-4">
        {notes.map((note, idx) => (
          <li
            key={note.id || idx}
            className="bg-gray-50 shadow-sm rounded-xl p-4 border border-gray-200"
          >
            <div>
              <strong>Lempi hahmo:</strong> {note.favCharacter}
            </div>
            <div>
              <strong>Paras sitaatti:</strong> {note.bestQuote}
            </div>
            <div>
              <strong>Oma muistiinpano:</strong>
              <div className="mt-1 break-words max-h-40 overflow-auto">
                {note.note}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {note.created &&
                (note.created instanceof Date
                  ? note.created.toLocaleDateString()
                  : "seconds" in note.created
                  ? new Date(note.created.seconds * 1000).toLocaleDateString()
                  : "")}
            </div>
            <button
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
              onClick={() => handleRemove(note.id)}
            >
              🗑 Poista
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditBook;
