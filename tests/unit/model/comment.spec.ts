import { IComment } from "../../../src/interfaces/IComment";
import CommentModel from "../../../src/models/comment";
import * as db from "../../../src/models/firebase";

describe("CommentModel", () => {
  const commentModel = new CommentModel("test_comment");

  const userIdx1: string = "userIdx1";
  const userIdx2: string = "userIdx2";
  const comment1: string = "comment1";
  const comment2: string = "comment2";

  afterEach(async () => {
    await db.deleteCollection("test_comment");
  });

  test("findByUserIdx - 댓글이 존재하지 않는 경우", async () => {
    await commentModel.create(userIdx1, comment1);
    await commentModel.create(userIdx1, comment2);
    await commentModel.create(userIdx2, comment1);
    await commentModel.create(userIdx2, comment2);

    const commentList: IComment[] = await commentModel.findByUserIdx(
      "not existing user idx"
    );

    expect(commentList.length).toEqual(0);
  });

  test("findByUserIdx - 댓글이 존재하는 경우", async () => {
    await commentModel.create(userIdx1, comment1);
    await commentModel.create(userIdx1, comment2);
    await commentModel.create(userIdx2, comment1);
    await commentModel.create(userIdx2, comment2);

    const commentList: IComment[] = await commentModel.findByUserIdx(userIdx1);

    expect(commentList.length).toEqual(2);
    expect(commentList[0].user_idx).toEqual(userIdx1);
    expect(commentList[1].user_idx).toEqual(userIdx1);
  });

  test("find", async () => {
    await commentModel.create(userIdx1, comment1);

    const commentList: IComment[] = await commentModel.findByUserIdx(userIdx1);

    const comment: IComment = await commentModel.find(commentList[0].idx);

    expect(commentList[0].idx).toEqual(comment.idx);
  });

  test("find - 존재하지 않는 경우", async () => {
    const comment: IComment = await commentModel.find("not existing idx");

    expect(comment).toEqual(undefined);
  });

  test("delete", async () => {
    await commentModel.create(userIdx1, comment1);
    const commentList: IComment[] = await commentModel.findByUserIdx(userIdx1);

    expect(commentList.length).toEqual(1);
    await commentModel.delete(commentList[0].idx);

    const result: IComment[] = await commentModel.findByUserIdx(userIdx1);
    expect(result.length).toEqual(0);
  });
});
