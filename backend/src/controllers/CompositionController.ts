import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { dbConnection } from "../config/database";
import { Composition, SaveCompositionDto, User } from "../types/types";
import { ResultSetHeader } from "mysql2";

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
      const [result] = await dbConnection.execute<ResultSetHeader>(
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

      // save initial version to composition_versions
      const [versions] = await dbConnection.execute(
        `INSERT INTO composition_versions (composition_id, version, changes, created_by) VALUES (?, ?, ?, ?)`,
        [
          result.insertId,
          1,
          JSON.stringify({
            name: composition.name,
            mood: composition.mood,
            tempo: composition.tempo,
            instrument: composition.instrument,
            melody: composition.melody,
          }),
          userId,
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

  // this function is used to save the version of the composition
  async saveVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { compositionId } = req.params;
      const changes = req.body;
      const sessionId = req.cookies.sessionId;

      // get user
      const [users] = await dbConnection.execute<User[]>(
        "SELECT * FROM users WHERE session_id = ?",
        [sessionId]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get latest version
      const [versions] = await dbConnection.execute(
        "SELECT MAX(version) as latest FROM composition_versions WHERE composition_id = ?",
        [compositionId]
      );
      //@ts-ignore
      const nextVersion = (versions[0]?.latest || 0) + 1;

      //save new version
      await dbConnection.execute(
        `INSERT INTO composition_versions 
        (composition_id, version, changes, created_by) 
        VALUES (?, ?, ?, ?)`,
        [compositionId, nextVersion, JSON.stringify(changes), users[0].id]
      );

      res.status(201).json({ message: "Version saved successfully" });
    } catch (error) {
      next(error);
    }
  }

  // get the version history of the composition
  async getVersionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { compositionId } = req.params;
      const sessionId = req.cookies.sessionId;

      const [versions] = await dbConnection.execute(
        `SELECT cv.* 
         FROM composition_versions cv
         JOIN compositions c ON cv.composition_id = c.id
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ? AND u.session_id = ?
         ORDER BY cv.version DESC`,
        [compositionId, sessionId]
      );

      res.json({ versions });
    } catch (error) {
      next(error);
    }
  }
}
