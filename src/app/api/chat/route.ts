import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getAuthenticatedUserId(request: NextRequest): string | null {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('group_id');

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const messages = await db.getChatMessages(groupId);
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { group_id, content, image_url } = body;

    if (!group_id || !content) {
      return NextResponse.json(
        { success: false, error: 'Group ID and content are required' },
        { status: 400 }
      );
    }

    const message = await db.createChatMessage({
      sender_id: userId,
      sender_name: user.full_name,
      group_id,
      message: content,
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}