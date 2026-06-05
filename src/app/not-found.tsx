import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-7xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent mb-4">
          404
        </p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all notes
        </Link>
      </div>
    </div>
  );
}
