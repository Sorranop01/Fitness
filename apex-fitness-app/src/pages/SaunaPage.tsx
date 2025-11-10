import { useState } from 'react';
import { Droplets, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data for demonstration
const MOCK_LOCATIONS = [
  { id: 'bangkok-sukhumvit', name: 'สาขา สุขุมวิท', capacity: 4 },
  { id: 'bangkok-silom', name: 'สาขา สีลม', capacity: 6 },
  { id: 'bangkok-thonglor', name: 'สาขา ทองหล่อ', capacity: 4 },
];

const TIME_SLOTS = [
  { start: '06:00', end: '07:00' },
  { start: '07:00', end: '08:00' },
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
  { start: '17:00', end: '18:00' },
  { start: '18:00', end: '19:00' },
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' },
];

export function SaunaPage() {
  const [selectedLocation, setSelectedLocation] = useState(MOCK_LOCATIONS[0].id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const location = MOCK_LOCATIONS.find((loc) => loc.id === selectedLocation);

  const handleBooking = () => {
    if (!selectedSlot) return;

    // This would call the createBooking API
    alert(`การจองซาวน่า\nสาขา: ${location?.name}\nวันที่: ${selectedDate}\nเวลา: ${selectedSlot}\n\n(ฟีเจอร์นี้ยังไม่เชื่อมต่อกับ API จริง)`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Droplets className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">จองซาวน่า</h1>
        </div>
        <p className="text-gray-600">เลือกสาขา วันที่ และเวลาที่ต้องการใช้บริการซาวน่า</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Location Selection */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                เลือกสาขา
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MOCK_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setSelectedLocation(loc.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${
                        selectedLocation === loc.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <p className="font-medium text-gray-900">{loc.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Users className="w-3 h-3 inline mr-1" />
                      {loc.capacity} ที่
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                เลือกวันที่
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Time Slot Selection */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                เลือกช่วงเวลา (1 ชั่วโมง)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                {TIME_SLOTS.map((slot) => {
                  const slotKey = `${slot.start}-${slot.end}`;
                  const isSelected = selectedSlot === slotKey;

                  return (
                    <button
                      key={slotKey}
                      type="button"
                      onClick={() => setSelectedSlot(slotKey)}
                      className={`
                        px-3 py-2 rounded-lg border text-sm font-medium transition-all
                        ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }
                      `}
                    >
                      {slot.start}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="primary"
                onClick={handleBooking}
                disabled={!selectedSlot}
                className="w-full"
              >
                {selectedSlot ? 'ยืนยันการจอง' : 'กรุณาเลือกช่วงเวลา'}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary & Info */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">สรุปการจอง</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-600">สาขา</p>
                  <p className="font-medium text-gray-900">{location?.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-600">วันที่</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-600">เวลา</p>
                  <p className="font-medium text-gray-900">
                    {selectedSlot || 'ยังไม่ได้เลือก'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-600">ความจุ</p>
                  <p className="font-medium text-gray-900">{location?.capacity} คน</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">ข้อมูลการใช้บริการ</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>ระยะเวลาใช้บริการ 1 ชั่วโมงต่อรอบ</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>สามารถยกเลิกการจองก่อนเวลาใช้งาน 2 ชั่วโมง</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>กรุณามาถึงก่อนเวลาอย่างน้อย 10 นาที</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>โปรดเตรียมผ้าขนหนูและชุดว่ายน้ำเอง</span>
              </li>
            </ul>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-800">
              <strong>หมายเหตุ:</strong> หน้าจองซาวน่านี้เป็น Demo UI ยังไม่ได้เชื่อมต่อกับ API จริง
              สำหรับการใช้งานจริง ควรเพิ่ม API endpoints และ hooks สำหรับจองซาวน่า
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
