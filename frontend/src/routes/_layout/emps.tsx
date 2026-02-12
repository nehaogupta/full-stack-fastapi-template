import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense } from "react"

import { EmpsService } from "@/client/sdk.gen"
import { DataTable } from "@/components/Common/DataTable"
import AddEmp from "@/components/Emp/AddEmp"
import { columns } from "@/components/Emp/columns"
import PendingEmps from "@/components/Pending/PendingEmps"

function getEmpsQueryOptions() {
  return {
    queryFn: () => EmpsService.readEmps(),
    queryKey: ["emps"],
  }
}

export const Route = createFileRoute("/_layout/emps")({
  component: Emps,
  head: () => ({
    meta: [
      {
        title: "Employees - FastAPI Template",
      },
    ],
  }),
})

function EmpsTableContent() {
  const { data: emps } = useSuspenseQuery(getEmpsQueryOptions())

  if (emps.data.length === 0) {
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

  return <DataTable columns={columns} data={emps.data} />
}

function EmpsTable() {
  return (
    <Suspense fallback={<PendingEmps />}>
      <EmpsTableContent />
    </Suspense>
  )
}

function Emps() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Create and manage your employees</p>
        </div>
        <AddEmp />
      </div>
      <EmpsTable />
    </div>
  )
}
