import React from 'react';

interface BarcodeVisualProps {
  value: string;
  className?: string;
  showText?: boolean;
}

export const BarcodeVisual: React.FC<BarcodeVisualProps> = ({
  value,
  className = '',
  showText = true,
}) => {
  // Deterministic bar widths based on input string
  const bars: { width: number; isSpace: boolean }[] = [];
  const seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Start guard bars
  bars.push({ width: 2, isSpace: false });
  bars.push({ width: 2, isSpace: true });
  bars.push({ width: 3, isSpace: false });
  bars.push({ width: 1, isSpace: true });

  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const mod = (charCode * (i + 1) + seed) % 11;
    bars.push({ width: (mod % 3) + 1, isSpace: false });
    bars.push({ width: ((mod + 2) % 3) + 1, isSpace: true });
    bars.push({ width: ((mod + 4) % 3) + 1, isSpace: false });
    bars.push({ width: ((mod + 1) % 2) + 1, isSpace: true });
  }

  // End guard bars
  bars.push({ width: 3, isSpace: false });
  bars.push({ width: 1, isSpace: true });
  bars.push({ width: 2, isSpace: false });

  let totalWidth = 0;
  bars.forEach(b => {
    totalWidth += b.width;
  });

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} 48`}
        className="w-full max-w-[240px] h-12"
        preserveAspectRatio="none"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width;
          if (bar.isSpace) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={48}
              fill="#1c1917"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="font-mono-nums text-xs tracking-widest text-stone-700 mt-1 font-semibold">
          *{value}*
        </span>
      )}
    </div>
  );
};
