import express from "express";
import "reflect-metadata";
import { default as request } from "supertest";
import loaders from "../../src/loaders";
import * as db from "./mysql";

const app = express();

beforeAll(async () => {
  await loaders({ expressApp: app });
});

describe("auth", () => {
  beforeEach(async () => {
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE comment");
    await db.query("TRUNCATE TABLE user");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
  });

  test("should return 201", async () => {
    const res = await request(app).post(`/api/auth/signup`).send({
      id: "id",
      password: "password",
      nickname: "nickname",
    });

    expect(res.status).toEqual(201);
  });
});
