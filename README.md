# Mermaid Diagram Editor

A Next.js 14 application for creating, editing, and exporting Mermaid diagrams with a live preview.

## Features

- Split-view editor with code panel and live preview
- Syntax highlighting via CodeMirror
- Support for all Mermaid diagram types (flowchart, sequence, gantt, class, state, ER, pie, git, etc.)
- Export diagrams as PNG (2x retina quality)
- Export diagrams as PDF (auto-oriented, centered on A4)
- Copy code to clipboard
- Error display for invalid Mermaid syntax
- Responsive layout (side-by-side on desktop, stacked on mobile)
- Black and white, printer-friendly design

## Tech Stack

- **Next.js 14** (App Router)
- **React + TypeScript**
- **Tailwind CSS**
- **Mermaid.js** for diagram rendering
- **@uiw/react-codemirror** for code editing
- **jsPDF** for PDF export

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

This project is ready for deployment on [Vercel](https://vercel.com) with zero configuration. Push to GitHub and import the repository in Vercel.

## Project Structure

```
src/
  app/
    globals.css       - Global styles and print media query
    layout.tsx        - Root layout with metadata and font
    page.tsx          - Main page with dynamic editor import
  components/
    MermaidEditor.tsx  - Main editor orchestrator
    CodePanel.tsx      - CodeMirror code editor
    PreviewPanel.tsx   - Live Mermaid diagram preview
    Toolbar.tsx        - Export, copy, and clear buttons
  hooks/
    useDebouncedValue.ts - Debounce hook for live preview
  lib/
    defaultDiagram.ts  - Default example diagram
    exportPng.ts       - PNG export via SVG serialization
    exportPdf.ts       - PDF export via jsPDF
```
