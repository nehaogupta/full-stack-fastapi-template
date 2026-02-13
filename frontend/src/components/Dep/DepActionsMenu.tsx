import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import type { DepPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteDep from "./DeleteDep"
import EditDep from "./EditDep"

interface DepActionsMenuProps {
  dep: DepPublic
}

export const DepActionsMenu = ({ dep }: DepActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <EditDep dep={dep} onSuccess={() => setOpen(false)} />
        <DeleteDep id={dep.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
