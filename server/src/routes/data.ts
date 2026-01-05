import { Router, Request, Response } from 'express';
import { getDB, run } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all user data (checkins, cycles, settings)
router.get('/sync', (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const db = getDB();

    const checkinsResult = db.exec(
      `SELECT date, categories, penalties, completed FROM checkins WHERE user_id = ${userId} ORDER BY date`
    );

    const cyclesResult = db.exec(
      `SELECT cycle_number, days, completed FROM cycles WHERE user_id = ${userId} ORDER BY cycle_number`
    );

    const settingsResult = db.exec(
      `SELECT settings FROM settings WHERE user_id = ${userId}`
    );

    const checkins = checkinsResult.length > 0 && checkinsResult[0].values.length > 0
      ? checkinsResult[0].values.map((row: any) => ({
          date: row[0],
          categories: JSON.parse(row[1]),
          penalties: row[2],
          completed: Boolean(row[3])
        }))
      : [];

    const cycles = cyclesResult.length > 0 && cyclesResult[0].values.length > 0
      ? cyclesResult[0].values.map((row: any) => ({
          cycleNumber: row[0],
          days: JSON.parse(row[1]),
          completed: Boolean(row[2])
        }))
      : [];

    const settings = settingsResult.length > 0 && settingsResult[0].values.length > 0
      ? JSON.parse(settingsResult[0].values[0][0] as string)
      : { requireThreeOfFive: true };

    res.json({ checkins, cycles, settings });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Save checkin
router.post('/checkins', (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { date, categories, penalties, completed } = req.body;

    const db = getDB();
    
    // Check if exists
    const existing = db.exec(`SELECT id FROM checkins WHERE user_id = ${userId} AND date = '${date}'`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      // Update
      run(
        `UPDATE checkins SET categories = ?, penalties = ?, completed = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = ? AND date = ?`,
        [JSON.stringify(categories), penalties, completed ? 1 : 0, userId, date]
      );
    } else {
      // Insert
      run(
        `INSERT INTO checkins (user_id, date, categories, penalties, completed, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [userId, date, JSON.stringify(categories), penalties, completed ? 1 : 0]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Checkin save error:', error);
    res.status(500).json({ error: 'Failed to save checkin' });
  }
});

// Save cycle
router.post('/cycles', (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { cycleNumber, days, completed } = req.body;

    const db = getDB();
    
    // Check if exists
    const existing = db.exec(`SELECT id FROM cycles WHERE user_id = ${userId} AND cycle_number = ${cycleNumber}`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      // Update
      run(
        `UPDATE cycles SET days = ?, completed = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = ? AND cycle_number = ?`,
        [JSON.stringify(days), completed ? 1 : 0, userId, cycleNumber]
      );
    } else {
      // Insert
      run(
        `INSERT INTO cycles (user_id, cycle_number, days, completed, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [userId, cycleNumber, JSON.stringify(days), completed ? 1 : 0]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Cycle save error:', error);
    res.status(500).json({ error: 'Failed to save cycle' });
  }
});

// Save settings
router.post('/settings', (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { settings } = req.body;

    const db = getDB();
    
    // Check if exists
    const existing = db.exec(`SELECT id FROM settings WHERE user_id = ${userId}`);
    
    if (existing.length > 0 && existing[0].values.length > 0) {
      // Update
      run(
        `UPDATE settings SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [JSON.stringify(settings), userId]
      );
    } else {
      // Insert
      run(
        `INSERT INTO settings (user_id, settings, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [userId, JSON.stringify(settings)]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Settings save error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
