"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Textarea } from "../components/ui/textarea"
import { Mic, MicOff, Upload, Play, Loader2 } from "lucide-react"

export function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [query, setQuery] = useState("")

  const handleStartRecording = () => {
    setIsRecording(true)
  
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsProcessing(true)

  
    setTimeout(() => {
      setIsProcessing(false)
      setQuery("Show me the sales data for Q1 2023 by region")
    }, 2000)
  }

  const handleSubmitQuery = () => {
    setIsProcessing(true)

  
    setTimeout(() => {
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>What Would You Like to Know?</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="voice">Voice Input</TabsTrigger>
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="file">Audio File</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-8">
              <div className="relative mb-6">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100 dark:bg-red-900/20 animate-pulse" : "bg-primary/10"}`}
                >
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    size="icon"
                    className="h-20 w-20 rounded-full"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-10 w-10 animate-spin" />
                    ) : isRecording ? (
                      <MicOff className="h-10 w-10" />
                    ) : (
                      <Mic className="h-10 w-10" />
                    )}
                  </Button>
                </div>
                {isRecording && (
                  <div className="absolute -bottom-2 left-0 right-0 text-center text-sm font-medium text-red-500">
                    Recording...
                  </div>
                )}
              </div>
              <p className="text-center text-muted-foreground mb-2">
                {isProcessing
                  ? "Processing your query..."
                  : isRecording
                    ? "Speak your query clearly..."
                    : "Press the microphone button and speak your query"}
              </p>
              {query && (
                <div className="mt-4 p-4 bg-muted rounded-md w-full">
                  <p className="font-medium">Recognized Query:</p>
                  <p className="text-muted-foreground">{query}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Enter your query here (e.g., 'Show me sales data for Q1 2023 by region')"
              className="min-h-[120px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button className="w-full" onClick={handleSubmitQuery} disabled={!query.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Query
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Drag and drop an audio file, or click to browse</p>
              <p className="text-xs text-muted-foreground mb-4">Supports MP3, WAV, M4A (Max 10MB)</p>
              <Button variant="outline">Browse Files</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

