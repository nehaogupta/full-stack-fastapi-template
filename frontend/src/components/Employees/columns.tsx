import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { EmpPublic } from "@/client"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { cn } from "@/lib/utils"
import { EmployeeActionsMenu } from "./EmployeeActionsMenu"

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

export const columns: ColumnDef<EmpPublic>[] = [
  {
    accessorKey: "empcode",
    header: "Employee Code",
    cell: ({ row }) => <CopyId id={row.original.empcode} />,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name || "N/A"}</span>
    ),
  },
  {
    accessorKey: "workemail",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.workemail}</span>
    ),
  },
  {
    accessorKey: "mobile_number",
    header: "Mobile Number",
    cell: ({ row }) => (
      <span
        className={cn(
          "font-mono text-sm",
          !row.original.mobile_number && "italic text-muted-foreground",
        )}
      >
        {row.original.mobile_number || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address
      return (
        <span
          className={cn(
            "max-w-xs truncate block text-muted-foreground",
            !address && "italic",
          )}
        >
          {address || "No address"}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <EmployeeActionsMenu employee={row.original} />
      </div>
    ),
  },
]
