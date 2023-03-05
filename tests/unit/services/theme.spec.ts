import { themeById, maxId } from "../../../src/services/theme";

describe("Theme", () => {
  test("not existing id - get default id", async () => {
    const notExistingId = 3
    const theme = themeById(notExistingId);

    expect(theme.id).toEqual(1);
  });

  test("undefined - get default id", async () => {
    const notExistingId = undefined
    const theme = themeById(notExistingId);

    expect(theme.id).toEqual(1);
  });

  test("get theme by id", async () => {
    const theme = themeById(2);

    expect(theme.id).toEqual(2);
  });

  test("max id", async () => {
    expect(maxId()).toEqual(2);
  });
});
