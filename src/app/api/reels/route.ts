import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return db.getUserById(payload.userId);
}

export async function GET() {
  try {
    const reels = await db.getReels();
    return NextResponse.json({ success: true, data: reels });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { video_url, thumbnail_url, caption } = body;

    if (!video_url || !caption) {
      return NextResponse.json(
        { success: false, error: 'Video URL and caption are required' },
        { status: 400 }
      );
    }

    const reel = await db.createReel({
      user_id: user.id,
      title: caption || 'Untitled',
      video_url,
      thumbnail_url: thumbnail_url || '',
      description: caption,
    });

    return NextResponse.json({ success: true, data: reel });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}