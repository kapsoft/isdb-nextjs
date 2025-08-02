import Image from 'next/image'

export default function Logo({ className = "", size = "default", backgroundTransparent = false }) {
  const sizes = {
    nav: { icon: 120, text: "text-2xl" },
    small: { icon: 180, text: "text-2xl" },
    default: { icon: 240, text: "text-4xl" },
    large: { icon: 360, text: "text-6xl" }
  }
  
  const { icon } = sizes[size] || sizes.default

  return (
    <div className={`flex items-center ${className}`}>
      {/* ISDB Logo */}
      <div className={backgroundTransparent ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]' : ''}>
        <Image 
          src="/isdb_logo24_transparent.png" 
          alt="ISDB Logo" 
          width={icon} 
          height={icon}
          className="object-contain"
        />
      </div>
    </div>
  )
} 