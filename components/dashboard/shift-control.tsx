"use client"

import { useState } from "react"
import {
  Power,
  Coffee,
  Clock,
  AlertCircle,
  Target,
  Calendar,
} from "lucide-react"
import { ActionButton } from "./action-button"

type PrimaryAction = "clock-in" | "break" | "clock-out" | null

export function ShiftControl() {
  const [activeAction, setActiveAction] = useState<PrimaryAction>(null)

  return (
    <div>
      <h2 className="mb-3 font-semibold">Shift Control</h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {/* Selectable Primary Actions */}
        <ActionButton
          icon={Power}
          label="Clock In"
          size="large"
          active={activeAction === "clock-in"}
          activeColor="green"
          onClick={() => setActiveAction("clock-in")}
        />

        <ActionButton
          icon={Coffee}
          label="Break"
          size="medium"
          active={activeAction === "break"}
          activeColor="yellow"
          onClick={() => setActiveAction("break")}
        />

        <ActionButton
          icon={Clock}
          label="Clock Out"
          size="medium"
          active={activeAction === "clock-out"}
          activeColor="maroon"
          onClick={() => setActiveAction("clock-out")}
        />

        {/* Non-selectable Secondary Actions */}
        <ActionButton icon={AlertCircle} label="Incident" />
        <ActionButton icon={Target} label="Missions" />
        <ActionButton icon={Calendar} label="Leave" />
      </div>
    </div>
  )
}
