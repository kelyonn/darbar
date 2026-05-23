import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="font-montserrat text-royal-gold text-xs tracking-[4px] uppercase mb-4">Unexpected Error</p>
            <h1 className="font-playfair text-4xl mb-4">Something went wrong</h1>
            <p className="font-montserrat text-sm text-gray-600 mb-8">
              {this.state.error?.message || 'An unexpected error occurred. Please refresh the page.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                className="bg-royal-gold text-white px-6 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-all"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="border border-gray-300 text-gray-600 px-6 py-3 rounded font-montserrat text-sm hover:border-gray-400 transition-all"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
