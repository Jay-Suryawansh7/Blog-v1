'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import { ArrowLeft, Save, Image as ImageIcon, Video, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(!!postId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (postId) {
      fetch(`/api/posts/${postId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Post not found');
          return res.json();
        })
        .then((data: Post) => {
          setTitle(data.title);
          setContent(data.content);
          setImageUrl(data.imageUrl || '');
          setFetching(false);
        })
        .catch(() => {
          router.push('/');
        });
    }
  }, [postId, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleContentUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const url = data.imageUrl;

      let insertText = '';
      if (type === 'image') {
        insertText = `\n![${file.name}](${url})\n`;
      } else if (type === 'video') {
        insertText = `\n<video src="${url}" controls width="100%"></video>\n`;
      } else {
        insertText = `\n[Download ${file.name}](${url})\n`;
      }

      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + insertText + content.substring(end);
        setContent(newContent);
        
        // Restore cursor position after insertion (approximate)
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + insertText.length, start + insertText.length);
        }, 0);
      } else {
        setContent((prev) => prev + insertText);
      }

    } catch (error) {
      alert(`Error uploading ${type}`);
    } finally {
      setUploading(false);
      // Reset input value to allow uploading same file again
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = postId ? `/api/posts/${postId}` : '/api/posts';
    const method = postId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      if (!res.ok) throw new Error('Failed to save');

      router.push('/');
      router.refresh();
    } catch (error) {
      alert('Error saving post');
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-white/40 animate-pulse">Loading editor...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Cancel
        </Link>
        <button
          type="submit"
          disabled={loading || uploading}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Image Upload Section */}
        <div className="relative group">
          {imageUrl ? (
            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10">
              <img src={imageUrl} alt="Post thumbnail" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-sm text-white/60">
                  {uploading ? 'Uploading...' : 'Click to upload thumbnail'}
                </p>
              </div>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
            </label>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-5xl font-bold placeholder-white/20 focus:outline-none border-b border-transparent focus:border-white/10 pb-4 transition-colors"
            required
          />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-t-md border border-white/10 border-b-0">
            <span className="text-xs text-white/40 mr-2 uppercase tracking-wider font-semibold">Insert:</span>
            
            <label className="p-2 hover:bg-white/10 rounded cursor-pointer text-white/60 hover:text-white transition-colors" title="Insert Image">
              <ImageIcon size={18} />
              <input type="file" className="hidden" onChange={(e) => handleContentUpload(e, 'image')} accept="image/*" disabled={uploading} />
            </label>
            
            <label className="p-2 hover:bg-white/10 rounded cursor-pointer text-white/60 hover:text-white transition-colors" title="Insert Video">
              <Video size={18} />
              <input type="file" className="hidden" onChange={(e) => handleContentUpload(e, 'video')} accept="video/*" disabled={uploading} />
            </label>
            
            <label className="p-2 hover:bg-white/10 rounded cursor-pointer text-white/60 hover:text-white transition-colors" title="Insert Document">
              <FileText size={18} />
              <input type="file" className="hidden" onChange={(e) => handleContentUpload(e, 'file')} accept=".pdf,.doc,.docx,.txt" disabled={uploading} />
            </label>
          </div>
          
          <textarea
            ref={textareaRef}
            placeholder="Write your story... (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[60vh] bg-transparent text-lg leading-relaxed placeholder-white/20 focus:outline-none resize-none p-4 border border-white/10 rounded-b-md focus:border-white/20 transition-colors"
            required
          />
        </div>
      </div>
    </form>
  );
}
