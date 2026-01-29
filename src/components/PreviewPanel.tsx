'use client';

import { useEffect, useRef, useState } from 'react';

interface PreviewPanelProps {
  code: string;
  previewRef: React.RefObject<HTMLDivElement>;
}

export default function PreviewPanel({ code, previewRef }: PreviewPanelProps) {
  const [svgOutput, setSvgOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const renderCounter = useRef(0);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim()) {
        setSvgOutput('');
        setError('');
        return;
      }

      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'sans-serif',
        });

        renderCounter.current += 1;
        const id = `mermaid-diagram-${renderCounter.current}`;

        const { svg } = await mermaid.render(id, code);
        setSvgOutput(svg);
        setError('');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Invalid Mermaid syntax';
        setError(message);
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div className="preview-panel flex-1 overflow-auto bg-white p-6 border-l border-gray-200">
      {error ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 text-sm font-mono whitespace-pre-wrap">
          {error}
        </div>
      ) : (
        <div
          ref={previewRef}
          className="flex items-center justify-center min-h-full"
          dangerouslySetInnerHTML={{ __html: svgOutput }}
        />
      )}
    </div>
  );
}
