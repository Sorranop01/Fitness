import { BookingCard } from './BookingCard';
import { Spinner } from '@/components/ui/Spinner';
import { useBookings, useUpcomingBookings } from '../hooks/useBookings';
import { CalendarX } from 'lucide-react';

interface BookingListProps {
  userId: string;
  showOnlyUpcoming?: boolean;
}

export function BookingList({ userId, showOnlyUpcoming = false }: BookingListProps) {
  const bookingsQuery = showOnlyUpcoming
    ? useUpcomingBookings(userId)
    : useBookings(userId);

  const { data: bookings, isLoading, error, refetch } = bookingsQuery;

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
        <p className="text-red-600 mb-4">
          เกิดข้อผิดพลาดในการโหลดข้อมูล: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarX className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {showOnlyUpcoming ? 'ไม่มีการจองที่กำลังจะมาถึง' : 'ไม่มีประวัติการจอง'}
        </h3>
        <p className="text-gray-600">
          {showOnlyUpcoming
            ? 'คุณยังไม่มีการจองที่กำลังจะมาถึง'
            : 'คุณยังไม่เคยทำการจองคลาสหรือซาวน่า'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancelSuccess={() => refetch()}
        />
      ))}
    </div>
  );
}
