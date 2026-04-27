"use client";

import { useState, useRef } from "react";
import {
  X, UploadCloud, ScanLine, Info, ShieldCheck, CheckCircle2,
  ChevronDown, UserPlus, ArrowRight, FileImage, Check, Hash,
  MapPin, ChevronLeft, Trophy, Sparkles, Keyboard, CreditCard,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

const MOCK_ATHLETE = {
  name: "Rizky Ridho",
  nik: "3578012345678901",
  dob: "21 Nov 2001",
  age: 24,
  gender: "Laki-laki",
  address: "Jl. Raya Darmo No.12, Surabaya",
  province: "Jawa Timur",
  photo: "https://images.unsplash.com/photo-1612153110544-072aa892ba48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZG9uZXNpYW4lMjBtYWxlJTIwYXRobGV0ZSUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDc4MzA3fDA&ixlib=rb-4.1.0&q=80&w=400",
};

const TEAMS = ["Surabaya", "Malang", "Sidoarjo", "Gresik", "Mojokerto", "Pasuruan", "Banyuwangi", "Jember"];
const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger", "Striker"];

interface AddAthleteModalProps {
  onClose: () => void;
}

function SkeletonBlock({ width, height = "h-3" }: { width: string; height?: string }) {
  return (
    <div className={`${height} ${width} rounded-full`}
      style={{ background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.8s infinite" }}
    />
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Input Data" },
    { n: 2, label: "Verify" },
    { n: 3, label: "Add to Roster" },
  ];
  return (
    <div className="flex items-center gap-0 mt-4 pl-9">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className="flex items-center gap-0">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: done ? "#16a34a" : active ? "#2563eb" : "#e2e8f0" }}
              >
                {done
                  ? <Check size={10} className="text-white" strokeWidth={3} />
                  : <span className="text-white" style={{ fontSize: "10px", fontWeight: 700 }}>{s.n}</span>
                }
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: active ? 600 : 500,
                  color: done ? "#16a34a" : active ? "#2563eb" : "#94a3b8",
                  transition: "color 0.3s",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px w-6 flex-shrink-0 transition-all duration-300"
                style={{ backgroundColor: step > s.n ? "#16a34a" : "#e2e8f0" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function KtpThumbnail({ src }: { src: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-md shrink-0"
      style={{ width: "140px", height: "90px", background: "linear-gradient(135deg,#0a2a6e 0%,#1a4aae 60%,#0f3a8a 100%)" }}>
      <div className="absolute top-0 left-0 right-0 h-[14px] flex items-center gap-1 px-2"
        style={{ background: "rgba(255,255,255,0.07)" }}>
        <div className="flex gap-px items-center">
          <div style={{ width: "5px", height: "8px", background: "#e00", borderRadius: "1px" }} />
          <div style={{ width: "5px", height: "8px", background: "#fff", borderRadius: "1px" }} />
        </div>
        <span style={{ fontFamily: "Inter", fontSize: "4.5px", color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.04em" }}>REPUBLIK INDONESIA</span>
      </div>
      <div className="absolute top-[16px] left-2">
        <span style={{ fontFamily: "Inter", fontSize: "4px", color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.08em" }}>KARTU TANDA PENDUDUK</span>
      </div>
      <div className="absolute rounded overflow-hidden" style={{ top: "20px", left: "6px", width: "26px", height: "32px", border: "1px solid rgba(255,255,255,0.2)" }}>
        <ImageWithFallback src={src} alt="KTP" className="w-full h-full object-cover" />
      </div>
      <div className="absolute flex flex-col gap-[3px]" style={{ top: "20px", left: "38px", right: "5px" }}>
        {[
          { l: "NIK", v: "3578 0123 4567 8901", mono: true },
          { l: "Nama", v: "RIZKY RIDHO" },
          { l: "TTL", v: "Surabaya, 21-11-2001" },
          { l: "JK", v: "Laki-laki" },
        ].map(r => (
          <div key={r.l} className="flex gap-0.5">
            <span style={{ fontFamily: "Inter", fontSize: "3.5px", color: "rgba(255,255,255,0.5)", minWidth: "12px" }}>{r.l}</span>
            <span style={{ fontFamily: r.mono ? "JetBrains Mono, monospace" : "Inter", fontSize: "3.5px", color: "rgba(255,255,255,0.9)", fontWeight: r.mono ? 600 : 400 }}>{r.v}</span>
          </div>
        ))}
      </div>
      <div className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,#22c55e,#4ade80,#22c55e,transparent)", boxShadow: "0 0 5px 2px rgba(34,197,94,0.45)", animation: "ktpScan 2.2s ease-in-out infinite", top: "50%" }}
      />
      {["top-1 left-1 border-t border-l", "top-1 right-1 border-t border-r", "bottom-1 left-1 border-b border-l", "bottom-1 right-1 border-b border-r"].map((c, i) => (
        <div key={i} className={`absolute w-2.5 h-2.5 border-green-400 ${c}`} style={{ borderWidth: "1.5px" }} />
      ))}
    </div>
  );
}

function Step1Upload({
  isDragging, onDragOver, onDragLeave, onDrop, onFileSelect, fileRef, fileName, isScanning, scanProgress,
}: {
  isDragging: boolean; onDragOver: (e: React.DragEvent) => void; onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void; onFileSelect: () => void;
  fileRef: React.RefObject<HTMLInputElement>; fileName: string | null;
  isScanning: boolean; scanProgress: number;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-gray-500 mb-2" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
          KTP / NATIONAL ID CARD
        </label>
        <div
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          onClick={!isScanning ? onFileSelect : undefined}
          className="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 select-none overflow-hidden"
          style={{
            backgroundColor: isScanning ? "#f0fdf4" : isDragging ? "#eff6ff" : "#F8FAFC",
            border: `2px dashed ${isScanning ? "#22c55e" : isDragging ? "#2563eb" : "#93c5fd"}`,
            minHeight: "184px", padding: "28px 24px",
            cursor: isScanning ? "default" : "pointer",
            boxShadow: isDragging ? "0 0 0 4px rgba(37,99,235,0.08)" : isScanning ? "0 0 0 4px rgba(34,197,94,0.08)" : "none",
          }}
        >
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden"
            onChange={(e) => e.target.files?.length && onFileSelect()} />

          {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map(pos => (
            <div key={pos} className={`absolute w-1.5 h-1.5 rounded-full ${pos}`}
              style={{ backgroundColor: isScanning ? "#22c55e" : isDragging ? "#2563eb" : "#bfdbfe" }} />
          ))}

          {isScanning ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "1.5px solid #86efac" }}>
                <ScanLine size={26} strokeWidth={1.5} className="text-emerald-600" style={{ animation: "pulse 1s infinite" }} />
              </div>
              <div className="text-center">
                <p className="text-gray-700 mb-0.5" style={{ fontSize: "14px", fontWeight: 700 }}>OCR Processing...</p>
                <p className="text-gray-400" style={{ fontSize: "12px" }}>Extracting data from KTP image</p>
              </div>
              <div className="w-full max-w-[200px]">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${scanProgress}%`, background: "linear-gradient(90deg,#22c55e,#16a34a)" }} />
                </div>
                <p className="text-center text-emerald-600 mt-1.5" style={{ fontSize: "10px", fontWeight: 600 }}>{scanProgress}%</p>
              </div>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1.5px solid #bfdbfe" }}>
                <FileImage size={26} strokeWidth={1.5} className="text-blue-500" />
              </div>
              <p className="text-gray-700 text-center" style={{ fontSize: "13px", fontWeight: 600 }}>{fileName}</p>
              <span className="px-2 py-0.5 rounded-md text-emerald-700" style={{ backgroundColor: "#dcfce7", fontSize: "10px", fontWeight: 600 }}>Ready to extract</span>
            </div>
          ) : (
            <>
              <div className="upload-icon-float flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1.5px solid #bfdbfe" }}>
                <UploadCloud size={28} strokeWidth={1.5} style={{ color: isDragging ? "#1d4ed8" : "#2563eb" }} />
              </div>
              <p className="text-gray-700 mb-1 text-center" style={{ fontSize: "15px", fontWeight: 700 }}>
                {isDragging ? "Release to upload KTP" : "Drag & Drop KTP Image Here"}
              </p>
              <p className="text-center mb-3" style={{ fontSize: "13px" }}>
                <span className="text-gray-400">or </span>
                <span className="text-[#2563eb]" style={{ fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  click to browse files
                </span>
              </p>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {["JPG", "PNG"].map(fmt => (
                  <span key={fmt} className="px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "10px", fontWeight: 700 }}>{fmt}</span>
                ))}
                <span className="text-gray-300 mx-0.5" style={{ fontSize: "10px" }}>·</span>
                <span className="text-gray-400" style={{ fontSize: "10px" }}>Max 5 MB</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-start gap-2 mt-2.5 px-1">
          <Info size={12} className="text-gray-300 shrink-0 mt-0.5" />
          <p className="text-gray-400" style={{ fontSize: "11px", lineHeight: 1.6 }}>
            Make sure the <span className="text-gray-500 font-medium">NIK</span> and{" "}
            <span className="text-gray-500 font-medium">Name</span> are clearly readable. OCR accuracy depends on photo quality.
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <label className="text-gray-300" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>EXTRACTED DATA</label>
          <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: "#f1f5f9", color: "#94a3b8", fontSize: "10px", fontWeight: 600 }}>
            {isScanning ? "Scanning..." : "Waiting for upload..."}
          </span>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", opacity: isScanning ? 0.85 : 0.55 }}>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-[64px] h-[64px] rounded-xl"
              style={{ background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.8s infinite" }} />
            <div className="flex-1 flex flex-col gap-3 pt-1">
              <div className="flex flex-col gap-1.5"><SkeletonBlock width="w-10" height="h-2" /><SkeletonBlock width="w-36" height="h-4" /></div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-2 flex flex-col gap-1.5"><SkeletonBlock width="w-6" height="h-2" /><SkeletonBlock width="w-44" height="h-3.5" /></div>
                <div className="flex flex-col gap-1.5"><SkeletonBlock width="w-16" height="h-2" /><SkeletonBlock width="w-24" height="h-3" /></div>
                <div className="flex flex-col gap-1.5"><SkeletonBlock width="w-12" height="h-2" /><SkeletonBlock width="w-14" height="h-3" /></div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100"><SkeletonBlock width="w-52" height="h-6" /></div>
        </div>
      </div>
    </div>
  );
}

function Step2Verify({ onConfirm: _onConfirm, onBack: _onBack }: { onConfirm: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-gray-500 mb-2" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
          KTP SCAN RESULT
        </label>
        <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-200" style={{ backgroundColor: "#f0fdf4" }}>
          <KtpThumbnail src={MOCK_ATHLETE.photo} />
          <div className="flex flex-col gap-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl self-start"
              style={{ backgroundColor: "#16a34a" }}>
              <CheckCircle2 size={14} strokeWidth={2.5} className="text-white" />
              <span className="text-white" style={{ fontSize: "12px", fontWeight: 700 }}>OCR Scan Complete</span>
            </div>
            <p className="text-emerald-700" style={{ fontSize: "12px", fontWeight: 500 }}>Data successfully extracted.</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-400" style={{ fontSize: "11px" }}>Verified · Read-only</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-500 mb-2" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
          EXTRACTED ATHLETE DATA
          <span className="ml-2 px-1.5 py-0.5 rounded text-gray-400" style={{ backgroundColor: "#f1f5f9", fontSize: "9px", fontWeight: 600, letterSpacing: "0.04em" }}>LOCKED · OCR VERIFIED</span>
        </label>
        <div className="rounded-xl p-4 flex items-start gap-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #e2e8f0" }}>
          <div className="shrink-0 relative">
            <ImageWithFallback src={MOCK_ATHLETE.photo} alt={MOCK_ATHLETE.name}
              className="w-[68px] h-[68px] rounded-xl object-cover shadow ring-2 ring-white" />
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-white">
              <ShieldCheck size={10} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 mb-0.5" style={{ fontSize: "17px", fontWeight: 700 }}>{MOCK_ATHLETE.name}</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg mb-3"
              style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: 600 }}>
              <ShieldCheck size={11} strokeWidth={2.5} />
              Verified via National Database
            </span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <div className="col-span-2">
                <p className="text-gray-400 mb-0.5" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>NIK</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-lg" style={{ backgroundColor: "#e2e8f0" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#334155", letterSpacing: "0.08em", fontWeight: 500 }}>
                    {MOCK_ATHLETE.nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4")}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>DATE OF BIRTH</p>
                <p className="text-gray-700" style={{ fontSize: "13px", fontWeight: 500 }}>
                  {MOCK_ATHLETE.dob} <span className="text-gray-400" style={{ fontWeight: 400 }}>(Age: {MOCK_ATHLETE.age})</span>
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>GENDER</p>
                <p className="text-gray-700" style={{ fontSize: "13px", fontWeight: 500 }}>{MOCK_ATHLETE.gender}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-0.5" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>ADDRESS</p>
                <div className="flex items-start gap-1">
                  <MapPin size={11} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-gray-600" style={{ fontSize: "12px" }}>{MOCK_ATHLETE.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-300 mt-2 px-1" style={{ fontSize: "11px" }}>
          ⚠️ Data above is locked. If there's a mismatch, please re-upload a clearer KTP photo.
        </p>
      </div>
    </div>
  );
}

function Step3AddRoster({
  selectedTeam, setSelectedTeam, jerseyNumber, setJerseyNumber,
  selectedPosition, setSelectedPosition,
}: {
  selectedTeam: string; setSelectedTeam: (v: string) => void;
  jerseyNumber: string; setJerseyNumber: (v: string) => void;
  selectedPosition: string; setSelectedPosition: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200" style={{ backgroundColor: "#f0fdf4" }}>
        <ImageWithFallback src={MOCK_ATHLETE.photo} alt={MOCK_ATHLETE.name}
          className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-gray-900" style={{ fontSize: "14px", fontWeight: 700 }}>{MOCK_ATHLETE.name}</p>
          <p className="text-gray-400" style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.04em" }}>
            {MOCK_ATHLETE.nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4")}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg shrink-0"
          style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "10px", fontWeight: 700 }}>
          <ShieldCheck size={10} strokeWidth={2.5} /> Verified
        </span>
      </div>

      <div>
        <label className="block text-gray-600 mb-1.5" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
          TEAM / CONTINGENT <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}
            className="w-full h-11 rounded-xl border bg-white px-4 pr-9 text-gray-800 appearance-none outline-none transition-all cursor-pointer"
            style={{ fontSize: "14px", fontWeight: 500, borderColor: selectedTeam ? "#2563eb" : "#e2e8f0", boxShadow: selectedTeam ? "0 0 0 3px rgba(37,99,235,0.08)" : "none" }}>
            <option value="">Select Team / Contingent</option>
            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-600 mb-1.5" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>POSITION</label>
          <div className="relative">
            <select value={selectedPosition} onChange={e => setSelectedPosition(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 pr-8 text-gray-700 appearance-none outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all cursor-pointer"
              style={{ fontSize: "13px" }}>
              <option value="">Select...</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-gray-600 mb-1.5" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
            JERSEY NO. <span className="text-gray-300">(Optional)</span>
          </label>
          <div className="relative">
            <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input type="number" min={1} max={99} placeholder="e.g. 10"
              value={jerseyNumber} onChange={e => setJerseyNumber(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-8 pr-4 text-gray-700 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all"
              style={{ fontSize: "14px", fontWeight: 600 }} />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-blue-600" style={{ fontSize: "11px", lineHeight: 1.6 }}>
          The athlete will be added to the <span style={{ fontWeight: 700 }}>Football (Men's 11v11)</span> roster under{" "}
          <span style={{ fontWeight: 700 }}>Unesa Cup 2026</span>. This action will count towards the team's registration quota.
        </p>
      </div>
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-4">
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full bg-emerald-50" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full"
          style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 8px 24px rgba(34,197,94,0.35)" }}>
          <Check size={36} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-gray-900 mb-1" style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "24px", fontWeight: 700 }}>
          Athlete Added!
        </h3>
        <p className="text-gray-500" style={{ fontSize: "13px" }}>
          <span style={{ fontWeight: 600 }}>{MOCK_ATHLETE.name}</span> has been successfully registered to the Football roster.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontSize: "12px", fontWeight: 600 }}>
          ⚽ Football (Men's 11v11)
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "12px", fontWeight: 600 }}>
          🏆 Unesa Cup 2026
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <Trophy size={13} className="text-amber-400" />
        <span className="text-gray-400" style={{ fontSize: "11px" }}>
          Total Athletes: <span style={{ fontWeight: 600, color: "#2563eb" }}>225 / 250</span>
        </span>
      </div>
      <button onClick={onClose}
        className="mt-2 w-full h-11 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", fontSize: "14px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
        Close & Return to Roster
      </button>
    </div>
  );
}

export interface ManualForm {
  nik: string;
  fullName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  address: string;
  maritalStatus: string;
  occupation: string;
  citizenship: string;
}

const RELIGIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
const MARITAL = ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-gray-600 mb-1.5" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );
}

const INPUT_CLS = "w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-gray-800 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all";
const INPUT_STYLE: React.CSSProperties = { fontSize: "14px", fontWeight: 500 };

function Step1ManualEntry({
  form, setForm,
}: {
  form: ManualForm;
  setForm: (patch: Partial<ManualForm>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel required>NIK (NATIONAL ID NUMBER)</FieldLabel>
        <input
          type="text" inputMode="numeric" maxLength={16}
          placeholder="16-digit number"
          value={form.nik}
          onChange={e => setForm({ nik: e.target.value.replace(/\D/g, "").slice(0, 16) })}
          className={INPUT_CLS}
          style={{ ...INPUT_STYLE, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em" }}
        />
      </div>
      <div>
        <FieldLabel required>FULL NAME</FieldLabel>
        <input
          type="text" placeholder="As shown on KTP"
          value={form.fullName}
          onChange={e => setForm({ fullName: e.target.value })}
          className={INPUT_CLS} style={INPUT_STYLE}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>PLACE OF BIRTH</FieldLabel>
          <input
            type="text" placeholder="e.g. Surabaya"
            value={form.placeOfBirth}
            onChange={e => setForm({ placeOfBirth: e.target.value })}
            className={INPUT_CLS} style={INPUT_STYLE}
          />
        </div>
        <div>
          <FieldLabel required>DATE OF BIRTH</FieldLabel>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={e => setForm({ dateOfBirth: e.target.value })}
            className={INPUT_CLS} style={INPUT_STYLE}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>GENDER</FieldLabel>
          <div className="relative">
            <select
              value={form.gender}
              onChange={e => setForm({ gender: e.target.value })}
              className={`${INPUT_CLS} appearance-none pr-9 cursor-pointer`} style={INPUT_STYLE}
            >
              <option value="">Select...</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <FieldLabel required>RELIGION</FieldLabel>
          <div className="relative">
            <select
              value={form.religion}
              onChange={e => setForm({ religion: e.target.value })}
              className={`${INPUT_CLS} appearance-none pr-9 cursor-pointer`} style={INPUT_STYLE}
            >
              <option value="">Select...</option>
              {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div>
        <FieldLabel required>FULL ADDRESS</FieldLabel>
        <textarea
          rows={3}
          placeholder="Street, RT/RW, Kelurahan, Kecamatan, City, Province"
          value={form.address}
          onChange={e => setForm({ address: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-800 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all resize-none"
          style={{ ...INPUT_STYLE, minHeight: "80px", lineHeight: 1.5 }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>MARITAL STATUS</FieldLabel>
          <div className="relative">
            <select
              value={form.maritalStatus}
              onChange={e => setForm({ maritalStatus: e.target.value })}
              className={`${INPUT_CLS} appearance-none pr-9 cursor-pointer`} style={INPUT_STYLE}
            >
              <option value="">Select...</option>
              {MARITAL.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <FieldLabel>OCCUPATION</FieldLabel>
          <input
            type="text" placeholder="e.g. Pelajar/Mahasiswa"
            value={form.occupation}
            onChange={e => setForm({ occupation: e.target.value })}
            className={INPUT_CLS} style={INPUT_STYLE}
          />
        </div>
      </div>
      <div>
        <FieldLabel>CITIZENSHIP</FieldLabel>
        <input
          type="text" placeholder="WNI"
          value={form.citizenship}
          onChange={e => setForm({ citizenship: e.target.value })}
          className={INPUT_CLS} style={INPUT_STYLE}
        />
      </div>
    </div>
  );
}

export function AddAthleteModal({ onClose }: AddAthleteModalProps) {
  const [step, setStep] = useState<"method" | "manual" | 1 | 2 | 3 | "success">("method");
  const [method, setMethod] = useState<"ocr" | "manual" | null>(null);
  const [manualForm, setManualForm] = useState<ManualForm>({
    nik: "", fullName: "", placeOfBirth: "", dateOfBirth: "",
    gender: "", religion: "", address: "", maritalStatus: "",
    occupation: "", citizenship: "WNI",
  });
  const patchManual = (patch: Partial<ManualForm>) => setManualForm(p => ({ ...p, ...patch }));
  const manualValid =
    manualForm.nik.length === 16 &&
    manualForm.fullName.trim() &&
    manualForm.placeOfBirth.trim() &&
    manualForm.dateOfBirth &&
    manualForm.gender &&
    manualForm.religion &&
    manualForm.address.trim() &&
    manualForm.maritalStatus;
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState("Surabaya");
  const [jerseyNumber, setJerseyNumber] = useState("10");
  const [selectedPosition, setSelectedPosition] = useState("Midfielder");
  const fileRef = useRef<HTMLInputElement>(null);

  const triggerScan = (name: string) => {
    setFileName(name);
    setIsScanning(true);
    setScanProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 8;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setStep(2);
        }, 400);
      }
      setScanProgress(Math.min(Math.round(prog), 100));
    }, 180);
  };

  const handleFileSelect = () => {
    if (isScanning) return;
    if (fileRef.current?.files?.length) {
      triggerScan(fileRef.current.files[0].name);
    } else {
      triggerScan("ktp_rizky_ridho.jpg");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) triggerScan(f.name);
    else triggerScan("ktp_photo.jpg");
  };

  const stepSubtitles: Record<string | number, string> = {
    method: "Choose how you want to add the athlete's details.",
    1: "Upload KTP/ID Card photo to auto-extract verified data via OCR.",
    manual: "Fill in athlete details as shown on their KTP.",
    2: "Review the extracted data before adding to roster.",
    3: "Assign team details and confirm registration.",
    success: "Registration complete.",
  };

  const indicatorStep =
    step === "method" ? 0 :
    step === "manual" || step === 1 ? 1 :
    step === 2 ? 2 :
    step === 3 ? 3 : 3;

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes floatUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes ktpScan { 0%{top:15%;opacity:0}10%{opacity:1}50%{top:80%;opacity:1}90%{opacity:1}100%{top:80%;opacity:0} }
        .upload-icon-float { animation: floatUp 2.6s ease-in-out infinite; }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(8, 18, 36, 0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden"
          style={{ fontFamily: "Inter, sans-serif", maxHeight: "92vh" }}
        >
          {step !== "success" && (
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#eff6ff]">
                      <ScanLine size={15} className="text-[#2563eb]" />
                    </div>
                    <h2 className="text-[#0a1628]"
                      style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "26px", fontWeight: 700, lineHeight: 1.1 }}>
                      Register Athlete
                    </h2>
                  </div>
                  <p className="text-gray-400 pl-9" style={{ fontSize: "13px", lineHeight: 1.5 }}>
                    {stepSubtitles[step]}
                  </p>
                </div>
                <button onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
                  <X size={15} />
                </button>
              </div>
              <StepIndicator step={indicatorStep} />
            </div>
          )}

          <div className="px-6 py-5 flex flex-col gap-0 overflow-y-auto flex-1">
            {step === "method" && <MethodSelect method={method} setMethod={setMethod} />}
            {step === "manual" && <Step1ManualEntry form={manualForm} setForm={patchManual} />}
            {step === 1 && (
              <Step1Upload
                isDragging={isDragging}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                fileRef={fileRef as React.RefObject<HTMLInputElement>}
                fileName={fileName}
                isScanning={isScanning}
                scanProgress={scanProgress}
              />
            )}
            {step === 2 && (
              <Step2Verify
                onConfirm={() => setStep(3)}
                onBack={() => { setFileName(null); setIsScanning(false); setScanProgress(0); setStep(1); }}
              />
            )}
            {step === 3 && (
              <Step3AddRoster
                selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}
                jerseyNumber={jerseyNumber} setJerseyNumber={setJerseyNumber}
                selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition}
              />
            )}
            {step === "success" && <SuccessState onClose={onClose} />}
          </div>

          {step !== "success" && (
            <div className="px-6 pb-6 pt-2 shrink-0">
              <div className="h-px bg-gray-100 mb-4" />

              {step === "method" && (
                <div className="flex gap-3">
                  <button onClick={onClose}
                    className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                    style={{ fontSize: "13px", fontWeight: 600 }}>
                    Cancel
                  </button>
                  <button
                    disabled={!method}
                    onClick={() => method && setStep(method === "ocr" ? 1 : "manual")}
                    className="flex-1 h-12 rounded-xl text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    style={{
                      background: method ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                      fontSize: "15px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif",
                      letterSpacing: "0.04em", cursor: method ? "pointer" : "not-allowed",
                      boxShadow: method ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                    }}>
                    Next <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {step === "manual" && (
                <div className="flex gap-3">
                  <button onClick={() => setStep("method")}
                    className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                    style={{ fontSize: "13px", fontWeight: 600 }}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    disabled={!manualValid}
                    onClick={() => manualValid && setStep(2)}
                    className="flex-1 h-12 rounded-xl text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    style={{
                      background: manualValid ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                      fontSize: "15px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif",
                      letterSpacing: "0.04em", cursor: manualValid ? "pointer" : "not-allowed",
                      boxShadow: manualValid ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                    }}>
                    Proceed to Verification <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {step === 1 && (
                <>
                  <button disabled={isScanning}
                    onClick={!fileName && !isScanning ? handleFileSelect : undefined}
                    className="w-full h-12 rounded-xl flex items-center justify-center gap-2.5 transition-all"
                    style={{
                      background: fileName && !isScanning ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                      fontSize: "15px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif",
                      letterSpacing: "0.05em", color: "#fff",
                      cursor: isScanning ? "not-allowed" : "pointer",
                      boxShadow: fileName && !isScanning ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                    }}>
                    {isScanning ? (
                      <><ScanLine size={16} strokeWidth={2} /> Processing OCR...</>
                    ) : fileName ? (
                      <><ArrowRight size={16} strokeWidth={2.5} /> Extract Data</>
                    ) : (
                      <><UploadCloud size={16} strokeWidth={2} /> Upload KTP First</>
                    )}
                  </button>
                  {!fileName && !isScanning && (
                    <p className="text-center text-gray-300 mt-2" style={{ fontSize: "11px" }}>
                      Button activates once a KTP image is uploaded
                    </p>
                  )}
                </>
              )}

              {step === 2 && (
                <div className="flex gap-3">
                  <button onClick={() => {
                      if (method === "manual") { setStep("manual"); }
                      else { setFileName(null); setScanProgress(0); setStep(1); }
                    }}
                    className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                    style={{ fontSize: "13px", fontWeight: 600 }}>
                    <ChevronLeft size={15} /> {method === "manual" ? "Edit Data" : "Re-upload"}
                  </button>
                  <button onClick={() => setStep(3)}
                    className="flex-1 h-12 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", fontSize: "15px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
                    Confirm & Continue <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex items-center justify-center gap-1.5 h-12 px-5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                    style={{ fontSize: "13px", fontWeight: 600 }}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    disabled={!selectedTeam}
                    onClick={() => setStep("success")}
                    className="flex-1 h-12 rounded-xl text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    style={{
                      background: selectedTeam ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                      fontSize: "15px", fontWeight: 700, fontFamily: "Barlow Condensed, sans-serif",
                      letterSpacing: "0.04em", cursor: selectedTeam ? "pointer" : "not-allowed",
                      boxShadow: selectedTeam ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                    }}>
                    <UserPlus size={16} strokeWidth={2.2} /> Add to Football Roster
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MethodSelect({
  method, setMethod,
}: {
  method: "ocr" | "manual" | null;
  setMethod: (m: "ocr" | "manual") => void;
}) {
  const cards: Array<{
    id: "ocr" | "manual";
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    recommended?: boolean;
  }> = [
    {
      id: "ocr",
      icon: (
        <div className="relative">
          <CreditCard size={28} strokeWidth={1.5} className="text-[#2563eb]" />
          <Sparkles size={12} strokeWidth={2.5} className="absolute -top-1 -right-1.5 text-amber-400" />
        </div>
      ),
      title: "Scan KTP/ID Card",
      subtitle: "Auto-extract data using OCR",
      recommended: true,
    },
    {
      id: "manual",
      icon: <Keyboard size={28} strokeWidth={1.5} className="text-gray-500" />,
      title: "Enter Data Manually",
      subtitle: "Type in the details yourself",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {cards.map(c => {
        const active = method === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setMethod(c.id)}
            className="flex items-center gap-4 text-left rounded-2xl transition-all"
            style={{
              backgroundColor: active ? "#eff6ff" : "#ffffff",
              border: `2px solid ${active ? "#2563eb" : "#e5e7eb"}`,
              padding: "18px 20px",
              boxShadow: active ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: "56px",
                height: "56px",
                background: c.id === "ocr"
                  ? "linear-gradient(135deg,#eff6ff,#dbeafe)"
                  : "linear-gradient(135deg,#f8fafc,#f1f5f9)",
                border: `1.5px solid ${c.id === "ocr" ? "#bfdbfe" : "#e2e8f0"}`,
              }}
            >
              {c.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-gray-900" style={{ fontSize: "15px", fontWeight: 700 }}>
                  {c.title}
                </h3>
                {c.recommended && (
                  <span
                    className="px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em" }}
                  >
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className="text-gray-500" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                {c.subtitle}
              </p>
            </div>
            <div
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${active ? "#2563eb" : "#cbd5e1"}`,
                backgroundColor: active ? "#2563eb" : "transparent",
              }}
            >
              {active && <Check size={11} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}