import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import type { EmpPublic } from "@/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteEmployee from "./DeleteEmployee"
import EditEmployee from "./EditEmployee"

interface EmployeeActionsMenuProps {
  employee: EmpPublic
}

export const EmployeeActionsMenu = ({ employee }: EmployeeActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditEmployee employee={employee} onSuccess={() => setOpen(false)} />
        <DeleteEmployee id={employee.empcode} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
