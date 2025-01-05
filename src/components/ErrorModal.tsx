type ErrorModalProps = {
  message: string;
};

export const ErrorModal = ({ message }: ErrorModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Erreur</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => window.location.href = '/login'}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}; 
