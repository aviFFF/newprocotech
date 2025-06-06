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
import { X } from "lucide-react"

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  technologies: z.array(z.string()).min(1, { message: "At least one technology is required." }),
})

type FormValues = z.infer<typeof formSchema>

interface ProjectFormProps {
  initialData?: FormValues & { id?: number }
  isEditing?: boolean
}

export default function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTech, setNewTech] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Make sure initialData has a valid technologies array
  const sanitizedInitialData = initialData ? {
    ...initialData,
    technologies: Array.isArray(initialData.technologies) ? initialData.technologies : []
  } : undefined

  // Initialize form with initial data if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: sanitizedInitialData || {
      title: "",
      description: "",
      image_url: "",
      url: "",
      technologies: [],
    },
  })

  const technologies = form.watch("technologies")

  const handleAddTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      form.setValue("technologies", [...technologies, newTech.trim()])
      setNewTech("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    form.setValue(
      "technologies",
      technologies.filter((t) => t !== tech),
    )
  }

  // Form submission handler
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Add technologies from component state to form data
      data.technologies = technologies;

      // Make sure technologies isn't empty
      if (data.technologies.length === 0) {
        form.setError('technologies', {
          type: 'manual',
          message: 'Please add at least one technology',
        });
        setIsSubmitting(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const url = isEditing && initialData?.id 
        ? `${baseUrl}/api/admin/projects/${initialData.id}` 
        : `${baseUrl}/api/admin/projects`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show a more helpful error message based on the error type
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
        } else if (errorMessage.includes("technologies") && (errorMessage.includes("column") || errorMessage.includes("schema"))) {
          // Technologies column error - show guidance
          toast({
            title: "Database Update Required",
            description: (
              <div className="space-y-2">
                <p>Your database needs to be updated to include the technologies field.</p>
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
        title: isEditing ? "Project Updated" : "Project Created",
        description: isEditing
          ? "The project has been updated successfully."
          : "The project has been created successfully.",
      });

      // Redirect to projects list
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
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
                <Input placeholder="Project title" {...field} />
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
                <Textarea placeholder="Project description" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={() => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTechnology()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTechnology}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full"
                  >
                    {tech}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTechnology(tech)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tech}</span>
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

