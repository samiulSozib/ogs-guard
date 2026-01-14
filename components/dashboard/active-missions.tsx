export function ActiveMission() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-[#3a000a] to-[#6b0015] p-4 text-white flex items-center justify-between">
      <div>
        <p className="text-sm opacity-80">Site Name</p>
        <p className="font-semibold">Active</p>
        <p className="text-xs opacity-80">
          Shift: 08:00 AM – 04:00 PM
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
        <span className="text-sm font-semibold">60%</span>
      </div>
    </div>
  )
}
