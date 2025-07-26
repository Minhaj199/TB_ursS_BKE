import { ZodError } from "zod";
import {
  UserSignup,
  UserSchema,
  UserLoginSchema,
  UserLoginSchemaType,
} from "../schemas/userSchema";
import { LoginValidationResult, SignupValidationResult } from "../types";
import { ErrorType } from "../constrains/ErrorTypes";

////////////formating error///
function zodFormatedEror(zodData: ZodError): Record<string, string>[] {
  return zodData.issues.map((issue) => {
    const field = issue.path.join(".") || ErrorType.GeneralError;
    return { [field]: issue.message };
  });
}
/////////

//////////validating signup////

export const validateSignup = (
  data: unknown
): SignupValidationResult<UserSchema> => {
  const result = UserSignup.safeParse(data);
  if (!result.success) {
    return { success: false, errors: zodFormatedEror(result.error) };
  }
  return { success: true, data: result.data };
};

//////////validating loging////
export const validateLogin = (
  data: unknown
): LoginValidationResult<UserLoginSchemaType> => {
  const result = UserLoginSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: zodFormatedEror(result.error) };
  }
  return { success: true, data: result.data };
};
