"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// ── Card-brand detection ──────────────────────────────────────────────────────
function detectBrand(num: string): "visa" | "mastercard" | "amex" | "unknown" {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

// ── Brand logos ───────────────────────────────────────────────────────────────
function VisaLogo() {
  return (
    <svg viewBox="0 0 780 500" width="52" height="34" aria-label="Visa">
      <rect width="780" height="500" rx="40" fill="#1a1f71" />
      <text x="390" y="320" textAnchor="middle" fontFamily="Arial"
        fontWeight="900" fontSize="240" fill="white" letterSpacing="-10">VISA</text>
    </svg>
  );
}
function MastercardLogo() {
  return (
    <svg viewBox="0 0 152 108" width="52" height="34" aria-label="Mastercard">
      <circle cx="54" cy="54" r="54" fill="#eb001b" />
      <circle cx="98" cy="54" r="54" fill="#f79e1b" />
      <path d="M76 22a54 54 0 0 1 0 64 54 54 0 0 1 0-64z" fill="#ff5f00" />
    </svg>
  );
}
function AmexLogo() {
  return (
    <svg viewBox="0 0 780 500" width="52" height="34" aria-label="Amex">
      <rect width="780" height="500" rx="40" fill="#2e77bc" />
      <text x="390" y="340" textAnchor="middle" fontFamily="Arial"
        fontWeight="900" fontSize="200" fill="white">AMEX</text>
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
      <rect x="1" y="1" width="42" height="32" rx="5" fill="url(#chip2)" stroke="#b8860b" strokeWidth="1" />
      <rect x="14" y="1" width="2" height="32" fill="#b8860b" opacity=".4" />
      <rect x="28" y="1" width="2" height="32" fill="#b8860b" opacity=".4" />
      <rect x="1" y="11" width="42" height="2" fill="#b8860b" opacity=".4" />
      <rect x="1" y="21" width="42" height="2" fill="#b8860b" opacity=".4" />
      <rect x="16" y="9" width="12" height="16" rx="2" fill="url(#chipCenter2)" stroke="#b8860b" strokeWidth=".8" />
      <defs>
        <linearGradient id="chip2" x1="0" y1="0" x2="44" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8d48b" /><stop offset="1" stopColor="#c9a84c" />
        </linearGradient>
        <linearGradient id="chipCenter2" x1="16" y1="9" x2="28" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4b86a" /><stop offset="1" stopColor="#a07830" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Payment {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}
interface Props {
  payment: Payment;
  setPayment: (p: Payment) => void;
}

const brandGradients: Record<string, string> = {
  visa:       "linear-gradient(135deg,#1a1f71 0%,#276eb5 60%,#1a9bde 100%)",
  mastercard: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  amex:       "linear-gradient(135deg,#1a6898 0%,#2e77bc 50%,#56b4d3 100%)",
  unknown:    "linear-gradient(135deg,#1a1a2a 0%,#2d2d44 50%,#3d3d5c 100%)",
};

// ── The actual form (rendered inside the modal) ───────────────────────────────
function CardFormFields({
  payment, setPayment, onClose,
}: { payment: Payment; setPayment: (p: Payment) => void; onClose: () => void }) {
  const [cvvFocused, setCvvFocused] = useState(false);
  const [focused, setFocused] = useState<keyof Payment | null>(null);

  const brand = detectBrand(payment.cardNumber);

  const formatCardDisplay = (raw: string) => {
    const d = raw.replace(/\s/g, "");
    if (!d) return "•••• •••• •••• ••••";
    if (brand === "amex") {
      return `${d.slice(0,4) || "••••"} ${d.slice(4,10) || "••••••"} ${d.slice(10,15) || "•••••"}`;
    }
    return [0,4,8,12].map((i) => (d.slice(i,i+4)||"").padEnd(4,"•")).join(" ");
  };

  function handleCardNumber(raw: string) {
    const digits = raw.replace(/\D/g,"").slice(0, brand==="amex"?15:16);
    let f: string;
    if (brand==="amex" || /^3[47]/.test(digits)) {
      f = digits.replace(/(\d{4})(\d{0,6})(\d{0,5})/,(_,a,b,c)=>[a,b,c].filter(Boolean).join(" "));
    } else {
      f = digits.replace(/(\d{4})(?=\d)/g,"$1 ").trim();
    }
    setPayment({...payment, cardNumber: f});
  }
  function handleExpiry(raw: string) {
    const d = raw.replace(/\D/g,"").slice(0,4);
    setPayment({...payment, expiry: d.length>=3 ? d.slice(0,2)+"/"+d.slice(2,4) : d});
  }
  function handleCvv(raw: string) {
    setPayment({...payment, cvv: raw.replace(/\D/g,"").slice(0,brand==="amex"?4:3)});
  }

  const isFoc = (f: keyof Payment) => focused === f;
  const hasVal = (f: keyof Payment) => !!payment[f];

  return (
    <>
      <style>{`
        .scm-overlay {
          position:fixed;inset:0;z-index:10000;
          background:rgba(0,0,0,.55);
          display:flex;align-items:center;justify-content:center;
          padding:16px;
          animation:scm-fadein .2s ease;
        }
        @keyframes scm-fadein{from{opacity:0}to{opacity:1}}
        .scm-modal {
          background:#fff;
          border-radius:24px;
          width:100%;max-width:460px;
          box-shadow:0 32px 80px rgba(0,0,0,.35);
          animation:scm-slidein .25s cubic-bezier(.4,0,.2,1);
          overflow:hidden;
        }
        .dark .scm-modal{background:#1a1d2e;}
        @keyframes scm-slidein{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}
        .scm-header{
          padding:22px 24px 16px;
          border-bottom:1px solid #f1f5f9;
          display:flex;align-items:center;justify-content:space-between;
        }
        .dark .scm-header{border-color:#2d3148;}
        .scm-body{padding:20px 24px 24px;}
        .scm-field{position:relative;transition:all .2s;}
        .scm-field input{
          width:100%;
          border:1.5px solid #e2e8f0;
          border-radius:10px;
          padding:22px 14px 8px;
          font-size:15px;font-weight:500;
          background:#fff;color:#1a1a2e;
          outline:none;
          transition:border-color .2s,box-shadow .2s;
          letter-spacing:.5px;
          font-family:inherit;
          box-sizing:border-box;
        }
        .dark .scm-field input{background:#1e2130;border-color:#2d3148;color:#e8eaf6;}
        .scm-field input:focus{
          border-color:#635bff;
          box-shadow:0 0 0 3px rgba(99,91,255,.12);
        }
        .dark .scm-field input:focus{border-color:#7c74ff;box-shadow:0 0 0 3px rgba(124,116,255,.15);}
        .scm-label{
          position:absolute;left:14px;top:50%;
          transform:translateY(-50%);
          font-size:14px;color:#94a3b8;
          pointer-events:none;
          transition:all .18s;
        }
        .scm-label.up{
          top:9px;transform:none;
          font-size:10px;font-weight:700;
          color:#635bff;letter-spacing:.5px;text-transform:uppercase;
        }
        .dark .scm-label.up{color:#7c74ff;}
        .scm-row{display:flex;gap:12px;}
        .scm-card-wrap{perspective:1000px;margin-bottom:20px;}
        .scm-card-inner{
          position:relative;width:100%;max-width:380px;height:200px;
          margin:0 auto;transform-style:preserve-3d;
          transition:transform .65s cubic-bezier(.4,0,.2,1);
        }
        .scm-card-inner.flipped{transform:rotateY(180deg);}
        .scm-card-face{
          position:absolute;inset:0;backface-visibility:hidden;
          border-radius:16px;
          box-shadow:0 20px 50px rgba(0,0,0,.3),0 4px 12px rgba(0,0,0,.2);
          overflow:hidden;padding:22px 24px;
          display:flex;flex-direction:column;justify-content:space-between;
        }
        .scm-card-back{transform:rotateY(180deg);}
        .scm-shine{
          position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.06) 40%,transparent 70%);
          pointer-events:none;
        }
        .scm-num{
          font-size:18px;font-weight:700;letter-spacing:2.5px;
          color:rgba(255,255,255,.92);font-family:'Courier New',monospace;
          text-shadow:0 1px 3px rgba(0,0,0,.3);
        }
        @keyframes scm-blink{0%,100%{opacity:1}50%{opacity:.3}}
        .scm-cursor{
          display:inline-block;width:2px;height:1em;
          background:rgba(255,255,255,.8);margin-left:2px;
          vertical-align:text-bottom;animation:scm-blink .9s infinite;
        }
        .scm-close-btn{
          width:32px;height:32px;border-radius:50%;border:none;
          background:#f1f5f9;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          color:#64748b;transition:background .15s;
        }
        .scm-close-btn:hover{background:#e2e8f0;}
        .dark .scm-close-btn{background:#2d3148;color:#94a3b8;}
        .dark .scm-close-btn:hover{background:#3d4160;}
        .scm-confirm-btn{
          width:100%;padding:15px;
          background:linear-gradient(135deg,#635bff,#7c74ff);
          color:#fff;border:none;border-radius:12px;
          font-size:15px;font-weight:700;cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:transform .15s,box-shadow .15s;
          margin-top:20px;
          box-shadow:0 4px 16px rgba(99,91,255,.35);
        }
        .scm-confirm-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,91,255,.45);}
        .scm-confirm-btn:active{transform:none;}
        .scm-badges{
          display:flex;align-items:center;justify-content:center;
          gap:16px;margin-top:14px;
        }
        .scm-badge{display:flex;align-items:center;gap:4px;}
      `}</style>

      {/* 3-D Card */}
      <div className="scm-card-wrap">
        <div className={`scm-card-inner${cvvFocused ? " flipped" : ""}`}>
          {/* FRONT */}
          <div className="scm-card-face" style={{background:brandGradients[brand]}}>
            <div className="scm-shine"/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <ChipIcon/>
              {brand==="visa"       && <VisaLogo/>}
              {brand==="mastercard" && <MastercardLogo/>}
              {brand==="amex"       && <AmexLogo/>}
            </div>
            <div className="scm-num">
              {formatCardDisplay(payment.cardNumber)}
              {isFoc("cardNumber") && <span className="scm-cursor"/>}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,.5)",letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Kart Sahibi</div>
                <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.9)",letterSpacing:1,fontFamily:"monospace"}}>
                  {payment.nameOnCard.trim() ? payment.nameOnCard.toUpperCase() : "AD SOYAD"}
                  {isFoc("nameOnCard") && <span className="scm-cursor"/>}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,.5)",letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Son. Tar.</div>
                <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.9)",letterSpacing:1,fontFamily:"monospace"}}>
                  {payment.expiry||"AA/YY"}
                  {isFoc("expiry") && <span className="scm-cursor"/>}
                </div>
              </div>
            </div>
          </div>
          {/* BACK */}
          <div className="scm-card-face scm-card-back" style={{background:brandGradients[brand]}}>
            <div className="scm-shine"/>
            <div style={{position:"absolute",top:32,left:0,right:0,height:40,background:"rgba(0,0,0,.6)"}}/>
            <div style={{position:"absolute",top:88,left:24,right:24}}>
              <div style={{background:"rgba(255,255,255,.9)",height:38,borderRadius:6,
                display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:12,gap:6}}>
                <span style={{fontSize:8,color:"#64748b",fontStyle:"italic",marginRight:"auto",paddingLeft:10}}>Yetkili İmza</span>
                <span style={{fontFamily:"monospace",fontWeight:800,fontSize:17,color:"#1a1a2e",letterSpacing:3}}>
                  {payment.cvv||"•••"}
                </span>
              </div>
              <div style={{textAlign:"right",marginTop:5,fontSize:10,color:"rgba(255,255,255,.65)",fontWeight:600}}>CVV</div>
            </div>
            <div style={{position:"absolute",bottom:18,right:20}}>
              {brand==="visa"&&<VisaLogo/>}{brand==="mastercard"&&<MastercardLogo/>}{brand==="amex"&&<AmexLogo/>}
            </div>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {/* Card Number */}
        <div className="scm-field">
          <input
            id="scm-number" type="text" inputMode="numeric"
            autoComplete="off" autoCorrect="off" spellCheck={false}
            value={payment.cardNumber}
            maxLength={brand==="amex"?17:19}
            onChange={(e)=>handleCardNumber(e.target.value)}
            onFocus={()=>setFocused("cardNumber")}
            onBlur={()=>setFocused(null)}
            placeholder=" "
          />
          <label className={`scm-label${isFoc("cardNumber")||hasVal("cardNumber")?" up":""}`} htmlFor="scm-number">
            Kart Numarası
          </label>
          {brand!=="unknown"&&(
            <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)"}}>
              {brand==="visa"&&<VisaLogo/>}{brand==="mastercard"&&<MastercardLogo/>}{brand==="amex"&&<AmexLogo/>}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="scm-field">
          <input
            id="scm-name" type="text"
            autoComplete="off" autoCorrect="off" spellCheck={false}
            value={payment.nameOnCard}
            onChange={(e)=>setPayment({...payment,nameOnCard:e.target.value})}
            onFocus={()=>setFocused("nameOnCard")}
            onBlur={()=>setFocused(null)}
            placeholder=" "
          />
          <label className={`scm-label${isFoc("nameOnCard")||hasVal("nameOnCard")?" up":""}`} htmlFor="scm-name">
            Kart Üzerindeki İsim
          </label>
        </div>

        {/* Expiry + CVV */}
        <div className="scm-row">
          <div className="scm-field" style={{flex:1}}>
            <input
              id="scm-expiry" type="text" inputMode="numeric"
              autoComplete="off"
              value={payment.expiry} maxLength={5}
              onChange={(e)=>handleExpiry(e.target.value)}
              onFocus={()=>setFocused("expiry")}
              onBlur={()=>setFocused(null)}
              placeholder=" "
            />
            <label className={`scm-label${isFoc("expiry")||hasVal("expiry")?" up":""}`} htmlFor="scm-expiry">
              AA / YY
            </label>
          </div>
          <div className="scm-field" style={{width:110}}>
            <input
              id="scm-cvv" type="password" inputMode="numeric"
              autoComplete="off"
              value={payment.cvv}
              maxLength={brand==="amex"?4:3}
              onChange={(e)=>handleCvv(e.target.value)}
              onFocus={()=>{setCvvFocused(true);setFocused("cvv");}}
              onBlur={()=>{setCvvFocused(false);setFocused(null);}}
              placeholder=" "
            />
            <label className={`scm-label${isFoc("cvv")||hasVal("cvv")?" up":""}`} htmlFor="scm-cvv">
              CVV
            </label>
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <button className="scm-confirm-btn" onClick={onClose}>
        <span className="material-symbols-outlined" style={{fontSize:18}}>check_circle</span>
        Kart Bilgilerini Kaydet
      </button>

      {/* Security badges */}
      <div className="scm-badges">
        {[{icon:"lock",label:"256-bit SSL"},{icon:"verified_user",label:"3D Secure"},{icon:"shield",label:"PCI-DSS"}]
          .map(({icon,label})=>(
          <div key={label} className="scm-badge">
            <span className="material-symbols-outlined" style={{fontSize:13,color:"#22c55e"}}>{icon}</span>
            <span style={{fontSize:10,fontWeight:600,color:"#94a3b8",letterSpacing:.3}}>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main exported component ────────────────────────────────────────────────────
export default function StripeCardForm({ payment, setPayment }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const brand = detectBrand(payment.cardNumber);
  const hasData = !!(payment.cardNumber || payment.nameOnCard || payment.expiry || payment.cvv);

  // Format masked number for the trigger button
  const maskedNum = payment.cardNumber
    ? payment.cardNumber.replace(/\d(?=\d{4})/g,"•")
    : null;

  return (
    <div style={{marginTop:16}}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={()=>setOpen(true)}
        style={{
          width:"100%",
          padding:"16px 20px",
          background:"#f8fafc",
          border:"2px dashed #cbd5e1",
          borderRadius:14,
          cursor:"pointer",
          display:"flex",alignItems:"center",gap:14,
          transition:"all .2s",
          textAlign:"left",
        }}
        onMouseEnter={(e)=>{
          (e.currentTarget as HTMLButtonElement).style.borderColor="#635bff";
          (e.currentTarget as HTMLButtonElement).style.background="#f5f3ff";
        }}
        onMouseLeave={(e)=>{
          (e.currentTarget as HTMLButtonElement).style.borderColor="#cbd5e1";
          (e.currentTarget as HTMLButtonElement).style.background="#f8fafc";
        }}
      >
        <div style={{
          width:44,height:44,borderRadius:10,
          background: hasData ? brandGradients[brand] : "linear-gradient(135deg,#635bff,#7c74ff)",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 12px rgba(99,91,255,.3)",
          flexShrink:0,
        }}>
          <span className="material-symbols-outlined" style={{color:"#fff",fontSize:22}}>
            {hasData ? "credit_card" : "add_card"}
          </span>
        </div>
        <div style={{flex:1}}>
          {hasData ? (
            <>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a2e"}}>
                {payment.nameOnCard || "Kart Sahibi"}&nbsp;
                {brand!=="unknown" && (
                  <span style={{
                    fontSize:11,fontWeight:600,
                    padding:"2px 6px",borderRadius:4,
                    background:"#f1f5f9",color:"#635bff",
                    textTransform:"uppercase",
                  }}>{brand}</span>
                )}
              </div>
              <div style={{fontSize:13,color:"#64748b",fontFamily:"monospace",marginTop:2,letterSpacing:1}}>
                {maskedNum}
              </div>
            </>
          ) : (
            <>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a2e"}}>Kart Bilgilerini Gir</div>
              <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Visa, Mastercard, AMEX</div>
            </>
          )}
        </div>
        <span className="material-symbols-outlined" style={{color:"#94a3b8",fontSize:20}}>
          {hasData ? "edit" : "chevron_right"}
        </span>
      </button>

      {/* ── Modal portal ── */}
      {mounted && open && createPortal(
        <div
          className="scm-overlay"
          onClick={(e)=>{ if(e.target===e.currentTarget) setOpen(false); }}
        >
          <div className="scm-modal">
            <div className="scm-header">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  width:32,height:32,borderRadius:8,
                  background:"linear-gradient(135deg,#635bff,#7c74ff)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  <span className="material-symbols-outlined" style={{color:"#fff",fontSize:16}}>lock</span>
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:"#1a1a2e"}}>Kart Bilgileri</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>Güvenli ve şifreli bağlantı</div>
                </div>
              </div>
              <button className="scm-close-btn" onClick={()=>setOpen(false)} aria-label="Kapat">
                <span className="material-symbols-outlined" style={{fontSize:18}}>close</span>
              </button>
            </div>
            <div className="scm-body">
              <CardFormFields payment={payment} setPayment={setPayment} onClose={()=>setOpen(false)}/>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
