import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import config from "../config";
import { useAuth } from "../AuthContext";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import { useAuthFetch } from "../lib/hooksLib";

const landerCs =
  `py-20 text-center flex flex-col gap-2`;
const landerTitleCs =
  `text-4xl font-semibold`;
const landerDescCs =
  `text-gray-500`;
const notesCs =
  `flex flex-col gap-4`;
const notesTitleCs =
  `pb-3 text-3xl font-serif font-medium border-b border-gray-200`;
const listCs =
  `border border-gray-200 rounded-md overflow-hidden`;
const listItemCs =
  `flex flex-col gap-1 py-3 px-4 border-gray-200 hover:bg-gray-100`;
const listItemTitleCs =
  `font-semibold truncate`;
const listItemDescCs =
  `text-gray-500 text-sm truncate`;
const listNewItemCs =
  `flex items-center gap-2 py-3 px-4 border-gray-200 hover:bg-gray-100`;
const listNewItemIconCs =
  `shrink-0`;
const listNewItemTitleCs =
  `font-semibold truncate`;

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
      <>
        <Link
          to="/notes/new"
          className={`${listNewItemCs} ${notes.length > 0 ? 'border-b' : ''}`}
        >
          <HiOutlinePencilSquare className={listNewItemIconCs} size={17} />
          <span className={listNewItemTitleCs}>Create a new note</span>
        </Link>
        {notes.map(({ noteId, content, createdAt }, index) => (
          <Link
            key={noteId}
            to={`/notes/${noteId}`}
            className={`${listItemCs} ${index < notes.length - 1 ? 'border-b' : ''}`}
          >
            <h2 className={listItemTitleCs}>{content.trim().split("\n")[0]}</h2>
            <p className={listItemDescCs}>Created: {formatDate(createdAt)}</p>
          </Link>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className={landerCs}>
        <h1 className={landerTitleCs}>Scratch</h1>
        <p className={landerDescCs}>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className={notesCs}>
        <h2 className={notesTitleCs}>Your Notes</h2>
        {!isLoading && <div className={listCs}>{renderNotesList(notes)}</div>}
      </div>
    );
  }

  return auth.loggedIn
    ? renderNotes()
    : renderLander();
}
