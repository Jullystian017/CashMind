"use client";

import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BackgroundRippleEffectProps = {
    rows?: number;
    cols?: number;
    cellSize?: number;
    className?: string;
    interactive?: boolean;
    borderColor?: string;
    fillColor?: string;
    shadowColor?: string;
    glowPattern?: (row: number, col: number) => boolean;
    glowDurationRange?: [number, number];
    stretchToViewport?: boolean;
};

export const BackgroundRippleEffect = ({
    rows = 8,
    cols = 27,
    cellSize = 56,
    className,
    interactive = true,
    borderColor = "rgba(255, 255, 255, 0.2)",
    fillColor = "transparent",
    shadowColor = "rgba(59, 130, 246, 0.2)",
    glowPattern,
    glowDurationRange = [4200, 7200],
    stretchToViewport = false,
}: BackgroundRippleEffectProps) => {
    const [clickedCell, setClickedCell] = useState<{
        row: number;
        col: number;
    } | null>(null);
    const [rippleKey, setRippleKey] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <style>{`
        @keyframes ripple-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            opacity: 0.15;
            filter: saturate(100%);
          }
          45% {
            box-shadow: 0 0 40px 10px rgba(59, 130, 246, 0.3);
            opacity: 0.8;
            filter: saturate(150%);
          }
          70% {
            box-shadow: 0 0 30px 8px rgba(59, 130, 246, 0.2);
            opacity: 0.6;
            filter: saturate(130%);
          }
        }
        
        @keyframes cell-ripple {
          0% {
            background-color: rgba(59, 130, 246, 0.4);
            transform: scale(1.1);
          }
          100% {
            background-color: transparent;
            transform: scale(1);
          }
        }

        .animate-cell-ripple {
           animation: cell-ripple var(--duration) ease-out var(--delay) forwards;
        }
      `}</style>
            <div
                ref={ref}
                className={cn(
                    "absolute inset-0 h-full w-full",
                    className,
                )}
                style={
                    {
                        "--cell-border-color": borderColor,
                        "--cell-fill-color": fillColor,
                        "--cell-shadow-color": shadowColor,
                    } as React.CSSProperties
                }
            >
                <div className="relative h-auto w-auto overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 z-2 h-full w-full overflow-hidden" />
                    <DivGrid
                        key={`base-${rippleKey}`}
                        className="opacity-100"
                        rows={rows}
                        cols={cols}
                        cellSize={cellSize}
                        borderColor="var(--cell-border-color)"
                        fillColor="var(--cell-fill-color)"
                        clickedCell={interactive ? clickedCell : null}
                        onCellClick={
                            interactive
                                ? (row, col) => {
                                    setClickedCell({ row, col });
                                    setRippleKey((k) => k + 1);
                                }
                                : undefined
                        }
                        interactive={interactive}
                        glowPattern={glowPattern}
                        glowDurationRange={glowDurationRange}
                        stretchToViewport={stretchToViewport && !interactive}
                    />
                </div>
            </div>
        </>
    );
};

type DivGridProps = {
    className?: string;
    rows: number;
    cols: number;
    cellSize: number;
    borderColor: string;
    fillColor: string;
    clickedCell: { row: number; col: number } | null;
    onCellClick?: (row: number, col: number) => void;
    interactive?: boolean;
    glowPattern?: (row: number, col: number) => boolean;
    glowDurationRange?: [number, number];
    stretchToViewport?: boolean;
};

type CellStyle = React.CSSProperties & {
    ["--delay"]?: string;
    ["--duration"]?: string;
};

const DivGrid = ({
    className,
    rows = 7,
    cols = 30,
    cellSize = 56,
    borderColor = "rgba(255, 255, 255, 0.2)",
    fillColor = "transparent",
    clickedCell = null,
    onCellClick = () => { },
    interactive = true,
    glowPattern,
    glowDurationRange = [4200, 7200],
    stretchToViewport = false,
}: DivGridProps) => {
    const cells = useMemo(
        () => Array.from({ length: rows * cols }, (_, idx) => idx),
        [rows, cols],
    );

    const stretch = stretchToViewport && !interactive;

    const gridStyle: React.CSSProperties = stretch
        ? {
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: `calc(100vw / ${cols})`,
            width: "100vw",
            height: `calc((100vw / ${cols}) * ${rows})`,
            marginInline: "calc((100% - 100vw) / 2)",
        }
        : {
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            width: cols * cellSize,
            height: rows * cellSize,
            marginInline: "auto",
        };

    return (
        <div className={cn("relative z-3", className)} style={gridStyle}>
            {cells.map((idx) => {
                const rowIdx = Math.floor(idx / cols);
                const colIdx = idx % cols;
                const distance = clickedCell
                    ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
                    : 0;
                const rippleDelay = clickedCell ? Math.max(0, distance * 55) : 0;
                const rippleDuration = 200 + distance * 80;

                const style: CellStyle = clickedCell
                    ? {
                        "--delay": `${rippleDelay}ms`,
                        "--duration": `${rippleDuration}ms`,
                    }
                    : {};

                const baseStyle: React.CSSProperties = {
                    backgroundColor: fillColor,
                    borderColor: borderColor,
                    ...style,
                };

                const glowEnabled = true;
                const shouldGlow = glowPattern
                    ? glowPattern(rowIdx, colIdx)
                    : ((rowIdx * 31 + colIdx) * 17) % 9 === 0;

                if (glowEnabled && shouldGlow) {
                    baseStyle.opacity = 0.9;
                    baseStyle.backgroundColor = "rgba(59, 130, 246, 0.2)";
                    baseStyle.boxShadow = "0 0 35px 10px rgba(59, 130, 246, 0.2)";
                    baseStyle.borderColor = "rgba(255, 255, 255, 0.85)";
                } else {
                    baseStyle.opacity = 0.4;
                }

                return (
                    <div
                        key={idx}
                        className={cn(
                            "cell relative border-[0.5px] transition-all duration-150 will-change-transform hover:opacity-100 hover:bg-blue-50/10",
                            clickedCell && "animate-cell-ripple",
                            !interactive && "pointer-events-none",
                        )}
                        style={baseStyle}
                        onClick={
                            interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
                        }
                    />
                );
            })}
        </div>
    );
};
