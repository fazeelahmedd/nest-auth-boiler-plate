export enum ResponseMessage {
  UNAUTHORIZED = 'Unauthorized for request. Token Mismatch.',
  SUCCESS = 'Success',
  SUCCESS_WITH_NO_CONTENT = 'No Content',
  NOT_FOUND = 'Resource Not found',
  CONFLICT = 'The request could not be completed due to a conflict with the current state of the resource',
  NOT_ACCEPTABLE = 'User not activated.',
  FORBIDDEN = 'Not allowed for performing this action.',
  BAD_REQUEST = 'Bad Request. Please verify your request input.',
  SERVER_ERROR = 'Something went wrong, please try again.',
}

export const MESSAGES = {
  GLOBAL: {
    SUCCESS: {},
    ERROR: {
      ALREADY_EXIST: 'already exist.',
      DOES_NOT_EXIST: "doesn't exist",
    },
  },
  REDIS: {
    CONNECTED: 'Redis client connected!',
    TIMEOUT: 'Redis timeout.',
    CLOSE_WITH_ERROR: 'close with err: ',
  },
  AUTH: {
    SUCCESS: {
      VERIFY_EMAIL: 'Account has been verified.',
      RESEND_VERIFICATION_EMAIL: 'Verification email resent.',
      FORGOT_PASSWORD: 'Reset password link has been sent to your email.',
      RESET_PASSWORD: 'Password changed successfully.',
      LOGOUT: 'You logged out successfully.',
      PASSWORD_CHANGED: 'Password changed successfully.',
      ACCOUNT_VERIFIED: 'Account has been verified',
      VERIFICATION_EMAIL_SENT: 'Verification email resent',
    },
    ERROR: {
      TOKEN_EXPIRED: 'Token is expired.',
      TOKEN_INVALID: 'Token is invalid.',
      TOKEN_INVALID_OR_EXPIRED: 'Token is invalid or expired.',
      LOGGED_OUT: 'You are currently logged out, please login again.',
      REFRESH_MALFORMED: 'Refresh token malformed.',
      USERNAME_PASSWORD_INCORRECT: 'Username or password is incorrect.',
      EMAIL_UNVERIFIED: 'Email address not verified',
      USER_DISABLED: 'User is disabled',
      USER_NOT_ACTIVE: 'User is not active',
      VERIFICATION_LINK_EXPIRED:
        'Your verification link is invalid or has expired.',
      USER_ALREADY_VERIFIED: 'User already verified.',
      USER_NOT_EXIST: 'User with this email does not exist.',
      MUST_NOT_BE_EMPTY: 'Must be not empty.',
      DIFFERENT_OLD_NEW_PASSWORD:
        'old password should be different from new password.',
    },
  },
  ROLE: {
    SUCCESS: {},
    ERROR: {
      ROLE_DOES_NOT_EXIST: "Role doesn't exist",
      ROLE_IS_EXIST: 'Role already exists',
      ATLEAST_ONE_ROLE: 'You need to define atleast one role',
    },
  },
  ROUTE: {
    SUCCESS: {},
    ERROR: {
      ROUTE_DOES_NOT_EXIST: "Route doesn't exist",
      ROUTE_IS_EXIST: 'Route already exists',
    },
  },
  EMAIL: {
    SUCCESS: {},
    ERROR: {
      INVALID_EMAIL: 'Invalid Email',
      EMAIL_DOES_NOT_EXIST: "Email doesn't exist",
      EMAIL_IS_EXIST: 'Email already exists',
    },
  },
  PASSWORD: {
    SUCCESS: {},
    ERROR: {
      PASSWORD_RULES:
        'Password must be at least 6 characters long and contain one number.',
    },
  },
  USER: {
    SUCCESS: {},
    ERROR: {
      USER_DOES_NOT_EXIST: "User doesn't exist",
    },
  },

  OTP: {
    SUCCESS: { OTP_SENT: 'OTP has been sent to your email' },
    ERROR: {
      OTP_EXPIRED: 'OTP has been expired',
      OTP_INVALID: 'OTP is invalid',
    },
  },
};
