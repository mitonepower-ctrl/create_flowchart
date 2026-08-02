# คู่มือ Deploy โปรเจกต์ขึ้น Vercel ผ่าน GitHub

คู่มือนี้อธิบายขั้นตอนการนำ **ระบบเว็บแอปพลิเคชันสำหรับเรียนรู้การสร้างโฟลว์ชาร์ต** (Next.js) ขึ้นไปรันบนระบบจริงผ่าน [Vercel](https://vercel.com) โดยเชื่อมต่อกับ GitHub Repository

> โปรเจกต์นี้ถูก push ขึ้น GitHub ที่ `mitonepower-ctrl/create_flowchart` ไว้แล้วระหว่างการพัฒนา ถ้า repository นี้มีอยู่แล้วให้ข้ามไปขั้นตอนที่ 2 ได้เลย ขั้นตอนที่ 1 มีไว้สำหรับกรณีเริ่มต้นจากศูนย์หรือ deploy ไปยัง repository ใหม่

## สิ่งที่ต้องเตรียม (Prerequisites)

- **โค้ดโปรเจกต์บนเครื่อง** ที่รันได้ปกติด้วย `npm run dev`
- **บัญชี GitHub** สำหรับเก็บซอร์สโค้ด
- **บัญชี Vercel** (สมัครฟรีได้ที่ [vercel.com](https://vercel.com) โดยใช้บัญชี GitHub ได้เลย)
- **โปรเจกต์ Supabase** ที่รัน `supabase/schema.sql` แล้ว (ดู [README.md](README.md))
- **ค่า Environment Variables** ทั้งหมดต่อไปนี้ (ดูตัวอย่างได้จาก `.env.example`):

| ตัวแปร | คำอธิบาย |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL ของโปรเจกต์ Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable/anon key จาก Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret/service role key จาก Supabase (**ห้ามเปิดเผยฝั่ง client**) |
| `GEMINI_API_KEY` | API key จาก [Google AI Studio](https://aistudio.google.com/apikey) |
| `ADMIN_EMAIL` | อีเมลแอดมิน (ค่าเริ่มต้น `admin@admin.com`) |
| `ADMIN_PASSWORD` | รหัสผ่านแอดมิน (ค่าเริ่มต้น `123456`) |

## ขั้นตอนที่ 1: นำโค้ดขึ้น GitHub

หากยังไม่เคยสร้าง repository และ push โค้ดมาก่อน ให้เปิด Terminal ที่โฟลเดอร์โปรเจกต์แล้วรันคำสั่งตามลำดับ:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

**คำอธิบายแต่ละคำสั่ง:**

1. `git init` — เริ่มต้น Git repository ในโฟลเดอร์โปรเจกต์
2. `git add .` — เพิ่มไฟล์ทั้งหมดเข้าสู่ staging area (ตรวจสอบว่า `.gitignore` กันไฟล์ `.env.local` ไว้แล้ว เพื่อไม่ให้ค่าลับหลุดขึ้น GitHub)
3. `git commit -m "..."` — บันทึกการเปลี่ยนแปลงเป็น commit แรก
4. `git branch -M main` — ตั้งชื่อ branch หลักเป็น `main`
5. `git remote add origin ...` — เชื่อมโปรเจกต์ในเครื่องเข้ากับ repository บน GitHub ที่สร้างไว้
6. `git push -u origin main` — push โค้ดขึ้น GitHub และตั้งให้ `main` ติดตาม `origin/main` ต่อจากนี้

## ขั้นตอนที่ 2: นำโปรเจกต์เข้าสู่ Vercel

1. ไปที่ [vercel.com](https://vercel.com) แล้วกด **Log In**
2. เลือก **Continue with GitHub** และอนุญาตให้ Vercel เข้าถึงบัญชี GitHub ของคุณ
3. ที่หน้า Dashboard กดปุ่ม **Add New...** แล้วเลือก **Project**
4. ในรายการ **Import Git Repository** ให้ค้นหาและเลือก repository ของโปรเจกต์นี้ (เช่น `create_flowchart`) แล้วกด **Import**
5. Vercel จะตรวจพบว่าเป็นโปรเจกต์ **Next.js** โดยอัตโนมัติ และตั้งค่า Build/Output settings ให้เองไม่ต้องแก้ไข

## ขั้นตอนที่ 3: ตั้งค่า Environment Variables

ก่อนกด Deploy ให้เลื่อนลงมาที่หัวข้อ **Environment Variables** ในหน้าตั้งค่าโปรเจกต์ แล้วนำค่าจากไฟล์ `.env.local` บนเครื่องมาใส่ทีละตัว:

1. เปิดไฟล์ `.env.local` ในเครื่อง
2. คัดลอกชื่อตัวแปร (เช่น `NEXT_PUBLIC_SUPABASE_URL`) ใส่ในช่อง **Key**
3. คัดลอกค่าของตัวแปรนั้นใส่ในช่อง **Value**
4. กด **Add** แล้วทำซ้ำจนครบทั้ง 6 ตัวแปรตามตารางในหัวข้อ "สิ่งที่ต้องเตรียม"

> **ข้อควรระวัง:** `SUPABASE_SERVICE_ROLE_KEY` เป็นค่าลับที่มีสิทธิ์เต็มเหนือฐานข้อมูล ห้ามใส่ไว้ในตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` เพราะจะถูกส่งไปยัง browser ของผู้ใช้ทันที โปรเจกต์นี้ตั้งชื่อตัวแปรไว้ถูกต้องแล้ว (ไม่มี `NEXT_PUBLIC_` นำหน้า) จึงปลอดภัยหากใส่ตามตารางด้านบน

## ขั้นตอนที่ 4: Deploy และการอัปเดตโค้ดอัตโนมัติ (CI/CD)

1. เมื่อใส่ Environment Variables ครบแล้ว กดปุ่ม **Deploy**
2. Vercel จะเริ่ม build โปรเจกต์ (ติดตั้ง dependencies, รัน `next build`) ซึ่งใช้เวลาประมาณ 1-3 นาที สามารถดู log แบบ real-time ได้ระหว่างรอ
3. เมื่อ build สำเร็จ จะได้ URL สำหรับใช้งานจริงในรูปแบบ `https://<ชื่อโปรเจกต์>.vercel.app` ทันที
4. **หลัง deploy ครั้งแรก** ให้รันคำสั่งสร้างข้อมูลโจทย์เริ่มต้นจากเครื่อง (ชี้ไปที่ Supabase โปรเจกต์เดียวกับที่ตั้งค่าไว้บน Vercel):
   ```bash
   npm run seed
   ```
   ขั้นตอนนี้ทำครั้งเดียว เพราะข้อมูลอยู่ใน Supabase ไม่ใช่ในตัวแอป

**การอัปเดตโค้ดในอนาคต (CI/CD อัตโนมัติ):**

หลังจากเชื่อมต่อ GitHub กับ Vercel แล้ว ไม่ต้อง deploy ด้วยมืออีกต่อไป เพียงแค่:

```bash
git add .
git commit -m "อธิบายสิ่งที่แก้ไข"
git push origin main
```

ทุกครั้งที่ push โค้ดขึ้น branch `main` ระบบ Vercel จะ **ตรวจจับการเปลี่ยนแปลงอัตโนมัติ**, build โปรเจกต์ใหม่, และ deploy เวอร์ชันล่าสุดขึ้นแทนที่ทันทีโดยไม่ต้องเข้าไปกดอะไรในหน้าเว็บ Vercel เลย และหากมีการเปิด Pull Request ไว้ Vercel ยังสร้าง **Preview Deployment** แยกให้ดูตัวอย่างก่อน merge เข้า `main` ได้อีกด้วย

## สรุปลำดับขั้นตอน

1. เตรียมโค้ด, บัญชี GitHub/Vercel, และค่า Environment Variables ให้ครบ
2. `git push` โค้ดขึ้น GitHub
3. Import repository เข้า Vercel ผ่านการ Login ด้วย GitHub
4. ใส่ Environment Variables ให้ครบก่อนกด Deploy
5. กด Deploy แล้วรัน `npm run seed` หนึ่งครั้งหลัง deploy สำเร็จ
6. ครั้งต่อไปแค่ `git push` ขึ้น `main` ระบบจะ build และ deploy ให้อัตโนมัติ

---

Copyright © 2026 Nimit Trakoonta. All Rights Reserved.
