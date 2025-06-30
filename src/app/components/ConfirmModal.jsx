import React from 'react';

export default function ConfirmModal({ open, message, onConfirm, onCancel, local }) {
  if (!open) return null;
  return (
    <div
      className={
        local
          ? 'absolute inset-0 bg-black/20 flex items-center justify-center z-50'
          : 'fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      }
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="mb-4 text-gray-800">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">OK</button>
        </div>
      </div>
    </div>
  );
} 