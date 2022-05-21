import { default as request } from "supertest";
import express from "express";
import loaders from "../src/loaders";

const app = express();

beforeAll(async () => {
  await loaders({ expressApp: app });
});

describe("comment", () => {
  test("should return 200", async () => {
    const res = await request(app).get("/api/comment").send();
    expect(res.status).toEqual(200);
  });
});
