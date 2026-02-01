"use client"

import { useState } from "react"
import { Filter, MapPin, Clock, AlertCircle } from "lucide-react"
import UserMap from "./user-map"

export default function NearbyAlerts() {
    const [selectedFilter, setSelectedFilter] = useState<string>("all")

    const filters = [
        { id: "all", label: "All" },
        { id: "fire", label: "Fire" },
        { id: "medical", label: "Medical" },
        { id: "police", label: "Police" },
        { id: "accident", label: "Accident" },
    ]

    const alerts = [
        {
            id: 1,
            type: "Fire",
            location: "Block 4, Connaught Place",
            distance: "2.1 km",
            time: "5 min ago",
            severity: "high" as const,
            status: "Active",
            details: "Structural fire reported on 2nd floor",
            lat: 28.6328,
            lng: 77.2197
        },
        {
            id: 2,
            type: "Medical",
            location: "Rajpath, Central Delhi",
            distance: "3.5 km",
            time: "12 min ago",
            severity: "medium" as const,
            status: "Responding",
            details: "Medical emergency - cardiac arrest",
            lat: 28.6129,
            lng: 77.2295
        },
        {
            id: 3,
            type: "Accident",
            location: "India Gate Circle",
            distance: "4.2 km",
            time: "18 min ago",
            severity: "low" as const,
            status: "Resolved",
            details: "Minor vehicle collision",
            lat: 28.6127,
            lng: 77.2295
        },
        {
            id: 4,
            type: "Police",
            location: "Khan Market",
            distance: "5.8 km",
            time: "25 min ago",
            severity: "medium" as const,
            status: "Active",
            details: "Security incident reported",
            lat: 28.6000,
            lng: 77.2300
        },
    ]

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high": return "bg-red-500"
            case "medium": return "bg-orange-500"
            case "low": return "bg-yellow-500"
            default: return "bg-gray-500"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "text-red-500"
            case "Responding": return "text-orange-500"
            case "Resolved": return "text-green-500"
            default: return "text-gray-500"
        }
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden pb-16">
            {/* Header */}
            <div className="gradient-header border-b border-border px-4 py-6">
                <h1 className="text-2xl font-bold mb-1">Nearby Alerts</h1>
                <p className="text-sm text-muted-foreground">Stay informed about incidents in your area</p>
            </div>

            {/* Map with Incidents */}
            <div className="relative h-[250px] bg-muted/30 border-b border-border">
                <UserMap incidents={alerts} />
            </div>

            {/* Filters */}
            <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`
                px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                transition-all duration-300 ios-press
                ${selectedFilter === filter.id
                                    ? "bg-primary text-primary-foreground shadow-apple"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }
              `}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className="card-elevated rounded-2xl p-4 shadow-apple border border-border/50 hover:border-primary/30 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} animate-pulse`} />
                                <h3 className="font-bold text-base text-foreground">{alert.type}</h3>
                            </div>
                            <span className={`text-xs font-semibold ${getStatusColor(alert.status)}`}>
                                {alert.status}
                            </span>
                        </div>

                        {/* Details */}
                        <p className="text-sm text-muted-foreground mb-3">{alert.details}</p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{alert.distance}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{alert.time}</span>
                                </div>
                            </div>
                            <button className="text-primary font-semibold">View Details</button>
                        </div>

                        {/* Location */}
                        <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">{alert.location}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Safety Banner */}
            <div className="px-4 pb-4">
                <div className="glass-strong rounded-xl p-3 border border-primary/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">You're Safe</p>
                        <p className="text-xs text-muted-foreground">No active alerts in your immediate area</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
