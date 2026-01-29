'use client';

import { useState, useCallback } from 'react';

interface ToolbarProps {
  onExportPng: () => void;
  onExportPdf: () => void;
  onCopy: () => void;
  onClear: () => void;
}

export default function Toolbar({
  onExportPng,
  onExportPdf,
  onCopy,
  onClear,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [onCopy]);

  return (
    <div className="toolbar flex items-center gap-2 px-6 py-3 border-b border-gray-200 bg-white">
      <button
        onClick={onExportPng}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
      >
        Export PNG
      </button>
      <button
        onClick={onExportPdf}
        className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
      >
        Export PDF
      </button>
      <button
        onClick={handleCopy}
        className="px-4 py-2 border border-black text-black text-sm font-medium rounded hover:bg-gray-100 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
      <button
        onClick={onClear}
        className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
