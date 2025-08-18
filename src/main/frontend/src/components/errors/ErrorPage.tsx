import {useRouteError} from "react-router-dom";
import {getErrorMessage} from "./index";

/**
 * Error page component for use with React Router's errorElement
 */
export default function ErrorPage() {
  const error = useRouteError();
  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-md bg-red-50 p-6 shadow-sm border border-red-100 max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-700 mb-2">Oops!</h1>
        <p className="text-red-600 mb-4">
          Sorry, an unexpected error has occurred.
        </p>

        <div className="bg-white p-3 rounded-md border border-red-100 text-left">
          <p className="text-sm text-gray-700 font-mono">{errorMessage}</p>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
