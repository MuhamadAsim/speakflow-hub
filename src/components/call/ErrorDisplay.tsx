interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700 text-sm">
        <strong>Error:</strong> {error}
      </p>
    </div>
  );
};

export default ErrorDisplay;
