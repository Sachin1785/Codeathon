"use client"

import { Send, Mic, Paperclip, Radio, Phone, Video, AlertCircle, CheckCheck } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const mockMessages = [
    {
        id: 1,
        sender: "Dispatch Center",
        message: "FR-2847, structural fire reported at Block 4. Proceed immediately.",
        time: "14:32",
        type: "system",
        priority: "high"
    },
    {
        id: 2,
        sender: "You",
        message: "Copy that. En route to location.",
        time: "14:33",
        type: "sent",
        status: "read"
    },
    {
        id: 3,
        sender: "Officer Raj Kumar",
        message: "I'm 2 minutes behind you. Will provide backup.",
        time: "14:34",
        type: "received",
    },
    {
        id: 4,
        sender: "You",
        message: "Roger. Heavy traffic on Ring Road.",
        time: "14:35",
        type: "sent",
        status: "read"
    },
    {
        id: 5,
        sender: "Dispatch Center",
        message: "Fire department has been notified. ETA 5 minutes.",
        time: "14:36",
        type: "system",
        priority: "medium"
    },
    {
        id: 6,
        sender: "Dr. Sarah Chen",
        message: "Medical team standing by. Any casualties reported?",
        time: "14:37",
        type: "received",
    },
    {
        id: 7,
        sender: "You",
        message: "2 victims reported. Possible gas cylinder leak.",
        time: "14:38",
        type: "sent",
        status: "delivered"
    },
]

export default function CommsView() {
    const [message, setMessage] = useState("")

    return (
        <div className="flex flex-col h-full bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-bold">Communications</h1>
                            <p className="text-xs text-muted-foreground mt-1">Mission FR-2847 • 5 participants</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 bg-success/10 text-success rounded-xl hover:bg-success/20 transition-all active:scale-95">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all active:scale-95">
                                <Radio className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-accent/10 text-accent rounded-lg text-xs font-medium hover:bg-accent/20 transition-all active:scale-95 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Emergency Alert
                        </button>
                        <button className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-all active:scale-95 flex items-center justify-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            Video Call
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {mockMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex",
                            msg.type === "sent" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[80%] space-y-1",
                            msg.type === "sent" && "items-end"
                        )}>
                            {/* Sender Name */}
                            {msg.type !== "sent" && (
                                <div className="text-xs font-medium text-muted-foreground px-3">
                                    {msg.sender}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={cn(
                                "rounded-2xl px-4 py-2.5 shadow-sm",
                                msg.type === "sent" && "bg-primary text-primary-foreground rounded-tr-sm",
                                msg.type === "received" && "bg-card border border-border rounded-tl-sm",
                                msg.type === "system" && msg.priority === "high" && "bg-accent/10 border border-accent/30 text-accent",
                                msg.type === "system" && msg.priority === "medium" && "bg-warning/10 border border-orange-500/30 text-orange-700 dark:text-orange-400",
                            )}>
                                {msg.type === "system" && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs font-semibold uppercase">
                                            {msg.priority === "high" ? "High Priority" : "System Message"}
                                        </span>
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed">{msg.message}</p>
                            </div>

                            {/* Time and Status */}
                            <div className={cn(
                                "flex items-center gap-1 px-3 text-xs text-muted-foreground",
                                msg.type === "sent" && "justify-end"
                            )}>
                                <span>{msg.time}</span>
                                {msg.type === "sent" && msg.status === "read" && (
                                    <CheckCheck className="w-3.5 h-3.5 text-primary" />
                                )}
                                {msg.type === "sent" && msg.status === "delivered" && (
                                    <CheckCheck className="w-3.5 h-3.5" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-16 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border">
                <div className="px-4 py-3">
                    <div className="flex items-end gap-2">
                        {/* Attachments */}
                        <button className="p-2.5 bg-muted/50 rounded-xl hover:bg-muted transition-all active:scale-95 flex-shrink-0">
                            <Paperclip className="w-5 h-5" />
                        </button>

                        {/* Input */}
                        <div className="flex-1 relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                rows={1}
                                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all max-h-24"
                                style={{ minHeight: "42px" }}
                            />
                        </div>

                        {/* Voice/Send */}
                        {message.trim() ? (
                            <button className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex-shrink-0">
                                <Send className="w-5 h-5" />
                            </button>
                        ) : (
                            <button className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex-shrink-0">
                                <Mic className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Quick Responses */}
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                        {["On my way", "Need backup", "Arrived", "Situation under control"].map((quick) => (
                            <button
                                key={quick}
                                onClick={() => setMessage(quick)}
                                className="px-3 py-1.5 bg-muted/50 border border-border rounded-full text-xs font-medium hover:bg-muted transition-all whitespace-nowrap active:scale-95"
                            >
                                {quick}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
