import PostEditor from '@/components/PostEditor';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function NewPost() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }
  return <PostEditor />;
}
