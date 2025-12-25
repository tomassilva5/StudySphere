'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Importar estilos do Swiper
import 'swiper/css';
import 'swiper/css/pagination';

export default function IntroPage() {
  const router = useRouter();
  const [isLastSlide, setIsLastSlide] = useState(false);

  const slides = [
    {
      title: "Bem-vindo ao StudySphere",
      description: "A tua nova esfera de produtividade académica. Tudo o que precisas num só lugar.",
      image: "/Logo/Logo.jpg"
    },
    {
      title: "Organiza as tuas Tarefas",
      description: "Gere o teu tempo de estudo, define prioridades e nunca mais percas um prazo de entrega.",
      image: "/Logo/Logo.jpg" // Podes trocar por uma imagem de tarefas
    },
    {
      title: "Trabalho em Equipa",
      description: "Cria grupos, partilha o progresso e colabora com os teus colegas de forma eficiente.",
      image: "/Logo/Logo.jpg" // Podes trocar por uma imagem de grupos
    }
  ];

  const handleFinish = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    router.push('/login');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#06141F] via-[#0B1F2E] to-[#1C3B4F]">
      
      {/* Botão Pular (Opcional) */}
      {!isLastSlide && (
        <button 
          onClick={handleFinish}
          className="absolute top-12 right-6 z-20 text-gray-400 font-medium hover:text-white transition-colors"
        >
          Pular
        </button>
      )}

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setIsLastSlide(swiper.activeIndex === slides.length - 1)}
        className="h-full w-full intro-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              
              <div className="relative h-64 w-64 mb-12 animate-pulse-slow">
                <Image 
                  src={slide.image}
                  alt={slide.title}
                  fill 
                  className="object-contain rounded-full shadow-[0_0_50px_rgba(110,231,183,0.2)]"
                  priority
                />
              </div>

              <h1 className="text-3xl font-bold text-white mb-6">
                {slide.title.includes("StudySphere") ? (
                  <>Bem-vindo ao <span className="bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] bg-clip-text text-transparent">StudySphere</span></>
                ) : slide.title}
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed max-w-xs">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botão de Ação no Fundo */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-6 flex justify-center">
        <div className="w-full max-w-sm">
          <button 
            onClick={isLastSlide ? handleFinish : undefined}
            className={`w-full rounded-2xl py-4 text-lg font-bold text-white shadow-lg transition-all duration-500
              ${isLastSlide 
                ? "bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] opacity-100 translate-y-0" 
                : "opacity-0 translate-y-10 pointer-events-none"
              }`}
          >
            Começar Agora
          </button>
        </div>
      </div>

      {/* Customização das bolinhas (CSS inline para facilitar) */}
      <style jsx global>{`
        .intro-swiper .swiper-pagination-bullet {
          background: #374151;
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
        }
        .intro-swiper .swiper-pagination-bullet-active {
          background: #6EE7B7 !important;
          width: 24px;
          border-radius: 5px;
          transition: all 0.3s;
        }
        .intro-swiper .swiper-pagination {
          bottom: 120px !important;
        }
      `}</style>
    </div>
  );
}