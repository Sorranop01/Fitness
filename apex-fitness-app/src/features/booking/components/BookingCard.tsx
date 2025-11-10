import { Calendar, Clock, MapPin, User, Check, X } from 'lucide-react';
import type { Booking } from '@/types';
import { formatDateTime, formatTime, formatShortDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/Button';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { useClassById } from '../hooks/useClassById';

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess?: () => void;
}

export function BookingCard({ booking, onCancelSuccess }: BookingCardProps) {
  const cancelMutation = useCancelBooking();

  // Fetch class details if this is a class booking
  const { data: classData } = useClassById(booking.classId || '');

  const handleCancel = async () => {
    if (!confirm('คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync({
        bookingId: booking.id,
        userId: booking.userId,
        classId: booking.classId,
      });

      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      alert(errorMessage);
    }
  };

  const isUpcoming = booking.startTime > new Date() && booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';

  // Status Badge
  const getStatusBadge = () => {
    if (isCancelled) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          ยกเลิกแล้ว
        </span>
      );
    }

    if (isCompleted) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Check className="w-3 h-3 mr-1" />
          เสร็จสิ้น
        </span>
      );
    }

    if (isUpcoming) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          ยืนยันแล้ว
        </span>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.type === 'class' && classData ? classData.name : 'การจองซาวน่า'}
          </h3>
          {booking.type === 'class' && classData && (
            <p className="text-sm text-gray-600 flex items-center">
              <User className="w-4 h-4 mr-1" />
              ผู้สอน: {classData.instructor}
            </p>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        {/* Date */}
        <div className="flex items-center text-sm text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{formatShortDate(booking.startTime)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center text-sm text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>สาขา: {booking.locationId}</span>
        </div>

        {/* Check-in status */}
        {booking.checkedInAt && (
          <div className="flex items-center text-sm text-green-600">
            <Check className="w-4 h-4 mr-2" />
            <span>เช็คอินแล้วเมื่อ: {formatDateTime(booking.checkedInAt)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {isUpcoming && (
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'กำลังยกเลิก...' : 'ยกเลิกการจอง'}
          </Button>
        </div>
      )}
    </div>
  );
}
