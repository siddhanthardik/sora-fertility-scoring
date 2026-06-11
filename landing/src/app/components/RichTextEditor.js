"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import react-quill with ssr disabled to prevent document undefined errors
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function RichTextEditor({ value, onChange }) {
  const quillRef = useRef();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/superadmin/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        
        if (result.success) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", result.url);
        } else {
          alert("Image upload failed: " + result.message);
        }
      } catch (err) {
        alert("Image upload failed: " + err.message);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image"
  ];

  return (
    <div style={{ backgroundColor: "white", borderRadius: "6px" }}>
      <ReactQuill 
        ref={quillRef}
        theme="snow" 
        value={value || ""} 
        onChange={onChange} 
        modules={modules}
        formats={formats}
        style={{ height: "400px", marginBottom: "40px" }}
      />
    </div>
  );
}
