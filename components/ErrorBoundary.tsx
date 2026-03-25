import React from 'react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

interface Props {
  children: React.ReactNode;
  /** Optional component name shown in the error indicator */
  feature?: string;
  /** If true, renders nothing instead of an error message when failed */
  silent?: boolean;
}

/**
 * ErrorBoundary — prevents any feature crash from breaking the entire page.
 * Follows the PART 8 failsafe requirement: never show blank/black screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console only — never escalate to blank page
    console.warn(`[ErrorBoundary] ${this.props.feature || 'Feature'} failed:`, error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      return (
        <div
          className="px-3 py-2 rounded-lg border border-white/5 bg-white/[0.01] inline-flex items-center gap-2"
          title={this.state.errorMessage}
        >
          <span className="font-mono text-[8px] text-text-muted/40 uppercase tracking-widest">
            {this.props.feature || 'Feature'} unavailable
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
