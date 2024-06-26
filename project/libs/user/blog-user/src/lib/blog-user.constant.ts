import { MessagesType } from '@project/shared/core';

export const BlogUserValidation = {
  FIRST_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  LAST_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 12
  },
}

export const BlogUserMessage: MessagesType = {
  ERROR: {
    ALREADY_EXISTS: 'User already exists',
    NOT_FOUND: 'User not found',
    INCORRECT_CREDENTIALS: 'Incorrect user email/password',
    CANT_UPDATE: 'Can`t update user. Possible reason: Object with fields to update are empty',
    SAME_SUBSCRIPTIONS: 'User and subscribtion target can`t be the same person'
  },
  SUCCESS: {
    FOUND: 'User found',
    UPDATED: 'User has been successfully updated',
    DELETED: 'User has been successfully deleted',
  },
  DESCRIPTION: {
    USER_DETAIL: 'Get detail info about user',
    USER_SUBSCRIBERS: 'Get all user subscribers',
    SUBSCRIBE: 'Add subscribtion to target user',
    UNSUBSCRIBE: 'Remove target user from subscription',
  }
} as const;
