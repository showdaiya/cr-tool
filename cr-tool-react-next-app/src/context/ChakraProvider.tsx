import {
  ChakraProvider as ChakraUIProvider,
  extendTheme,
  ThemeConfig,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

type ChakraProviderProps = {
  children: ReactNode;
};

// Chakra UIの設定
const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
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
    heading: `var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif`,
    body: `var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif`,
  },
  semanticTokens: {
    colors: {
      "bg.page": {
        default: "white",
        _dark: "gray.900",
      },
      "bg.card": {
        default: "white",
        _dark: "gray.800",
      },
      "bg.footer": {
        default: "gray.50",
        _dark: "gray.900",
      },
      "text.primary": {
        default: "gray.800",
        _dark: "gray.100",
      },
      "text.secondary": {
        default: "gray.600",
        _dark: "gray.400",
      },
      "text.muted": {
        default: "gray.500",
        _dark: "gray.500",
      },
      "border.default": {
        default: "gray.200",
        _dark: "gray.700",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "bg.page",
        color: "text.primary",
      },
    },
  },
  components: {
    Badge: {
      baseStyle: {
        bg: "gray.100",
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
