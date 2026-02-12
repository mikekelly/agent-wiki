import { Page, Version, Comment, Category } from './types.js';
import { v4 as uuid } from 'uuid';
import { createTwoFilesPatch } from 'diff';

export interface Store {
  pages: Map<string, Page>;
  versions: Map<string, Version[]>;
  comments: Map<string, Comment[]>;
  categories: Map<string, Category>;
  nextId: number;
}

export const store: Store = {
  pages: new Map(),
  versions: new Map(),
  comments: new Map(),
  categories: new Map(),
  nextId: 1,
};

function commentKey(pageId: string, vid: number): string {
  return `${pageId}:${vid}`;
}

export function createPage(title: string, body: string, tags: string[] = []): Page {
  const id = String(store.nextId++);
  const now = new Date().toISOString();

  const page: Page = {
    id,
    title,
    body,
    tags,
    createdAt: now,
    updatedAt: now,
    currentVersion: 1,
  };

  const version: Version = {
    vid: 1,
    pageId: id,
    title,
    body,
    tags,
    editNote: null,
    diff: null,
    createdAt: now,
  };

  store.pages.set(id, page);
  store.versions.set(id, [version]);

  // Update categories
  for (const tag of tags) {
    addToCategory(tag, id);
  }

  return page;
}

export function editPage(
  id: string,
  body: string,
  tags?: string[],
  editNote?: string
): Page | null {
  const page = store.pages.get(id);
  if (!page) return null;

  const versions = store.versions.get(id)!;
  const prevVersion = versions[versions.length - 1];
  const newVid = prevVersion.vid + 1;
  const now = new Date().toISOString();

  const diffText = createTwoFilesPatch(
    `v${prevVersion.vid}`,
    `v${newVid}`,
    prevVersion.body,
    body,
    undefined,
    undefined
  );

  const newTags = tags ?? page.tags;

  const version: Version = {
    vid: newVid,
    pageId: id,
    title: page.title,
    body,
    tags: newTags,
    editNote: editNote ?? null,
    diff: diffText,
    createdAt: now,
  };

  versions.push(version);

  // Update category memberships if tags changed
  if (tags) {
    const removed = page.tags.filter((t) => !tags.includes(t));
    const added = tags.filter((t) => !page.tags.includes(t));
    for (const tag of removed) removeFromCategory(tag, id);
    for (const tag of added) addToCategory(tag, id);
  }

  page.body = body;
  page.tags = newTags;
  page.updatedAt = now;
  page.currentVersion = newVid;

  return page;
}

export function deletePage(id: string): boolean {
  const page = store.pages.get(id);
  if (!page) return false;

  // Remove from categories
  for (const tag of page.tags) {
    removeFromCategory(tag, id);
  }

  // Remove all comments for this page's versions
  const versions = store.versions.get(id) || [];
  for (const v of versions) {
    store.comments.delete(commentKey(id, v.vid));
  }

  store.pages.delete(id);
  store.versions.delete(id);
  return true;
}

export function getPage(id: string): Page | undefined {
  return store.pages.get(id);
}

export function getAllPages(): Page[] {
  return Array.from(store.pages.values());
}

export function getVersions(pageId: string): Version[] | undefined {
  const versions = store.versions.get(pageId);
  if (!versions) return undefined;
  return [...versions].reverse(); // newest first
}

export function getVersion(pageId: string, vid: number): Version | undefined {
  const versions = store.versions.get(pageId);
  if (!versions) return undefined;
  return versions.find((v) => v.vid === vid);
}

export function addComment(pageId: string, vid: number, author: string, body: string): Comment | null {
  const version = getVersion(pageId, vid);
  if (!version) return null;

  const key = commentKey(pageId, vid);
  const comments = store.comments.get(key) || [];

  const comment: Comment = {
    id: uuid(),
    pageId,
    vid,
    author,
    body,
    createdAt: new Date().toISOString(),
  };

  comments.push(comment);
  store.comments.set(key, comments);
  return comment;
}

export function getComments(pageId: string, vid: number): Comment[] | undefined {
  const version = getVersion(pageId, vid);
  if (!version) return undefined;
  return store.comments.get(commentKey(pageId, vid)) || [];
}

export function getComment(pageId: string, vid: number, commentId: string): Comment | undefined {
  const comments = store.comments.get(commentKey(pageId, vid));
  if (!comments) return undefined;
  return comments.find((c) => c.id === commentId);
}

export function getAllCategories(): Category[] {
  return Array.from(store.categories.values());
}

export function getCategory(name: string): Category | undefined {
  return store.categories.get(name);
}

export function searchPages(query: string): Page[] {
  const q = query.toLowerCase();
  return getAllPages().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function addToCategory(tag: string, pageId: string): void {
  const existing = store.categories.get(tag);
  if (existing) {
    if (!existing.pageIds.includes(pageId)) {
      existing.pageIds.push(pageId);
    }
  } else {
    store.categories.set(tag, { name: tag, pageIds: [pageId] });
  }
}

function removeFromCategory(tag: string, pageId: string): void {
  const existing = store.categories.get(tag);
  if (existing) {
    existing.pageIds = existing.pageIds.filter((id) => id !== pageId);
    if (existing.pageIds.length === 0) {
      store.categories.delete(tag);
    }
  }
}
