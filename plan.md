# Implementation Plan: Add Visual Flowchart Builder Features

## Overview
Integrate the visual flowchart builder features from the user's code into the existing Next.js Mermaid Editor app. This transforms the app from a raw-code editor into a visual node-based builder that auto-generates Mermaid code, while preserving existing export (PNG/PDF) and preview capabilities.

## New Features to Add
1. Visual node builder with 4-step wizard (type → text → branches → connections/color)
2. Node types: Start, End, Process, Decision with distinct shapes and icons
3. Connection management (create, label, delete connections)
4. Actors/Swimlanes (subgraph grouping)
5. Inline node editing panel (text, type, color, actor)
6. Color customization (10 preset colors)
7. Save/Load flowcharts to localStorage
8. Import existing Mermaid code (parse into nodes)
9. Auto-generate Mermaid code from visual node model

## Implementation Steps

### Step 1: Install lucide-react dependency
- Add `lucide-react` package (used for all icons: Plus, Trash2, Edit3, Download, Upload, Save, etc.)

### Step 2: Create shared types and constants (`src/lib/flowchartTypes.ts`)
- Define `NODE_TYPES` constant with shape definitions, colors, icons
- Define `PRESET_COLORS` array
- Define TypeScript interfaces: `FlowchartNode`, `Connection`, `SavedChart`
- Export `generateId` utility function

### Step 3: Create Mermaid code generator utility (`src/lib/generateMermaid.ts`)
- Extract `generateMermaidCode()` function from the user's code
- Takes nodes and connections as input, returns Mermaid code string
- Handles subgraph generation for multiple actors
- Handles node styling for custom colors

### Step 4: Create Mermaid code parser utility (`src/lib/parseMermaid.ts`)
- Extract `importMermaid()` parsing logic into a reusable function
- Parses Mermaid flowchart syntax into nodes and connections arrays
- Handles node definitions, connections with labels, and auto-creates missing nodes

### Step 5: Create storage utility (`src/lib/storage.ts`)
- Create save/load/delete functions for flowchart persistence
- Use `localStorage` (the user's code uses `window.storage` which is environment-specific)
- Handle serialization/deserialization of chart data

### Step 6: Create Node Wizard component (`src/components/NodeWizard.tsx`)
- 4-step wizard UI for adding nodes
- Step 1: Select node type (Start/End/Process/Decision)
- Step 2: Enter node text
- Step 3: Decision branches (for decision nodes only)
- Step 4: Set connection source, actor, color → create node
- Returns completed node + connection data to parent

### Step 7: Create Node List component (`src/components/NodeList.tsx`)
- Scrollable list of all nodes with icons, types, actors, connection counts
- Click to select/edit a node
- Connection mode: click a node to connect to it
- Visual indicators for selected node and connection mode

### Step 8: Create Node Editor component (`src/components/NodeEditor.tsx`)
- Inline edit panel for selected node (text, type, actor, color)
- Color picker with preset swatches
- Connect and Delete action buttons
- Outgoing connections list with delete capability

### Step 9: Create Actor Manager modal (`src/components/ActorModal.tsx`)
- Modal to add/remove actors (swimlanes)
- Input field to add new actors
- List existing actors with delete buttons
- "Default" actor cannot be deleted

### Step 10: Create Import Modal component (`src/components/ImportModal.tsx`)
- Modal with textarea for pasting Mermaid code
- Uses the parser from Step 4
- Cancel/Import buttons

### Step 11: Create Save/Load Modals (`src/components/SaveLoadModals.tsx`)
- Save modal: text input for chart name + save button
- Load modal: list of saved charts with load/delete actions
- Shows node count and save date for each chart

### Step 12: Rebuild the main FlowchartBuilder component (`src/components/FlowchartBuilder.tsx`)
- This replaces MermaidEditor as the main orchestrator
- State: nodes, connections, actors, selectedNode, wizardState, connectionMode, modals
- Composes: NodeWizard, NodeList, NodeEditor, ActorModal, ImportModal, SaveLoadModals
- Layout: header (title input + action buttons) → left sidebar (node list + editor) → right main (preview + code panel)
- Auto-generates Mermaid code on node/connection changes
- Renders preview using existing Mermaid rendering approach (adapted from PreviewPanel)

### Step 13: Update the header/toolbar
- Replace existing Toolbar with integrated header bar
- Buttons: Import, Export Mermaid, Export PNG, Copy Code, Save, Load
- Editable chart name input
- Keep existing PNG export logic from `exportPng.ts`

### Step 14: Update page.tsx and globals.css
- Update `page.tsx` to dynamically import FlowchartBuilder instead of MermaidEditor
- Update `globals.css` for new dark theme styles (slate-900 background)
- Keep print media queries

### Step 15: Clean up
- Remove CodePanel.tsx (no longer needed — code is auto-generated, not hand-edited)
- Keep PreviewPanel logic integrated into FlowchartBuilder
- Keep exportPng.ts and exportPdf.ts utilities
- Update layout.tsx metadata if needed

## Architecture Notes
- The existing CodeMirror-based editor is replaced by the visual builder. The Mermaid code panel becomes a read-only collapsible section.
- Mermaid rendering reuses the existing approach (dynamic import, `mermaid.render()` with debounce).
- The app shifts from a dark/light split theme to a full dark theme (slate-900/800/700).
- `lucide-react` replaces any existing icon usage.
- All new components use `'use client'` directive for Next.js compatibility.

## Files Changed
- **New**: `src/lib/flowchartTypes.ts`, `src/lib/generateMermaid.ts`, `src/lib/parseMermaid.ts`, `src/lib/storage.ts`
- **New**: `src/components/FlowchartBuilder.tsx`, `src/components/NodeWizard.tsx`, `src/components/NodeList.tsx`, `src/components/NodeEditor.tsx`, `src/components/ActorModal.tsx`, `src/components/ImportModal.tsx`, `src/components/SaveLoadModals.tsx`
- **Modified**: `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `package.json`
- **Removed**: `src/components/CodePanel.tsx` (replaced by auto-generated code view)
- **Kept as-is**: `src/lib/exportPng.ts`, `src/lib/exportPdf.ts`, `src/hooks/useDebouncedValue.ts`, `src/components/Toolbar.tsx` (may be removed if fully replaced)
