import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassById } from '@/features/booking/hooks/useClassById';
import { BookingForm } from '@/features/booking';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { formatTime, formatDateTime } from '@/utils/formatDate';

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: classData, isLoading, error } = useClassById(id || '');
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่พบคลาสนี้</h3>
        <p className="text-gray-600 mb-4">คลาสที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
        <Button onClick={() => navigate('/classes')}>
          กลับไปหน้าคลาส
        </Button>
      </div>
    );
  }

  const availableSlots = classData.capacity - classData.bookedCount;
  const isFullyBooked = availableSlots <= 0;
  const isAlmostFull = availableSlots > 0 && availableSlots <= 5;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/classes')}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไปหน้าคลาส
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{classData.name}</h1>
              <p className="text-blue-100 text-lg">ผู้สอน: {classData.instructor}</p>
            </div>

            {/* Availability Badge */}
            {isFullyBooked ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white">
                เต็มแล้ว
              </span>
            ) : isAlmostFull ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-500 text-white">
                เหลือ {availableSlots} ที่
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white">
                ว่าง {availableSlots} ที่
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">รายละเอียด</h2>
            <p className="text-gray-700 leading-relaxed">{classData.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date & Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">วันและเวลา</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-900">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDateTime(classData.startTime)}</span>
                </div>
                <div className="flex items-center text-gray-900">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ระยะเวลา: {formatTime(classData.startTime)} - {formatTime(classData.endTime)}</span>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">จำนวนผู้เข้าร่วม</h3>
              <div className="flex items-center text-gray-900">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>
                  จอง {classData.bookedCount} / {classData.capacity} คน
                  {!isFullyBooked && ` (เหลือ ${availableSlots} ที่)`}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>ความคืบหน้าการจอง</span>
              <span>{Math.round((classData.bookedCount / classData.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isFullyBooked
                    ? 'bg-red-500'
                    : isAlmostFull
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${(classData.bookedCount / classData.capacity) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {!showBookingForm ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isFullyBooked || !user}
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  setShowBookingForm(true);
                }}
              >
                {!user ? 'เข้าสู่ระบบเพื่อจอง' : isFullyBooked ? 'เต็มแล้ว' : 'จองคลาสนี้'}
              </Button>
            </div>
          ) : (
            <div>
              <BookingForm
                classData={classData}
                bookingType="class"
                locationId={classData.locationId}
                userId={user?.id || ''}
                onSuccess={() => {
                  setShowBookingForm(false);
                  navigate('/bookings');
                }}
                onCancel={() => setShowBookingForm(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
