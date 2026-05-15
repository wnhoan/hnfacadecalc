import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            The calculation engine encountered an error. This might be due to invalid input values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} className="w-full">
            Reset Application
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
