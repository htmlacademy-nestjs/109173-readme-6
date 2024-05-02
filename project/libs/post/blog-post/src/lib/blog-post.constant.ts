import { MessagesType, SortDirection, SortType } from '@project/shared/core';

export const MAX_POSTS_PER_PAGE = 25; // Максимальное количество постов на один запрос
export const POST_ONLY_PUBLISHED = true; // В список публикаций попадают только посты со статусом "Опубликовано" (isPublished)

export const MAX_SEARCH_POSTS_LIMIT = 20; // Максимальное количество возвращаемых публикаций при поиске
export const DEFAULT_SORT_TYPE = SortType.CREATED_DATE;
export const DEFAULT_SORT_DIRECTION = SortDirection.DESC;
export const DEFAULT_PAGE_COUNT = 1;

export const MAX_COMMENTS_PER_PAGE = 50; // Максимальное количество комментариев на один запрос

export const BlogPostValidation = {
  TITLE: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 50
  },
  TAG: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 10,
    MAX_СOUNT: 8
  },
  ANNOUNCE: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 255
  },
  TEXT: {
    MIN_LENGTH: 100,
    MAX_LENGTH: 1024
  },
  QUOTE_TEXT: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 300
  },
  QUOTE_AUTHOR: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PHOTO: {
    SIZE: 1000, // 1 Мбайт
    EXT: ['jpg', 'png']
  },
  AVATAR: {
    SIZE: 500, // 500 Кб,
    EXT: ['jpg', 'png']
  },
  LINK_DESCRIPTION: {
    MAX_LENGTH: 300
  },
  COMMENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 300
  },
};

export const BlogPostMessage: MessagesType = {
  ERROR: {
    POST_TYPE: 'Received invalid post type',
    CANT_UPDATE: 'Can`t update post. Possible reason: Object with fields to update are empty',
    UNAUTHORIZED: 'Post can be created only by authorized user',
    NOT_FOUND: 'Post not found',
  },
  SUCCESS: {
    FOUND: 'Post found',
    CREATED: 'Post has been successfully created',
    UPDATED: 'Post has been successfully updated',
    DELETED: 'Post has been successfully deleted',
  }
} as const;
