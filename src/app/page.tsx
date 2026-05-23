import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedChessGrid from "@/components/AnimatedChessGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Backgrounds */}
      <ParticleBackground />
      <AnimatedChessGrid />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl">
        <div className="stagger-children">
          {/* Title */}
          <h1 className="font-mono text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-500 text-glow-blue mb-4 animate-float">
            CHESSGOD
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl md:text-3xl font-light tracking-wide text-[var(--cg-text-dim)] mb-12">
            Can Humanity Defeat{" "}
            <span className="font-semibold text-white text-glow-blue">God</span>
            ?
          </h2>

          {/* Call to Action */}
          <div className="mb-16">
            <Link
              href="/play"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-lg md:text-xl tracking-widest text-white uppercase overflow-hidden glass hover:bg-blue-600/20 transition-all duration-300 animate-pulse-glow"
              style={{
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                borderColor: "rgba(59, 130, 246, 0.4)",
              }}
            >
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors" />
              <span className="relative">Challenge God</span>
            </Link>
          </div>

          {/* Global Statistics Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full glass-sm p-6 text-sm md:text-base border-t border-[var(--cg-blue-dim)]">
            <div className="flex flex-col space-y-1">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Total Challengers
              </span>
              <span className="font-bold text-white">2,184,331</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Humanity Win Rate
              </span>
              <span className="font-bold text-[var(--cg-crimson)] text-glow-crimson">
                0.0008%
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Longest Survival
              </span>
              <span className="font-bold text-[var(--cg-gold)] text-glow-gold">
                47 Moves
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Latest Godslayer
              </span>
              <span className="font-bold text-[var(--cg-cyan)]">
                Unknown_17
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--cg-bg)] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--cg-bg)_100%)] pointer-events-none z-[5]" />
    </main>
  );
}
