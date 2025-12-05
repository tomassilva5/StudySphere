'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-zinc-50 dark:bg-black py-12">
      {/* Imagem no topo */}
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/logo-sphere.jpg"
          alt="StudySphere logo"
          width={200}
          height={200}
          priority
        />
      </div>
      
      {/* Roda de loading na parte inferior */}
      <div className="flex flex-col items-center gap-4 pb-12">
        <div className="w-12 h-12 border-4 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-50 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
