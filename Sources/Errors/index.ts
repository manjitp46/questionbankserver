export var BAD_REQUEST_USERNAME_OR_PASSWORD_MISSING = "Required params username or password missing!";
export var ERROR_ED_SERVER_NOT_RESPONDING = "Failed to communicate to LDAP server!";
export var ERROR_BAD_LOGIN_CREDENTIAL = "User credential not valid!";
export var JWT_TOKEN_NOT_FOUND = "JWT token not found in request headers";
export var JWT_TOKEN_NOT_VALID = "JWT token is either expired or modified";
export var NOT_ADMIN_USER = "User do not have admin role";
export var USER_NOT_HAVE_CORRECT_ROLE = "User do not have correct roles"
export var ERROR_CODES = {
    BAD_REQUEST_USERNAME_OR_PASSWORD_MISSING : 1001,
    ERROR_ED_SERVER_NOT_RESPONDING : 1002,
    ERROR_BAD_LOGIN_CREDENTIAL: 1003,
    JWT_TOKEN_NOT_FOUND: 1004,
    JWT_TOKEN_NOT_VALID: 1005,
    NOT_ADMIN_USER: 1006,
    USER_NOT_HAVE_CORRECT_ROLE: 1007
}