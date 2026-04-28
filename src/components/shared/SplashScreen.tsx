import { TbSquareRoundedCheck } from 'react-icons/tb'

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden"
    >
      {/* Subtle depth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(113,113,122,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* App icon */}
        <div className="w-[72px] h-[72px] rounded-2xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shadow-2xl">
            <TbSquareRoundedCheck className="text-5xl text-white" />
        </div>

        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-[22px] font-semibold text-zinc-100 tracking-tight leading-none">
            Habit Tracker
          </h1>
          <p className="text-zinc-500 text-sm">
            Building better habits, one day at a time.
          </p>
        </div>

        {/* Loading spinner */}
        <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
}
