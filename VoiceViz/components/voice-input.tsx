"use client"

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MicOff,
  Play,
  Loader2,
  FileAudio,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function VoiceInput() {
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [language, setLanguage] = useState("en");
  const [checking, setChecking] = useState(false);
  const [model, setModel] = useState("model_1");
  const [result, setResult] = useState<{
    isMalicious: boolean;
    message: string;
  } | null>(null);

  const handleStartRecording = async () => {
    setError(null);
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        processAudioData();
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        "Failed to start recording. Please check your microphone permissions."
      );
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const processAudioData = async () => {
    if (audioChunksRef.current.length === 0) {
      setError("No audio recorded. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create audio blob and form data
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");


      // Send to your backend API
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Speech-to-text processing failed");
      }

      const data = await response.json();

      if (data.transcription) {
        setQuery(data.transcription);
      } else {
        setError(
          "Could not transcribe audio. Please try again or use text input."
        );
      }
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Failed to process audio. Please try again or use text input.");
    } finally {
      setIsProcessing(false);
    }
  };

  
 

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    // Check file type
    if (
      !["audio/wav", "audio/mp3", "audio/mpeg", "audio/m4a"].includes(file.type)
    ) {
      setError("Unsupported file type. Please upload WAV, MP3, or M4A files.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      // Send to Google Speech-to-Text API
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Speech-to-text processing failed");
      }

      const data = await response.json();

      if (data.transcription) {
        setQuery(data.transcription);

        
      } else {
        setError(
          "Could not transcribe audio. Please try again or use text input."
        );
      }
    } catch (err) {
      console.error("Error processing audio file:", err);
      setError(
        "Failed to process audio file. Please try again or use text input."
      );
    } finally {
      setIsProcessing(false);
    }
  };


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
          
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
              {/* <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" /> */}
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

