"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  logo_url: z.string().url({ message: "Please enter a valid logo URL." }),
  website: z.string()
    .url({ message: "Please enter a valid website URL." })
    .optional()
    .or(z.literal("")),
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
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      const url = isEditing && initialData?.id 
        ? `${baseUrl}/api/admin/companies/${initialData.id}` 
        : `${baseUrl}/api/admin/companies`

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      let result
      try {
        const text = await response.text()
        result = text ? JSON.parse(text) : {}
      } catch (jsonError) {
        console.error("Error parsing response:", jsonError)
        throw new Error("Invalid response from server. Please try again or check console for details.")
      }

      if (!response.ok) {
        // Show a more helpful error message based on the error type
        const errorMessage = result?.error || "Something went wrong"
        
        if (errorMessage.includes("table") && errorMessage.includes("does not exist")) {
          toast({
            title: "Database Setup Required",
            description: (
              <div className="space-y-2">
                <p>The database tables have not been set up yet.</p>
                <a 
                  href="/admin/setup" 
                  className="block text-blue-600 underline hover:text-blue-800"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/admin/setup")
                  }}
                >
                  Go to Database Setup Page
                </a>
              </div>
            ),
            variant: "destructive",
            duration: 10000,
          })
        } else {
          toast({
            title: "Submission Failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
        
        throw new Error(errorMessage)
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

