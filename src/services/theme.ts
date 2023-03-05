import { ITheme } from "../interfaces/ITheme";

const defaultTheme: ITheme = {
  id: 1,
  backgroundColor: { start: "#8B008B", middle: "#C71585", end: "#FF69B4" },
  commentColor: { start: "#0000CD", end: "#0000FF" },
};

const themes: ITheme[] = [
  defaultTheme,
  {
    id: 2,
    backgroundColor: { start: "#8B008B", middle: "#C71585", end: "#FF69B4" },
    commentColor: { start: "#0000CD", end: "#0000FF" },
  },
];

export const themeById = (id: number | undefined): ITheme => {
  const theme = themes.find((e) => e.id == id);

  if (theme === undefined) return defaultTheme;
  return theme;
};
