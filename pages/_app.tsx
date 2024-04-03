import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Noto_Sans_Thai } from "next/font/google";

const mitr = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export let theme = createTheme({
  typography: {
    fontFamily: mitr.style.fontFamily,
    fontSize: 14,
  },
  palette: {
    secondary: {
      main: "#6B3B7B",
    },
    primary: {
      main: "#FFC653",
    },
    success: {
      main: "#DB6773",
    },
    info: {
      main: "#3C8161",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={mitr.className}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </main>
  );
}
