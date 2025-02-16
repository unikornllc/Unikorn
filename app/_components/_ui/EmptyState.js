import { FolderOpen } from "lucide-react"

export function EmptyState({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
            <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

