import express from "express";
import "reflect-metadata";
import { default as request } from "supertest";
import loaders from "../../src/loaders";

const app = express();

beforeAll(async () => {
  await loaders({ expressApp: app });
});

describe("comment", () => {
  test("should return 200", async () => {
    const userId = "mimseong";
    const answer = [userId, "find", "result"];

    const res = await request(app)
      .get("/api/comment")
      .query({ userId: userId })
      .send();

    expect(res.status).toEqual(200);
    expect(res.body.comments).toEqual(answer);
  });

  test("should return 201", async () => {
    const res = await request(app)
      .post("/api/comment")
      .send({ comment: "mimseong" });
    expect(res.status).toEqual(201);
  });
});
