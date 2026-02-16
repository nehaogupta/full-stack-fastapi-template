import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { DepsService } from "@/client"
import { useState } from "react"

export const Route = createFileRoute("/_layout/deps")({
  component: DepPage,
})

function DepPage() {
  const [page] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ["deps", page],
    queryFn: () =>
      DepsService.readDeps({
        skip: 0,
        limit: 10,
      }),
  })

  if (isLoading) return <div>Loading departments...</div>
  if (error) return <div>Error loading departments</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>

      {data?.data?.map((dep: any) => (
        <div
          key={dep.dep_id}
          className="border rounded p-4 mb-3 shadow-sm"
        >
          <p><strong>Name:</strong> {dep.dep_name}</p>
          <p><strong>Code:</strong> {dep.dep_code}</p>
        </div>
      ))}

      {data?.data?.length === 0 && (
        <p>No departments found.</p>
      )}
    </div>
  )
}
