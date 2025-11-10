import { Calendar, Clock, MapPin, User } from 'lucide-react';
import type { Booking } from '@/types';
import { formatTime, formatShortDate } from '@/utils/formatDate';
import { CheckInButton } from './CheckInButton';
import { useClassById } from '@/features/booking/hooks/useClassById';

interface CheckInCardProps {
  booking: Booking;
  onCheckInSuccess?: () => void;
}

export function CheckInCard({ booking, onCheckInSuccess }: CheckInCardProps) {
  // Fetch class details if this is a class booking
  const { data: classData } = useClassById(booking.classId || '');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
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
      </div>

      {/* Check-in Action */}
      <div className="pt-4 border-t border-gray-200">
        <CheckInButton booking={booking} onSuccess={onCheckInSuccess} />
      </div>
    </div>
  );
}
