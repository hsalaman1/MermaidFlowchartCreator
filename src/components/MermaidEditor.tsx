'use client';

import { useState, useRef, useCallback } from 'react';
import CodePanel from './CodePanel';
import PreviewPanel from './PreviewPanel';
import Toolbar from './Toolbar';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { DEFAULT_DIAGRAM } from '@/lib/defaultDiagram';
import { exportPng } from '@/lib/exportPng';
import { exportPdf } from '@/lib/exportPdf';

export default function MermaidEditor() {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const debouncedCode = useDebouncedValue(code, 300);
  const previewRef = useRef<HTMLDivElement>(null!);

  const handleExportPng = useCallback(async () => {
    if (previewRef.current) {
      await exportPng(previewRef.current);
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (previewRef.current) {
      await exportPdf(previewRef.current);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
  }, [code]);

  const handleClear = useCallback(() => {
    setCode('');
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toolbar
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        onCopy={handleCopy}
        onClear={handleClear}
      />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden border-r border-gray-200">
          <CodePanel value={code} onChange={setCode} />
        </div>
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
          <PreviewPanel code={debouncedCode} previewRef={previewRef} />
        </div>
      </div>
    </div>
  );
}
