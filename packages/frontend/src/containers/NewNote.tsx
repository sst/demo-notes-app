import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { formCs } from "../lib/styles";
import { onError } from "../lib/error";
import Button from "../components/Button";
import { useAuthFetch } from "../lib/fetch";

export default function NewNote() {
  const file = useRef<null | File>(null);
  const authFetch = useAuthFetch();
  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) return;
    file.current = event.currentTarget.files[0];
  }

  function createNote(content: string, attachment?: string) {
    return authFetch(`${config.API_URL}/notes`, {
      method: "POST",
      body: JSON.stringify({ content, attachment }),
    });
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
      const attachment = file.current
        ? await handleUpload(file.current)
        : undefined;

      await createNote(content, attachment);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formCs.container}>
      <textarea
        id="content"
        value={content}
        className={formCs.textarea}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={formCs.field}>
        <label htmlFor="file" className={formCs.label}>Attachment</label>
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
          variant="success"
          loading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
