export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]} flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold hover:opacity-70">
          &times;
        </button>
      )}
    </div>
  );
}
