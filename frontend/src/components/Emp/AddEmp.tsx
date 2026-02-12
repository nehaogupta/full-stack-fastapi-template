import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { type EmpCreate, EmpsService } from "@/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  workemail: z.string().min(1, { message: "Work email is required" }),
  mobile_number: z.string().regex(/^[0-9]{10}$/, {message: "Mobile number must be exactly 10 digits",}),
  address: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const AddEmp = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      workemail: "",
      mobile_number: "",
      address: "",
},
  })

  const mutation = useMutation({
    mutationFn: (data: EmpCreate) =>
      EmpsService.createEmp({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Employee created successfully")
      form.reset()
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["emps"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4">
          <Plus className="mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new employee.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Employee name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="workemail"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Work Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="mobile_number"
                      render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mobile <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="10 digit mobile" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                          )}
                          />
                          <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Address" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                            )}
                            />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" disabled={mutation.isPending}>
                                  Cancel
                                  </Button>
                                  </DialogClose>
                                  <LoadingButton type="submit" loading={mutation.isPending}>
                                    Save
                                    </LoadingButton>
                                    </DialogFooter>
                                    </form>
                                    </Form>
                                    </DialogContent>
                                    </Dialog>
                                    )
                                  }
                                  export default AddEmp
