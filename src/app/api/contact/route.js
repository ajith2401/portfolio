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
    
    // Send email with Resend using HTML format
    const { data, error } = await resend.emails.send({
        from: 'Contact Form <contact@ajithkumarr.com>',
        to: recipient,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px 5px 0 0;
              margin-bottom: 20px;
            }
            .message-content {
              padding: 0 15px 15px;
            }
            .field {
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              display: inline-block;
              width: 80px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="message-content">
              <div class="field">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="field">
                <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
              </div>
              <div class="field">
                <span class="label">Subject:</span> ${subject}
              </div>
              <div class="field">
                <span class="label">Message:</span>
              </div>
              <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #ccc; margin: 10px 0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div class="footer">
              This email was sent from the contact form on your website.
            </div>
          </div>
        </body>
        </html>
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