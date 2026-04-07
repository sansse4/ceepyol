"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted) {
      void initialize();
    }
  }, [mounted, initialize]);

  useEffect(() => {
    if (mounted && (!isLoggedIn || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [mounted, isLoggedIn, user, router]);

  if (!mounted || !isLoggedIn || user?.role !== "admin") {
    return (
      <div className="fixed inset-0 bg-[#0f1117] flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-white/60 text-sm font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <style jsx global>{`
        .admin-layout + footer { display: none; }
        header { display: none !important; }
        nav.md\\:hidden { display: none !important; }
        main { padding-top: 0 !important; animation: none !important; }
      `}</style>
      {children}
    </div>
  );
}
