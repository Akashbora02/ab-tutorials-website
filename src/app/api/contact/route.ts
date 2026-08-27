import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and message are required' },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email || '',
        phone,
        subject: subject || 'General Inquiry',
        message,
        isRead: false,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully! We will get back to you shortly.', data: newMessage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID required' }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}
