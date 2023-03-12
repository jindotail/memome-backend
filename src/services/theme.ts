import { ITheme } from "../interfaces/ITheme";

const defaultTheme: ITheme = {
  id: 1,
  backgroundColor: { start: "#dfe8ff", middle: "#f3c6f1", end: "#ffcfd1" },
  commentColor: { start: "#eb93f7", end: "#d398fd" },
};

const themes: ITheme[] = [
  defaultTheme,
  {
    id: 2,
    backgroundColor: { start: "#F4EEFF", middle: "#DCD6F7", end: "#A6B1E1" },
    commentColor: { start: "#A6B1E1", end: "#97a9f6" },
  },
  {
    id: 3,
    backgroundColor: { start: "#FFB200", middle: "#FFCB42", end: "#FFF4CF" },
    commentColor: { start: "#FFE69A", end: "#FFD24C" },
  },
  {
    id: 4,
    backgroundColor: { start: "#9EB23B", middle: "#C7D36F", end: "#FCF9C6" },
    commentColor: { start: "#FCF9C6", end: "#FFE69A" },
  },
];

export const themeById = (id: number | undefined): ITheme => {
  const theme = themes.find((e) => e.id == id);

  if (theme === undefined) return defaultTheme;
  return theme;
};

export const maxId = (): number => {
  return themes.length;
};
