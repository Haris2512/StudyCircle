import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, BookOpen, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth.api';
import { FormInput } from '../components/common/FormInput';
import { Button } from '../components/common/Button';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap tidak boleh kosong'),
  username: z.string().min(3, 'Username minimal 3 karakter').max(30, 'Username maksimal 30 karakter'),
  email: z.string().email('Format email tidak valid'),
  semester: z.string().optional(),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setApiError('');
    try {
      const payload = {
        ...data,
        semester: data.semester ? parseInt(data.semester, 10) : undefined,
      };
      const response = await authApi.register(payload);
      if (response.success && response.data) {
        login(response.data); // No token string passed anymore
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'Pendaftaran gagal');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-bg text-white">
      {/* Left Column - Graphic/Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E1E2E] overflow-hidden flex-col justify-between p-12">
        {/* Background Graphic */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/Container.png')` }}
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
            Mulai perjalanan akademismu bersama kami.
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

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Daftar Akun Baru</h2>
            <p className="text-gray-400">Lengkapi data diri Anda untuk bergabung ke StudyCircle.</p>
          </div>

          {apiError && (
            <div role="alert" aria-live="assertive" className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              leadingIcon={<User className="w-5 h-5" />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <FormInput
              label="Username"
              placeholder="pilih_username"
              leadingIcon={<User className="w-5 h-5" />}
              error={errors.username?.message}
              {...register('username')}
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="contoh@kampus.ac.id"
              leadingIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <FormInput
              label="Semester (Opsional)"
              type="number"
              placeholder="Contoh: 3"
              leadingIcon={<BookOpen className="w-5 h-5" />}
              error={errors.semester?.message}
              {...register('semester')}
            />

            <FormInput
              label="Kata Sandi"
              type={showPassword ? "text" : "password"}
              placeholder="Buat kata sandi baru"
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-6"
            >
              {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
              Masuk di sini
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
