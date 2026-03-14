import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, name, size = 40, className = '' }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  if (src) {
    return (
      <Image src={src} alt={name} width={size} height={size}
        className={'rounded-full object-cover ' + className}
        style={{ width: size, height: size }} />
    );
  }

  return (
    <div className={'rounded-full flex items-center justify-center font-bold text-white ' + className}
      style={{ width: size, height: size, backgroundColor: colors[colorIndex], fontSize: size * 0.4 }}>
      {initials}
    </div>
  );
}