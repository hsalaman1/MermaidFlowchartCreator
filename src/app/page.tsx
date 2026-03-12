import dynamic from "next/dynamic";

const FlowchartBuilder = dynamic(() => import("@/components/FlowchartBuilder"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <p className="text-slate-400">Loading Flowchart Builder...</p>
    </div>
  ),
});

export default function Home() {
  return <FlowchartBuilder />;
}
