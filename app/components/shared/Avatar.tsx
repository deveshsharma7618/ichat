interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-xl",
  xl: "w-32 h-32 text-3xl",
};

export default function Avatar({ name, image, size = "md", className = "" }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white font-bold ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
