export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  phone: string;
  birthdate: string;
  role: 'citizen' | 'cityofficial' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  image_url?: string;
  status: ReportStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  by: string;
  user_id?: string;
  by_user?: User;
  upvotes: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  group_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export interface Reel {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  user_id?: string;
  likes: number;
  comments: number;
  created_at: string;
}

export type ReportCategory = 
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'drainage'
  | 'water_leak'
  | 'broken_sign'
  | 'tree_down'
  | 'other';

export type ReportStatus = 'new' | 'in_progress' | 'resolved' | 'rejected';

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}