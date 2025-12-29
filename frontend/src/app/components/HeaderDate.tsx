'use client';

export default function HeaderDate() {
  const date = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-full pt-8 px-6 mb-2">
      <p className="text-sm font-bold capitalize tracking-wide inline-block bg-gradient-to-r from-[#57F177] to-[#4CB2D8] bg-clip-text text-transparent">
        {date}
      </p>
    </div>
  );
}