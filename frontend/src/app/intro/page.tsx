'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
      title: 'Bem-vindo ao StudySphere',
      description: 'A tua nova esfera de produtividade académica. Tudo o que precisas num só lugar.',
      image: '/Logo/Logo_sem_fundo.png',
    },
    {
      title: 'Calendário Centralizado',
      description: 'Visualiza tudo num só calendário. Sincroniza e importa eventos do Google Calendar e Outlook.',
      image: '/IntroImages/Slidee2.png',
    },
    {
      title: 'Gere as tuas Tarefas',
      description: 'Organiza o teu estudo, define prioridades e acompanha o teu progresso diário.',
      image: '/IntroImages/Imagem3.png',
    },
    {
      title: 'Trabalho em Equipa',
      description: 'Cria grupos, envia mensagens, realiza chamadas e colabora com os teus colegas de forma eficiente.',
      image: '/IntroImages/Imagem4.png',
    },
  ];

  const handleFinish = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    router.push('/login');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#06141F] via-[#0B1F2E] to-[#1C3B4F] relative overflow-hidden">
      
      {/* Botão Saltar - Esconde no último slide */}
      {!isLastSlide && (
        <button
          onClick={handleFinish}
          className="absolute top-12 right-6 z-30 text-gray-400 font-medium hover:text-white transition-colors"
        >
          Saltar
        </button>
      )}

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) =>
          setIsLastSlide(swiper.activeIndex === slides.length - 1)
        }
        className="h-full w-full intro-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Removido o pb-24 para permitir o justify-center alinhar ao meio exato */}
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="relative h-64 w-64 mb-12 animate-pulse-slow">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-contain rounded-full shadow-[0_0_50px_rgba(110,231,183,0.2)]"
                />
              </div>

              <h1 className="text-3xl font-bold text-white mb-6">
                {slide.title.includes('StudySphere') ? (
                  <>
                    Bem-vindo ao{' '}
                    <span className="bg-gradient-to-r from-[#57F177] to-[#4CB2D8] bg-clip-text text-transparent">
                      StudySphere
                    </span>
                  </>
                ) : (
                  slide.title
                )}
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed max-w-xs">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botão "Começar agora" */}
      <div 
        className={`absolute bottom-12 left-0 right-0 z-40 px-10 transition-all duration-500 transform ${
          isLastSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <button
          onClick={handleFinish}
          className="w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[#57F177] to-[#4CB2D8] hover:opacity-90 active:scale-[0.98]"
        >
          Começar agora
        </button>
      </div>

      {/* Customização da paginação */}
      <style jsx global>{`
        .intro-swiper .swiper-pagination-bullet {
          background: #374151;
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
          transition: all 0.3s ease-in-out;
        }

        .intro-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #57F177, #4CB2D8) !important;
          width: 24px;
          border-radius: 5px;
        }

        .intro-swiper .swiper-pagination {
          bottom: 55px !important;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: ${isLastSlide ? '0' : '1'};
          pointer-events: ${isLastSlide ? 'none' : 'auto'};
        }
      `}</style>
    </div>
  );
}