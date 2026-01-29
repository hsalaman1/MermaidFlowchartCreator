'use client';

import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';

interface CodePanelProps {
  value: string;
  onChange: (value: string) => void;
}

const extensions = [EditorView.lineWrapping];

export default function CodePanel({ value, onChange }: CodePanelProps) {
  return (
    <div className="code-panel flex-1 overflow-hidden flex flex-col">
      <CodeMirror
        value={value}
        onChange={onChange}
        height="100%"
        className="flex-1 overflow-auto text-sm"
        extensions={extensions}
        theme="light"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
          highlightActiveLine: true,
          autocompletion: false,
        }}
      />
    </div>
  );
}
