export function TaskCard() {
  return (
    <div className="rounded-xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium">Check Main Entrance</p>
        <span className="text-xs text-yellow-500">Pending</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Verify all doors are locked after 10 PM
      </p>
    </div>
  )
}
