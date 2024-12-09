import * as bcrypt from 'bcrypt';
// src/modules/user/helpers.ts
/**
 * 加密明文密码
 * @param password
 */
export const encrypt = async (password: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

/**
 * 验证密码
 * @param password
 * @param hashed
 */
export const decrypt = (password: string, hashed: string) => {
  return bcrypt.compareSync(password, hashed);
};
