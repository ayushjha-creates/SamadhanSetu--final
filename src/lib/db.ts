import { supabase, TABLES } from './supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, Report, Donation, ChatMessage, Reel } from '@/types';

class SupabaseDatabase {
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'role'> & { password: string }): Promise<User> {
    const { data: existing } = await supabase
      .from(TABLES.USERS)
      .select('email')
      .eq('email', userData.email)
      .single();

    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert({
        email: userData.email,
        password: hashedPassword,
        full_name: userData.full_name,
        username: userData.username,
        phone: userData.phone || '',
        birthdate: userData.birthdate || '',
        role: 'citizen',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  async verifyUser(email: string, password: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createReport(reportData: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'upvotes'>): Promise<Report> {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .insert({
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        location: reportData.location,
        image_url: reportData.image_url || '',
        status: 'new',
        priority: reportData.priority || 'medium',
        by: reportData.by || 'anonymous',
        user_id: reportData.user_id || null,
        upvotes: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getReports(filters?: { category?: string; status?: string; userId?: string }): Promise<Report[]> {
    let query = supabase
      .from(TABLES.REPORTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async getReportById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report | null> {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    return data;
  }

  async deleteReport(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLES.REPORTS)
      .delete()
      .eq('id', id);

    return !error;
  }

  async createDonation(donationData: Omit<Donation, 'id' | 'created_at'>): Promise<Donation> {
    const { data, error } = await supabase
      .from(TABLES.DONATIONS)
      .insert({
        donor_name: donationData.donor_name,
        amount: donationData.amount,
        message: donationData.message || '',
        anonymous: donationData.anonymous || false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getDonations(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from(TABLES.DONATIONS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async createChatMessage(messageData: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from(TABLES.CHAT_MESSAGES)
      .insert({
        group_id: messageData.group_id,
        sender_id: messageData.sender_id,
        sender_name: messageData.sender_name,
        message: messageData.message,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getChatMessages(groupId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from(TABLES.CHAT_MESSAGES)
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async createReel(reelData: Omit<Reel, 'id' | 'created_at' | 'likes' | 'comments'>): Promise<Reel> {
    const { data, error } = await supabase
      .from(TABLES.REELS)
      .insert({
        title: reelData.title,
        description: reelData.description || '',
        video_url: reelData.video_url,
        thumbnail_url: reelData.thumbnail_url || '',
        user_id: reelData.user_id || null,
        likes: 0,
        comments: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getReels(): Promise<Reel[]> {
    const { data, error } = await supabase
      .from(TABLES.REELS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async getStats() {
    const { data: reports } = await supabase.from(TABLES.REPORTS).select('status, priority');
    
    return {
      total: reports?.length || 0,
      pending: reports?.filter(r => r.status === 'new').length || 0,
      inProgress: reports?.filter(r => r.status === 'in_progress').length || 0,
      resolved: reports?.filter(r => r.status === 'resolved').length || 0,
      highPriority: reports?.filter(r => r.priority === 'high' || r.priority === 'critical').length || 0,
    };
  }
}

export const db = new SupabaseDatabase();