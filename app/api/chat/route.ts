import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// IMPORTANT: Set the runtime to edge
export const runtime = "edge"

// Mock data for when API requests fail
const mockCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build modern websites.",
    duration: "8 weeks",
  },
  {
    id: 2,
    title: "React.js Masterclass",
    description: "Master React.js and build powerful single-page applications.",
    duration: "10 weeks",
  },
  {
    id: 3,
    title: "Full-Stack Development",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB.",
    duration: "12 weeks",
  },
];

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment processing and inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    id: 2,
    title: "Healthcare Management System",
    description: "A comprehensive system for managing patient records, appointments, and billing.",
    technologies: ["Angular", "Java", "Spring Boot", "PostgreSQL"],
  },
  {
    id: 3,
    title: "Real Estate Marketplace",
    description: "A platform connecting property buyers, sellers, and agents with advanced search features.",
    technologies: ["Vue.js", "Python", "Django", "AWS"],
  },
];

const mockCompanies = [
  {
    id: 1,
    name: "Acme Inc",
    description: "A leading software development company specializing in enterprise solutions and digital transformation services for Fortune 500 companies.",
  },
  {
    id: 2,
    name: "TechCorp",
    description: "Innovative technology consulting firm focused on AI, machine learning, and cloud architecture for startups and mid-sized businesses.",
  },
  {
    id: 3,
    name: "Innovate Solutions",
    description: "Specializing in custom software development, mobile applications, and UI/UX design for clients across healthcare and finance sectors.",
  },
];

// Function to fetch data from your API endpoints
async function fetchLocalData(query: string) {
  try {
    let courses = mockCourses;
    let projects = mockProjects;
    let companies = mockCompanies;
    
    // In Edge runtime, we can't use relative URLs, so we'll just use the mock data
    // This simplifies the implementation and ensures we always have data to work with
    
    // Normalize the query for searching
    const normalizedQuery = query.toLowerCase();
    
    // Extract keywords for better matching
    const keywords = normalizedQuery.split(/\s+/).filter((word: string) => word.length > 2);
    
    // Search with both exact matches and keyword matches
    const matchedCourses = courses.filter((course: any) => 
      course.title?.toLowerCase().includes(normalizedQuery) || 
      course.description?.toLowerCase().includes(normalizedQuery) ||
      keywords.some(keyword => 
        course.title?.toLowerCase().includes(keyword) || 
        course.description?.toLowerCase().includes(keyword)
      )
    );
    
    const matchedProjects = projects.filter((project: any) => 
      project.title?.toLowerCase().includes(normalizedQuery) || 
      project.description?.toLowerCase().includes(normalizedQuery) ||
      keywords.some(keyword => 
        project.title?.toLowerCase().includes(keyword) || 
        project.description?.toLowerCase().includes(keyword)
      )
    );
    
    const matchedCompanies = companies.filter((company: any) => 
      company.name?.toLowerCase().includes(normalizedQuery) || 
      company.description?.toLowerCase().includes(normalizedQuery) ||
      keywords.some(keyword => 
        company.name?.toLowerCase().includes(keyword) || 
        company.description?.toLowerCase().includes(keyword)
      )
    );
    
    // Prepare the results
    const results = {
      courses: matchedCourses,
      projects: matchedProjects,
      companies: matchedCompanies,
      hasResults: matchedCourses.length > 0 || matchedProjects.length > 0 || matchedCompanies.length > 0
    };
    
    return results;
  } catch (error) {
    console.error('Error fetching local data:', error);
    // Return mock data as a fallback
    return { 
      courses: mockCourses,
      projects: mockProjects, 
      companies: mockCompanies, 
      hasResults: true 
    };
  }
}

// Function to format search results as a text response
function formatSearchResults(results: any) {
  let response = "Here's what I found on our website:\n\n";
  
  if (results.courses.length > 0) {
    response += "**Courses:**\n";
    results.courses.slice(0, 3).forEach((course: any, index: number) => {
      response += `${index + 1}. ${course.title || 'Unnamed Course'}: ${course.description?.substring(0, 100) || 'No description'}...\n`;
    });
    response += "\n";
  }
  
  if (results.projects.length > 0) {
    response += "**Projects:**\n";
    results.projects.slice(0, 3).forEach((project: any, index: number) => {
      response += `${index + 1}. ${project.title || 'Unnamed Project'}: ${project.description?.substring(0, 100) || 'No description'}...\n`;
    });
    response += "\n";
  }
  
  if (results.companies.length > 0) {
    response += "**Companies:**\n";
    results.companies.slice(0, 3).forEach((company: any, index: number) => {
      response += `${index + 1}. ${company.name || 'Unnamed Company'}: ${company.description?.substring(0, 100) || 'No description'}...\n`;
    });
  }
  
  if (!results.hasResults) {
    response = "I couldn't find specific information about that in our website data. Please try asking about our courses, projects, or companies with different keywords.";
  }
  
  return response;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Safety check for empty messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Extract the user's last message
    const userMessage = messages.filter((msg: any) => msg.role === 'user').pop()?.content || '';
    
    if (!userMessage.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Always search local data first (this will use mock data)
    const searchResults = await fetchLocalData(userMessage);
    
    // Prepare the response text
    let responseText;
    if (searchResults.hasResults) {
      responseText = formatSearchResults(searchResults);
    } else {
      responseText = 
        "I can help you learn about our courses, projects, and company partnerships. " +
        "We offer various courses like Web Development, React.js Masterclass, and Full-Stack Development. " +
        "Our projects include E-commerce platforms, Healthcare systems, and Real Estate marketplaces. " +
        "Try asking about specific technologies like 'React', 'JavaScript', or 'Full-Stack development'.";
    }
    
    // Create a response that exactly matches the Vercel AI SDK format
    const encoder = new TextEncoder();
    const messageId = crypto.randomUUID();
    const stream = new ReadableStream({
      async start(controller) {
        // Must start with empty content
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            id: messageId,
            role: "assistant",
            content: ""
          })}\n\n`)
        );
        
        // Send the actual content
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            id: messageId,
            role: "assistant",
            content: responseText
          })}\n\n`)
        );
        
        // End with DONE marker
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

