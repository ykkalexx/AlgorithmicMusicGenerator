import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbConnection } from "../config/database";
import { Composition, SaveCompositionDto, User } from "../types/types";

export class CompositionControllers {
  // saving the session in the database and cookies rather than auth system
  // why?
  // why not lol
  async saveComposition(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.cookies.sessionId || uuidv4();
      const composition: SaveCompositionDto = req.body;

      //get or create user based on session id
      let userId: string;
      const [users] = await dbConnection.execute<User[]>(
        "SELECT * FROM users WHERE session_id = ?",
        [sessionId]
      );

      if (Array.isArray(users) && users.length > 0) {
        userId = users[0].id;
      } else {
        userId = uuidv4();
        await dbConnection.execute(
          "INSERT INTO users (id, session_id) VALUES (?, ?)",
          [userId, sessionId]
        );
      }

      // save composition
      const [result] = await dbConnection.execute(
        `INSERT INTO compositions 
        (user_id, name, mood, tempo, instrument, melody) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          composition.name,
          composition.mood,
          composition.tempo,
          composition.instrument,
          JSON.stringify(composition.melody),
        ]
      );

      // Set session cookie if new
      if (!req.cookies.sessionId) {
        res.cookie("sessionId", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
      }

      res.status(201).json({ message: "Composition saved successfully" });
    } catch (error) {
      next(error);
    }
  }

  // get all the composition for a user from the database
  async getUserCompositions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.cookies.sessionId;

      if (!sessionId) {
        return res.status(200).json({ compositions: [] });
      }

      const [rows] = await dbConnection.execute(
        `SELECT c.* 
        FROM compositions c
        JOIN users u ON c.user_id = u.id
        WHERE u.session_id = ?
        ORDER BY c.created_at DESC`,
        [sessionId]
      );

      res.json({ compositions: rows });
    } catch (error) {
      next(error);
    }
  }

  // getting a specific composition from the database
  async getComposition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sessionId = req.cookies.sessionId;

      const [rows] = await dbConnection.execute(
        `SELECT c.* 
        FROM compositions c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ? AND u.session_id = ?`,
        [id, sessionId]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(404).json({ message: "Composition not found" });
      }

      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
  }

  // just deletes the composition from the database and session id
  async deleteComposition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sessionId = req.cookies.sessionId;

      const [result] = await dbConnection.execute(
        `DELETE c FROM compositions c
          JOIN users u ON c.user_id = u.id
          WHERE c.id = ? AND u.session_id = ?`,
        [id, sessionId]
      );

      res.json({ message: "Composition deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
