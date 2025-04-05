import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    
    console.log({
      envVars: {
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
      },
      message
    })

    if (!backendUrl) {
      throw new Error('Backend URL not configured. Current value: ' + process.env.NEXT_PUBLIC_BACKEND_URL)
    }
    
    console.log('Sending request to:', backendUrl)

    try {
      const response = await fetch(`${backendUrl}/v2/chatbot/ask-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend response not ok:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`)
      }

      const data = await response.json()
      return NextResponse.json({ message: data.answer })
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      if (fetchError.cause && fetchError.cause.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Connection to backend failed. Backend may not be running.' },
          { status: 503 }
        )
      }
      throw fetchError
    }

  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { error: 'Failed to process your request: ' + error.message },
      { status: 500 }
    )
  }
}

export const OPTIONS = async (request) => {
  return NextResponse.json({}, { status: 200 })
} 