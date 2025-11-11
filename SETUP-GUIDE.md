# 🚀 คู่มือการ Setup CI/CD แบบครบถ้วน

คู่มือนี้จะพาคุณ setup Firebase Hosting + GitHub Actions ให้เสร็จสิ้นภายใน 5 นาที!

---

## ✅ สิ่งที่ทำเสร็จแล้ว

- ✅ Firebase Project: `fitness-42b90`
- ✅ ติดตั้ง dependencies ครบถ้วน
- ✅ สร้าง GitHub Actions workflow
- ✅ สร้าง Firebase configuration files
- ✅ สร้าง `.env.local` พร้อม Firebase config

---

## 🔧 สิ่งที่คุณต้องทำ (3 ขั้นตอนง่ายๆ)

### ขั้นตอนที่ 1: ติดตั้ง GitHub CLI (ถ้ายังไม่มี)

```bash
# macOS
brew install gh

# หรือดาวน์โหลดจาก
# https://cli.github.com/
```

ตรวจสอบว่าติดตั้งแล้ว:
```bash
gh --version
```

---

### ขั้นตอนที่ 2: ดาวน์โหลด Service Account จาก Firebase

**วิธีที่ 1: ใช้ Firebase Console (แนะนำ)**

1. เปิด: https://console.firebase.google.com/project/fitness-42b90/settings/serviceaccounts/adminsdk
2. คลิกปุ่ม **"Generate new private key"**
3. ยืนยันโดยคลิก **"Generate key"**
4. ไฟล์ JSON จะถูกดาวน์โหลด
5. **เปลี่ยนชื่อไฟล์เป็น** `service-account.json`
6. **ย้ายไฟล์มาไว้ในโฟลเดอร์โปรเจค** `/Users/sorranopkhanonvech/Fitness/`

**วิธีที่ 2: ใช้ Google Cloud Console**

1. เปิด: https://console.cloud.google.com/iam-admin/serviceaccounts?project=fitness-42b90
2. คลิก **"Create Service Account"**
3. ตั้งชื่อ: `github-actions`
4. Grant role: **"Firebase Admin"** หรือ **"Editor"**
5. คลิก **"Create Key"** → เลือก **JSON**
6. **เปลี่ยนชื่อเป็น** `service-account.json`
7. **ย้ายมาไว้ในโฟลเดอร์โปรเจค**

---

### ขั้นตอนที่ 3: รัน Setup Script

```bash
# Login เข้า GitHub CLI (ครั้งแรกเท่านั้น)
gh auth login

# รัน script
./setup-github-secrets.sh
```

Script นี้จะ:
- ✅ ตรวจสอบว่ามี `service-account.json`
- ✅ ตั้งค่า `FIREBASE_SERVICE_ACCOUNT` secret บน GitHub
- ✅ ตั้งค่า `FIREBASE_PROJECT_ID` secret บน GitHub

---

## 🎯 ทดสอบ Deployment

หลังจาก setup เสร็จแล้ว:

```bash
# Commit changes
git add .
git commit -m "Setup CI/CD with GitHub Actions"

# Push to main branch
git push origin main
```

GitHub Actions จะเริ่มทำงานทันที!

---

## 📍 ดู Deployment Status

### 1. ดู GitHub Actions
- ไปที่: https://github.com/Sorranop01/Fitness/actions
- คุณจะเห็น workflow "Deploy to Firebase Hosting" กำลังทำงาน

### 2. เช็คเว็บไซต์
- **Production URL:** https://fitness-42b90.web.app
- **Firebase Console:** https://console.firebase.google.com/project/fitness-42b90/hosting

---

## 🧪 ทดสอบ Preview Deploy (Pull Request)

```bash
# สร้าง feature branch
git checkout -b feature/test-deploy

# ทำการแก้ไขอะไรก็ได้
echo "Test" >> README.md

# Commit และ push
git add .
git commit -m "Test preview deployment"
git push origin feature/test-deploy

# สร้าง Pull Request บน GitHub
gh pr create --title "Test Preview Deploy" --body "Testing preview deployment"
```

GitHub Actions จะสร้าง **Preview URL** ให้อัตโนมัติ และ comment ใน PR!

---

## 🔍 Workflow มีอะไรบ้าง?

### เมื่อ Push ไป Main Branch:
1. ✅ รัน `pnpm lint` - ตรวจสอบ code quality
2. ✅ รัน `pnpm type-check` - ตรวจสอบ TypeScript
3. ✅ รัน `pnpm test --run` - รัน tests
4. ✅ รัน `pnpm build` - Build production
5. ✅ Deploy ไป Firebase Hosting (Live)

### เมื่อสร้าง Pull Request:
1. ✅ รัน lint, type-check, tests, build เหมือนกัน
2. ✅ Deploy ไป Preview Channel
3. ✅ Comment Preview URL ใน PR

---

## 🛠️ Troubleshooting

### ❌ "service-account.json not found"
- ตรวจสอบว่าไฟล์อยู่ในโฟลเดอร์โปรเจคจริงๆ
- ตรวจสอบชื่อไฟล์ว่าถูกต้อง (ต้องเป็น `service-account.json`)

### ❌ "GitHub CLI not installed"
```bash
brew install gh
```

### ❌ "Permission denied when running script"
```bash
chmod +x setup-github-secrets.sh
./setup-github-secrets.sh
```

### ❌ "Secrets not set correctly"
ตั้งค่า manual บน GitHub:
1. ไปที่: https://github.com/Sorranop01/Fitness/settings/secrets/actions
2. คลิก **"New repository secret"**
3. เพิ่ม 2 secrets:
   - `FIREBASE_SERVICE_ACCOUNT` = เนื้อหาใน `service-account.json` ทั้งหมด
   - `FIREBASE_PROJECT_ID` = `fitness-42b90`

---

## 📚 คำสั่งที่มีประโยชน์

```bash
# ดู Secrets ที่ตั้งไว้
gh secret list -R Sorranop01/Fitness

# ลบ Secret (ถ้าตั้งผิด)
gh secret remove FIREBASE_SERVICE_ACCOUNT -R Sorranop01/Fitness

# ดู Workflow runs
gh run list -R Sorranop01/Fitness

# ดู logs ของ run ล่าสุด
gh run view -R Sorranop01/Fitness

# Deploy manual (ในเครื่อง)
pnpm build
firebase deploy --only hosting
```

---

## 🎉 เสร็จสิ้น!

เมื่อทำครบทุกขั้นตอนแล้ว:
- ✅ Push to main = Auto deploy to production
- ✅ Create PR = Auto deploy to preview
- ✅ Tests fail = Deployment blocked
- ✅ Full CI/CD pipeline ready!

**Your Production URL:** https://fitness-42b90.web.app

---

## 🤔 มีคำถาม?

- Firebase Docs: https://firebase.google.com/docs/hosting
- GitHub Actions: https://docs.github.com/en/actions
- Vite: https://vite.dev/
