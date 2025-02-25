import React, { useRef, useState, useEffect } from "react";
import config from "../config";
import Form from "react-bootstrap/Form";
import { NoteType } from "../types/note";
import { onError } from "../lib/errorLib";
import Stack from "react-bootstrap/Stack";
import { useAuthFetch } from "../lib/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { useParams, useNavigate } from "react-router-dom";
import "./Notes.css";

export default function Notes() {
  const file = useRef<null | File>(null);
  const authFetch = useAuthFetch();
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState<null | NoteType>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return authFetch(`${config.API_URL}notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          const { url } = await getPresignedDownload(attachment);
          note.attachmentURL = url;
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str: string) {
    return str.split("/")[1].replace(/^\w+-/, "");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) return;
    file.current = event.currentTarget.files[0];
  }

  function saveNote(note: NoteType) {
    return authFetch(`${config.API_URL}notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(note),
    });
  }

  function getPresignedDownload(path: string) {
    return authFetch(`${config.API_URL}presign?path=${encodeURIComponent(path)}`);
  }

  function getPresignedUpload(fileName: string, fileType: string) {
    return authFetch(`${config.API_URL}presign`, {
      method: "POST",
      body: JSON.stringify({ fileName, fileType }),
    });
  }

  async function handleUpload(file: File) {
    const res = await getPresignedUpload(file.name, file.type);

    await fetch(res.url, {
      body: file,
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });

    return res.path;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await handleUpload(file.current);
      } else if (note && note.attachment) {
        attachment = note.attachment;
      }

      await saveNote({ content: content, attachment: attachment });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return authFetch(`${config.API_URL}notes/${id}`, {
      method: "DELETE",
    });
  }

  async function handleDelete(event: React.FormEvent<HTMLModElement>) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      nav("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Form.Group controlId="content">
              <Form.Control
                size="lg"
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="file">
              <Form.Label>Attachment</Form.Label>
              {note.attachment && (
                <p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={note.attachmentURL}
                  >
                    {formatFilename(note.attachment)}
                  </a>
                </p>
              )}
              <Form.Control onChange={handleFileChange} type="file" />
            </Form.Group>
            <Stack gap={1}>
              <LoaderButton
                size="lg"
                type="submit"
                isLoading={isLoading}
                disabled={!validateForm()}
              >
                Save
              </LoaderButton>
              <LoaderButton
                size="lg"
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </LoaderButton>
            </Stack>
          </Stack>
        </Form>
      )}
    </div>
  );
}
