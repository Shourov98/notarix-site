import Image from "next/image";
import Link from "next/link";

export default function BrandLockup({ compact = false }) {
  return (
    <Link href="/" className="inline-flex flex-col items-center gap-4 text-center">
      <div
        className={`relative ${compact ? "h-20 w-20" : "h-28 w-28"} rounded-[28px] bg-white/80 shadow-[0_20px_60px_rgba(14,30,66,0.12)] ring-1 ring-[#d7deef] backdrop-blur`}
      >
        <Image src="/logo.svg" alt="Notarix logo" fill className="object-contain p-3" priority />
      </div>
      <div className={`relative ${compact ? "h-10 w-40" : "h-12 w-52"}`}>
        <Image src="/text_2.svg" alt="Notarix Signing Services" fill className="object-contain" priority />
      </div>
    </Link>
  );
}
