import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/types';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <article className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/5 flex gap-6">
        {/* Thumbnail */}
        {post.imageUrl && (
          <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-black/20">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h2>
          <p className="text-white/60 mb-4 line-clamp-2">{post.content}</p>
          <div className="flex items-center justify-between text-sm text-white/40">
            <div className="flex items-center gap-4">
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              {post.authorName && (
                <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/60">
                  Written by {post.authorName}
                </span>
              )}
            </div>
            <span className="group-hover:translate-x-1 transition-transform">Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
