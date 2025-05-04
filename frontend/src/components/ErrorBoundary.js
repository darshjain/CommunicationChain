import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {

        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {

        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-100 text-red-800">
                    <h2 className="text-xl font-bold">Something went wrong.</h2>
                    <p>{String(this.state.error)}</p>
                </div>
            );
        }

        return this.props.children;
    }
}
