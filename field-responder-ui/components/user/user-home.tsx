"use client"

import { Flame, Heart, Shield, AlertTriangle, MapPin, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

interface UserHomeProps {
    onNavigateToReport?: (type: string) => void
    activeIncident?: any
}

export default function UserHome({ onNavigateToReport, activeIncident }: UserHomeProps) {

    const emergencyTypes = [
        { id: "fire", icon: Flame, label: "Fire", color: "bg-red-500", hoverColor: "hover:bg-red-600" },
        { id: "medical", icon: Heart, label: "Medical", color: "bg-pink-500", hoverColor: "hover:bg-pink-600" },
        { id: "police", icon: Shield, label: "Police", color: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
        { id: "other", icon: AlertTriangle, label: "Other", color: "bg-orange-500", hoverColor: "hover:bg-orange-600" },
    ]

    const nearbyIncidents = [
        { id: 1, type: "Fire", location: "Block 4, CP", distance: "2.1 km", time: "5 min ago", severity: "high" },
        { id: 2, type: "Medical", location: "Rajpath", distance: "3.5 km", time: "12 min ago", severity: "medium" },
        { id: 3, type: "Accident", location: "India Gate", distance: "4.2 km", time: "18 min ago", severity: "low" },
    ]

    const handleEmergencyClick = (type: string) => {
        // Navigate to report page with pre-selected type
        if (onNavigateToReport) {
            onNavigateToReport(type)
        }
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
            {/* Safety Status Banner */}
            <div className="gradient-header border-b border-border px-4 py-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold">Safety Center</h1>
                    <div className={`w-3 h-3 rounded-full animate-pulse ${activeIncident ? "bg-warning" : "bg-success"}`} />
                </div>
                <p className="text-sm text-muted-foreground">
                    {activeIncident ? "Help is on the way" : "You're in a safe area"}
                </p>
            </div>

            {/* Active Incident Tracker (only shown if user has active incident) */}
            {activeIncident && (
                <div className="mx-4 mt-4">
                    <div className="card-elevated rounded-2xl p-4 shadow-apple-lg border-2 border-primary/30">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-base text-foreground">Help is on the way!</h3>
                                <p className="text-xs text-muted-foreground">Incident #{activeIncident.id}</p>
                            </div>
                            <div className="px-3 py-1 bg-primary/20 rounded-full">
                                <p className="text-xs font-bold text-primary">En Route</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-success" />
                                <span className="font-semibold text-success">ETA: {activeIncident.eta}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Shield className="w-4 h-4" />
                                <span>{activeIncident.responderName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span className="text-xs">{activeIncident.location}</span>
                            </div>
                        </div>

                        {/* Mini progress bar */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-2/3 transition-all duration-500" />
                            </div>
                            <span className="text-xs text-muted-foreground">66%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Emergency Buttons */}
            <div className="px-4 mt-6">
                <h2 className="text-lg font-bold mb-3">Report Emergency</h2>
                <div className="grid grid-cols-2 gap-3">
                    {emergencyTypes.map((emergency) => {
                        const Icon = emergency.icon
                        return (
                            <button
                                key={emergency.id}
                                onClick={() => handleEmergencyClick(emergency.id)}
                                className={`
                  ${emergency.color} ${emergency.hoverColor}
                  text-white rounded-2xl p-6 shadow-apple-lg
                  transition-all duration-300 ios-press
                  hover:scale-105 active:scale-95
                  flex flex-col items-center justify-center gap-3
                `}
                            >
                                <Icon className="w-10 h-10" strokeWidth={2} />
                                <span className="font-bold text-base">{emergency.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Nearby Incidents */}
            <div className="px-4 mt-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold">Nearby Incidents</h2>
                    <button className="text-xs text-primary font-semibold">View All</button>
                </div>
                <div className="space-y-2">
                    {nearbyIncidents.map((incident) => (
                        <div
                            key={incident.id}
                            className="card-elevated rounded-xl p-3 shadow-apple border border-border/50 hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${incident.severity === "high" ? "bg-red-500" :
                                            incident.severity === "medium" ? "bg-orange-500" : "bg-yellow-500"
                                            }`} />
                                        <h3 className="font-semibold text-sm text-foreground">{incident.type}</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{incident.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-primary">{incident.distance}</p>
                                    <p className="text-xs text-muted-foreground">{incident.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safety Tips */}
            <div className="px-4 pb-6">
                <h2 className="text-lg font-bold mb-3">Safety Tips</h2>
                <div className="card-elevated rounded-2xl p-4 shadow-apple bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm mb-1">Stay Prepared</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Keep emergency contacts saved. Know your nearest hospital and police station locations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
