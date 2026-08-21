// lib/guard-utils.ts
import { Guard } from "@/app/types/client/guard.types";

export const getGuardStatus = (guard: Guard) => {
  if (guard.online_status?.is_online) {
    return {
      label: 'Online',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      dot: 'bg-green-500',
    };
  }
  return {
    label: 'Offline',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dot: 'bg-gray-500',
  };
};

export const getGuardDutyStatus = (guard: Guard) => {
  if (guard.current_duty) {
    const status = guard.current_duty.assignment_status;
    switch (status) {
      case 'active':
        return { label: 'On Duty', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'assigned':
        return { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
      case 'completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default:
        return { label: 'Not Assigned', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
    }
  }
  return { label: 'Not Assigned', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};