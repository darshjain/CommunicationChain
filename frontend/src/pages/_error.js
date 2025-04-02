function Error({ statusCode }) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-500">
                    {statusCode ? `Error: ${statusCode}` : "An error occurred"}
                </h1>
                <p className="mt-2 text-gray-600">
                    Sorry about that! Please try again later.
                </p>
            </div>
        </div>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
