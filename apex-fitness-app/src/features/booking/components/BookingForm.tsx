import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCreateBooking } from '../hooks/useCreateBooking';
import type { Class as ClassType, BookingType } from '@/types';
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle } from 'lucide-react';
import { formatTime, formatShortDate } from '@/utils/formatDate';

interface BookingFormProps {
  classData?: ClassType;
  bookingType: BookingType;
  locationId: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BookingForm({
  classData,
  bookingType,
  locationId,
  userId,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const createBookingMutation = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        userId,
        type: bookingType,
        classId: classData?.id,
        locationId,
        startTime: classData?.startTime || new Date(),
        endTime: classData?.endTime || new Date(),
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      alert(errorMessage);
      setIsConfirming(false);
    }
  };

  const handleBack = () => {
    if (isConfirming) {
      setIsConfirming(false);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Success state
  if (createBookingMutation.isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">จองสำเร็จ!</h2>
        <p className="text-gray-600 mb-6">
          {bookingType === 'class'
            ? 'คุณได้จองคลาสนี้เรียบร้อยแล้ว'
            : 'คุณได้จองซาวน่าเรียบร้อยแล้ว'
          }
        </p>
        {onSuccess && (
          <Button type="button" onClick={onSuccess}>
            ตกลง
          </Button>
        )}
      </div>
    );
  }

  const availableSlots = classData ? classData.capacity - classData.bookedCount : 0;
  const isFullyBooked = availableSlots <= 0;

  // Confirmation screen
  if (isConfirming) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ยืนยันการจอง</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {bookingType === 'class' && classData ? classData.name : 'การจองซาวน่า'}
          </h3>

          {/* Class details */}
          {bookingType === 'class' && classData && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2" />
                <span>ผู้สอน: {classData.instructor}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatShortDate(classData.startTime)}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2" />
                <span>สาขา: {locationId}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">ข้อควรทราบ:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>กรุณามาถึงก่อนเวลาอย่างน้อย 10 นาที</li>
                <li>การยกเลิกต้องทำก่อนเวลาอย่างน้อย 2 ชั่วโมง</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={createBookingMutation.isPending}
            >
              ย้อนกลับ
            </Button>
            <Button
              type="submit"
              isLoading={createBookingMutation.isPending}
              disabled={createBookingMutation.isPending}
              className="flex-1"
            >
              {createBookingMutation.isPending ? 'กำลังจอง...' : 'ยืนยันการจอง'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Initial booking form
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {bookingType === 'class' ? 'จองคลาส' : 'จองซาวน่า'}
      </h2>

      {bookingType === 'class' && classData && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{classData.name}</h3>
            <p className="text-gray-600 mb-4">{classData.description}</p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                <span>ผู้สอน: {classData.instructor}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <span>{formatShortDate(classData.startTime)}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                <span>
                  {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>สาขา: {locationId}</span>
              </div>
            </div>
          </div>

          {/* Availability status */}
          {isFullyBooked ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">คลาสนี้เต็มแล้ว</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">เหลือที่ว่างอีก {availableSlots} ที่</span>
              </div>
            </div>
          )}
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              ยกเลิก
            </Button>
          )}
          <Button
            type="submit"
            disabled={isFullyBooked}
            className="flex-1"
          >
            {isFullyBooked ? 'คลาสเต็มแล้ว' : 'จองเลย'}
          </Button>
        </div>
      </form>
    </div>
  );
}
