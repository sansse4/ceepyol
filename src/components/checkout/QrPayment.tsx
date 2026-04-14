"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Props {
  total: number;
  onProofReady: (file: File) => void;
  onProofRemoved: () => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function QrPayment({ total, onProofReady, onProofRemoved }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Yalnızca PNG, JPG veya WEBP dosyaları kabul edilir.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Maksimum dosya boyutu ${MAX_SIZE_MB} MB'tır.`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onProofReady(file);
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onProofRemoved();
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <h3 className="font-bold text-base flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">qr_code</span>
        Ödemeyi Tamamlamak İçin QR Kodu Okutun
      </h3>

      {/* QR Image */}
      <div className="flex flex-col items-center gap-4 bg-surface-container-low rounded-2xl p-6">
        <p className="text-sm text-on-surface-variant">Ödenecek Tutar</p>
        <p className="text-2xl font-extrabold text-primary">
          ₺{total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
        </p>

        <div className="bg-white rounded-2xl p-1 shadow-md border border-black/10 w-full">
          <Image
            src="/payment/qr-cod.png"
            alt="Binance QR Kodu"
            width={600}
            height={600}
            className="w-full h-auto rounded-xl"
            unoptimized
            priority
          />
        </div>

        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">
          Binance Pay
        </span>
      </div>

      {/* Instructions */}
      <div className="bg-white dark:bg-surface-container rounded-2xl p-5 border border-surface-variant">
        <p className="font-bold text-sm mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">info</span>
          Nasıl Ödeme Yapılır?
        </p>
        <ol className="space-y-2">
          {[
            "Binance uygulamasını veya dijital cüzdanınızı açın",
            "Yukarıdaki QR kodu okutun",
            `İstenen tutarı girin: ₺${total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
            "Ödeme makbuzunun ekran görüntüsünü alın ve aşağıya yükleyin",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Upload Zone */}
      <div>
        <p className="font-bold text-sm mb-2">
          Ödeme Kanıtı Yükle{" "}
          <span className="text-red-500">*</span>
        </p>

        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
              dragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-surface-variant hover:border-primary/50 hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              upload_file
            </span>
            <p className="text-sm font-semibold text-on-surface-variant text-center">
              Görseli buraya sürükleyin veya seçmek için tıklayın
            </p>
            <p className="text-xs text-on-surface-variant/60">
              PNG, JPG, WEBP — Maks. {MAX_SIZE_MB} MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-black/10 shrink-0">
              <Image src={preview} alt="Ödeme Kanıtı" fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="material-symbols-outlined text-green-600 text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                  Görsel Yüklendi
                </p>
              </div>
              <p className="text-xs text-on-surface-variant truncate">{fileName}</p>
            </div>
            <button
              onClick={handleRemove}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              title="Görseli Kaldır"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                close
              </span>
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
