# Features Directory

ไดเรกทอรีนี้เก็บ **ตรรกะธุรกิจหลัก** ของแอปพลิเคชัน แต่ละ feature เป็นโมดูลที่ครบวงจร

## โครงสร้าง Feature

แต่ละ feature ควรมีโครงสร้างดังนี้:

```
features/
├── auth/
│   ├── components/     # UI components เฉพาะ auth (LoginForm, RegisterForm)
│   ├── hooks/          # Custom hooks (useAuth, useLogin)
│   ├── api/            # API calls (loginUser, registerUser)
│   └── types/          # Types เฉพาะ feature (ถ้าไม่ได้ใช้ร่วมกับ feature อื่น)
```

## กฎการวาง Code

- **✅ ใช้ภายใน Feature เดียว**: เก็บใน `features/{feature-name}/`
- **❌ ใช้ร่วมกันหลาย Features**: ย้ายไปที่ `src/components/`, `src/utils/`, หรือ `src/types/`

## Features ที่มีในแอป

- **auth**: Authentication & Authorization
- **booking**: การจองคลาส/ซาวน่า
- **check-in**: การเช็คอิน
