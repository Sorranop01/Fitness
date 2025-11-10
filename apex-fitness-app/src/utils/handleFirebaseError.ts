import { FirebaseError } from 'firebase/app';

/**
 * Convert Firebase error codes to user-friendly Thai messages
 */
export function handleFirebaseError(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
  }

  const errorMessages: Record<string, string> = {
    // Auth errors
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'auth/user-disabled': 'บัญชีนี้ถูกปิดใช้งาน',
    'auth/user-not-found': 'ไม่พบผู้ใช้นี้',
    'auth/wrong-password': 'รหัสผ่านไม่ถูกต้อง',
    'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว',
    'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'auth/too-many-requests': 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง',

    // Firestore errors
    'permission-denied': 'คุณไม่มีสิทธิ์ในการดำเนินการนี้',
    'not-found': 'ไม่พบข้อมูลที่ต้องการ',
    'already-exists': 'ข้อมูลนี้มีอยู่แล้ว',
    'resource-exhausted': 'ใช้งานเกินโควต้าที่กำหนด',
    'unavailable': 'บริการไม่พร้อมใช้งานในขณะนี้',
  };

  return errorMessages[error.code] || `เกิดข้อผิดพลาด: ${error.code}`;
}
