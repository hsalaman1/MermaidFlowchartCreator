import dynamic from "next/dynamic";

const MermaidEditor = dynamic(() => import("@/components/MermaidEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center flex-1">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-4 bg-white">
        <h1 className="text-xl font-bold text-black">Mermaid Diagram Editor</h1>
      </header>
      <MermaidEditor />
    </main>
  );
}
