'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { EditorState } from 'lexical'
import { useCallback } from 'react'

function Placeholder() {
  return <div className="text-gray-400"></div>
}

const editorConfig = {
  namespace: 'MyEditor',
  theme: { paragraph: 'editor-paragraph' },
  onError: (error: Error) => console.error(error),
  nodes: [],
}

export default function LexicalEditor({ onChange }: { onChange: (json: any) => void }) {
  const handleChange = useCallback(
    (editorState: EditorState) => {
      onChange(editorState.toJSON())
    },
    [onChange],
  )

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          minHeight: '150px',
          padding: '8px',
          backgroundColor: 'white',
          outline: 'none',
        }}
      >
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[150px] outline-none" />}
          placeholder={<Placeholder />}
          ErrorBoundary={() => null}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  )
}
