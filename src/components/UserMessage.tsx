import React from 'react';

const UserMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="bg-purple-600 rounded-lg p-4 max-w-lg">
        <p className="text-white">{children}</p>
      </div>
    </div>
  );
};

export default UserMessage;