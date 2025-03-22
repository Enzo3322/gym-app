import { eq } from 'drizzle-orm';
import { SharedWorkout } from '../../../domain/entities/SharedWorkout';
import { SharedWorkoutRepository } from '../../../domain/ports/repositories/SharedWorkoutRepository';
import { db, sqlite } from '../../database/connection';
import { sharedWorkouts } from '../../database/schema';

// Define interfaces for the database results
interface DbSharedWorkout {
  id: string;
  workout_id: string;
  link: string;
  qr_code: string;
  created_at: number;
}

export class DrizzleSharedWorkoutRepository implements SharedWorkoutRepository {
  constructor() {
    // Verifica se a tabela existe e cria se necessário
    this.initTable();
  }

  private async initTable() {
    try {
      // Verifica se a tabela existe
      const tableExists = sqlite.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='shared_workouts'
      `).get();

    
        // Verifica se a coluna created_at existe
        const columnExists = sqlite.prepare(`
          PRAGMA table_info(shared_workouts)
        `).all().some((col: any) => col.name === 'created_at');

        if (!columnExists) {
          // Adiciona a coluna created_at se não existir
          sqlite.exec(`
            ALTER TABLE shared_workouts ADD COLUMN created_at INTEGER NOT NULL DEFAULT ${Date.now()}
          `);
        }
      
    } catch (error) {
      console.error('Error initializing shared_workouts table:', error);
    }
  }

  async create(sharedWorkout: SharedWorkout): Promise<SharedWorkout> {
    // Usa drizzle com SQL personalizado
    sqlite.prepare(`
      INSERT INTO shared_workouts (id, workout_id, link, qr_code, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      sharedWorkout.id,
      sharedWorkout.workoutId,
      sharedWorkout.link,
      sharedWorkout.qrCode,
      sharedWorkout.createdAt
    );
    
    return sharedWorkout;
  }

  async findById(id: string): Promise<SharedWorkout | null> {
    const stmt = sqlite.prepare(`
      SELECT * FROM shared_workouts WHERE id = ? LIMIT 1
    `);
    
    const share = stmt.get(id) as DbSharedWorkout | undefined;
    
    if (!share) {
      return null;
    }
    
    return {
      id: share.id,
      workoutId: share.workout_id,
      link: share.link,
      qrCode: share.qr_code,
      createdAt: new Date(share.created_at || Date.now())
    };
  }

  async findByWorkoutId(workoutId: string): Promise<SharedWorkout[]> {
    const stmt = sqlite.prepare(`
      SELECT * FROM shared_workouts WHERE workout_id = ?
    `);
    
    const shares = stmt.all(workoutId) as DbSharedWorkout[];
    
    return shares.map((share: DbSharedWorkout) => ({
      id: share.id,
      workoutId: share.workout_id,
      link: share.link,
      qrCode: share.qr_code,
      createdAt: new Date(share.created_at || Date.now())
    }));
  }

  async delete(id: string): Promise<void> {
    const stmt = sqlite.prepare(`
      DELETE FROM shared_workouts WHERE id = ?
    `);
    
    stmt.run(id);
  }
} 