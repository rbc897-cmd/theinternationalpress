import { LucideIcon } from 'lucide-react'

interface DashboardStatsProps {
    title: string
    value: number | string
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
    color?: string
}

export default function DashboardStats({ title, value, icon: Icon, trend, trendUp, color = "gray" }: DashboardStatsProps) {
    const colorClasses = {
        gray: "bg-gray-100 text-gray-700",
        green: "bg-green-50 text-green-600",
        yellow: "bg-yellow-50 text-yellow-600",
        purple: "bg-gray-100 text-gray-700"
    }

    const activeColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.gray

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${activeColorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={trendUp ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {trend}
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                </div>
            )}
        </div>
    )
}
