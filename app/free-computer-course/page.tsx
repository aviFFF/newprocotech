import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Award, Users, BookOpen, Computer } from "lucide-react"

export const metadata: Metadata = {
  title: "Free Computer Course - 1 Month Program with Certificate | Procotech",
  description: "Join our comprehensive 1-month free computer course and earn a certificate. Learn computer fundamentals, Microsoft Office, internet basics, and more.",
  keywords: "free computer course, computer basics, Microsoft Office, certificate course, online learning",
}

export default function FreeComputerCoursePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              🎉 Limited Time Offer - Completely FREE!
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Free Computer Course
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Master computer fundamentals in just 1 month and earn a professional certificate
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-yellow-600">1 Month Duration</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-blue-600">Certificate Included</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-green-600">Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Free Computer Course?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Curriculum</h3>
                    <p className="text-gray-600">Cover all essential computer skills from basics to advanced applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Industry-Recognized Certificate</h3>
                    <p className="text-gray-600">Earn a professional certificate to boost your career prospects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Flexible Learning</h3>
                    <p className="text-gray-600">Learn at your own pace with both online and offline resources</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Support</h3>
                    <p className="text-gray-600">Get guidance from experienced instructors throughout your journey</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <Computer className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Course Highlights</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-yellow-600">1 Month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Certificate</span>
                    <span className="font-semibold text-blue-500">Included</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Support</span>
                    <span className="font-semibold text-red-500">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Curriculum
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive 4-week program designed to take you from beginner to proficient
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Week 1</CardTitle>
                </div>
                <CardDescription>Computer Fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Computer Hardware & Software</li>
                  <li>• Operating System Basics</li>
                  <li>• File Management</li>
                  <li>• Keyboard & Mouse Skills</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Week 2</CardTitle>
                </div>
                <CardDescription>Microsoft Office Suite</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Microsoft Word</li>
                  <li>• Microsoft Excel</li>
                  <li>• Microsoft PowerPoint</li>
                  <li>• Document Formatting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Week 3</CardTitle>
                </div>
                <CardDescription>Internet & Email</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Web Browsing</li>
                  <li>• Email Management</li>
                  <li>• Online Safety</li>
                  <li>• Digital Communication</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Week 4</CardTitle>
                </div>
                <CardDescription>Advanced Skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Data Management</li>
                  <li>• Troubleshooting</li>
                  <li>• Digital Tools</li>
                  <li>• Final Project</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Register Now - Limited Seats Available!
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Don't miss this opportunity to enhance your computer skills with our comprehensive free course
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Course Registration Form</CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below to secure your spot in our free computer course
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Embedded Google Form */}
                <div className="w-full">
                  <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdHaCu2OXCAmibeWBpYgXvjlf1y2GhY-cIe_CWakdqL4j2YvQ/viewform?usp=header"
                    width="100%"
                    height="800"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="rounded-b-lg"
                    title="Free Computer Course Registration Form"
                  >
                    Loading…
                  </iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Gain
            </h2>
            <p className="text-xl text-gray-600">
              Transform your career prospects with essential computer skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Certificate</h3>
              <p className="text-gray-600">
                Receive an industry-recognized certificate upon successful completion of the course
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Opportunities</h3>
              <p className="text-gray-600">
                Open doors to new job opportunities in the digital age with essential computer skills
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Computer className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Practical Skills</h3>
              <p className="text-gray-600">
                Learn hands-on skills that you can immediately apply in your personal and professional life
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this course really free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! This is a completely free 1-month computer course including the certificate. 
                  There are no hidden fees or charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are the prerequisites for this course?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No prior computer experience is required. This course is designed for complete beginners 
                  who want to learn computer fundamentals from scratch.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How will the classes be conducted?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Classes will be conducted through a combination of online sessions and practical exercises. 
                  You'll receive access to learning materials and video tutorials.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is the certificate recognized by employers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, our certificate is industry-recognized and can be added to your resume and LinkedIn profile 
                  to showcase your computer skills to potential employers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I miss a class?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All sessions are recorded and made available to registered students. You can catch up on 
                  missed content at your own pace.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How many seats are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We have limited seats available to ensure quality instruction and personalized attention. 
                  Register early to secure your spot!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Computer Learning Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of students who have already transformed their careers with our courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm">Students Enrolled</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm">Completion Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">4.8/5</div>
              <div className="text-sm">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need Help with Registration?
          </h3>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you with any questions about the course
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-300">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>avi.sr00@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>+91 8383811977</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💬</span>
              <span>Whatsapp Available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}