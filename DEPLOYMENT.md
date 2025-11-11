# 🚀 Firebase Hosting Deployment via GitHub Actions

คู่มือการตั้งค่า CI/CD สำหรับ Deploy โปรเจค Apex Fitness App ไปยัง Firebase Hosting ผ่าน GitHub Actions

---

## 📋 สิ่งที่คุณต้องทำเอง

### 1. สร้าง Firebase Project

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Add project" หรือเลือก project ที่มีอยู่
3. จดชื่อ **Project ID** ของคุณไว้

### 2. ตั้งค่า Firebase Project ID

แก้ไขไฟล์ `.firebaserc` ให้ใส่ Project ID จริงของคุณ:

```json
{
  "projects": {
    "default": "your-firebase-project-id"  // แทนที่ด้วย Project ID จริง
  }
}
```

### 3. เปิดใช้งาน Firebase Hosting

```bash
# ติดตั้ง Firebase CLI (ถ้ายังไม่มี)
pnpm install -g firebase-tools

# Login เข้า Firebase
firebase login

# เริ่มต้นใช้งาน Hosting
firebase init hosting
```

**สำคัญ:** เมื่อถูกถามว่าจะ setup GitHub Actions หรือไม่ให้เลือก **Yes**

### 4. สร้าง Firebase Service Account

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือก Project ของคุณ
3. ไปที่ **Project Settings** → **Service Accounts**
4. คลิก **Generate new private key**
5. ดาวน์โหลดไฟล์ JSON และเก็บไว้ในที่ปลอดภัย

**หรือ** ใช้คำสั่ง Firebase CLI:

```bash
firebase init hosting:github
```

คำสั่งนี้จะช่วยสร้าง Service Account และตั้งค่า GitHub Secrets ให้อัตโนมัติ

### 5. ตั้งค่า GitHub Secrets

ไปที่ GitHub Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

สร้าง Secrets ต่อไปนี้:

#### `FIREBASE_SERVICE_ACCOUNT`
- เนื้อหาทั้งหมดจากไฟล์ JSON ที่ดาวน์โหลดมา (Step 4)
- ต้องเป็น JSON format แบบเต็ม

#### `FIREBASE_PROJECT_ID`
- Project ID ของคุณ (เช่น `apex-fitness-app-abc123`)

**หมายเหตุ:** `GITHUB_TOKEN` ถูกสร้างอัตโนมัติโดย GitHub Actions ไม่ต้องตั้งค่าเอง

---

## 🔄 Workflow Overview

### การ Deploy แบบอัตโนมัติ

#### 1. Production Deployment (Main Branch)
```bash
git push origin main
```
- รัน lint, type check, และ tests
- Build production bundle
- Deploy ไปยัง Firebase Hosting (Live Channel)
- URL: `https://your-project-id.web.app`

#### 2. Preview Deployment (Pull Request)
```bash
# สร้าง PR จาก feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
# สร้าง Pull Request บน GitHub
```
- รัน lint, type check, และ tests
- Build production bundle
- Deploy ไปยัง Preview Channel
- GitHub จะ comment URL preview ใน PR

---

## 🧪 ทดสอบก่อน Deploy

### ทดสอบในเครื่อง (Emulators)

```bash
# รัน Firebase Emulators
pnpm firebase:emulators
```

เข้าถึงได้ที่:
- **Hosting:** http://localhost:5000
- **Emulator UI:** http://localhost:4000
- **Firestore:** http://localhost:8080
- **Auth:** http://localhost:9099
- **Functions:** http://localhost:5001

### Build และ Preview

```bash
# Build production
pnpm build

# ดูตัวอย่าง production build
pnpm preview
```

---

## 📂 ไฟล์ที่เกี่ยวข้อง

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `firebase.json` - Firebase Hosting configuration
- `.firebaserc` - Firebase project aliases
- `firestore.rules` - Firestore Security Rules
- `firestore.indexes.json` - Firestore Indexes

---

## ⚠️ สิ่งที่ควรระวัง

1. **อย่า commit** Firebase Service Account JSON ลงใน Git
2. **อย่า commit** `.env` ไฟล์ที่มี API keys
3. ตรวจสอบ Firestore Rules ก่อน deploy production
4. ตรวจสอบว่า build ผ่านก่อน merge PR

---

## 🔐 Security Best Practices

### Environment Variables

สร้างไฟล์ `.env.local` สำหรับ development:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**สำคัญ:** เพิ่มไฟล์นี้ใน `.gitignore`

### ตั้งค่า Environment Variables ใน GitHub

ไปที่ **Settings** → **Secrets and variables** → **Actions** → **Variables**

เพิ่ม Environment Variables ทั้งหมดที่จำเป็น

---

## 🐛 Troubleshooting

### Error: "FIREBASE_SERVICE_ACCOUNT is not set"
- ตรวจสอบว่าได้เพิ่ม Secret ใน GitHub Settings แล้ว
- ตรวจสอบชื่อ Secret ว่าถูกต้อง (case-sensitive)

### Error: "Permission denied"
- ตรวจสอบว่า Service Account มีสิทธิ์เพียงพอ
- ลอง generate Service Account key ใหม่

### Build Failed
- รัน `pnpm build` ในเครื่องก่อน
- แก้ไข type errors และ linting issues

### Tests Failed
- รัน `pnpm test` ในเครื่อง
- แก้ไข tests ที่ fail

---

## 📞 Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vite.dev/)
