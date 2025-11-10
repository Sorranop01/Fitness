import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Dumbbell, CheckCircle, Clock, ArrowRight, Droplets } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUpcomingBookings } from '@/features/booking';
import { useCheckInStats } from '@/features/check-in';
import { useTodayCheckIns } from '@/features/check-in/hooks/useTodayCheckIns';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatTime, formatShortDate } from '@/utils/formatDate';

export function HomePage() {
  const { user } = useAuth();
  const { data: upcomingBookings, isLoading: bookingsLoading } = useUpcomingBookings(user?.id || '');
  const { data: checkInStats, isLoading: statsLoading } = useCheckInStats(user?.id || '');
  const { data: todayCheckIns, isLoading: todayLoading } = useTodayCheckIns(user?.id || '');

  const upcomingCount = upcomingBookings?.length || 0;
  const todayCheckInsCount = todayCheckIns?.length || 0;
  const monthCheckIns = checkInStats?.thisMonth || 0;

  // Get next class
  const nextClass = upcomingBookings?.[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          สวัสดี {user?.displayName || user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-gray-600">
          {todayCheckInsCount > 0
            ? `คุณมี ${todayCheckInsCount} คลาสที่สามารถเช็คอินได้วันนี้`
            : 'พร้อมออกกำลังกายแล้วหรือยัง?'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          to="/classes"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Dumbbell className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">จองคลาส</h3>
          <p className="text-blue-100 text-sm">เลือกคลาสที่คุณชอบ</p>
        </Link>

        <Link
          to="/check-in"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">เช็คอิน</h3>
          <p className="text-green-100 text-sm">
            {todayCheckInsCount > 0 ? `${todayCheckInsCount} คลาสวันนี้` : 'เช็คอินคลาสของคุณ'}
          </p>
        </Link>

        <Link
          to="/bookings"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">การจองของฉัน</h3>
          <p className="text-purple-100 text-sm">
            {upcomingCount > 0 ? `${upcomingCount} การจอง` : 'ดูการจองทั้งหมด'}
          </p>
        </Link>

        <Link
          to="/sauna"
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">จองซาวน่า</h3>
          <p className="text-orange-100 text-sm">ผ่อนคลายหลังออกกำลังกาย</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">การจองที่จะมาถึง</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          {bookingsLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-blue-600">{upcomingCount}</p>
              <p className="text-sm text-gray-500 mt-1">คลาสที่จอง</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">การเช็คอินเดือนนี้</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          {statsLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-green-600">{monthCheckIns}</p>
              <p className="text-sm text-gray-500 mt-1">ครั้ง</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">เช็คอินวันนี้</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          {todayLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-orange-600">{todayCheckInsCount}</p>
              <p className="text-sm text-gray-500 mt-1">คลาสวันนี้</p>
            </>
          )}
        </div>
      </div>

      {/* Next Class */}
      {nextClass && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm p-6 border border-indigo-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">คลาสถัดไป</h3>
              </div>
              <div className="ml-7">
                <p className="text-gray-600 text-sm mb-1">
                  {formatShortDate(nextClass.startTime)} • {formatTime(nextClass.startTime)}
                </p>
                <p className="text-gray-500 text-xs">สาขา: {nextClass.locationId}</p>
              </div>
            </div>
            <Link to={`/classes/${nextClass.classId}`}>
              <Button type="button" variant="primary" size="sm">
                ดูรายละเอียด
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!bookingsLoading && upcomingCount === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Dumbbell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีการจอง</h3>
          <p className="text-gray-600 mb-6">เริ่มต้นการออกกำลังกายด้วยการจองคลาสแรกของคุณ</p>
          <Link to="/classes">
            <Button type="button" variant="primary">
              เลือกคลาส
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
