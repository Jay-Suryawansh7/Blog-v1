import fs from 'fs';
import path from 'path';

import { Post } from './types';

const dataFilePath = path.join(process.cwd(), 'data', 'posts.json');

export type { Post };

export const getPosts = (): Post[] => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

export const getPost = (id: string): Post | undefined => {
  const posts = getPosts();
  return posts.find((post) => post.id === id);
};

export const createPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post => {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
  return newPost;
};

export const updatePost = (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Post | null => {
  const posts = getPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return null;

  const updatedPost = {
    ...posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  posts[index] = updatedPost;
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
  return updatedPost;
};

export const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const filteredPosts = posts.filter((post) => post.id !== id);
  if (posts.length === filteredPosts.length) return false;
  
  fs.writeFileSync(dataFilePath, JSON.stringify(filteredPosts, null, 2));
  return true;
};
