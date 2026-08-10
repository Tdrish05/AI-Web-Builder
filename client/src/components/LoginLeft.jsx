import React from 'react'

const LoginLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-b from-black via-red-950 via-red-800 to-amber-600 flex-col justify-between p-12 shrink-0 select-none relative overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* 1. TOP CHILD */}
      <div className='flex items-center gap-3 z-10 relative'>
        <img src="/logo.svg" alt="Logo" className="size-9.5" />
        <span className="text-2xl font-semibold tracking-tight text-white">
          AI Web Builder
        </span>
      </div>

      {/* 2. BOTTOM CHILD (Wrap both text and copyright inside this single div) */}
      <div>
        <h2 className="text-3xl text-white font-medium leading-snug mb-3 tracking-tight z-10 relative">
          Create stunning websites with AI
        </h2>
        <p className="text-zinc-300 z-10 relative">
          Describe your website in plain English and watch the AI generate a fully interactive, production-ready React codebase instantly.
        </p>
        <p className="text-zinc-300 text-sm mt-12 z-10 relative">
          Copyright {new Date().getFullYear()} AI Web Builder
        </p>
      </div>

    </div>
  )
}

export default LoginLeft