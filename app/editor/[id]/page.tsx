import PostEditor from '@/components/PostEditor';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }
  const { id } = await params;
  return <PostEditor postId={id} />;
}
