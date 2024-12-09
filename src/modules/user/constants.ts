/**
 * 用户请求DTO验证组
 */
export enum UserValidateGroups {
  USER_CREATE = 'user-create',
  USER_UPDATE = 'user-update',
  USER_REGISTER = 'user-register',
  ACCOUNT_UPDATE = 'account-update',
  CHANGE_PASSWORD = 'change-password',
}

export enum UserOrderType {
  CREATED = 'createdAt',
  UPDATED = 'updatedAt',
}

export const ALLOW_GUEST = 'allowGuest';
