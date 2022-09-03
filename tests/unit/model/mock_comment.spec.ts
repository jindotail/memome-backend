import { IComment } from "../../../src/interfaces/IComment";
import CommentModel from "../../../src/models/mock_comment";

describe("MockCommentModel", () => {
  const commentModel = new CommentModel();

  const userIdx1: string = "userIdx1";
  const userIdx2: string = "userIdx2";
  const comment1: string = "comment1";
  const comment2: string = "comment2";

  beforeEach(() => {
    commentModel.commentMap = new Map<string, any>();
  });

  test("findByUserIdx - 댓글이 존재하지 않는 경우", () => {
    commentModel.create(userIdx1, comment1);
    commentModel.create(userIdx1, comment2);
    commentModel.create(userIdx2, comment1);
    commentModel.create(userIdx2, comment2);

    const commentList: IComment[] = commentModel.findByUserIdx(
      "not existing user idx"
    );

    expect(commentList.length).toEqual(0);
  });

  test("findByUserIdx - 댓글이 존재하는 경우", () => {
    commentModel.create(userIdx1, comment1);
    commentModel.create(userIdx1, comment2);
    commentModel.create(userIdx2, comment1);
    commentModel.create(userIdx2, comment2);

    const commentList: IComment[] = commentModel.findByUserIdx(userIdx1);

    expect(commentList.length).toEqual(2);
    expect(commentList[0].user_idx).toEqual(userIdx1);
    expect(commentList[1].user_idx).toEqual(userIdx1);
  });

  // TODO - 없는 걸 삭제하는 경우
  test("delete", () => {
    commentModel.create(userIdx1, comment1);
    const commentList: IComment[] = commentModel.findByUserIdx(userIdx1);

    expect(commentList.length).toEqual(1);
    commentModel.delete(commentList[0].idx);

    const result: IComment[] = commentModel.findByUserIdx(userIdx1);
    expect(result.length).toEqual(0);
  });
});
