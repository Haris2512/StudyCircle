import { Link } from 'react-router-dom';
import { Sparkles, Video, Trophy, Smartphone, ArrowRight, BrainCircuit } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-primary-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            StudyCircle
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-bold rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background Decorative Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-secondary-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-primary-300 font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Platform Kolaborasi AI Generasi Baru</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Belajar Bersama,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500">
              Tanpa Hambatan.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Mahasiswa sering susah koordinasi *study group*. StudyCircle hadir untuk mencocokkan grup belajar Anda secara otomatis dengan AI berdasarkan minat, gaya belajar, dan zona waktu.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-500 hover:to-secondary-400 text-white font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(203,166,247,0.3)] hover:shadow-[0_0_40px_rgba(203,166,247,0.5)] flex items-center justify-center gap-2"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-lg transition-all duration-300 flex items-center justify-center"
            >
              Masuk
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-dark-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Solusi Cerdas untuk Koordinasi</h2>
            <p className="text-gray-400">Dirancang khusus untuk kebutuhan akademis mahasiswa modern.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/[0.07] transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Matching</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mencari grup dan menyarankan jadwal pertemuan optimal (AI Scheduling) berdasarkan ketersediaan dan zona waktu anggota.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 hover:bg-white/[0.07] transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Virtual Rooms</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Terintegrasi langsung dengan video call Jitsi Meet. Rapat kelompok tanpa perlu membagikan link pihak ketiga.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07] transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gamifikasi</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dapatkan poin, naikkan level, dan kumpulkan lencana (badges) setiap kali Anda menyelesaikan sesi diskusi.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/[0.07] transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Akses Offline</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mendukung Progressive Web App (PWA). Akses ringkasan materi dan grup Anda meski koneksi internet terputus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 mt-auto">
        <p>&copy; {new Date().getFullYear()} StudyCircle. All rights reserved.</p>
      </footer>
    </div>
  );
}
