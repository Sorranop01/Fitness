/**
 * Firestore Seed Data Script
 *
 * วิธีการใช้งาน:
 * 1. ติดตั้ง Firebase Admin SDK: pnpm add firebase-admin
 * 2. ดาวน์โหลด Service Account Key จาก Firebase Console
 * 3. บันทึกไว้ที่ scripts/serviceAccountKey.json
 * 4. รัน: npx tsx scripts/seedData.ts
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json';

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

// ==========================================
// Seed Data
// ==========================================

const LOCATIONS = [
  {
    id: 'bangkok-sukhumvit',
    name: 'สาขา สุขุมวิท',
    address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    saunaCapacity: 4,
  },
  {
    id: 'bangkok-silom',
    name: 'สาขา สีลม',
    address: '456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    saunaCapacity: 6,
  },
  {
    id: 'bangkok-thonglor',
    name: 'สาขา ทองหล่อ',
    address: '789 ถนนสุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    saunaCapacity: 4,
  },
];

const CLASSES = [
  {
    name: 'Yoga Morning Flow',
    description: 'เริ่มต้นวันใหม่ด้วยการเคลื่อนไหวที่นุ่มนวลและการหายใจที่ลึกซึ้ง เหมาะสำหรับทุกระดับ',
    instructor: 'อาจารย์ณัฐชา',
    locationId: 'bangkok-sukhumvit',
    capacity: 20,
    duration: 60, // minutes
    classTime: {
      dayOfWeek: 1, // Monday
      startHour: 7,
      startMinute: 0,
    },
  },
  {
    name: 'HIIT Cardio Blast',
    description: 'เทรนนิ่งความเข้มข้นสูงที่จะเผาผลาญแคลอรี่อย่างมากในเวลาสั้น พร้อมสร้างกล้ามเนื้อ',
    instructor: 'โค้ชธนพล',
    locationId: 'bangkok-sukhumvit',
    capacity: 15,
    duration: 45,
    classTime: {
      dayOfWeek: 1,
      startHour: 18,
      startMinute: 30,
    },
  },
  {
    name: 'Pilates Core Strength',
    description: 'เน้นการสร้างความแข็งแรงของกล้ามเนื้อแกนกลาง ปรับสมดุลและความยืดหยุ่นของร่างกาย',
    instructor: 'อาจารย์ปารณีย์',
    locationId: 'bangkok-silom',
    capacity: 18,
    duration: 60,
    classTime: {
      dayOfWeek: 2, // Tuesday
      startHour: 12,
      startMinute: 0,
    },
  },
  {
    name: 'Zumba Dance Fitness',
    description: 'เต้นสนุก ๆ ไปพร้อมกับเผาผลาญแคลอรี่ เหมาะสำหรับคนชอบเต้น ไม่ต้องมีพื้นฐาน',
    instructor: 'โค้ชพลอย',
    locationId: 'bangkok-silom',
    capacity: 25,
    duration: 60,
    classTime: {
      dayOfWeek: 3, // Wednesday
      startHour: 19,
      startMinute: 0,
    },
  },
  {
    name: 'Strength Training',
    description: 'เทรนนิ่งแบบฟรีเวทและเครื่องออกกำลังกายเพื่อสร้างกล้ามเนื้อและเพิ่มความแข็งแรง',
    instructor: 'โค้ชอนุชา',
    locationId: 'bangkok-thonglor',
    capacity: 12,
    duration: 75,
    classTime: {
      dayOfWeek: 4, // Thursday
      startHour: 6,
      startMinute: 0,
    },
  },
  {
    name: 'Spin Cycle',
    description: 'ปั่นจักรยานในร่มพร้อมเพลงและแสงไฟที่สร้างแรงบันดาลใจ เหมาะสำหรับคนชอบท้าทายตัวเอง',
    instructor: 'โค้ชวิทย์',
    locationId: 'bangkok-thonglor',
    capacity: 20,
    duration: 45,
    classTime: {
      dayOfWeek: 5, // Friday
      startHour: 17,
      startMinute: 30,
    },
  },
  {
    name: 'Stretch & Recovery',
    description: 'ฟื้นฟูร่างกายด้วยการยืดเหยียดและเทคนิคผ่อนคลาย เหมาะสำหรับวันพักผ่อน',
    instructor: 'อาจารย์สุภาพร',
    locationId: 'bangkok-sukhumvit',
    capacity: 15,
    duration: 60,
    classTime: {
      dayOfWeek: 6, // Saturday
      startHour: 10,
      startMinute: 0,
    },
  },
  {
    name: 'Boxing Bootcamp',
    description: 'เทรนนิ่งแบบชกมวยผสมความแข็งแรงและการ์ดิโอ เหมาะสำหรับคนชอบท้าทายและปลดปล่อยพลังงาน',
    instructor: 'โค้ชธนาวุฒิ',
    locationId: 'bangkok-silom',
    capacity: 16,
    duration: 60,
    classTime: {
      dayOfWeek: 6,
      startHour: 16,
      startMinute: 0,
    },
  },
];

// ==========================================
// Helper Functions
// ==========================================

function getNextClassDate(dayOfWeek: number, hour: number, minute: number): Date {
  const now = new Date();
  const currentDay = now.getDay();

  // Calculate days until next occurrence
  let daysUntil = dayOfWeek - currentDay;
  if (daysUntil < 0) {
    daysUntil += 7;
  }

  // If same day but time has passed, go to next week
  if (daysUntil === 0) {
    const classTime = new Date(now);
    classTime.setHours(hour, minute, 0, 0);
    if (classTime < now) {
      daysUntil = 7;
    }
  }

  const classDate = new Date(now);
  classDate.setDate(now.getDate() + daysUntil);
  classDate.setHours(hour, minute, 0, 0);

  return classDate;
}

// ==========================================
// Seed Functions
// ==========================================

async function seedLocations() {
  console.log('🏢 Seeding locations...');

  for (const location of LOCATIONS) {
    const docRef = db.collection('locations').doc(location.id);
    await docRef.set({
      ...location,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`  ✅ Added: ${location.name}`);
  }

  console.log(`✨ ${LOCATIONS.length} locations added\n`);
}

async function seedClasses() {
  console.log('💪 Seeding classes...');

  for (const classData of CLASSES) {
    const { classTime, duration, ...rest } = classData;

    // Create 4 weeks of classes
    for (let week = 0; week < 4; week++) {
      const startTime = getNextClassDate(
        classTime.dayOfWeek,
        classTime.startHour,
        classTime.startMinute
      );

      // Add weeks
      startTime.setDate(startTime.getDate() + (week * 7));

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + duration);

      await db.collection('classes').add({
        ...rest,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        bookedCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    console.log(`  ✅ Added 4 weeks of: ${classData.name}`);
  }

  console.log(`✨ ${CLASSES.length * 4} classes added\n`);
}

// ==========================================
// Main Function
// ==========================================

async function main() {
  console.log('🚀 Starting seed data...\n');

  try {
    await seedLocations();
    await seedClasses();

    console.log('✨ Seed data completed successfully! 🎉');
    console.log('\n📝 Next steps:');
    console.log('1. Register a new user in the app');
    console.log('2. Start booking classes!');
    console.log('3. Try the check-in feature\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { seedLocations, seedClasses };
