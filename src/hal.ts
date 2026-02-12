import { HalLink, HalResource, CurieLink, Page, Version, Comment, Category } from './types.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const CURIES: CurieLink[] = [
  {
    name: 'wiki',
    href: `${BASE_URL}/rels/{rel}`,
    templated: true,
  },
];

export function halResponse(data: Record<string, unknown>, links: Record<string, HalLink | HalLink[]>): HalResource {
  return {
    _links: {
      ...links,
    },
    ...data,
  };
}

export function withCuries(links: Record<string, HalLink | HalLink[] | CurieLink[]>): Record<string, HalLink | HalLink[] | CurieLink[]> {
  return {
    curies: CURIES,
    ...links,
  };
}

export function selfLink(path: string): HalLink {
  return { href: path };
}

export function pageToHal(page: Page): HalResource {
  return {
    _links: withCuries({
      self: selfLink(`/pages/${page.id}`),
      'wiki:pages': { href: '/pages', title: 'All pages' },
      'wiki:edit-page': { href: `/pages/${page.id}`, title: 'Edit this page' },
      'wiki:delete-page': { href: `/pages/${page.id}`, title: 'Delete this page' },
      'wiki:history': { href: `/pages/${page.id}/history`, title: 'Version history' },
    }),
    id: page.id,
    title: page.title,
    body: page.body,
    tags: page.tags,
    currentVersion: page.currentVersion,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export function pageSummaryToHal(page: Page): HalResource {
  return {
    _links: {
      self: selfLink(`/pages/${page.id}`),
      'wiki:history': { href: `/pages/${page.id}/history` },
    },
    id: page.id,
    title: page.title,
    tags: page.tags,
    currentVersion: page.currentVersion,
    updatedAt: page.updatedAt,
  };
}

export function versionToHal(version: Version, totalVersions: number): HalResource {
  const links: Record<string, HalLink | HalLink[] | CurieLink[]> = withCuries({
    self: selfLink(`/pages/${version.pageId}/versions/${version.vid}`),
    'wiki:page': { href: `/pages/${version.pageId}`, title: 'Current page' },
    'wiki:history': { href: `/pages/${version.pageId}/history`, title: 'Version history' },
    'wiki:comments': {
      href: `/pages/${version.pageId}/versions/${version.vid}/comments`,
      title: 'Comments on this version',
    },
    'wiki:add-comment': {
      href: `/pages/${version.pageId}/versions/${version.vid}/comments`,
      title: 'Add a comment',
    },
  });

  if (version.vid > 1) {
    links['prev'] = {
      href: `/pages/${version.pageId}/versions/${version.vid - 1}`,
      title: `Version ${version.vid - 1}`,
    };
  }
  if (version.vid < totalVersions) {
    links['next'] = {
      href: `/pages/${version.pageId}/versions/${version.vid + 1}`,
      title: `Version ${version.vid + 1}`,
    };
  }

  return {
    _links: links,
    vid: version.vid,
    pageId: version.pageId,
    title: version.title,
    body: version.body,
    tags: version.tags,
    editNote: version.editNote,
    diff: version.diff,
    createdAt: version.createdAt,
  };
}

export function versionSummaryToHal(version: Version): HalResource {
  return {
    _links: {
      self: selfLink(`/pages/${version.pageId}/versions/${version.vid}`),
      'wiki:comments': {
        href: `/pages/${version.pageId}/versions/${version.vid}/comments`,
      },
    },
    vid: version.vid,
    editNote: version.editNote,
    createdAt: version.createdAt,
  };
}

export function commentToHal(comment: Comment): HalResource {
  return {
    _links: withCuries({
      self: selfLink(`/pages/${comment.pageId}/versions/${comment.vid}/comments/${comment.id}`),
      'wiki:version': {
        href: `/pages/${comment.pageId}/versions/${comment.vid}`,
        title: 'Parent version',
      },
    }),
    id: comment.id,
    author: comment.author,
    body: comment.body,
    createdAt: comment.createdAt,
  };
}

export function categoryToHal(category: Category): HalResource {
  return {
    _links: {
      self: selfLink(`/categories/${encodeURIComponent(category.name)}`),
    },
    name: category.name,
    pageCount: category.pageIds.length,
    pageIds: category.pageIds,
  };
}
