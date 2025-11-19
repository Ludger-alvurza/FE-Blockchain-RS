// components/LoadingFallback.tsx
interface LoadingFallbackProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function LoadingFallback({
  message = "Memuat data...",
  size = "md",
  fullScreen = false,
}: LoadingFallbackProps) {
  const spinnerSizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-950"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${spinnerSizes[size]} border-zinc-300 dark:border-zinc-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin`}
        />
        <p className={`${textSizes[size]} text-zinc-600 dark:text-zinc-400`}>
          {message}
        </p>
      </div>
    </div>
  );
}
