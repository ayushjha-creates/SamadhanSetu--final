'use client';

import { useState, useRef } from 'react';
import { ReportCategory } from '@/types';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../LeafletMap/LeafletMap'), { ssr: false });

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const categories: { value: ReportCategory; label: string; icon: string }[] = [
  { value: 'pothole', label: 'Pothole', icon: '🕳️' },
  { value: 'streetlight', label: 'Streetlight', icon: '💡' },
  { value: 'garbage', label: 'Garbage', icon: '🗑️' },
  { value: 'drainage', label: 'Drainage', icon: '🚰' },
  { value: 'water_leak', label: 'Water Leak', icon: '💧' },
  { value: 'broken_sign', label: 'Broken Sign', icon: '🚧' },
  { value: 'tree_down', label: 'Tree Down', icon: '🌳' },
  { value: 'other', label: 'Other', icon: '📍' },
];

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ReportCategory | '',
    priority: 'medium',
    location: { lat: 23.2599, lng: 77.4126, address: '' },
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: { lat: 23.2599, lng: 77.4126, address: '' },
        image_url: '',
      });
      setStep(1);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData({
      ...formData,
      location: {
        ...location,
        address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        setFormData({ ...formData, image_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    setFormData({ ...formData, image_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2>Report an Issue</h2>
        
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <h3>Select Category</h3>
              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-btn ${formData.category === cat.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)} disabled={!formData.category}>
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief title of the issue"
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue in detail"
                  rows={3}
                  required
                />
              </div>
              <div className="input-group">
                <label>Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="low">Low - Minor inconvenience</option>
                  <option value="medium">Medium - Affecting daily life</option>
                  <option value="high">High - Safety hazard</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Photo (Optional)</label>
                <div className="photo-upload">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="file-input"
                    id="photo-upload"
                  />
                  {!previewUrl ? (
                    <label htmlFor="photo-upload" className="upload-label">
                      <span className="upload-icon">📷</span>
                      <span>Click to upload photo</span>
                      <span className="upload-hint">Max 5MB (JPG, PNG)</span>
                    </label>
                  ) : (
                    <div className="preview-container">
                      <img src={previewUrl} alt="Preview" className="preview-image" />
                      <button type="button" className="remove-photo" onClick={removePhoto}>
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="step-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)} disabled={!formData.title || !formData.description}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Select Location</h3>
              <p className="hint">Click on the map to mark the exact location</p>
              <div className="map-container">
                <LeafletMap
                  center={[formData.location.lat, formData.location.lng]}
                  markers={[{ position: [formData.location.lat, formData.location.lng], popup: 'Issue Location', type: 'issue' }]}
                  onMapClick={handleLocationSelect}
                  height="280px"
                />
              </div>
              <div className="input-group">
                <label>Selected Location</label>
                <input type="text" value={formData.location.address} readOnly placeholder="Click on map to select location" />
              </div>
              <div className="step-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="btn btn-primary" disabled={loading || !formData.location.address}>
                  {loading ? '⏳ Submitting...' : '✅ Submit Report'}
                </button>
              </div>
            </div>
          )}
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }
          .modal-content {
            background: white;
            border-radius: 16px;
            padding: 32px;
            width: 100%;
            max-width: 560px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
          }
          .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f0f0f0;
            border: none;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .modal-close:hover { background: #e0e0e0; }
          h2 { margin-bottom: 24px; color: #1a1a2e; font-size: 24px; }
          .progress-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 28px;
          }
          .progress-step {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            color: #666;
          }
          .progress-step.active {
            background: #3498db;
            color: white;
          }
          .progress-line {
            width: 50px;
            height: 2px;
            background: #e0e0e0;
            margin: 0 8px;
          }
          .step-content h3 { margin-bottom: 16px; color: #1a1a2e; font-size: 18px; }
          .category-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }
          .category-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 14px 8px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s;
          }
          .category-btn:hover { border-color: #3498db; }
          .category-btn.selected {
            border-color: #3498db;
            background: rgba(52, 152, 219, 0.1);
          }
          .cat-icon { font-size: 24px; }
          .input-group { margin-bottom: 16px; }
          .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #1a1a2e;
            font-size: 14px;
          }
          .input-group input,
          .input-group textarea,
          .input-group select {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            transition: border-color 0.2s;
          }
          .input-group input:focus,
          .input-group textarea:focus,
          .input-group select:focus {
            outline: none;
            border-color: #3498db;
          }
          .photo-upload {
            border: 2px dashed #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .file-input { display: none; }
          .upload-label {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: #666;
          }
          .upload-icon { font-size: 36px; }
          .upload-hint { font-size: 12px; color: #999; }
          .preview-container {
            position: relative;
            display: inline-block;
          }
          .preview-image {
            max-width: 100%;
            max-height: 200px;
            border-radius: 10px;
          }
          .remove-photo {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #e74c3c;
            color: white;
            border: none;
            font-size: 18px;
            cursor: pointer;
          }
          .hint { color: #666; font-size: 14px; margin-bottom: 12px; }
          .map-container {
            margin-bottom: 16px;
            border-radius: 12px;
            overflow: hidden;
          }
          .step-buttons { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
          .btn {
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-primary {
            background: #3498db;
            color: white;
            border: none;
          }
          .btn-primary:hover { background: #2980b9; }
          .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
          .btn-outline {
            background: transparent;
            border: 2px solid #3498db;
            color: #3498db;
          }
          .btn-outline:hover { background: #3498db; color: white; }
          @media (max-width: 500px) {
            .category-grid { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
      </div>
    </div>
  );
}