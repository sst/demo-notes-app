import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";
import { formCs } from "../lib/styles";
import { onError } from "../lib/error";
import Button from "../components/Button";
import { useAuthFetch } from "../lib/fetch";

const attachmentCs =
  `text-blue-600 hover:text-blue-800 hover:underline
  dark:text-blue-400 dark:hover:text-blue-500`;

export default function Note() {
  const file = useRef<null | File>(null);
  const authFetch = useAuthFetch();
  const { id } = useParams();
  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [note, setNote] = useState<null | Record<string, string>>(null);

  useEffect(() => {
    function loadNote() {
      return authFetch(`${config.API_URL}/notes/${id}`);
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

  function saveNote(content: string, attachment?: string) {
    return authFetch(`${config.API_URL}/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content, attachment }),
    });
  }

  function getPresignedDownload(path: string) {
    return authFetch(`${config.API_URL}/presign?path=${encodeURIComponent(path)}`);
  }

  function getPresignedUpload(fileName: string, fileType: string) {
    return authFetch(`${config.API_URL}/presign`, {
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

      await saveNote(content, attachment);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return authFetch(`${config.API_URL}/notes/${id}`, {
      method: "DELETE",
    });
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
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

  return note && (
    <form onSubmit={handleSubmit} className={formCs.container}>
      <textarea
        id="content"
        value={content}
        className={formCs.textarea}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={formCs.field}>
        <label htmlFor="file" className={formCs.label}>Attachment</label>
        {note.attachment && (
          <p>
            <a
              target="_blank"
              className={attachmentCs}
              rel="noopener noreferrer"
              href={note.attachmentURL}
            >
              {formatFilename(note.attachment)}
            </a>
          </p>
        )}
        <input
          id="file"
          type="file"
          className={formCs.file}
          onChange={handleFileChange}
        />
      </div>
      <div className={formCs.controls}>
        <Button
          type="submit"
          loading={isLoading}
          disabled={!validateForm()}
        >
          Save
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          loading={isDeleting}
        >
          Delete
        </Button>
      </div>
    </form>
  );
}
