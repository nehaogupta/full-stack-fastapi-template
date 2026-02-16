import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { DepPublic } from "@/client"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { DepActionsMenu } from "./DepActionsMenu"

function CopyId({ id }: { id: string }) {
  const [copiedText, copy] = useCopyToClipboard()
  const isCopied = copiedText === id

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="font-mono text-xs text-muted-foreground">{id}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(id)}
      >
        {isCopied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
        <span className="sr-only">Copy ID</span>
      </Button>
    </div>
  )
}

export const columns: ColumnDef<DepPublic>[] = [
  {
    accessorKey: "dep_id",
    header: "Department ID",
    cell: ({ row }) => <CopyId id={row.original.dep_id} />,
  },
  {
    accessorKey: "dep_code",
    header: "Department Code",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.dep_code}</span>
    ),
  },
  {
    accessorKey: "dep_name",
    header: "Department Name",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.ownerdep?.dep_name ?? "No Department"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DepActionsMenu dep={row.original} />
      </div>
    ),
  },
]
