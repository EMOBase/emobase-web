import { cn } from "@/utils/classname";

const PercentageRangeInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  return (
    <div className="flex flex-col w-full sm:w-[320px]">
      <div className="relative h-8 flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={cn(
            "w-full appearance-none bg-transparent rounded",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:-mt-1.25 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:z-20",
            "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded",
          )}
          style={{
            background: `linear-gradient(to right, #d97706 0%, #d97706 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`,
            backgroundSize: "100% 4px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-[22px] left-[6px] right-[6px] flex justify-between pointer-events-none">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
            <div key={val} className={`w-px h-1.5 bg-slate-300 ${value}`}></div>
          ))}
        </div>
        <div className="absolute top-8 left-0 -right-2 flex justify-between text-[10px] font-medium text-slate-400 select-none">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <div className="absolute bottom-6 left-[6px] right-[6px] text-[10px] text-primary font-bold select-none">
          <span
            className="absolute bottom-0 -translate-x-1/2"
            style={{ left: `${value}%` }}
          >
            {value}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PercentageRangeInput;
