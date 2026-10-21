import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { useApp } from '../lib/store'

const axis = { fontSize: 11, fill: '#6B7EA6' }

export function TopicBars({
  data,
  height = 210,
}: {
  data: { name: string; value: number }[]
  height?: number
}) {
  const { lowData } = useApp()
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 4 }} barCategoryGap={10}>
          <CartesianGrid horizontal={false} stroke="#EDF0F7" />
          <XAxis type="number" domain={[0, 100]} tick={axis} axisLine={false} tickLine={false} ticks={[0, 25, 50, 75, 100]} />
          <YAxis type="category" dataKey="name" width={126} tick={axis} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(15,169,143,0.06)' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #E6EAF4', fontSize: 12 }}
            formatter={(v: number) => [`${v}%`, 'Class average']}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={!lowData} maxBarSize={22}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.value >= 75 ? '#0FA98F' : d.value >= 60 ? '#6C4CF1' : '#E0A64B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TrendArea({
  data,
  height = 200,
}: {
  data: { label: string; classAvg: number; aarav?: number }[]
  height?: number
}) {
  const { lowData } = useApp()
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="classFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C4CF1" stopOpacity={lowData ? 0.12 : 0.24} />
              <stop offset="100%" stopColor="#6C4CF1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="aaravFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0FA98F" stopOpacity={lowData ? 0.14 : 0.3} />
              <stop offset="100%" stopColor="#0FA98F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#EDF0F7" vertical={false} />
          <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={axis} axisLine={false} tickLine={false} width={44} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E6EAF4', fontSize: 12 }} />
          <Area type="monotone" dataKey="classAvg" name="Class average" stroke="#6C4CF1" strokeWidth={2} fill="url(#classFill)" isAnimationActive={!lowData} />
          <Area type="monotone" dataKey="aarav" name="Aarav" stroke="#0FA98F" strokeWidth={2.4} fill="url(#aaravFill)" isAnimationActive={!lowData} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MasteryDonut({
  segments,
  height = 180,
}: {
  segments: { name: string; value: number; color: string }[]
  height?: number
}) {
  const { lowData } = useApp()
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segments}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="86%"
            paddingAngle={2}
            isAnimationActive={!lowData}
            stroke="none"
          >
            {segments.map((s) => (
              <Cell key={s.name} fill={s.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E6EAF4', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
