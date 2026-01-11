import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-[#c4c4c6] flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-light tracking-wide mb-4">Error</h1>
            <p className="text-[#c4c4c6] mb-4">Something went wrong.</p>
            {this.state.error && (
              <pre className="bg-[#0a0a0b] p-4 rounded-md text-left text-xs overflow-auto">
                <code>{this.state.error.toString()}</code>
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#2d4a3a] text-white rounded-md hover:bg-[#3d5a4a]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
