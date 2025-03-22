export type UserRole = 'user' | 'admin' | 'root';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole = 'user',
    public readonly createdAt: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('User ID is required');
    }
    if (!this.name) {
      throw new Error('User name is required');
    }
    if (!this.email) {
      throw new Error('User email is required');
    }
    if (!this.validateEmail(this.email)) {
      throw new Error('Invalid email format');
    }
    if (!this.password) {
      throw new Error('User password is required');
    }
    if (!['user', 'admin', 'root'].includes(this.role)) {
      throw new Error('Invalid user role');
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static create(
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole = 'user'
  ): UserEntity {
    return new UserEntity(id, name, email, password, role);
  }
}