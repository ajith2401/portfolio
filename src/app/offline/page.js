export default function Offline() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
        <h1 className="text-3xl font-bold mb-4">You&apos;re currently offline</h1>
        <p className="mb-6">It seems you&apos;ve lost your internet connection. Some content might not be available.</p>
        <p>You can still browse previously visited pages while we wait for your connection to return.</p>
      </div>
    );
  }