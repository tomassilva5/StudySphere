// app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o utilizador já viu a introdução
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro === 'true') {
      // Se já viu a intro, vai para loading (que verifica autenticação)
      router.replace('/loading');
    } else {
      // Se é a primeira vez, mostra a intro
      router.replace('/intro');
    }
  }, [router]);

  return null; // Não renderiza nada, apenas redireciona
}
