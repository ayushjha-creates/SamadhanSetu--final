'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/app/providers';
import { Reel, ChatMessage } from '@/types';

const mockReels: Reel[] = [
  {
    id: '1',
    user_id: '1',
    title: 'Cleanup Drive',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    description: '🌊 Amazing cleanup drive at Upper Lake! Over 200 volunteers participated. Thank you all! #BhopalCleanup #GreenBhopal',
    likes: 342,
    comments: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '2',
    title: 'Road Repair',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
    description: '🚀 Roads repaired in just 24 hours! MP Nagar Main Road is now motorable. Great work by PWD! #RoadRepair #Bhopal',
    likes: 189,
    comments: 28,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '3',
    title: 'Tree Plantation',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    description: '🌳 Planted 500 trees today at Van Vihar! Let\'s make Bhopal greener together. #TreePlantation #GreenCity',
    likes: 567,
    comments: 89,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '4',
    title: 'Water Fix',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    description: '💧 Water pipeline leak fixed in Bawaria Kalan. Thanks to the water department for quick action! #WaterSupply #CivicDuty',
    likes: 234,
    comments: 34,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    user_id: '5',
    title: 'Garbage Cleanup',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    description: '🗑️ Massive garbage cleanup at TT Nagar! Community coming together. #SwachhBharat #CleanBhopal',
    likes: 421,
    comments: 67,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    user_id: '6',
    title: 'Street Lights',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
    description: '💡 Streetlights installed at Arera Colony! Area is now safe at night. #StreetLight #SafetyFirst',
    likes: 178,
    comments: 23,
    created_at: new Date().toISOString(),
  },
];

const groups = [
  { id: 'general', name: 'General Discussion', icon: '💬', members: 2450 },
  { id: 'green', name: 'Green Warriors', icon: '🌱', members: 1820 },
  { id: 'cleanup', name: 'Clean Bhopal', icon: '🧹', members: 1567 },
  { id: 'wildlife', name: 'Wildlife Bhopal', icon: '🦌', members: 890 },
  { id: 'roads', name: 'Roads & Infrastructure', icon: '🛣️', members: 1234 },
];

export default function EcoVoicePage() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'reels' | 'chat' | 'groups'>('reels');
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(groups[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?group_id=${selectedGroup}`);
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (error) {
      setMessages([
        { id: '1', sender_id: '1', sender_name: 'Priya', group_id: selectedGroup, message: 'Great initiative! Count me in for the cleanup drive.', created_at: new Date().toISOString() },
        { id: '2', sender_id: '2', sender_name: 'Rahul', group_id: selectedGroup, message: 'When and where is the meetup?', created_at: new Date().toISOString() },
        { id: '3', sender_id: '3', sender_name: 'Anita', group_id: selectedGroup, message: 'I\'ll bring gloves and bags!', created_at: new Date().toISOString() },
      ]);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender_id: user?.id || 'guest',
      sender_name: user?.full_name || 'Guest',
      group_id: selectedGroup,
      message: newMessage,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleLike = (reelId: string) => {
    setReels(reels.map(r => r.id === reelId ? { ...r, likes: r.likes + 1 } : r));
  };

  return (
    <div className="ecovoice-page">
<header className="eco-header">
        <div className="eco-header-content">
          <Link href="/" className="eco-logo-box">
            <img src="/logo.png" alt="Samadhan Setu" className="eco-logo-img" />
            <span className="eco-logo-text">Samadhan Setu</span>
          </Link>
          <nav className="eco-nav">
            <Link href="/home" className="eco-nav-link">🏠 Home</Link>
            <Link href="/viewmap" className="eco-nav-link">🗺️ Map</Link>
            <Link href="/donation" className="eco-nav-link">💝 Donate</Link>
            <Link href="/ecovoice" className="eco-nav-link active">🌿 EcoVoice</Link>
            <Link href="/natureheroes" className="eco-nav-link">🌳 Nature</Link>
          </nav>
          <div className="eco-header-actions">
            <button onClick={toggleTheme} className="eco-theme-btn">{isDark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </header>

      <div className="eco-tabs">
        <button className={`eco-tab ${activeTab === 'reels' ? 'active' : ''}`} onClick={() => setActiveTab('reels')}>
          📹 Reels
        </button>
        <button className={`eco-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          💬 Chat
        </button>
        <button className={`eco-tab ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => setActiveTab('groups')}>
          👥 Groups
        </button>
      </div>

      <main className="eco-content">
        {activeTab === 'reels' && (
          <div className="reels-section">
            <div className="section-header">
              <h2>🌍 Community Reels</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowUpload(true)}>
                + Share Reel
              </button>
            </div>
            <div className="reels-grid">
              {reels.map((reel) => (
                <div key={reel.id} className="reel-card">
                  <div className="reel-thumbnail" style={{ backgroundImage: `url(${reel.thumbnail_url})` }}>
                    <div className="play-overlay">
                      <span>▶️</span>
                    </div>
                    <div className="reel-duration">0:30</div>
                  </div>
                  <div className="reel-details">
                    <div className="reel-user">
                      <span className="user-avatar">{(reel as any).user_name?.charAt(0) || 'U'}</span>
                      <span className="user-name">@{ (reel as any).user_name || 'user' }</span>
                    </div>
                    <p className="reel-caption">{reel.description || (reel as any).caption}</p>
                    <div className="reel-stats">
                      <button onClick={() => handleLike(reel.id)}>❤️ {reel.likes}</button>
                      <span>💬 {reel.comments}</span>
                      <span>🔗 Share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-section">
            <div className="groups-list">
              {groups.map((group) => (
                <button
                  key={group.id}
                  className={`group-item ${selectedGroup === group.id ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <span className="group-icon">{group.icon}</span>
                  <div className="group-info">
                    <span className="group-name">{group.name}</span>
                    <span className="group-members">{group.members.toLocaleString()} members</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="chat-main">
              <div className="chat-header">
                <span className="chat-title">{groups.find(g => g.id === selectedGroup)?.icon} {groups.find(g => g.id === selectedGroup)?.name}</span>
              </div>
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.sender_id === user?.id ? 'own' : ''}`}>
                    <span className="msg-avatar">{msg.sender_name.charAt(0)}</span>
                    <div className="msg-bubble">
                      <span className="msg-name">{msg.sender_name}</span>
                      <p>{msg.message}</p>
                      <span className="msg-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="groups-section">
            <div className="section-header">
              <h2>👥 Community Groups</h2>
            </div>
            <div className="groups-grid">
              {groups.map((group) => (
                <div key={group.id} className="group-card">
                  <span className="group-icon-lg">{group.icon}</span>
                  <h3>{group.name}</h3>
                  <p className="members">{group.members.toLocaleString()} active members</p>
                  <p className="desc">Join the conversation and make a difference in Bhopal</p>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => { setSelectedGroup(group.id); setActiveTab('chat'); }}
                  >
                    Join Group
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📹 Share a Reel</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowUpload(false); alert('Reel shared successfully! 🎉'); }}>
              <div className="input-group">
                <label>Video URL (YouTube/TikTok)</label>
                <input type="url" placeholder="https://..." />
              </div>
              <div className="input-group">
                <label>Caption</label>
                <textarea placeholder="Write a caption about your civic initiative..." rows={3} />
              </div>
              <div className="upload-preview">
                <span>📁</span>
                <p>Drag & drop or click to upload</p>
              </div>
              <button type="submit" className="btn btn-primary">Share Reel</button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .ecovoice-page {
          min-height: 100vh;
          background: var(--background-light);
        }
        [data-theme="dark"] .ecovoice-page {
          background: var(--background-dark);
        }
        .eco-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 24px;
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          color: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .eco-logo-box {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .eco-logo-img {
          height: 44px;
          border-radius: 8px;
        }
        .eco-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }
        .eco-nav {
          display: flex;
          gap: 12px;
        }
        .eco-nav-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          transition: all 0.3s;
        }
        .eco-nav-link:hover, .eco-nav-link.active {
          background: rgba(255,255,255,0.15);
          border-color: white;
        }
        .eco-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .theme-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
        .user-badge .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          color: #27ae60;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .eco-tabs {
          display: flex;
          background: var(--card-light);
          border-bottom: 1px solid var(--border-light);
        }
        [data-theme="dark"] .eco-tabs {
          background: var(--card-dark);
          border-color: var(--border-dark);
        }
        .eco-tab {
          flex: 1;
          padding: 16px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-muted);
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        .eco-tab.active {
          color: #27ae60;
          border-bottom-color: #27ae60;
        }
        .eco-content {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .section-header h2 {
          font-size: 22px;
          color: var(--text-primary);
        }
        [data-theme="dark"] .section-header h2 {
          color: var(--text-light);
        }
        .reels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .reel-card {
          background: var(--card-light);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="dark"] .reel-card {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .reel-thumbnail {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          cursor: pointer;
        }
        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .reel-thumbnail:hover .play-overlay { opacity: 1; }
        .reel-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .reel-details { padding: 16px; }
        .reel-user {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #27ae60;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }
        .user-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        [data-theme="dark"] .user-name { color: var(--text-light); }
        .reel-caption {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .reel-stats {
          display: flex;
          gap: 16px;
        }
        .reel-stats button, .reel-stats span {
          background: none;
          font-size: 13px;
          color: var(--text-muted);
        }
        .reel-stats button { cursor: pointer; }
        .chat-section {
          display: flex;
          gap: 20px;
          height: calc(100vh - 250px);
        }
        .groups-list {
          width: 280px;
          background: var(--card-light);
          border-radius: 14px;
          overflow: hidden;
        }
        [data-theme="dark"] .groups-list {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .group-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          width: 100%;
          background: none;
          border: none;
          border-bottom: 1px solid var(--border-light);
          text-align: left;
        }
        [data-theme="dark"] .group-item {
          border-color: var(--border-dark);
        }
        .group-item.active { background: rgba(39, 174, 96, 0.1); }
        .group-icon {
          font-size: 24px;
        }
        .group-info {
          display: flex;
          flex-direction: column;
        }
        .group-name { font-weight: 600; font-size: 14px; color: var(--text-primary); }
        [data-theme="dark"] .group-name { color: var(--text-light); }
        .group-members { font-size: 12px; color: var(--text-muted); }
        .chat-main {
          flex: 1;
          background: var(--card-light);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
        }
        [data-theme="dark"] .chat-main {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-light);
        }
        [data-theme="dark"] .chat-header { border-color: var(--border-dark); }
        .chat-title { font-weight: 600; font-size: 16px; }
        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-message {
          display: flex;
          gap: 10px;
        }
        .chat-message.own { flex-direction: row-reverse; }
        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .msg-bubble {
          background: var(--background-light);
          padding: 10px 14px;
          border-radius: 14px;
          max-width: 70%;
        }
        [data-theme="dark"] .msg-bubble { background: var(--border-dark); }
        .chat-message.own .msg-bubble {
          background: #27ae60;
          color: white;
        }
        .msg-name { font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px; }
        .chat-message.own .msg-name { opacity: 0.8; }
        .msg-bubble p { font-size: 14px; margin: 0; }
        .msg-time { font-size: 10px; opacity: 0.7; display: block; margin-top: 4px; }
        .chat-input {
          display: flex;
          gap: 10px;
          padding: 16px;
          border-top: 1px solid var(--border-light);
        }
        [data-theme="dark"] .chat-input { border-color: var(--border-dark); }
        .chat-input input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid var(--border-light);
          border-radius: 25px;
          font-size: 14px;
          background: var(--background-light);
          color: var(--text-primary);
        }
        [data-theme="dark"] .chat-input input {
          background: var(--border-dark);
          border-color: var(--border-dark);
          color: var(--text-light);
        }
        .groups-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .group-card {
          background: var(--card-light);
          padding: 32px;
          border-radius: 14px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="dark"] .group-card {
          background: var(--card-dark);
          border: 1px solid var(--border-dark);
        }
        .group-icon-lg { font-size: 48px; display: block; margin-bottom: 12px; }
        .group-card h3 { margin-bottom: 8px; color: var(--text-primary); }
        [data-theme="dark"] .group-card h3 { color: var(--text-light); }
        .members { color: #27ae60; font-weight: 600; margin-bottom: 8px; }
        .desc { color: var(--text-muted); font-size: 14px; margin-bottom: 16px; }
        .upload-preview {
          border: 2px dashed var(--border-light);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          margin-bottom: 20px;
          cursor: pointer;
        }
        [data-theme="dark"] .upload-preview { border-color: var(--border-dark); }
        .upload-preview span { font-size: 48px; display: block; margin-bottom: 12px; }
        .upload-preview p { color: var(--text-muted); }
        @media (max-width: 900px) {
          .reels-grid, .groups-grid { grid-template-columns: 1fr; }
          .chat-section { flex-direction: column; height: auto; }
          .groups-list { width: 100%; }
          .chat-main { height: 400px; }
        }
      `}</style>
    </div>
  );
}