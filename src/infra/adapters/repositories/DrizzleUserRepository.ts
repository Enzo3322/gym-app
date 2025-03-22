import { eq } from 'drizzle-orm';
import { db } from '../../../infra/database/connection';
import { users } from '../../../infra/database/schema';
import { User, UserEntity, UserRole } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';

export class DrizzleUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    await db.insert(users).values({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: new Date()
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    const results = await db.select().from(users);
    
    return results.map(user => UserEntity.create(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
    ));
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    
    return UserEntity.create(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    
    return UserEntity.create(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
    );
  }

  async update(user: User): Promise<User> {
    await db.update(users)
      .set({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      })
      .where(eq(users.id, user.id));
    
    return user;
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}