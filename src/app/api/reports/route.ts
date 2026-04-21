import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  return db.getUserById(payload.userId);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const id = searchParams.get('id');

    if (id) {
      const report = await db.getReportById(id);
      if (!report) {
        return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: report });
    }

    const reports = await db.getReports({ category, status });
    const stats = await db.getStats();
    
    return NextResponse.json({ success: true, data: reports, stats });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    const body = await request.json();
    const { title, description, category, location, image_url, priority } = body;

    if (!title || !description || !category || !location) {
      return NextResponse.json(
        { success: false, error: 'Title, description, category, and location are required' },
        { status: 400 }
      );
    }

    const byUserId = user?.id || 'anonymous';
    const report = await db.createReport({
      title,
      description,
      category,
      location,
      image_url: image_url || '',
      status: 'new',
      priority: priority || 'medium',
      by: byUserId,
    });

    return NextResponse.json({ success: true, data: report, message: 'Report created successfully!' });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    if (user.role !== 'cityofficial' && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, priority, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Report ID is required' }, { status: 400 });
    }

    const report = await db.updateReport(id, { status, priority, ...updates });
    
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: report, message: 'Report updated successfully' });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Report ID is required' }, { status: 400 });
    }

    const deleted = await db.deleteReport(id);
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}
