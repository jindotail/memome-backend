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
  const date = new Date();

  beforeEach(async () => {
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE comment");
    await db.query("TRUNCATE TABLE user");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    user = await dummy.user("mimseong", date);
  });

  test("should return 200", async () => {
    const comments = [
      { comment: "comment1", created_at: date },
      { comment: "comment2", created_at: date },
    ];
    comments.forEach(async (comment) => {
      await dummy.comment(user._idx, comment.comment, date);
    });
    const commentsTimestamp = [
      { comment: "comment1", created_at: date.getTime() },
      { comment: "comment2", created_at: date.getTime() },
    ];

    const res = await request(app).get(`/api/comment/${user.id}`).send();
    expect(res.status).toEqual(200);
    expect(res.body.comments).toEqual(commentsTimestamp);
  });

  test("should return 201", async () => {
    const res = await request(app)
      .post(`/api/comment/${user.id}`)
      .send({ comment: "comment" });

    expect(res.status).toEqual(201);
  });
});
