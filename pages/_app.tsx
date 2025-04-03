import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Noto_Sans_Thai } from "next/font/google";
import { MaterialProvider } from "@/component/meterial-context";
import { SessionProvider } from "next-auth/react";
import { SearchCAQouteProvider } from "@/component/search-ca-qoute-context";
import { AlertAndLoading } from "@/component/alert-loading";

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
    primary: {
      main: "#0056b3",
    },
    secondary: {
      main: "#4a4a4a",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#2196f3",
    },
    warning: {
      main: "#ff9800",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: '#003d80',
            color: 'white',
          },
        },
        containedPrimary: {
          backgroundColor: '#0056b3',
          color: 'white',
          '&:hover': {
            backgroundColor: '#003d80',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <main className={mitr.className}>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <AlertAndLoading>
            <SearchCAQouteProvider>
              <MaterialProvider>
                <Component {...pageProps} />
              </MaterialProvider>
            </SearchCAQouteProvider>
          </AlertAndLoading>
        </SessionProvider>
      </ThemeProvider>
    </main>
  );
}
