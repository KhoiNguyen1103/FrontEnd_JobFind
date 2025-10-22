import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaHeading,
    FaListUl,
    FaListOl,
    FaEraser,
} from 'react-icons/fa';

const ToolbarButton = ({ onClick, active, icon: Icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-center w-9 h-9 rounded-md border 
        ${active ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}
        hover:bg-green-400 hover:text-white transition-all duration-200`}
        title={label}
    >
        <Icon size={14} />
    </button>
);

const TipTapToolbar = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b rounded-t-md">
            <ToolbarButton
                icon={FaBold}
                label="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
            />
            <ToolbarButton
                icon={FaItalic}
                label="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
            />
            <ToolbarButton
                icon={FaUnderline}
                label="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive('underline')}
            />
            <ToolbarButton
                icon={FaHeading}
                label="Heading 1"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
            />
            <ToolbarButton
                icon={FaHeading}
                label="Heading 2"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
            />
            <ToolbarButton
                icon={FaListUl}
                label="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
            />
            <ToolbarButton
                icon={FaListOl}
                label="Ordered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
            />
            <ToolbarButton
                icon={FaEraser}
                label="Clear Formatting"
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                active={false}
            />
        </div>
    );
};

const TipTapEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border border-gray-300 rounded-md shadow-sm bg-white">
            <TipTapToolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="p-4 min-h-[150px] focus:outline-none focus:ring-0 focus:border-green-500 caret-green-600 text-gray-800"
            />
        </div>
    );
};

export default TipTapEditor;