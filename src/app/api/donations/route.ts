import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const donations = await db.getDonations();
    return NextResponse.json({ success: true, data: donations });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, donor_name, message, anonymous } = body;

    if (!amount || !donor_name) {
      return NextResponse.json(
        { success: false, error: 'Amount and donor name are required' },
        { status: 400 }
      );
    }

    if (amount < 100 || amount > 100000) {
      return NextResponse.json(
        { success: false, error: 'Donation amount must be between 100 and 100000' },
        { status: 400 }
      );
    }

    const donation = await db.createDonation({ 
      amount, 
      donor_name, 
      message: message || '', 
      anonymous: anonymous || false 
    });
    return NextResponse.json({ success: true, data: donation, message: 'Donation successful!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}