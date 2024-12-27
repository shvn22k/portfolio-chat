import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      console.error('Backend URL is undefined')
      throw new Error('Backend URL not configured')
    }
    
    console.log('Sending request to:', backendUrl)

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
      console.error('Backend response not ok:', await response.text())
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ message: data.answer })

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