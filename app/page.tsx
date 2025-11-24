'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { Post } from '@/lib/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-white/40 animate-pulse">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
        <p className="text-white/60">Create your first post to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Latest Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
