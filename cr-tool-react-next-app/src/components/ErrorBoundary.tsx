import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex min-h-screen items-center justify-center p-6 text-center">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-destructive">問題が発生しました</h2>
            <p className="text-sm text-muted-foreground">
              予期せぬエラーが発生しました。ページを再読み込みしてください。
            </p>
            {this.state.error && (
              <p className="text-xs text-muted-foreground">
                エラー詳細: {this.state.error.message}
              </p>
            )}
            <Button variant="destructive" onClick={this.handleReload}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              再読み込み
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
