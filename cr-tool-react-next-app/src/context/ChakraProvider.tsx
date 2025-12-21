import {
  ChakraProvider as ChakraUIProvider,
  extendTheme,
  ThemeConfig,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react"; // Add back useEffect, useState imports

type ChakraProviderProps = {
  children: ReactNode;
};

// Chakra UIの設定
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// テーマの拡張
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      900: "#0d47a1",
    },
  },
  fonts: {
    heading: `'Noto Sans JP', sans-serif`,
    body: `'Noto Sans JP', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
  components: {
    Badge: {
      baseStyle: {
        bg: "gray.100",
      },
    },
    Box: {
      baseStyle: {
        borderColor: "gray.200",
      },
    },
  },
});

export const ChakraProvider = ({ children }: ChakraProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing on the server or before hydration
  }

  return (
    <ChakraUIProvider theme={theme} resetCSS={true}>
      {children}
    </ChakraUIProvider>
  );
};

export default ChakraProvider;
