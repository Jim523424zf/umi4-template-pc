import { componentErrorLogHandler, listenUncaughtErrors, unListenUncaughtErrors } from "@/utils/error";
import { Result } from "antd";
import { Component, ErrorInfo, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean; errorInfo: string }> {
  state = { hasError: false, errorInfo: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidMount(): void {
    listenUncaughtErrors();
  }

  componentWillUnmount(): void {
    unListenUncaughtErrors();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    componentErrorLogHandler(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Result status='error' title='Something went wrong.' extra={this.state.errorInfo} />;
    }
    return this.props.children;
  }
}
