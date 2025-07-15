import Image from 'next/image'

export default function Logo({ className = "", size = "default" }) {
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
      <Image 
        src="/isdb_logo24.png" 
        alt="ISDB Logo" 
        width={icon} 
        height={icon}
        className="object-contain"
      />
    </div>
  )
} 