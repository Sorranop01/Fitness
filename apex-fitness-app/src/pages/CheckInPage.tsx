import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, History, BarChart3 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTodayCheckIns } from '@/features/check-in/hooks/useTodayCheckIns';
import { CheckInCard } from '@/features/check-in/components/CheckInCard';
import { CheckInHistory } from '@/features/check-in/components/CheckInHistory';
import { CheckInStats } from '@/features/check-in/components/CheckInStats';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

type TabType = 'today' | 'history' | 'stats';

export function CheckInPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const { data: todayBookings, isLoading, error, refetch } = useTodayCheckIns(user?.id || '');

  if (!user) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อเช็คอิน</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">เช็คอิน</h1>
        <p className="text-gray-600">เช็คอินเข้าคลาสและดูประวัติการเข้าใช้งาน</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`
                flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === 'today'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`
                flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <History className="w-4 h-4 mr-2" />
              ประวัติ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`
                flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              สถิติ
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Today Tab */}
        {activeTab === 'today' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">
                  เกิดข้อผิดพลาด: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <Button type="button" onClick={() => refetch()}>
                  ลองอีกครั้ง
                </Button>
              </div>
            ) : !todayBookings || todayBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการจองสำหรับวันนี้</h3>
                <p className="text-gray-600 mb-6">คุณไม่มีคลาสหรือซาวน่าที่จองไว้สำหรับวันนี้</p>
                <Button type="button" onClick={() => navigate('/classes')}>
                  จองคลาส
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    การจองวันนี้ ({todayBookings.length})
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                  >
                    รีเฟรช
                  </Button>
                </div>
                <div className="space-y-4">
                  {todayBookings.map((booking) => (
                    <CheckInCard
                      key={booking.id}
                      booking={booking}
                      onCheckInSuccess={() => refetch()}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <CheckInHistory userId={user.id} limit={50} />
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <CheckInStats userId={user.id} />

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                เคล็ดลับการเช็คอิน
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>เช็คอินได้ก่อนคลาสเริ่ม 30 นาที</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>สามารถเช็คอินได้จนถึง 15 นาทีหลังคลาสเริ่ม</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>ต้องจองคลาสก่อนถึงจะสามารถเช็คอินได้</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>การเช็คอินจะทำให้สถานะการจองเปลี่ยนเป็น "เสร็จสิ้น"</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
