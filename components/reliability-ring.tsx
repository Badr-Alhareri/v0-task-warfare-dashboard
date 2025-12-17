"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface ReliabilityRingProps {
  value: number
  size?: number
}

export function ReliabilityRing({ value, size = 60 }: ReliabilityRingProps) {
  const data = [
    { name: "filled", value: value },
    { name: "empty", value: 100 - value },
  ]

  const getColor = (val: number) => {
    if (val >= 90) return "oklch(0.75 0.2 145)" // success green
    if (val >= 70) return "oklch(0.75 0.18 55)" // warning orange
    return "oklch(0.55 0.22 25)" // danger red
  }

  const color = getColor(value)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="oklch(0.22 0.01 260)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  )
}
