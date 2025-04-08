"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

export function DemoVideo() {
  const [isOpen, setIsOpen] = useState(false)
  const videoId = "K4TOrB7at0Y" // Your YouTube video ID

  // YouTube thumbnail URL (max resolution)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See VoiceViz in Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how easy it is to transform your voice queries into powerful visualizations
          </p>
        </div>

        <motion.div
          className="relative max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          onClick={() => setIsOpen(true)}
        >
          {/* Video thumbnail with purple overlay */}
          <div className="aspect-video relative">
            <Image
              src={thumbnailUrl}
              alt="Video thumbnail"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Purple tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                className="bg-white/90 hover:bg-white rounded-full p-4 shadow-lg z-10 w-16 h-16" // Perfect circle
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(true)
                }}
              >
                <Play className="text-primary" size={24} />
              </Button>
            </div>

            {/* Text in bottom left corner */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
              <div className="text-white">
                <h3 className="text-xl font-semibold drop-shadow-md">VoiceViz Demo</h3>
                <p className="text-sm opacity-90 drop-shadow-md">See how to analyze data with your voice</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl p-0 bg-black border-0">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
                title="VoiceViz Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
