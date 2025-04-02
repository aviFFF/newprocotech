// import { Message } from 'ai'
// import { Readable } from 'stream'

// // Helper function to create a streaming response
// function StreamingTextResponse(stream: Readable) {
//   const readableStream = new ReadableStream({
//     start(controller) {
//       stream.on('data', (chunk) => controller.enqueue(new TextEncoder().encode(chunk)));
//       stream.on('end', () => controller.close());
//       stream.on('error', (err) => controller.error(err));
//     },
//   });

//   return new Response(readableStream, {
//     headers: { 'Content-Type': 'text/event-stream' },
//   });
// }
// import { Configuration, OpenAIApi } from 'openai'
// import { NextResponse } from 'next/server'

// // IMPORTANT: Set the runtime to edge
// export const runtime = "edge"

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json()

//     const configuration = new Configuration({
//       apiKey: process.env.OPENAI_API_KEY,
//     })

//     const openai = new OpenAI(configuration)
//     const openai = new OpenAIApi(configuration)
//     const response = await openai.createChatCompletion({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful assistant for a software development company called Proco. You can help with information about our courses, services, and general programming questions. Be friendly, professional, and concise."
//         },
//         ...messages
//       ],
//       stream: true,
//     })

//     // Return the response as a streaming response
//     return new StreamingTextResponse(response.data)
//   } catch (error) {
//     return NextResponse.json({ error: "Error processing your request" }, { status: 500 })
//   }
// }

