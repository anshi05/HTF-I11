"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, Trash2 } from "lucide-react"
import { Loader } from "@/components/ui/loader"

export default function VisualizationPanel({
  rawResponse,
  onRawResponseChange,
}: {
  rawResponse: string | null
  onRawResponseChange: (newRawResponse: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClearRawResponse = () => {
    onRawResponseChange(" ")
  }

  const handleCopy = () => {
    if (rawResponse) {
      navigator.clipboard.writeText(rawResponse)
        .then(() => {
          console.log("Copied to clipboard!")
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
        })
    }
  }

  const handleDownload = () => {
    if (rawResponse) {
      const blob = new Blob([rawResponse], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "raw_data.txt"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl shadow-xl border border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Raw Data</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleClearRawResponse}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-auto rounded-md border bg-muted p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="h-6 w-6 animate-spin text-primary">
                  <Loader />
                </div>
              </div>
            ) : rawResponse ? (
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{rawResponse}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">Click the purple button to fetch raw data.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
