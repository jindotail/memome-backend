import express from "express";
import "reflect-metadata";
import { default as request } from "supertest";
import { IUser } from "../../src/interfaces/IUser";
import loaders from "../../src/loaders";
import * as dummy from "./dummy";
import * as db from "./mysql";

const app = express();

beforeAll(async () => {
  await loaders({ expressApp: app });
});

describe("comment", () => {
  let user: IUser;

  beforeEach(async () => {
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE comment");
    await db.query("TRUNCATE TABLE user");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    user = await dummy.user("mimseong");
    console.log(user);
  });

  test("should return 200", async () => {
    const comments = ["comment1", "comment2"];
    comments.forEach(async (comment) => {
      await dummy.comment(user._idx, comment);
    });

    const res = await request(app).get(`/api/comment/${user.id}`).send();

    expect(res.status).toEqual(200);
    expect(res.body.comments).toEqual(comments);
  });

  test("should return 201", async () => {
    const res = await request(app)
      .post(`/api/comment/${user.id}`)
      .send({ comment: "comment" });

    expect(res.status).toEqual(201);
  });
});
