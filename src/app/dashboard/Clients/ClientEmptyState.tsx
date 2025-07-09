import React from "react";
import Image from "next/image";

interface ClientEmptyStateProps {
  onCreate: () => void;
}

const ClientEmptyState: React.FC<ClientEmptyStateProps> = ({ onCreate }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex flex-col items-center justify-center text-center bg-white">
      <div className="w-56 h-56 flex items-center justify-center mb-0">
        <Image src="/no_client.svg" alt="No clients" width={224} height={224} className="w-56 h-56" />
      </div>
      <div className="text-lg font-semibold text-zinc-900 mb-1">No clients on record</div>
      <div className="text-zinc-400 text-sm mb-6 px-4 text-center">Once you add clients a list of them will appear here in real time.</div>
      <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 text-sm font-medium shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Create new client
      </button>
    </div>
  </div>
);

export default ClientEmptyState; 