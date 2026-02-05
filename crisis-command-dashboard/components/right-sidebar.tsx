"use client"

import { useState, useEffect } from "react"
import { Radio, MessageSquare, Wifi, AlertCircle, CheckCircle2, TrendingUp, PieChart } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { analyticsAPI } from "@/lib/api"
import { ResponseTimeWidget } from "@/components/analytics/response-time-widget"

interface RightSidebarProps {
  incidents: Array<{
    id: number
    title: string
    severity: "critical" | "high" | "medium" | "low"
    responders: string[]
    resources: string[]
    created_at?: string // Added to support time-series
  }>
}

export default function RightSidebar({ incidents }: RightSidebarProps) {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  const systemStatus = {
    voiceCall: { online: true, devices: 3 },
    sms: { online: true, devices: 5 },
    bluetoothMesh: { online: true, devices: 12 },
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await analyticsAPI.getDashboard()
        if (response.success) {
          setAnalyticsData(response.analytics)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    // Refresh every minute
    const interval = setInterval(fetchAnalytics, 60000)
    return () => clearInterval(interval)
  }, [incidents.length]) // Refresh when incident count changes

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-500"
  }

  const getStatusBg = (isOnline: boolean) => {
    return isOnline ? "bg-green-500/10" : "bg-red-500/10"
  }

  // Format data for charts
  const resourceAllocation = analyticsData?.resources?.resources_by_type?.map((r: any) => ({
    name: r.type.charAt(0).toUpperCase() + r.type.slice(1),
    value: r.count,
    deployed: r.deployed
  })) || []

  // Generate Incidents Over Time from actual incident data
  // Group incidents by hour for the last 12 hours
  const generateIncidentsOverTime = () => {
    const hoursMap = new Map<string, number>();
    const now = new Date();
    
    // Initialize last 8 hours with 0
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = d.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }) + ":00";
      hoursMap.set(hourKey, 0);
    }

    // Count incidents (using created_at if available, otherwise defaulting to 'now')
    incidents.forEach(inc => {
      if (inc.created_at) {
        const d = new Date(inc.created_at);
        const hourKey = d.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }) + ":00";
        if (hoursMap.has(hourKey)) {
          hoursMap.set(hourKey, (hoursMap.get(hourKey) || 0) + 1);
        }
      }
    });

    return Array.from(hoursMap.entries()).map(([time, count]) => ({
      time,
      incidents: count
    }));
  };

  const incidentsOverTime = generateIncidentsOverTime();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-foreground">System Dashboard</h2>
          {analyticsData && (
             <ResponseTimeWidget avgResponseTime={analyticsData.incidents.avg_response_time_minutes} />
          )}
        </div>

        {/* System Status */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">System Status</h3>

          {/* Voice Call */}
          <div className={`rounded p-2 border border-border/50 ${getStatusBg(systemStatus.voiceCall.online)}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Radio className={`w-3 h-3 flex-shrink-0 ${getStatusColor(systemStatus.voiceCall.online)}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">Voice Call</p>
                  <p className="text-xs text-muted-foreground">{systemStatus.voiceCall.devices} channels</p>
                </div>
              </div>
              {systemStatus.voiceCall.online ? (
                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-500 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* SMS */}
          <div className={`rounded p-2 border border-border/50 ${getStatusBg(systemStatus.sms.online)}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare className={`w-3 h-3 flex-shrink-0 ${getStatusColor(systemStatus.sms.online)}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">SMS Gateway</p>
                  <p className="text-xs text-muted-foreground">{systemStatus.sms.devices} gateways</p>
                </div>
              </div>
              {systemStatus.sms.online ? (
                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-500 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Bluetooth Mesh */}
          <div className={`rounded p-2 border border-border/50 ${getStatusBg(systemStatus.bluetoothMesh.online)}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Wifi className={`w-3 h-3 flex-shrink-0 ${getStatusColor(systemStatus.bluetoothMesh.online)}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground">Bluetooth Mesh</p>
                  <p className="text-xs text-muted-foreground">{systemStatus.bluetoothMesh.devices} devices</p>
                </div>
              </div>
              {systemStatus.bluetoothMesh.online ? (
                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-500 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Overall Health */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Overall Health</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                <span className="font-semibold text-green-600 dark:text-green-400">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content with graphs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Incidents Over Time Graph */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Incidents Over Time
          </h3>
          <div className="bg-muted/30 rounded-lg p-2 border border-border">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={incidentsOverTime} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 0, 255, 0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--color-muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--color-muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                />
                <Line type="monotone" dataKey="incidents" stroke="#a855f7" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Allocation Graph */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
            <PieChart className="w-3 h-3" />
            Equipment Allocation
          </h3>
          <div className="bg-muted/30 rounded-lg p-2 border border-border">
            {resourceAllocation.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={resourceAllocation} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 0, 255, 0.15)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--color-muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--color-muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--color-card))",
                      border: "1px solid hsl(var(--color-border))",
                    }}
                  />
                  <Bar dataKey="value" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-40 text-xs text-muted-foreground">
                 No resource data available
               </div>
            )}
          </div>
        </div>

        {/* Severity Distribution */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Severity Distribution
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground">Critical</span>
              </div>
              <span className="font-semibold text-primary">
                {incidents.filter((i) => i.severity === "critical").length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full" />
                <span className="text-foreground">High</span>
              </div>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {incidents.filter((i) => i.severity === "high").length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full" />
                <span className="text-foreground">Medium</span>
              </div>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {incidents.filter((i) => i.severity === "medium").length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
                <span className="text-foreground">Low</span>
              </div>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {incidents.filter((i) => i.severity === "low").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
