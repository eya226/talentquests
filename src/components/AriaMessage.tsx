import React from 'react';

const AriaMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-800 rounded-lg p-4 max-w-lg">
        <p className="text-white">{children}</p>
      </div>
    </div>
  );
};

export default AriaMessage;