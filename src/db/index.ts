import { v4 as uuidv4, validate } from "uuid";

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
};

export const validateUser = (user: unknown): user is User => {
  if (!user) return false;
  if (typeof user !== "object") return false;
  if (!("username" in user)) return false;
  if (typeof (user as User).username !== "string" || !user.username)
    return false;
  if (!("age" in user)) return false;
  if (typeof (user as User).age !== "number" || !user.age) return false;
  if (!("hobbies" in user)) return false;
  if (!Array.isArray((user as User).hobbies)) return false;

  return true;
};

const users = new Map<string, User>();

export const validateId = (id: string) => {
  return validate(id);
};

export const getAllUsers = () => {
  return Array.from(users.values());
};

export const getUser = (id: string) => {
  return users.get(id);
};

export const createUser = (user: User) => {
  const id = uuidv4();
  user.id = id;
  users.set(id, user);
  return user;
};

export const updateUser = (id: string, user: User) => {
  user.id = id;
  if (!users.has(id)) throw new Error("User not found");

  users.set(id, user);
  return user;
};

export const deleteUser = (id: string) => {
  if (!users.has(id)) throw new Error("User not found");
  users.delete(id);
};
