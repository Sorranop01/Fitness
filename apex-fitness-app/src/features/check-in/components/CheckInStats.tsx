import { TrendingUp, Calendar, Award } from 'lucide-react';
import { useCheckInStats } from '../hooks/useCheckInStats';
import { Spinner } from '@/components/ui/Spinner';

interface CheckInStatsProps {
  userId: string;
}

export function CheckInStats({ userId }: CheckInStatsProps) {
  const { data: stats, isLoading } = useCheckInStats(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Check-ins */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">เช็คอินทั้งหมด</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCheckIns}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* This Month */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">เดือนนี้</p>
            <p className="text-3xl font-bold text-green-600">{stats.thisMonth}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* This Week */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">สัปดาห์นี้</p>
            <p className="text-3xl font-bold text-purple-600">{stats.thisWeek}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
