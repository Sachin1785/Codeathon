"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import IncidentDetailView from "@/components/incident-detail-view"
import RightSidebar from "@/components/right-sidebar"

// Dynamic import for Leaflet map to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
})

const mockIncidents = [
  {
    id: 1,
    title: "Structure Fire - Delhi Downtown",
    location: { lat: 28.7041, lng: 77.1025 },
    severity: "critical",
    status: "active",
    time: "2:45 PM",
    reportSource: "voice-call",
    responders: ["Delhi Fire-01", "Delhi Fire-02", "Delhi Fire-03"],
    resources: ["Engine Pump-1", "Aerial Ladder-1", "Hazmat Unit-1"],
    description: "Multi-story commercial building fire reported in Central Delhi",
    arrivedUnits: 3,
    totalUnits: 5,
  },
  {
    id: 2,
    title: "Traffic Accident - Mumbai Highway",
    location: { lat: 19.0906, lng: 72.8679 },
    severity: "high",
    status: "active",
    time: "3:12 PM",
    reportSource: "sms",
    responders: ["Mumbai Police-04", "Mumbai Police-05"],
    resources: ["Ambulance-1", "Rescue Van-1"],
    description: "Multi-vehicle collision on Eastern Express Highway, lanes blocked",
    arrivedUnits: 2,
    totalUnits: 4,
  },
  {
    id: 3,
    title: "Medical Emergency - Bangalore Hospital",
    location: { lat: 12.9716, lng: 77.5946 },
    severity: "high",
    status: "in-transit",
    time: "3:08 PM",
    reportSource: "bluetooth-mesh",
    responders: ["Bangalore Medical-06", "Bangalore Medical-07"],
    resources: ["Ambulance-2", "Ambulance-3"],
    description: "Cardiac arrest reported at hospital, CPR in progress",
    arrivedUnits: 0,
    totalUnits: 2,
  },
  {
    id: 4,
    title: "Industrial Spill - Pune Industrial Area",
    location: { lat: 18.5595, lng: 73.8081 },
    severity: "critical",
    status: "active",
    time: "3:05 PM",
    reportSource: "voice-call",
    responders: ["Pune Hazmat-1", "Pune Emergency-08", "Pune Emergency-09"],
    resources: ["Hazmat Containment-2", "Engine Pump-3"],
    description: "Chemical spill at manufacturing facility near residential zone",
    arrivedUnits: 1,
    totalUnits: 5,
  },
]

const mockPersonnel = [
  // Delhi area personnel (near incident 1)
  { id: 1, name: "Delhi Fire-01", location: { lat: 28.7041, lng: 77.1025 }, status: "on-scene", assignedIncident: 1, role: "Fire Fighter" },
  { id: 2, name: "Delhi Fire-02", location: { lat: 28.7045, lng: 77.1028 }, status: "on-scene", assignedIncident: 1, role: "Fire Fighter" },
  { id: 3, name: "Delhi Fire-03", location: { lat: 28.7038, lng: 77.1022 }, status: "on-scene", assignedIncident: 1, role: "Fire Fighter" },
  { id: 4, name: "Delhi Fire-04", location: { lat: 28.7055, lng: 77.1035 }, status: "available", assignedIncident: null, role: "Fire Fighter" },
  { id: 5, name: "Delhi Medical-01", location: { lat: 28.7030, lng: 77.1015 }, status: "available", assignedIncident: null, role: "Paramedic" },

  // Mumbai area personnel (near incident 2)
  { id: 6, name: "Mumbai Police-04", location: { lat: 19.0906, lng: 72.8679 }, status: "on-scene", assignedIncident: 2, role: "Police Officer" },
  { id: 7, name: "Mumbai Police-05", location: { lat: 19.0908, lng: 72.8682 }, status: "on-scene", assignedIncident: 2, role: "Police Officer" },
  { id: 8, name: "Mumbai Medical-01", location: { lat: 19.0915, lng: 72.8690 }, status: "en-route", assignedIncident: 2, role: "Paramedic" },
  { id: 9, name: "Mumbai Fire-01", location: { lat: 19.0895, lng: 72.8665 }, status: "available", assignedIncident: null, role: "Fire Fighter" },

  // Bangalore area personnel (near incident 3)
  { id: 10, name: "Bangalore Medical-06", location: { lat: 12.9720, lng: 77.5950 }, status: "en-route", assignedIncident: 3, role: "Paramedic" },
  { id: 11, name: "Bangalore Medical-07", location: { lat: 12.9718, lng: 77.5948 }, status: "en-route", assignedIncident: 3, role: "Paramedic" },
  { id: 12, name: "Bangalore Police-01", location: { lat: 12.9710, lng: 77.5940 }, status: "available", assignedIncident: null, role: "Police Officer" },
  { id: 13, name: "Bangalore Fire-01", location: { lat: 12.9725, lng: 77.5955 }, status: "available", assignedIncident: null, role: "Fire Fighter" },

  // Pune area personnel (near incident 4)
  { id: 14, name: "Pune Hazmat-1", location: { lat: 18.5595, lng: 73.8081 }, status: "on-scene", assignedIncident: 4, role: "Hazmat Specialist" },
  { id: 15, name: "Pune Emergency-08", location: { lat: 18.5598, lng: 73.8085 }, status: "on-scene", assignedIncident: 4, role: "Emergency Response" },
  { id: 16, name: "Pune Emergency-09", location: { lat: 18.5592, lng: 73.8078 }, status: "on-scene", assignedIncident: 4, role: "Emergency Response" },
  { id: 17, name: "Pune Medical-01", location: { lat: 18.5600, lng: 73.8090 }, status: "en-route", assignedIncident: 4, role: "Paramedic" },
  { id: 18, name: "Pune Fire-01", location: { lat: 18.5585, lng: 73.8070 }, status: "available", assignedIncident: null, role: "Fire Fighter" },
]

export default function CrisisCommandDashboard() {
  const [selectedIncident, setSelectedIncident] = useState<(typeof mockIncidents)[0] | null>(mockIncidents[0])
  const [incidents, setIncidents] = useState(mockIncidents)
  const [expandedIncident, setExpandedIncident] = useState<number | null>(mockIncidents[0].id)

  const handleSelectIncident = (incident: (typeof mockIncidents)[0]) => {
    setSelectedIncident(incident)
    setExpandedIncident(expandedIncident === incident.id ? null : incident.id)
  }

  return (
    <div className="w-full h-screen bg-background flex overflow-hidden">
      {/* Left Sidebar - Incident List and Details */}
      <div className="w-96 bg-card border-r border-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Crisis Command</h1>
          </div>
          <div className="text-sm text-muted-foreground">{incidents.length} Active Incidents</div>
        </div>

        {/* Top Stats Bar in sidebar */}
        <div className="px-4 py-3 bg-muted/20 border-b border-border flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded p-2">
              <div className="text-xs text-muted-foreground">Personnel</div>
              <div className="text-lg font-bold text-accent">
                {incidents.reduce((sum, inc) => sum + inc.responders.length, 0)}
              </div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="text-xs text-muted-foreground">Equipment</div>
              <div className="text-lg font-bold text-accent">
                {incidents.reduce((sum, inc) => sum + inc.resources.length, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Incident List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-2">
            {incidents.map((incident) => (
              <div key={incident.id}>
                <button
                  onClick={() => handleSelectIncident(incident)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${selectedIncident?.id === incident.id
                      ? "bg-accent/20 border border-accent"
                      : "bg-muted/30 border border-transparent hover:bg-muted/50"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-foreground flex-1 pr-2 line-clamp-1">{incident.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded ${incident.severity === "critical"
                            ? "bg-primary/20 text-primary"
                            : incident.severity === "high"
                              ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                              : incident.severity === "medium"
                                ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                : "bg-green-500/20 text-green-600 dark:text-green-400"
                          }`}
                      >
                        {incident.severity.toUpperCase()}
                      </span>
                      {expandedIncident === incident.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">{incident.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {incident.responders.length} Personnel • Status:{" "}
                      <span className="text-accent capitalize">{incident.status}</span>
                    </div>
                  </div>
                </button>

                {/* Expanded Detail View */}
                {expandedIncident === incident.id && (
                  <div className="mx-2 mt-2 mb-2">
                    <IncidentDetailView incident={incident} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center - Map */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Stats */}
        <div className="bg-card border-b border-border p-4 flex-shrink-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Active Incidents</div>
              <div className="text-2xl font-bold text-foreground">{incidents.length}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Total Personnel</div>
              <div className="text-2xl font-bold text-accent">
                {incidents.reduce((sum, inc) => sum + inc.responders.length, 0)}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Equipment Deployed</div>
              <div className="text-2xl font-bold text-accent">
                {incidents.reduce((sum, inc) => sum + inc.resources.length, 0)}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Critical Incidents</div>
              <div className="text-2xl font-bold text-primary">
                {incidents.filter((inc) => inc.severity === "critical").length}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full h-full rounded-lg overflow-hidden border border-border bg-muted">
            <MapComponent incidents={incidents} selectedIncident={selectedIncident} personnel={mockPersonnel} />
          </div>
        </div>
      </div>

      {/* Right Sidebar - System Status and Graphs */}
      <div className="w-80 bg-card border-l border-border flex flex-col overflow-hidden">
        <RightSidebar incidents={incidents} />
      </div>
    </div>
  )
}
