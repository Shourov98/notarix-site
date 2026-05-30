import Link from "next/link";

export default function NotarixBrand({ href = "/", compact = false }) {
  return (
    <Link href={href} className="inline-flex flex-col items-center gap-4 text-center">
      <div
        className={`relative overflow-hidden rounded-[28px] border border-[#20486f] bg-[linear-gradient(160deg,#1e486f_0%,#173654_60%,#102743_100%)] shadow-[0_18px_40px_rgba(18,39,67,0.18)] ${
          compact ? "h-24 w-20" : "h-32 w-28"
        }`}
        style={{
          clipPath:
            "polygon(50% 0%, 88% 16%, 88% 58%, 50% 100%, 12% 58%, 12% 16%)",
        }}
      >
        <div className="absolute inset-[3px] rounded-[24px] border border-white/60 opacity-80" />
        <div className="absolute inset-x-0 top-4 flex justify-center text-[10px] font-bold tracking-[0.35em] text-[#9cc0e6]">
          SS
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-[linear-gradient(180deg,#ffe692_0%,#ffd346_40%,#bf8a10_100%)] bg-clip-text text-6xl font-black leading-none text-transparent drop-shadow-[0_3px_8px_rgba(255,214,91,0.38)]">
            N
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className={`font-black tracking-[0.08em] text-[#21486b] ${compact ? "text-3xl" : "text-4xl"}`}>
          NOTARIX
        </div>
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#21486b]">
          Signing Services
        </div>
      </div>
    </Link>
  );
}
