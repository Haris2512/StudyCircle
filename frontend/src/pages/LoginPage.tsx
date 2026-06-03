import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';
import { FormInput } from '../components/common/FormInput';
import { Button } from '../components/common/Button';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi tidak boleh kosong'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError('');
    try {
      const response = await authApi.login(data);
      if (response.success && response.data) {
        login(response.data); // Token is no longer required due to HTTP-Only Cookie
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'Login gagal');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Terjadi kesalahan saat mencoba masuk');
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-white">
      {/* Left Column - Graphic/Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E1E2E] overflow-hidden flex-col justify-between p-12">
        {/* Background Graphic */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/Artwork.png')` }}
        />

        {/* Top Header / Logo Area */}
        <div className="relative z-20 flex items-center gap-3">
          <img src="/icon.svg" alt="StudyCircle" className="w-8 h-8" />
          <span className="text-2xl font-bold text-white tracking-tight">StudyCircle</span>
        </div>

        {/* Middle / Bottom Marketing Text */}
        <div className="relative z-20 max-w-lg mt-auto mb-16">
          <p className="text-gray-400 font-medium mb-3">Jejaring Edukasi Kolektif</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Kolaborasi tanpa batas, tingkatkan potensi akademik.
          </h1>
          <p className="text-gray-400 text-lg">
            Bergabung dengan ribuan mahasiswa lainnya dalam grup belajar yang dinamis dan terstruktur.
          </p>
        </div>

        {/* Footer Links */}
        <div className="relative z-20 flex items-center justify-between text-sm text-gray-500 font-medium">
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Ketentuan Layanan</a>
            <a href="#" className="hover:text-gray-300">Kebijakan Privasi</a>
            <a href="#" className="hover:text-gray-300">Kontak</a>
          </div>
          <p>© 2024 StudyCircle.</p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Selamat Datang Kembali</h2>
            <p className="text-gray-400">Silakan masukkan detail akun Anda untuk melanjutkan.</p>
          </div>

          {apiError && (
            <div role="alert" aria-live="assertive" className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="Email"
              type="email"
              placeholder="contoh@kampus.ac.id"
              leadingIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <FormInput
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                leadingIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                trailingIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                {...register('password')}
              />
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-sm text-primary-500 hover:text-primary-400">
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4"
            >
              {isSubmitting ? 'Masuk...' : 'Masuk'} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px bg-dark-border flex-1" />
            <span className="text-xs text-gray-500 font-medium tracking-wider">ATAU MASUK DENGAN</span>
            <div className="h-px bg-dark-border flex-1" />
          </div>

          <button
            type="button"
            className="w-full mt-6 bg-dark-card border border-dark-border hover:bg-white/5 transition-colors text-white font-medium py-3 rounded-full flex items-center justify-center gap-3"
            onClick={() => alert("Google Login Not Implemented Yet")}
            aria-label="Masuk dengan Google (belum tersedia)"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">
              Daftar sekarang
            </Link>
          </p>
          
          <div className="lg:hidden mt-12 flex flex-col items-center gap-2 text-xs text-gray-600">
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-400">Ketentuan Layanan</a>
              <a href="#" className="hover:text-gray-400">Kebijakan Privasi</a>
              <a href="#" className="hover:text-gray-400">Kontak</a>
            </div>
            <p>© 2026 StudyCircle</p>
          </div>
        </div>
      </div>
    </div>
  );
};
