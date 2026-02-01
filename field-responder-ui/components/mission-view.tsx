"use client"

import { useState } from "react"
import MapSection from "@/components/map-section"
import MissionHeader from "@/components/mission-header"
import MissionBriefing from "@/components/mission-briefing"
import StatusBar from "@/components/status-bar"
import ActionButtons from "@/components/action-buttons"

export default function MissionView() {
    const [status, setStatus] = useState<"en-route" | "arrived" | "complete">("en-route")
    const [checklist, setChecklist] = useState({
        staging: false,
        assessment: false,
        resources: false,
        victims: false,
    })
    const [missionExpanded, setMissionExpanded] = useState(false)

    const handleChecklistToggle = (item: string) => {
        if (item in checklist) {
            setChecklist((prev) => ({ ...prev, [item]: !prev[item as keyof typeof checklist] }))
        }
    }

    const handleStatusChange = (newStatus: "en-route" | "arrived" | "complete") => {
        setStatus(newStatus)
    }

    return (
        <div className="flex flex-col h-full w-full bg-background overflow-hidden">
            {/* Header with glassmorphism */}
            <div className="flex-shrink-0 z-40">
                <MissionHeader status={status} />
            </div>

            {/* Map section - takes remaining space above bottom sheet */}
            <div className="relative w-full flex-1 overflow-hidden">
                <MapSection />
            </div>

            {/* Mission briefing bottom sheet - positioned at bottom with peek */}
            <MissionBriefing
                isExpanded={missionExpanded}
                onToggle={() => setMissionExpanded(!missionExpanded)}
                checklist={checklist}
                onChecklistToggle={handleChecklistToggle}
            />

            {/* Status bar with functional buttons */}
            <StatusBar status={status} onStatusChange={handleStatusChange} />

            {/* Action buttons */}
            <ActionButtons status={status} onStatusChange={handleStatusChange} />
        </div>
    )
}
