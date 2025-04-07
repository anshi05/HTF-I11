import type { Metadata } from "next"
import DataVisualization from "@/components/visualization/data-visualization"

export const metadata: Metadata = {
  title: "Data Visualization | VoiceViz",
  description: "Visualize your data with interactive charts and tables",
}

export default function VisualizationPage() {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background dark">
        <div className="flex-1">
          <DataVisualization />
        </div>
      </div>
    )
  }