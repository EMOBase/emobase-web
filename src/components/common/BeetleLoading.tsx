const BeetleLoading = ({ title }: { title: string }) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-14 border-[3px] border-orange-100 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl animate-pulse">
              pest_control
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-bold text-slate-900 font-display tracking-tight">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Querying iBeetle Hub database...
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeetleLoading;
