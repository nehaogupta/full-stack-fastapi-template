import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import type { EmpPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteEmp from "../Emp/DeleteEmp"
import EditEmp from "../Emp/EditEmp"

interface EmpActionsMenuProps {
  emp: EmpPublic
}

export const EmpActionsMenu = ({ emp }: EmpActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditEmp emp={emp} onSuccess={() => setOpen(false)} />
        <DeleteEmp id={emp.empcode} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
