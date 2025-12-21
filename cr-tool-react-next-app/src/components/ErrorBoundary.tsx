import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          textAlign="center"
          p={4}
        >
          <VStack spacing={4}>
            <Heading as="h2" size="lg" color="red.500">
              問題が発生しました
            </Heading>
            <Text color="gray.600">
              予期せぬエラーが発生しました。ページを再読み込みしてください。
            </Text>
            {this.state.error && (
              <Text fontSize="sm" color="gray.500">
                エラー詳細: {this.state.error.message}
              </Text>
            )}
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="red"
              onClick={this.handleReload}
            >
              再読み込み
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;