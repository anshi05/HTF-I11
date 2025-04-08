import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { DemoVideo } from "../components/demo-video"
import { Testimonials } from "../components/testimonials"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main>
        <HeroSection />
        <DemoVideo youtubeUrl="https://youtu.be/2kCTmlU0RPg?si=tQEO1Z-WnKDMxY2l"/>
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

