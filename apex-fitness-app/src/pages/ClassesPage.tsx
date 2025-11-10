import { useClasses } from '@/features/booking/hooks/useClasses';
import { ClassCard } from '@/features/booking/components/ClassCard';
import { Spinner } from '@/components/ui/Spinner';

export function ClassesPage() {
  const { data: classes, isLoading, error } = useClasses();

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
        <p className="text-gray-600">ไม่สามารถโหลดข้อมูลคลาสได้</p>
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่มีคลาสในขณะนี้</h3>
        <p className="text-gray-600">ยังไม่มีคลาสที่กำลังจะมาถึง กรุณาตรวจสอบอีกครั้งในภายหลัง</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">คลาสออกกำลังกาย</h1>
        <p className="text-gray-600">เลือกคลาสที่คุณสนใจและจองได้เลย</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classData) => (
          <ClassCard key={classData.id} classData={classData} />
        ))}
      </div>
    </div>
  );
}
