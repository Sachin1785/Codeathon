"use client"

import { MapPin, Phone, Radio, Clock, Navigation, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const mockTeamMembers = [
    {
        id: "FR-2847",
        name: "Officer James Mitchell",
        role: "Security Guard",
        status: "on-duty",
        location: "Block 4, Connaught Place",
        distance: "0.8 km",
        lastUpdate: "2 min ago",
        avatar: "JM",
        incident: "Structural Fire - Block 4"
    },
    {
        id: "FR-2103",
        name: "Dr. Sarah Chen",
        role: "Paramedic",
        status: "on-duty",
        location: "Rajiv Chowk Metro",
        distance: "2.1 km",
        lastUpdate: "5 min ago",
        avatar: "SC",
        incident: "Medical Emergency"
    },
    {
        id: "FR-1892",
        name: "Officer Raj Kumar",
        role: "Fire Fighter",
        status: "available",
        location: "Station 3, Central Delhi",
        distance: "1.5 km",
        lastUpdate: "1 min ago",
        avatar: "RK",
        incident: null
    },
    {
        id: "FR-2456",
        name: "Officer Priya Sharma",
        role: "Traffic Police",
        status: "on-duty",
        location: "Outer Ring Road",
        distance: "4.2 km",
        lastUpdate: "8 min ago",
        avatar: "PS",
        incident: "Traffic Accident"
    },
    {
        id: "FR-1567",
        name: "Officer Mike Johnson",
        role: "Fire Fighter",
        status: "off-duty",
        location: "Home",
        distance: "12 km",
        lastUpdate: "45 min ago",
        avatar: "MJ",
        incident: null
    },
]

export default function TeamView() {
    const onDutyCount = mockTeamMembers.filter(m => m.status === "on-duty").length
    const availableCount = mockTeamMembers.filter(m => m.status === "available").length

    return (
        <div className="flex flex-col h-full bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="px-4 py-4">
                    <h1 className="text-2xl font-bold mb-4">Team</h1>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                            <div className="text-xs text-muted-foreground">On Duty</div>
                            <div className="text-lg font-bold text-success">{onDutyCount}</div>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                            <div className="text-xs text-muted-foreground">Available</div>
                            <div className="text-lg font-bold text-primary">{availableCount}</div>
                        </div>
                        <div className="bg-muted/50 border border-border rounded-lg px-3 py-2">
                            <div className="text-xs text-muted-foreground">Total</div>
                            <div className="text-lg font-bold">{mockTeamMembers.length}</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all active:scale-95">
                            <Radio className="w-4 h-4 inline mr-1" />
                            Broadcast
                        </button>
                        <button className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all active:scale-95">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Map View
                        </button>
                    </div>
                </div>
            </div>

            {/* Team List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {mockTeamMembers.map((member) => (
                    <div
                        key={member.id}
                        className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            {/* Avatar */}
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0",
                                member.status === "on-duty" && "bg-success/20 text-success ring-2 ring-success/30",
                                member.status === "available" && "bg-primary/20 text-primary ring-2 ring-primary/30",
                                member.status === "off-duty" && "bg-muted text-muted-foreground"
                            )}>
                                {member.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-base truncate">{member.name}</h3>
                                    {member.status === "on-duty" && (
                                        <div className="w-2 h-2 bg-success rounded-full animate-pulse flex-shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <span>{member.role}</span>
                                    <span>•</span>
                                    <span className="font-mono">{member.id}</span>
                                </div>
                                <div className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                                    member.status === "on-duty" && "bg-success/20 text-success",
                                    member.status === "available" && "bg-primary/20 text-primary",
                                    member.status === "off-duty" && "bg-muted text-muted-foreground"
                                )}>
                                    {member.status === "on-duty" && <CheckCircle2 className="w-3 h-3" />}
                                    {member.status === "available" && <CheckCircle2 className="w-3 h-3" />}
                                    {member.status === "off-duty" && <AlertCircle className="w-3 h-3" />}
                                    {member.status.toUpperCase().replace("-", " ")}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                                <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all active:scale-95">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-muted/50 rounded-lg hover:bg-muted transition-all active:scale-95">
                                    <Radio className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Current Incident */}
                        {member.incident && (
                            <div className="mb-3 p-2 bg-accent/5 border border-accent/20 rounded-lg">
                                <div className="text-xs font-medium text-accent mb-1">Current Assignment</div>
                                <div className="text-xs text-muted-foreground">{member.incident}</div>
                            </div>
                        )}

                        {/* Location & Status */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">{member.location}</span>
                                <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{member.distance}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Last update: {member.lastUpdate}</span>
                            </div>
                        </div>

                        {/* Navigate Button */}
                        {member.status === "on-duty" && (
                            <button className="w-full mt-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Navigation className="w-4 h-4" />
                                Navigate to Location
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
