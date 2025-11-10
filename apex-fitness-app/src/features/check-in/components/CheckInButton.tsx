import { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCheckIn } from '../hooks/useCheckIn';
import { useValidateCheckIn } from '../hooks/useValidateCheckIn';
import type { Booking } from '@/types';

interface CheckInButtonProps {
  booking: Booking;
  onSuccess?: () => void;
}

export function CheckInButton({ booking, onSuccess }: CheckInButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const checkInMutation = useCheckIn();
  const { data: validation, isLoading: isValidating } = useValidateCheckIn(booking.id);

  const handleCheckIn = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      await checkInMutation.mutateAsync({
        bookingId: booking.id,
        userId: booking.userId,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      alert(errorMessage);
      setShowConfirm(false);
    }
  };

  // Already checked in
  if (booking.checkedInAt) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="w-5 h-5 mr-2" />
        <span className="font-medium">เช็คอินแล้ว</span>
      </div>
    );
  }

  // Loading validation
  if (isValidating) {
    return (
      <Button type="button" variant="secondary" disabled>
        <Clock className="w-4 h-4 mr-2 animate-spin" />
        กำลังตรวจสอบ...
      </Button>
    );
  }

  // Cannot check in
  if (validation && !validation.canCheckIn) {
    return (
      <div className="text-sm">
        <div className="flex items-center text-gray-500 mb-1">
          <XCircle className="w-4 h-4 mr-2" />
          <span>{validation.reason}</span>
        </div>
        {validation.timeUntilCheckIn && validation.timeUntilCheckIn > 0 && (
          <p className="text-xs text-gray-400 ml-6">
            เปิดให้เช็คอินในอีก {validation.timeUntilCheckIn} นาที
          </p>
        )}
      </div>
    );
  }

  // Success state
  if (checkInMutation.isSuccess) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="w-5 h-5 mr-2" />
        <span className="font-medium">เช็คอินสำเร็จ!</span>
      </div>
    );
  }

  // Confirm screen
  if (showConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-700 mb-3">ยืนยันการเช็คอิน?</p>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={checkInMutation.isPending}
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleCheckIn}
            isLoading={checkInMutation.isPending}
            disabled={checkInMutation.isPending}
          >
            {checkInMutation.isPending ? 'กำลังเช็คอิน...' : 'ยืนยัน'}
          </Button>
        </div>
      </div>
    );
  }

  // Ready to check in
  return (
    <Button
      type="button"
      variant="primary"
      onClick={handleCheckIn}
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      เช็คอิน
    </Button>
  );
}
