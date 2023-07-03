import { v4 as uuidv4, validate } from "uuid";
import { UserNotFoundError } from "../utils/error";
import { User } from "../utils/types";

export const validateUser = (user: unknown): user is User => {
  return (
    Boolean(user) &&
    typeof user === "object" &&
    "username" in user &&
    typeof (user as User).username === "string" &&
    user.username &&
    "age" in user &&
    typeof (user as User).age === "number" &&
    user.age &&
    "hobbies" in user &&
    Array.isArray((user as User).hobbies)
  );
};

const users = new Map<string, User>();

export const validateId = (id: string) => {
  return validate(id);
};

export const getAllUsers = () => {
  return Array.from(users.values());
};

export const getUser = async (id: string) => {
  return new Promise((resolve, error) => {
    const user = users.get(id);
    if (!user) error(new UserNotFoundError());
    resolve(users.get(id));
  });
};

export const createUser = (user: User) => {
  return new Promise((resolve, error) => {
    const id = uuidv4();
    user.id = id;
    users.set(id, user);
    resolve(user);
  });
};

export const updateUser = async (id: string, user: User) => {
  user.id = id;

  return new Promise((resolve, error) => {
    if (!users.has(id)) error(new UserNotFoundError());
    users.set(id, user);
    resolve(user);
  });
};

export const deleteUser = (id: string) => {
  return new Promise((resolve, error) => {
    if (!users.has(id)) error(new UserNotFoundError());
    users.delete(id);
    resolve(true);
  });
};
