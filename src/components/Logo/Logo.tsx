import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
  alt?: string;
}

const sizeMap = {
  sm: { width: 40, height: 40, containerClass: "w-10 h-10" },
  md: { width: 60, height: 60, containerClass: "w-16 h-16" },
  lg: { width: 100, height: 100, containerClass: "w-24 h-24" },
  xl: { width: 150, height: 150, containerClass: "w-40 h-40" },
};

export default function Logo({
  size = "md",
  className = "",
  href = "/",
  alt = "GBA Logo - Greater Bogura Association Khulna University",
}: LogoProps) {
  const sizeConfig = sizeMap[size];

  const logoContent = (
    <div
      className={`
        ${sizeConfig.containerClass}
        relative
        flex
        items-center
        justify-center
        rounded-full
        transition-transform
        duration-300
        hover:scale-105
        ${className}
      `}
    >
      <Image
        src="/logo.jpg"
        alt={alt}
        // placeholder="blur"
        width={sizeConfig.width}
        height={sizeConfig.height}
        // priority
        className="rounded-full object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
        sizes={`(max-width: 640px) ${sizeConfig.width * 0.75}px, ${sizeConfig.width}px`}
      />
    </div>
  );

  return href ? (
    <Link href={href} className="inline-flex items-center justify-center">
      {logoContent}
    </Link>
  ) : (
    logoContent
  );
}
