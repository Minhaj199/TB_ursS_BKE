/////////////// hashing password//////

import bcrypt from "bcrypt";

export function validatePassword(
  hashedPassword: string,
  inputPassword: string
) {
  const validate = bcrypt.compare(inputPassword, hashedPassword);
  return validate;
}
