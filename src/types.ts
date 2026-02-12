export interface Page {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  currentVersion: number;
}

export interface Version {
  vid: number;
  pageId: string;
  title: string;
  body: string;
  tags: string[];
  editNote: string | null;
  diff: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  pageId: string;
  vid: number;
  author: string;
  body: string;
  createdAt: string;
}

export interface Category {
  name: string;
  pageIds: string[];
}

export interface HalLink {
  href: string;
  templated?: boolean;
  title?: string;
  name?: string;
  type?: string;
}

export interface CurieLink {
  name: string;
  href: string;
  templated: boolean;
}

export interface HalResource {
  _links: Record<string, HalLink | HalLink[] | CurieLink[]>;
  _embedded?: Record<string, HalResource | HalResource[]>;
  [key: string]: unknown;
}
