"use client";

import React from "react";

export class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // If it's a chunk load error or similar network failure when loading a module
    if (
      error.name === "ChunkLoadError" ||
      (error.message && error.message.toLowerCase().includes("loading chunk")) ||
      (error.message && error.message.toLowerCase().includes("fetch")) ||
      (error.message && error.message.toLowerCase().includes("failed to load"))
    ) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return null;
    }
    return this.props.children;
  }
}
