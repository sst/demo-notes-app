import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import { BsPencilSquare } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
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
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes", {});
  }

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  function renderNotesList(notes: NoteType[]) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ms-2 fw-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action className="text-nowrap text-truncate">
              <span className="fw-bold">{content.trim().split("\n")[0]}</span>
              <br />
              <span className="text-muted">
                Created: {formatDate(createdAt)}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
