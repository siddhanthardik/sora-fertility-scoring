"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered, Link2, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

const MenuBar = ({ editor }) => {
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/superadmin/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        
        if (result.success) {
          editor.chain().focus().setImage({ src: result.url }).run();
        } else {
          alert("Image upload failed: " + result.message);
        }
      } catch (err) {
        alert("Image upload failed: " + err.message);
      } finally {
        setUploading(false);
      }
    };
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnStyle = (isActive) => ({
    padding: "6px",
    background: isActive ? "#e2e8f0" : "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#334155"
  });

  return (
    <div style={{ display: "flex", gap: "4px", padding: "8px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", borderTopLeftRadius: "6px", borderTopRightRadius: "6px", flexWrap: "wrap" }}>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive("bold"))} title="Bold"><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive("italic"))} title="Italic"><Italic size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive("strike"))} title="Strike"><Strikethrough size={18} /></button>
      
      <div style={{ width: "1px", backgroundColor: "#cbd5e1", margin: "0 4px" }} />
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive("heading", { level: 2 }))} title="Heading 2"><Heading2 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive("heading", { level: 3 }))} title="Heading 3"><Heading3 size={18} /></button>
      
      <div style={{ width: "1px", backgroundColor: "#cbd5e1", margin: "0 4px" }} />

      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} style={btnStyle(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} style={btnStyle(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} style={btnStyle(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} style={btnStyle(editor.isActive({ textAlign: 'justify' }))} title="Justify"><AlignJustify size={18} /></button>
      
      <div style={{ width: "1px", backgroundColor: "#cbd5e1", margin: "0 4px" }} />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive("bulletList"))} title="Bullet List"><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive("orderedList"))} title="Ordered List"><ListOrdered size={18} /></button>

      <div style={{ width: "1px", backgroundColor: "#cbd5e1", margin: "0 4px" }} />

      <button type="button" onClick={setLink} style={btnStyle(editor.isActive("link"))} title="Link"><Link2 size={18} /></button>
      <button type="button" onClick={handleImageUpload} style={btnStyle(false)} title="Upload Image" disabled={uploading}>
        {uploading ? <span style={{fontSize: '12px'}}>...</span> : <ImageIcon size={18} />}
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div style={{ border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "white", overflow: "hidden" }}>
      <MenuBar editor={editor} />
      <div style={{ padding: "16px", minHeight: "300px", maxHeight: "500px", overflowY: "auto", cursor: "text" }}>
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .tiptap {
          outline: none;
        }
        .tiptap p {
          margin: 0 0 1em 0;
        }
        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        .tiptap h2 {
          margin: 24px 0 12px 0;
          font-size: 1.5em;
        }
        .tiptap h3 {
          margin: 20px 0 10px 0;
          font-size: 1.25em;
        }
        .tiptap ul, .tiptap ol {
          padding-left: 24px;
          margin: 0 0 1em 0;
        }
        .tiptap a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
