'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Post } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Post not found');
          return res.json();
        })
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      router.push('/');
    }
  };

  if (loading) return <div className="text-center py-20 text-white/40 animate-pulse">Loading...</div>;
  if (!post) return <div className="text-center py-20">Post not found</div>;

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center text-sm text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Home
      </Link>
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-white/40 text-sm border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            {post.authorName && (
              <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/60">
                Written by {post.authorName}
              </span>
            )}
          </div>
          {user?.id === post.authorId && (
            <div className="flex gap-4">
              <Link href={`/editor/${post.id}`} className="hover:text-white flex items-center gap-1 transition-colors">
                <Edit size={16} /> Edit
              </Link>
              <button onClick={handleDelete} className="hover:text-red-400 flex items-center gap-1 transition-colors">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-invert max-w-none prose-img:rounded-xl prose-video:w-full prose-video:rounded-xl">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
