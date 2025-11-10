// ==========================================
// Components
// ==========================================
export { CheckInButton } from './components/CheckInButton';
export { CheckInCard } from './components/CheckInCard';
export { CheckInHistory } from './components/CheckInHistory';
export { CheckInStats } from './components/CheckInStats';

// ==========================================
// Hooks
// ==========================================
export { useCheckIn } from './hooks/useCheckIn';
export { useValidateCheckIn } from './hooks/useValidateCheckIn';
export { useTodayCheckIns } from './hooks/useTodayCheckIns';
export { useCheckInHistory } from './hooks/useCheckInHistory';
export { useCheckInStats } from './hooks/useCheckInStats';

// ==========================================
// API
// ==========================================
export {
  checkIn,
  validateCheckIn,
  getTodayCheckInEligibleBookings,
  getCheckInHistory,
  getCheckInStats,
  type CheckInResult,
  type CheckInValidation,
} from './api/checkInApi';
