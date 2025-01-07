import { Request, Response, NextFunction } from "express";
import { dbConnection } from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { User } from "../types/types";

export class effectPresetsControllers {
  // controller used to save presets
  async savePreset(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.cookies.sessionId || uuidv4();
      const { name, effects } = req.body;

      // getting or creating the user
      let userId: string;
      const [users] = await dbConnection.execute<User[]>(
        `SELECT * FROM users WHERE session_id = '${sessionId}'`
      );

      if (Array.isArray(users) && users.length > 0) {
        userId = users[0].id;
      } else {
        userId = uuidv4();
        await dbConnection.execute(
          `INSERT INTO users (id, session_id) VALUES ('${userId}', '${sessionId}')`
        );
      }

      // saving preset
      await dbConnection.execute(
        `INSERT INTO effect_presets (user_id, name, effects) VALUES (?, ?, ?)`,
        [userId, name, JSON.stringify(effects)]
      );

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  // controller used to fetch all user saved presets
  async getUserPresets(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.cookies.sessionId || uuidv4();

      if (!sessionId) {
        res.status(200).json({ presets: [] });
        return;
      }

      const [rows] = await dbConnection.execute(
        `SELECT p.* 
        FROM effect_presets p
        JOIN users u ON p.user_id = u.id
        WHERE u.session_id = ?
        ORDER BY p.created_at DESC`,
        [sessionId]
      );

      res.status(200).json({ presets: rows });
    } catch (error) {
      next(error);
    }
  }

  // controller used to delete a preset
  async deletePreset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sessionId = req.cookies.sessionId;

      await dbConnection.execute(
        `DELETE p FROM effect_presets p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ? AND u.session_id = ?`,
        [id, sessionId]
      );

      res.json({ message: "Preset deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
