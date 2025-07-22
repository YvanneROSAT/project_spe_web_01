export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
  }
}
