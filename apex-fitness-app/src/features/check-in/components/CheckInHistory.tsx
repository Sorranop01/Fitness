import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useCheckInHistory } from '../hooks/useCheckInHistory';
import { useClassById } from '@/features/booking/hooks/useClassById';
import { Spinner } from '@/components/ui/Spinner';
import { formatDateTime, formatShortDate } from '@/utils/formatDate';
import type { Booking } from '@/types';

interface CheckInHistoryProps {
  userId: string;
  limit?: number;
}

function HistoryItem({ booking }: { booking: Booking }) {
  const { data: classData } = useClassById(booking.classId || '');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">
            {booking.type === 'class' && classData ? classData.name : 'ซาวน่า'}
          </h4>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1.5" />
              <span>{formatShortDate(booking.startTime)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1.5" />
              <span>สาขา: {booking.locationId}</span>
            </div>
            {booking.checkedInAt && (
              <div className="flex items-center text-green-600">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>เช็คอินเมื่อ: {formatDateTime(booking.checkedInAt)}</span>
              </div>
            )}
          </div>
        </div>

        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      </div>
    </div>
  );
}

export function CheckInHistory({ userId, limit = 20 }: CheckInHistoryProps) {
  const { data: history, isLoading, error } = useCheckInHistory(userId, limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          เกิดข้อผิดพลาด: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีประวัติการเช็คอิน</h3>
        <p className="text-gray-600">เมื่อคุณเช็คอินเข้าคลาส ประวัติจะแสดงที่นี่</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        ประวัติการเช็คอิน ({history.length})
      </h3>
      {history.map((booking) => (
        <HistoryItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
