export const COLUMNS: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // used to generate labels/keys for squares, array length determines rendered board size
export const ROWS: number = 10; // defines number of rows on board
export const SQUARE_SIZE: number = 100; // defines width and height of each square, impacts rendered board size

export const API_ENDPOINT: string = `${
  process.env.REACT_APP_API_USE_HTTPS === "YES" ? "https://" : "http://"
}${process.env.REACT_APP_API_DOMAIN}`;
