// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertTriangle, CheckCircle } from "lucide-react"

// export default function AdminSetupPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     // Reset state
//     setLoading(true)
//     setError(null)
//     setSuccess(false)

//     // Validate password match
//     if (password !== confirmPassword) {
//       setError("Passwords do not match")
//       setLoading(false)
//       return
//     }

//     try {
//       const response = await fetch("/api/admin/create-admin", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ 
//           email, 
//           password,
//           role: "admin" // Explicitly set role to admin
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to create admin user")
//       }

//       setSuccess(true)
//       // Reset form
//       setEmail("")
//       setPassword("")
//       setConfirmPassword("")
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-muted/40">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
//           <CardDescription>
//             Create your first admin user to access the dashboard
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertTriangle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             {success && (
//               <Alert className="bg-green-100 border-green-400 text-green-800">
//                 <CheckCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   Admin user created successfully! You can now{" "}
//                   <Link href="/login" className="font-medium underline">
//                     log in
//                   </Link>
//                   .
//                 </AlertDescription>
//               </Alert>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="admin@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Creating user..." : "Create Admin User"}
//             </Button>
//             <div className="text-sm text-center text-muted-foreground">
//               <Link href="/" className="hover:text-primary">
//                 Return to website
//               </Link>
//             </div>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// } 