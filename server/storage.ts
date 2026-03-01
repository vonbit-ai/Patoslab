import { db } from "./db";
  import { dummy } from "@shared/schema";
  import { eq } from "drizzle-orm";

  export interface IStorage {
    // Add methods here if database is needed later
  }

  export class DatabaseStorage implements IStorage {
    // Implement methods here
  }

  export const storage = new DatabaseStorage();
  