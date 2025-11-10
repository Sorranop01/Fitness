import { useState } from 'react';
import { BookingList } from '@/features/booking';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MyBookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(true);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อดูการจองของคุณ</p>
        <Button type="button" onClick={() => navigate('/login')}>
          เข้าสู่ระบบ
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">การจองของฉัน</h1>
            <p className="text-gray-600">จัดการและดูประวัติการจองคลาสและซาวน่า</p>
          </div>

          <Button type="button" onClick={() => navigate('/classes')}>
            จองคลาสใหม่
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setShowOnlyUpcoming(true)}
              className={`
                flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  showOnlyUpcoming
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Clock className="w-4 h-4 mr-2" />
              กำลังจะมาถึง
            </button>
            <button
              type="button"
              onClick={() => setShowOnlyUpcoming(false)}
              className={`
                flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  !showOnlyUpcoming
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Calendar className="w-4 h-4 mr-2" />
              ทั้งหมด
            </button>
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      <BookingList userId={user.id} showOnlyUpcoming={showOnlyUpcoming} />
    </div>
  );
}
