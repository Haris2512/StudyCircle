// File ini berisi komponen untuk halaman LandingPage
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Video, Trophy, Smartphone, ArrowRight, BrainCircuit, 
  Users, CalendarX, BookX, CheckCircle, Quote, Star
} from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Oline",
    role: "Mahasiswa Ilmu Komunikasi",
    initial: "O",
    gradient: "from-[#B88CB2] to-[#8FAFEA]",
    colorText: "text-[#B88CB2]",
    content1: "Gila sih, dulu struggle banget nyari temen nugas yang klop. Semenjak pake StudyCircle, langsung dapet ",
    highlight: "circle belajar",
    content2: " yang se-vibe dan asik parah buat diajak ambis bareng!",
    hoverBorder: "hover:border-[#B88CB2]/40"
  },
  {
    name: "Delynn",
    role: "Mahasiswa Sistem Informasi",
    initial: "D",
    gradient: "from-[#8FAFEA] to-[#B88CB2]",
    colorText: "text-[#8FAFEA]",
    content1: "Fix ini ngebantu banget buat anak nolep kayak aku wkwk. AI-nya pinter banget nyariin ",
    highlight: "circle belajar",
    content2: " yang jadwal luangnya sama, jadi ga ada lagi wacana belajar doang!",
    hoverBorder: "hover:border-[#8FAFEA]/40"
  },
  {
    name: "Fiony",
    role: "Mahasiswa Psikologi",
    initial: "F",
    gradient: "from-[#B88CB2] to-[#8FAFEA]",
    colorText: "text-[#B88CB2]",
    content1: "Udah gonta-ganti ",
    highlight: "circle belajar",
    content2: " tapi pada ga jalan. Ketemu StudyCircle langsung dapet match yang gaya belajarnya sama. Beneran ngebantu naikin IPK banget deh sumpah!",
    hoverBorder: "hover:border-[#B88CB2]/40"
  }
];

// Repeat testimonials to create an infinite scrolling effect on mobile
const DISPLAY_TESTIMONIALS = Array(8).fill(TESTIMONIALS).flat();

export function LandingPage() {
  const testiScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for Testimonial Carousel
  useEffect(() => {
    // Only auto-scroll on mobile views where we have horizontal scroll
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const interval = setInterval(() => {
      if (testiScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = testiScrollRef.current;
        
        // If we reached the end of the cloned array, reset to start instantly, then smooth scroll to next
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          testiScrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
          setTimeout(() => {
            testiScrollRef.current?.scrollBy({ left: clientWidth * 0.85, behavior: 'smooth' });
          }, 50);
        } else {
          testiScrollRef.current.scrollBy({ left: clientWidth * 0.85, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060913] text-white font-sans selection:bg-primary-500/30 overflow-x-hidden">
      {/* Hide Scrollbar Global Styles for Carousels */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* --- 1. Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4 bg-[#060913]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#B88CB2] to-[#8FAFEA] flex items-center justify-center shadow-lg shadow-[#B88CB2]/20">
            <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="text-lg md:text-2xl font-bold tracking-tight text-white">
            Study<span className="text-primary-400">Circle</span>
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <Link to="/login" className="hidden md:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-base font-bold rounded-full bg-gradient-to-r from-[#B88CB2] to-[#8FAFEA] hover:opacity-90 text-white transition-all duration-300 shadow-[0_0_20px_rgba(184,140,178,0.3)] hover:shadow-[0_0_30px_rgba(143,175,234,0.5)]"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* --- 2. ADS & Headline (Hero Section) --- */}
      <main className="relative min-h-[100svh] md:min-h-0 pt-20 md:pt-32 pb-10 md:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Modern Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 animate-fade-in-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/[0.03] border border-white/10 text-[10px] md:text-sm text-primary-300 font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary-400" />
            <span>Platform Kolaborasi AI Generasi Baru</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15]">
            Belajar Bersama,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B88CB2] to-[#8FAFEA]">
              Tanpa Hambatan.
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed px-2">
            Tingkatkan produktivitas akademis Anda. Kami membantu mempertemukan Anda dengan rekan belajar yang tepat berdasarkan minat, metode belajar, dan ketersediaan waktu.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-4 sm:px-0">
            <Link
              to="/register"
              className="w-full max-w-[280px] sm:w-auto px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-gradient-to-r from-[#B88CB2] to-[#8FAFEA] hover:opacity-90 text-white font-bold text-sm md:text-lg transition-all duration-300 shadow-[0_0_30px_rgba(184,140,178,0.4)] hover:shadow-[0_0_40px_rgba(143,175,234,0.6)] flex items-center justify-center gap-2"
            >
              Mulai Sekarang
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full max-w-[280px] sm:w-auto px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-sm md:text-lg transition-all duration-300 flex items-center justify-center"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </main>

      {/* --- 3. Problem Section --- */}
      <section className="relative z-10 py-16 md:py-20 bg-[#0B0F19] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 tracking-tight">Tantangan dalam Kolaborasi Mahasiswa</h2>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
              Seringkali proses belajar kelompok terhambat oleh masalah koordinasi dan kompatibilitas yang menurunkan performa akademis secara keseluruhan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="flex flex-row md:flex-col items-center md:items-start p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[#B88CB2]/10 to-[#0B0F19] border border-[#B88CB2]/20 hover:border-[#8FAFEA]/40 transition-all duration-500 group gap-4 md:gap-0 shadow-lg shadow-black/50">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#060913] border border-[#B88CB2]/40 flex items-center justify-center mb-0 md:mb-6 text-[#B88CB2] group-hover:scale-110 group-hover:border-[#B88CB2] group-hover:shadow-[0_0_20px_rgba(184,140,178,0.4)] transition-all duration-500 shadow-[inset_0_0_15px_rgba(184,140,178,0.2)]">
                <Users className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 text-gray-100">Rekan Diskusi Tidak Sejalan</h3>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed">
                  Kesulitan menemukan rekan studi yang memiliki visi, target nilai, dan gaya belajar yang kompatibel.
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-start p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[#B88CB2]/10 to-[#0B0F19] border border-[#B88CB2]/20 hover:border-[#8FAFEA]/40 transition-all duration-500 group gap-4 md:gap-0 shadow-lg shadow-black/50">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#060913] border border-[#B88CB2]/40 flex items-center justify-center mb-0 md:mb-6 text-[#B88CB2] group-hover:scale-110 group-hover:border-[#B88CB2] group-hover:shadow-[0_0_20px_rgba(184,140,178,0.4)] transition-all duration-500 shadow-[inset_0_0_15px_rgba(184,140,178,0.2)]">
                <CalendarX className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 text-gray-100">Jadwal Tumpang Tindih</h3>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed">
                  Koordinasi waktu pertemuan yang rumit dan seringnya terjadi bentrok jadwal antar anggota kelompok.
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-start p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[#B88CB2]/10 to-[#0B0F19] border border-[#B88CB2]/20 hover:border-[#8FAFEA]/40 transition-all duration-500 group gap-4 md:gap-0 shadow-lg shadow-black/50">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#060913] border border-[#B88CB2]/40 flex items-center justify-center mb-0 md:mb-6 text-[#B88CB2] group-hover:scale-110 group-hover:border-[#B88CB2] group-hover:shadow-[0_0_20px_rgba(184,140,178,0.4)] transition-all duration-500 shadow-[inset_0_0_15px_rgba(184,140,178,0.2)]">
                <BookX className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 text-gray-100">Kurangnya Struktur</h3>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed">
                  Sesi diskusi yang tidak terarah dan ketiadaan platform terpusat untuk berbagi materi atau catatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. Solusi Section --- */}
      <section className="relative z-10 py-16 md:py-32 bg-[#060913]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 md:mb-16 gap-8 md:gap-10">
            <div className="lg:w-1/2 animate-fade-in-up text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#8FAFEA] text-[10px] md:text-xs font-bold mb-4 uppercase tracking-wider">
                Inovasi
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">Solusi Cerdas Berbasis Algoritma</h2>
              <p className="text-sm md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 lg:px-0">
                StudyCircle dirancang dengan arsitektur canggih untuk memecahkan masalah kolaborasi dan memastikan proses belajar berjalan terstruktur, terarah, dan membuahkan hasil.
              </p>
            </div>
            
            {/* Grid 2 Column on Mobile for Compactness */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4 w-full">
              <div className="p-5 md:p-6 rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-[#8FAFEA]/10 to-[#0B0F19] border border-[#8FAFEA]/20 hover:border-[#B88CB2]/40 transition-all duration-300 group shadow-lg shadow-black/50">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#060913] border border-[#8FAFEA]/40 flex items-center justify-center mb-3 md:mb-5 text-[#8FAFEA] group-hover:scale-110 group-hover:border-[#8FAFEA] group-hover:shadow-[0_0_20px_rgba(143,175,234,0.4)] transition-all duration-300 shadow-[inset_0_0_15px_rgba(143,175,234,0.2)]">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-100">AI Matching</h3>
                <p className="text-gray-400 text-[10px] md:text-sm leading-relaxed">
                  Pencocokan akurat berdasarkan ketersediaan dan metode belajar.
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-[#8FAFEA]/10 to-[#0B0F19] border border-[#8FAFEA]/20 hover:border-[#B88CB2]/40 transition-all duration-300 group md:translate-y-6 shadow-lg shadow-black/50">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#060913] border border-[#8FAFEA]/40 flex items-center justify-center mb-3 md:mb-5 text-[#8FAFEA] group-hover:scale-110 group-hover:border-[#8FAFEA] group-hover:shadow-[0_0_20px_rgba(143,175,234,0.4)] transition-all duration-300 shadow-[inset_0_0_15px_rgba(143,175,234,0.2)]">
                  <Video className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-100">Virtual Rooms</h3>
                <p className="text-gray-400 text-[10px] md:text-sm leading-relaxed">
                  Ruang tatap muka virtual bawaan tanpa perlu aplikasi eksternal.
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-[#8FAFEA]/10 to-[#0B0F19] border border-[#8FAFEA]/20 hover:border-[#B88CB2]/40 transition-all duration-300 group shadow-lg shadow-black/50">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#060913] border border-[#8FAFEA]/40 flex items-center justify-center mb-3 md:mb-5 text-[#8FAFEA] group-hover:scale-110 group-hover:border-[#8FAFEA] group-hover:shadow-[0_0_20px_rgba(143,175,234,0.4)] transition-all duration-300 shadow-[inset_0_0_15px_rgba(143,175,234,0.2)]">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-100">Gamifikasi</h3>
                <p className="text-gray-400 text-[10px] md:text-sm leading-relaxed">
                  Sistem poin dan metrik untuk mengukur peningkatan akademik.
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-[#8FAFEA]/10 to-[#0B0F19] border border-[#8FAFEA]/20 hover:border-[#B88CB2]/40 transition-all duration-300 group md:translate-y-6 shadow-lg shadow-black/50">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#060913] border border-[#8FAFEA]/40 flex items-center justify-center mb-3 md:mb-5 text-[#8FAFEA] group-hover:scale-110 group-hover:border-[#8FAFEA] group-hover:shadow-[0_0_20px_rgba(143,175,234,0.4)] transition-all duration-300 shadow-[inset_0_0_15px_rgba(143,175,234,0.2)]">
                  <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-100">PWA Ready</h3>
                <p className="text-gray-400 text-[10px] md:text-sm leading-relaxed">
                  Akses lancar lintas perangkat dengan dukungan optimalisasi cache.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. Testimonial Section --- */}
      <section className="relative z-10 py-20 md:py-24 bg-[#0B0F19] border-t border-white/5">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-full max-w-[600px] h-full bg-gradient-to-l from-primary-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">Pengalaman Pengguna Kami</h2>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Dengar langsung dari mahasiswa yang telah merevolusi cara mereka belajar melalui ekosistem kolaboratif StudyCircle.
            </p>
          </div>

          {/* Testimonial Carousel Container */}
          <div 
            ref={testiScrollRef}
            className="flex overflow-x-auto pb-8 -mx-6 px-6 snap-x snap-mandatory hide-scrollbar gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:pb-0 md:mx-0 md:px-0 md:overflow-visible"
          >
            {DISPLAY_TESTIMONIALS.map((testi, i) => (
              <div 
                key={i} 
                className={`w-[85vw] flex-shrink-0 snap-center md:w-auto flex-col p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.03] border border-white/[0.08] ${testi.hoverBorder} transition-all duration-300 ${i >= 3 ? 'flex md:hidden' : 'flex'}`}
              >
                <div className="flex gap-1 text-yellow-500 mb-4 md:mb-6">
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                </div>
                <p className="text-gray-300 italic leading-relaxed text-sm md:text-base flex-grow mb-6 md:mb-8">
                  "{testi.content1}<span className={`${testi.colorText} font-semibold`}>{testi.highlight}</span>{testi.content2}"
                </p>
                <div className="flex items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-white/10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${testi.gradient} flex items-center justify-center text-white font-bold text-base md:text-lg shadow-inner`}>
                    {testi.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 text-sm md:text-base">{testi.name}</h4>
                    <p className={`text-[10px] md:text-xs ${testi.colorText} font-medium`}>{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Carousel Indicators (Visual Only) */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
        </div>
      </section>

      {/* --- 6. Penawaran (Offer / CTA) --- */}
      <section className="relative z-10 py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 md:p-16 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#B88CB2]/10 via-[#0B0F19] to-[#060913] border border-[#B88CB2]/30 text-center relative overflow-hidden shadow-2xl shadow-[#B88CB2]/10">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#B88CB2]/20 rounded-full blur-[80px] md:blur-[100px] translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#8FAFEA]/20 rounded-full blur-[80px] md:blur-[100px] -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white tracking-tight leading-tight">
                Siap Mengoptimalkan <br className="hidden md:block" /> Potensi Akademik Anda?
              </h2>
              <p className="text-sm md:text-lg text-[#B88CB2]/80 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                Bergabunglah dengan ribuan mahasiswa lainnya. Bebaskan diri dari hambatan kolaborasi konvensional dan capai target nilai terbaik Anda bersama StudyCircle.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full max-w-[300px] sm:w-auto px-6 py-3.5 md:px-10 md:py-4 rounded-full bg-gradient-to-r from-[#B88CB2] to-[#8FAFEA] hover:opacity-90 text-white font-bold text-sm md:text-lg transition-all shadow-[0_0_30px_rgba(184,140,178,0.4)] hover:shadow-[0_0_40px_rgba(143,175,234,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Daftar Sekarang - Gratis
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. Footer --- */}
      <footer className="py-6 md:py-8 text-center text-xs md:text-sm text-gray-500 border-t border-white/5 bg-[#060913]">
        <p>&copy; {new Date().getFullYear()} StudyCircle. All rights reserved.</p>
      </footer>
    </div>
  );
}
