import { bench, describe } from "vitest";
import { randomUUID } from "crypto";

interface User {
  id: string;
  username: string;
  password: string;
}

interface InsertUser {
  username: string;
  password: string;
}

class MemStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

describe("MemStorage", () => {
  bench("createUser", async () => {
    const storage = new MemStorage();
    await storage.createUser({ username: "testuser", password: "testpass" });
  });

  bench("getUserByUsername", async () => {
    const storage = new MemStorage();
    await storage.createUser({ username: "testuser", password: "testpass" });
    await storage.getUserByUsername("testuser");
  });

  bench("getUser", async () => {
    const storage = new MemStorage();
    const user = await storage.createUser({
      username: "testuser",
      password: "testpass",
    });
    await storage.getUser(user.id);
  });

  bench("createUser - multiple users", async () => {
    const storage = new MemStorage();
    for (let i = 0; i < 100; i++) {
      await storage.createUser({
        username: `user${i}`,
        password: `pass${i}`,
      });
    }
  });

  bench("getUserByUsername - with many users", async () => {
    const storage = new MemStorage();
    for (let i = 0; i < 100; i++) {
      await storage.createUser({
        username: `user${i}`,
        password: `pass${i}`,
      });
    }
    await storage.getUserByUsername("user99");
  });
});
