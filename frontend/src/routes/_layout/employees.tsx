import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense } from "react"

import { EmpsService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddEmployee from "@/components/Employees/AddEmployee"
import { columns } from "@/components/Employees/columns"
import PendingEmployees from "@/components/Pending/PendingEmployees"

function getEmployeesQueryOptions() {
  return {
    queryFn: () => EmpsService.readEmps({limit: 10}),
    queryKey: ["employees"],
  }
}

export const Route = createFileRoute("/_layout/employees")({
  component: Employees,
  head: () => ({
    meta: [
      {
        title: "Employees - FastAPI Cloud",
      },
    ],
  }),
})

function EmployeesTableContent() {
  const { data: employees } = useSuspenseQuery(getEmployeesQueryOptions())

  if (employees.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">You don't have any employees yet</h3>
        <p className="text-muted-foreground">Add a new employee to get started</p>
      </div>
    )
  }

  return <DataTable columns={columns} data={employees.data} />
}

function EmployeesTable() {
  return (
    <Suspense fallback={<PendingEmployees />}>
      <EmployeesTableContent />
    </Suspense>
  )
}

function Employees() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Create and manage your employees</p>
        </div>
        <AddEmployee />
      </div>
      <EmployeesTable />
    </div>
  )
}
