"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  duration: z.string().min(2, { message: "Duration is required." }),
})

type FormValues = z.infer<typeof formSchema>

interface CourseFormProps {
  initialData?: FormValues & { id?: number }
  isEditing?: boolean
}

export default function CourseForm({ initialData, isEditing = false }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize form with initial data if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      duration: "",
    },
  })

  // Form submission handler
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      const url = isEditing && initialData?.id ? `/api/admin/courses/${initialData.id}` : "/api/admin/courses"

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
        // Show a more helpful error message to guide the user
        const errorMessage = result.error || "Something went wrong";
        
        if (errorMessage.includes("table") && errorMessage.includes("does not exist")) {
          // Database setup error - show guidance
          toast({
            title: "Database Setup Required",
            description: (
              <div className="space-y-2">
                <p>The database tables have not been set up yet.</p>
                <a 
                  href="/admin/setup" 
                  className="block text-violet-600 underline hover:text-violet-800"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/admin/setup");
                  }}
                >
                  Go to Database Setup Page
                </a>
              </div>
            ),
            variant: "destructive",
            duration: 10000, // Show for longer
          });
        } else {
          // Standard error
          toast({
            title: "Submission Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
        
        throw new Error(errorMessage);
      }

      // Show success message
      toast({
        title: isEditing ? "Course Updated" : "Course Created",
        description: isEditing
          ? "The course has been updated successfully."
          : "The course has been created successfully.",
      })

      // Redirect to courses list
      router.push("/admin/courses")
      router.refresh()
    } catch (error) {
      console.error("Error submitting course:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Course description" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 8 weeks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/courses")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

