export function SkeletonCard() {
  return (
    <div className="glass-card animate-pulse flex flex-col h-[300px]">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-20 bg-white/10 rounded"></div>
        <div className="h-4 w-10 bg-white/10 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-white/20 rounded mb-4"></div>
      <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-white/10 rounded mb-6"></div>
      <div className="mt-auto h-20 w-full bg-black/20 rounded-lg"></div>
    </div>
  );
}
