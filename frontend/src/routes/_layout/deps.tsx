import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense } from "react"

import { DepsService } from "@/client/sdk.gen"
import { DataTable } from "@/components/Common/DataTable"
import AddDep from "@/components/Dep/AddDep"
import { columns } from "@/components/Dep/columns"
import PendingDep from "@/components/Pending/PendingDeps"

function getDepsQueryOptions() {
  return {
    queryFn: () => DepsService.readDeps(),
    queryKey: ["deps"],
  }
}

export const Route = createFileRoute("/_layout/deps")({
  component: Deps,
  head: () => ({
    meta: [
      {
        title: "Departments - FastAPI Template",
      },
    ],
  }),
})

function DepsTableContent() {
  const { data: deps } = useSuspenseQuery(getDepsQueryOptions())

  if (deps.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">You don't have any departments yet</h3>
        <p className="text-muted-foreground">Add a new department to get started</p>
      </div>
    )
  }

  return <DataTable columns={columns} data={deps.data} />
}

function DepsTable() {
  return (
    <Suspense fallback={<PendingDep />}>
      <DepsTableContent />
    </Suspense>
  )
}

function Deps() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Create and manage your departments</p>
        </div>
        <AddDep />
      </div>
      <DepsTable />
    </div>
  )
}
