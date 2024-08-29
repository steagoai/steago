import clsx from 'clsx';
import { Markdown } from 'tiptap-markdown';
import { Button } from '../../base/button';
import { Extension } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockComponent from './code-block';
import { PiCodeBlockBold } from 'react-icons/pi';
import { createLowlight, common } from 'lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import {
  LuBold,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuItalic,
  LuList,
  LuListOrdered,
  LuStrikethrough,
} from 'react-icons/lu';
import { Editor } from '@tiptap/core';

/**

 * ================================================================================================
 * Import and register required languages
 * ================================================================================================
 */
// import xml from "highlight.js/lib/languages/xml";
// import python from "highlight.js/lib/languages/python";
// import ts from "highlight.js/lib/languages/typescript";
// import js from "highlight.js/lib/languages/javascript";
// import ruby from "highlight.js/lib/languages/ruby";
// import rust from "highlight.js/lib/languages/rust";
// import go from "highlight.js/lib/languages/go";
// import css from "highlight.js/lib/languages/css";

const lowlight = createLowlight(common); // loading all common languages

// lowlight.register({ xml }); // xml is to ensure proper JSX formatting
// lowlight.register({ python });
// lowlight.register({ js });
// lowlight.register({ ts });
// lowlight.register({ ruby });
// lowlight.register({ rust });
// lowlight.register({ go });
// lowlight.register({ css });

/**
 * ================================================================================================
 * MenuBar
 * ================================================================================================
 */
const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      label: <LuBold className="size-3" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      label: <LuItalic className="size-3" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      label: <LuStrikethrough className="size-3" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      label: <LuCode />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    {
      label: <LuHeading1 />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      label: <LuHeading2 />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      label: <LuHeading3 />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    {
      label: <LuList className="size-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      label: <LuListOrdered className="size-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      label: <PiCodeBlockBold />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
  ];

  return (
    <div className="flex flex-wrap">
      {buttons.map((button, index) => (
        <Button
          // size="xs"
          key={index}
          onClick={button.action}
          plain
          // aria-label={`Toggle ${button.label}`}
          className={clsx(
            'before:absolute before:-inset-px before:rounded-lg',
            button.isActive() && 'before:bg-zinc-950/5 dark:before:bg-white/10'
          )}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

/**
 * ================================================================================================
 * Helpers
 * ================================================================================================
 */

/**
 * Array of Tailwind CSS classes for prose styling.
 * These classes are used to style the content of the TipTap editor.
 */
const proseTailwindClasses: string[] = [
  /**
   * Default prose styles.
   */
  'prose prose-sm prose-zinc dark:prose-invert max-w-none focus:outline',
  /**
   * Override margins of headings.
   */
  'prose-headings:mt-0 prose-headings:mb-1',
  /**
   * Override heading sizes.
   */
  'prose-headings:text-base prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
  /**
   * Override code styles.
   */
  'prose-pre:rounded-lg prose-pre:text-sm prose-pre:my-1 dark:prose-pre:bg-zinc-800/50',
  /**
   * Override paragraph spacing.
   */
  'prose-p:my-0',
];

/**
 * ================================================================================================
 * Default Editable TipTap
 * ================================================================================================
 */
interface MessagePacket {
  html: string;
  json: object;
  text: string;
  md: string;
}

interface TipTapMethods {
  setIsHumanOnly: (value: boolean) => void;
  clearEditor: (value: boolean) => void;
}

interface TipTapProps {
  className?: string;
  setMessage?: (messagePacket: MessagePacket) => void;
  onEnterKey?: (
    messagePacket: MessagePacket,
    isHumanOnlyMessage?: boolean | undefined
  ) => void;

  clearOnEnterKey?: boolean;
  showMenuBar?: boolean;
  trackHumanState?: boolean;
  // placeholder?: string;
}

const TipTap = forwardRef<TipTapMethods, TipTapProps>(
  (
    {
      className,
      setMessage,
      onEnterKey,
      clearOnEnterKey = true,
      showMenuBar = false,
      trackHumanState = true,
      // placeholder = "Type your message...",
      ...props
    } = {},
    ref
  ) => {
    /**
     * --------------------------------------------------------------------------------------------
     * Setup
     * --------------------------------------------------------------------------------------------
     * */
    const [editorContent, setEditorContent] = useState('');

    const onEnterKeyRef = useRef(onEnterKey);
    useEffect(() => {
      onEnterKeyRef.current = onEnterKey;
    }, [onEnterKey]);

    /**
     * --------------------------------------------------------------------------------------------
     * Custom Extension for
     * - handling keyboard shortcuts in TipTap
     * - adding isHumanOnly tracking support
     * --------------------------------------------------------------------------------------------
     * */
    const SteagoAddons = Extension.create({
      name: 'steagoAddons',

      /**
       * Adds storage for handling the isShiftKeyPressed state.
       * @returns {Object} - Storage object with isShiftKeyPressed property.
       */
      addStorage(): object {
        return {
          isShiftKeyPressed: false, // Flag for tracking if shift key is pressed.
          isHumanOnlyMessage: false,
        };
      },

      addCommands(): object {
        return {
          // updateIsHumanOnlyState: (newValue: boolean) => ({ commands }) => {
          //   this.storage.isHumanOnlyMessage = newValue;
          // },
          updateIsHumanOnlyState: (newValue: boolean) => () => {
            this.storage.isHumanOnlyMessage = newValue;
          },
          // (newValue) => {
          //     this.storage.isHumanOnlyMessage = newValue;
          //   },
        };
      },

      /**
       * Adds keyboard shortcuts for handling Enter key.
       * @returns {Object} - Object with Enter and Shift-Enter shortcuts.
       */
      addKeyboardShortcuts() {
        return {
          /**
           * Handles Enter key press.
           * If shift key is not pressed, calls onEnterKey with editor content and
           * optionally clears editor content.
           * @returns {boolean|undefined} - Returns true if content should be cleared,
           * false to let TipTap handle other Enter key scenarios.
           */
          Enter: () => {
            if (!this.storage.isShiftKeyPressed) {
              // console.log("Calling onEnterKey...");
              if (onEnterKeyRef.current) {
                onEnterKeyRef.current(
                  {
                    html: this.editor.getHTML(),
                    json: this.editor.getJSON(),
                    text: this.editor.getText(),
                    md: this.editor.storage.markdown.getMarkdown(),
                  },
                  trackHumanState === true
                    ? this.storage.isHumanOnlyMessage
                    : undefined
                );
              }

              if (clearOnEnterKey === true) {
                return this.editor.commands.clearContent();
              }
              return true;
            } else {
              this.storage.isShiftKeyPressed = false;
              return false; // Let TipTap handle other Enter key scenarios
            }
          },
          /**
           * Handles Shift-Enter key press.
           * Sets isShiftKeyPressed to true and simulates default Enter behavior.
           * @returns {boolean} - Returns false to let TipTap handle other Shift-Enter
           * key scenarios.
           */
          'Shift-Enter': () => {
            this.storage.isShiftKeyPressed = true;
            // Scroll to bottom
            this.editor.commands.focus('end');
            // Simulate default Enter behavior
            return this.editor.commands.enter();
          },
        };
      },
    });

    /**
     * ----------------------------------------------------------------------------------------------
     * Define editor
     * ----------------------------------------------------------------------------------------------
     * */

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          // Disable codeblock since we are using CodeBlockLowlight
          codeBlock: false,
        }),
        CodeBlockLowlight.extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent);
          },
        }).configure({ lowlight }),
        Link.configure({
          openOnClick: true,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: {
            // Change rel to different value
            // Allow search engines to follow links(remove nofollow)
            // rel: "noopener noreferrer",
            // Remove target entirely so links open in current tab
            target: '_blank',
          },
        }),
        Markdown.configure({
          // html: true,                  // Allow HTML input/output
          tightLists: true, // No <p> inside <li> in markdown output
          tightListClass: 'tight', // Add class to <ul> allowing you to remove <p> margins when tight
          bulletListMarker: '-', // <li> prefix in markdown output
          linkify: true, // Create links from "https://..." text
          // breaks: false,               // New lines (\n) in markdown input are converted to <br>
          // transformPastedText: false,  // Allow to paste markdown text in the editor
          // transformCopiedText: false,  // Copied text is transformed to markdown
        }),
        SteagoAddons,
        Placeholder.configure({
          // placeholder: placeholder,
          // Use different placeholders depending on the node type:
          placeholder: ({ editor }) => {
            if (editor.extensionStorage.steagoAddons.isHumanOnlyMessage) {
              return 'Message other humans';
            } else {
              return 'Message Steago AI';
            }
          },
        }),
      ],
      content: editorContent,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        setEditorContent(editor.getHTML());
        if (setMessage) {
          setMessage({
            html: editor.getHTML(),
            json: editor.getJSON(),
            text: editor.getText(),
            md: editor.storage.markdown.getMarkdown(),
          });
        }
      },
    });

    /**
     * ----------------------------------------------------------------------------------------------
     * Expose ref methods
     * ----------------------------------------------------------------------------------------------
     * */
    const setIsHumanOnly = (value: boolean) => {
      // console.log("Toggling isHumanOnlyMessage to ->", value);
      // @ts-expect-error updateIsHumanOnlyState is a custom command
      editor?.commands.updateIsHumanOnlyState(value);
    };

    const clearEditor = (value: boolean) => {
      editor?.commands.clearContent();
    };

    useImperativeHandle(ref, () => ({
      setIsHumanOnly,
      clearEditor,
    }));

    /**
     * --------------------------------------------------------------------------------------------
     * Render
     * --------------------------------------------------------------------------------------------
     * */

    return (
      <div
        className={clsx(
          'tiptap-container',
          // Size and edges
          'relative block w-full rounded-lg',
          // Border
          'border border-zinc-950/10 dark:border-white/10',
          // Background
          'bg-white dark:bg-zinc-950',
          // Text styles
          'text-base/6 text-zinc-950 dark:text-white',
          // Shadow and ring
          'shadow-sm ring-1 ring-zinc-950/5 transition sm:text-sm/6 dark:ring-white/10',
          className
        )}
        {...props}
      >
        {showMenuBar && editor && <MenuBar editor={editor} />}
        <EditorContent
          editor={editor}
          className={clsx('tiptap-editor', proseTailwindClasses)}
        />
      </div>
    );
  }
);

TipTap.displayName = 'TipTap';
export default TipTap;

/**
 * ================================================================================================
 * Mini TipTap for read-only mode (no keyboard shortcut extension)
 * ================================================================================================
 */

interface TipTapPlainReadOnlyMethods {
  updateContentMarkdown: (value: string) => void;
}

interface TipTapPlainReadOnlyProps {
  initialContentJSON?: object;
  className?: string;
}

export const TipTapPlainReadOnly = forwardRef<
  TipTapPlainReadOnlyMethods,
  TipTapPlainReadOnlyProps
>(({ initialContentJSON, className } = {}, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable codeblock since we are using CodeBlockLowlight
        codeBlock: false,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          // Change rel to different value
          // Allow search engines to follow links(remove nofollow)
          // rel: "noopener noreferrer",
          // Remove target entirely so links open in current tab
          target: '_blank',
        },
      }),
      Markdown.configure({
        // html: true,                  // Allow HTML input/output
        tightLists: true, // No <p> inside <li> in markdown output
        tightListClass: 'tight', // Add class to <ul> allowing you to remove <p> margins when tight
        bulletListMarker: '-', // <li> prefix in markdown output
        linkify: true, // Create links from "https://..." text
        // breaks: false,               // New lines (\n) in markdown input are converted to <br>
        // transformPastedText: false,  // Allow to paste markdown text in the editor
        // transformCopiedText: false,  // Copied text is transformed to markdown
      }),
    ],
    content: initialContentJSON,
    immediatelyRender: false,
    editable: false,
  });

  const updateContentMarkdown = (updateContentMarkdown: string) => {
    if (editor) {
      editor.commands.setContent(updateContentMarkdown);
    }
  };

  useImperativeHandle(ref, () => ({
    updateContentMarkdown,
  }));

  return (
    <EditorContent
      editor={editor}
      className={clsx('tiptap-editor-mini', proseTailwindClasses)}
    />
  );
});
