import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);
const recipient = process.env.NODE_ENV === 'production' 
  ? 'ajith24ram@gmail.com'  
  : 'writerajithdev@gmail.com';
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' }, 
        { status: 400 }
      );
    }
    
    // Send email with Resend
    const { data, error } = await resend.emails.send({
        from: 'Contact Form <contact@ajithkumarr.com>', // Initially use this, then change to your domain
        to: recipient, // Use your verified email
        replyTo: email, // Corrected from reply_to to replyTo
        subject: `Contact Form: ${subject}`,
        text: `
    Name: ${name}
    Email: ${email}
    Message:
    ${message}
        `,
    });
    
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { message: 'Failed to send email' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}