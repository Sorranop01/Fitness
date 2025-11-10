import { Link } from 'react-router-dom';
import type { Class } from '@/types';
import { formatTime, formatShortDate } from '@/utils/formatDate';

interface ClassCardProps {
  classData: Class;
}

export function ClassCard({ classData }: ClassCardProps) {
  const availableSlots = classData.capacity - classData.bookedCount;
  const isFullyBooked = availableSlots <= 0;
  const isAlmostFull = availableSlots > 0 && availableSlots <= 5;

  return (
    <Link
      to={`/classes/${classData.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {classData.name}
          </h3>
          <p className="text-sm text-gray-600">
            ผู้สอน: {classData.instructor}
          </p>
        </div>

        {/* Availability Badge */}
        {isFullyBooked ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            เต็มแล้ว
          </span>
        ) : isAlmostFull ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            เหลือ {availableSlots} ที่
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ว่าง {availableSlots} ที่
          </span>
        )}
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {classData.description}
      </p>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        {/* Date */}
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatShortDate(classData.startTime)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTime(classData.startTime)} - {formatTime(classData.endTime)}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{classData.bookedCount}/{classData.capacity}</span>
        </div>
      </div>
    </Link>
  );
}
