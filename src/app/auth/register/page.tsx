"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const result = await register(name, email, password);
      if (result.success) {
        router.push("/account");
      } else {
        setError(result.error || "Kayıt başarısız");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image src="/logo.png" alt="ceepyol" width={200} height={109} className="mix-blend-multiply dark:mix-blend-screen dark:brightness-[2] dark:contrast-125" unoptimized />
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface font-[family-name:var(--font-headline)]">
            Hesap Oluştur
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">ceepyol&apos;a katılın ve alışverişe başlayın</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest dark:bg-surface-container rounded-2xl shadow-xl shadow-black/5 border border-surface-variant/60 p-6 space-y-5">
          {error && (
            <div className="bg-error-container/50 text-on-error-container text-sm font-semibold rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-on-surface mb-1.5 block">Ad Soyad</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/50">
                person
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmet Yılmaz"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface mb-1.5 block">E-posta</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/50">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siz@ornek.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface mb-1.5 block">Şifre</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/50">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                className="w-full pl-10 pr-12 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface mb-1.5 block">Şifreyi Onayla</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/50">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Hesap oluşturuluyor...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Hesap Oluştur
              </>
            )}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
