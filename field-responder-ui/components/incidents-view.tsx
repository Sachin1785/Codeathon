"use client"

import { Search, Filter, MapPin, Clock, AlertTriangle, Flame, Users as UsersIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const mockIncidents = [
    {
        id: "FR-2847",
        type: "Structural Fire",
        location: "Block 4, Connaught Place, Delhi",
        priority: "high",
        status: "active",
        time: "14:32",
        victims: 2,
        distance: "0.8 km",
        severity: "High - Active Fire"
    },
    {
        id: "FR-2846",
        type: "Medical Emergency",
        location: "Rajiv Chowk Metro Station",
        priority: "medium",
        status: "pending",
        time: "14:15",
        victims: 1,
        distance: "2.3 km",
        severity: "Medium - Cardiac Arrest"
    },
    {
        id: "FR-2845",
        type: "Traffic Accident",
        location: "Outer Ring Road, Sector 18",
        priority: "low",
        status: "completed",
        time: "13:45",
        victims: 3,
        distance: "5.1 km",
        severity: "Low - Minor Injuries"
    },
    {
        id: "FR-2844",
        type: "Gas Leak",
        location: "Nehru Place Complex",
        priority: "high",
        status: "pending",
        time: "13:20",
        victims: 0,
        distance: "3.7 km",
        severity: "High - Evacuation Required"
    },
]

export default function IncidentsView() {
    return (
        <div className="flex flex-col h-full bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="px-4 py-4">
                    <h1 className="text-2xl font-bold mb-4">Incidents</h1>

                    {/* Search and Filter */}
                    <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search incidents..."
                                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <button className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl hover:bg-muted transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
                            <div className="text-xs text-muted-foreground">Active</div>
                            <div className="text-lg font-bold text-accent">2</div>
                        </div>
                        <div className="bg-warning/10 border border-warning/20 rounded-lg px-3 py-2">
                            <div className="text-xs text-muted-foreground">Pending</div>
                            <div className="text-lg font-bold text-orange-600">2</div>
                        </div>
                        <div className="bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                            <div className="text-xs text-muted-foreground">Done</div>
                            <div className="text-lg font-bold text-success">1</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Incidents List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {mockIncidents.map((incident) => (
                    <div
                        key={incident.id}
                        className={cn(
                            "bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]",
                            incident.priority === "high" && "border-accent/30 bg-accent/5",
                            incident.priority === "medium" && "border-orange-500/30 bg-orange-500/5",
                            incident.status === "completed" && "opacity-60"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-muted-foreground">{incident.id}</span>
                                    {incident.priority === "high" && (
                                        <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-semibold rounded-full">
                                            HIGH PRIORITY
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-base">{incident.type}</h3>
                            </div>

                            {incident.status === "active" && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-success/20 text-success rounded-full">
                                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                    <span className="text-xs font-medium">Active</span>
                                </div>
                            )}
                            {incident.status === "completed" && (
                                <CheckCircle2 className="w-5 h-5 text-success" />
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{incident.location}</span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{incident.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{incident.distance}</span>
                            </div>
                            {incident.victims > 0 && (
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{incident.victims} victims</span>
                                </div>
                            )}
                        </div>

                        {/* Severity */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <AlertTriangle className={cn(
                                "w-4 h-4",
                                incident.priority === "high" && "text-accent",
                                incident.priority === "medium" && "text-orange-500",
                                incident.priority === "low" && "text-yellow-500"
                            )} />
                            <span className="text-xs font-medium">{incident.severity}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
