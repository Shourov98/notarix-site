import Image from "next/image";
import Link from "next/link";

export default function NotarixBrand({ href = "/", compact = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center text-left ${compact ? "gap-4" : "gap-5"}`}
    >
      <div
        className={`flex items-center justify-center rounded-[24px] bg-[#eef4ff] ring-1 ring-[#dbe6ff] shadow-[0_18px_38px_rgba(39,67,214,0.12)] ${
          compact ? "h-20 w-20" : "h-24 w-24"
        }`}
      >
        <Image
          src="/logo.svg"
          alt="Notarix"
          width={compact ? 44 : 56}
          height={compact ? 44 : 56}
          className={`${compact ? "h-11 w-11" : "h-14 w-14"} object-contain`}
          priority
        />
      </div>
      <div className="space-y-2">
        <Image
          src="/text_2.svg"
          alt="Notarix"
          width={compact ? 156 : 180}
          height={compact ? 46 : 53}
          className={`${compact ? "h-9" : "h-11"} w-auto object-contain`}
          priority
        />
        <div className={`font-bold uppercase tracking-[0.28em] text-[#21486b] ${compact ? "text-[10px]" : "text-xs"}`}>
          Signing Services
        </div>
      </div>
    </Link>
  );
}
