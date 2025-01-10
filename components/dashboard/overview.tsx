"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useState } from "react";

const data = [
  {
    name: "Mon",
    total: 4,
  },
  {
    name: "Tue",
    total: 7,
  },
  {
    name: "Wed",
    total: 5,
  },
  {
    name: "Thu",
    total: 6,
  },
  {
    name: "Fri",
    total: 8,
  },
  {
    name: "Sat",
    total: 3,
  },
  {
    name: "Sun",
    total: 2,
  },
];

export function Overview() {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Access Count
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="total"
          onMouseEnter={(data) => setHoveredBar(data.name)}
          onMouseLeave={() => setHoveredBar(null)}
          radius={[8, 8, 0, 0]} 
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                hoveredBar === entry.name
                  ? "hsl(var(--primary)/0.8)"
                  : "hsl(var(--primary))"
              }
              className="transition-colors duration-200"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
