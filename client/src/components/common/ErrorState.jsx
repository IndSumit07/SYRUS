import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "We could not load the data. Please try again.",
  actionLabel = "Try again",
  onRetry,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-red-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 bg-[#FD6000] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                  <RotateCcw size={16} />
                  {actionLabel}
                </button>
              )}
              {onSecondaryAction && (
                <button
                  onClick={onSecondaryAction}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {secondaryActionLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
