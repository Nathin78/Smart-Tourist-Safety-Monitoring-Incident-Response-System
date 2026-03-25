import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AlertNotification = () => {
  const handleShowAlert = (type) => {
    if (type === 'success') {
      toast.success('Operation completed successfully!');
    } else if (type === 'error') {
      toast.error('An error occurred!');
    } else if (type === 'info') {
      toast.custom((t) => (
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <FiInfo size={20} />
            <span>Information alert</span>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {/* Alerts are handled by react-hot-toast Toaster component in App */}
    </div>
  );
};

export default AlertNotification;
