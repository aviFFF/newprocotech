"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  logo_url: z.string().url({ message: "Please enter a valid URL." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

interface CompanyFormProps {
  initialData?: FormValues & { id?: number }
  isEditing?: boolean
}

export default function CompanyForm({ initialData, isEditing = false }: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize form with initial data if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      logo_url: "",
      website: "",
    },
  })

  // Form submission handler
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      const url = isEditing && initialData?.id ? `/api/admin/companies/${initialData.id}` : "/api/admin/companies"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      // Show success message
      toast({
        title: isEditing ? "Company Updated" : "Company Created",
        description: isEditing
          ? "The company has been updated successfully."
          : "The company has been created successfully.",
      })

      // Redirect to companies list
      router.push("/admin/companies")
      router.refresh()
    } catch (error) {
      console.error("Error submitting company:", error)

      // Show error message
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/companies")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Company" : "Create Company"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

