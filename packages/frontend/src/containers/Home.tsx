import { useState, useEffect } from "react";
import config from "../config";
import { useAuth } from "../AuthContext";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import { useAuthFetch } from "../lib/hooksLib";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

export default function Home() {
  const auth = useAuth();
  const authFetch = useAuthFetch();
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!auth.loggedIn) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [auth.loggedIn]);

  function loadNotes() {
    return authFetch(`${config.API_URL}notes`);
  }

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderNotesList(notes: NoteType[]) {
    return (
      <div className="flex flex-col">
        <Link
          to="/notes/new"
          className={`p-4 flex items-center hover:bg-gray-100 ${notes.length > 0 ? 'border-b' : ''} border-gray-200`}
        >
          <BsPencilSquare size={17} />
          <span className="ml-2 font-bold truncate">Create a new note</span>
        </Link>
        {notes.map(({ noteId, content, createdAt }, index) => (
          <Link
            key={noteId}
            to={`/notes/${noteId}`}
            className={`py-3 px-4 hover:bg-gray-100 truncate ${index < notes.length - 1 ? 'border-b' : ''} border-gray-200`}
          >
            <span className="font-bold block">
              {content.trim().split("\n")[0]}
            </span>
            <span className="text-gray-500 text-sm">
              Created: {formatDate(createdAt)}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  function renderLander() {
    return (
      <div className="py-20 text-center flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">Scratch</h1>
        <p className="text-gray-500">A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="pb-3 text-3xl font-serif font-medium border-b border-gray-200">Your Notes</h2>
        {!isLoading &&
          <div className="border border-gray-200 rounded-md overflow-hidden">
            {renderNotesList(notes)}
          </div>
        }
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {auth.loggedIn ? renderNotes() : renderLander()}
    </div>
  );
}
