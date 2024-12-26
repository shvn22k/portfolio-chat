import { NextResponse } from 'next/server'

export const POST = async (request) => {
  try {
    const { message } = await request.json()
    
    const responses = [
      "Hello! I'm happy to help answer your questions about my experience.",
      "I have extensive experience in web development and software engineering.",
      "I specialize in React, Node.js, and modern web technologies.",
      "Feel free to ask me anything specific about my skills or projects!"
    ]
    
    const response = responses[Math.floor(Math.random() * responses.length)]
    
    return NextResponse.json({ message: response })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

export const OPTIONS = async (request) => {
  return NextResponse.json({}, { status: 200 })
} 