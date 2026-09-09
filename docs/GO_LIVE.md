# Go-live checklist — Krabi Links Taxi (Plesk `host` branch)

ใช้เอกสารนี้ทีละข้อก่อนเปิดรับลูกค้าจริง  
Deploy ปัจจุบัน: push `master` → GitHub Actions → สาขา `host` → Plesk `/httpdocs`

---

## A. สิ่งที่ต้องมีก่อน (บัญชี)

| รายการ | ทำแล้ว? | หมายเหตุ |
|--------|---------|----------|
| โดเมน + SSL บน Plesk | ☐ | เช่น `https://www.krabilinkstaxi.com` |
| GitHub repo + Actions ใช้ได้ | ☐ | workflow `Deploy HostAtom (host branch)` |
| โปรเจกต์ [Supabase](https://supabase.com) (Free ได้) | ☐ | จำเป็นถ้าต้องการจองข้ามเครื่อง / แอดมินหลายคน |
| Discord webhook (แนะนำ) | ☐ | แจ้งแอดมินเมื่อมีจองใหม่ |
| Resend (ถ้าต้องการอีเมลโวเชอร์) | ☐ | ทางเลือก |

---

## B. Supabase (บังคับสำหรับโหมดทีมงาน)

1. สร้างโปรเจกต์ใหม่ใน Supabase  
2. **Project Settings → API** คัดลอก:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **SQL Editor** → วางรันไฟล์  
   `supabase/migrations/001_bookings.sql`
4. สร้างรหัสลับยาว ๆ (อย่างน้อย 16 ตัว) แล้วรัน:

```sql
update public.app_secrets
set value = 'ใส่รหัสลับยาวของคุณที่นี่'
where key = 'booking_admin_secret';
```

รหัสนี้ต้อง **ตรงกับ** `NEXT_PUBLIC_BOOKING_ADMIN_SECRET` ใน env

5. ทดสอบ: Table Editor ควรเห็นตาราง `bookings` และ `app_secrets`

---

## C. Environment variables

### เครื่อง local (ทดสอบ)

คัดลอก `.env.example` → `.env.local` แล้วใส่ค่าจริง:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_BOOKING_ADMIN_SECRET=รหัสเดียวกับใน SQL
NEXT_PUBLIC_SITE_URL=https://www.krabilinkstaxi.com
NEXT_PUBLIC_ADMIN_NOTIFY_WEBHOOK=https://discord.com/api/webhooks/...
```

จากนั้น:

```bash
npm run dev
```

ตรวจที่ `/th/booking` จองทดสอบ → แอดมินเครื่องอื่น / Incognito ควรเห็นออเดอร์ (หลัง login)

### GitHub Actions (build ขึ้นโฮสต์)

Repo → **Settings → Secrets and variables → Actions** เพิ่ม:

| Secret name | ค่า |
|-------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL โปรเจกต์ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `NEXT_PUBLIC_BOOKING_ADMIN_SECRET` | รหัสเดียวกับ SQL |
| `NEXT_PUBLIC_SITE_URL` | `https://www.krabilinkstaxi.com` |
| `NEXT_PUBLIC_ADMIN_NOTIFY_WEBHOOK` | Discord webhook (ถ้ามี) |

Workflow `deploy-host.yml` จะ inject ค่าเหล่านี้ตอน `npm run build:host`  
**สำคัญ:** แก้ secret แล้วต้อง push / รัน workflow ใหม่ ไม่งั้น build เก่ายังไม่มี cloud sync

---

## D. Plesk

1. Git → ดึงสาขา **`host`** (ไม่ใช่ `master`)  
2. Deploy files ไป **`/httpdocs`**  
3. เปิด Auto-deploy จากสาขา `host` (ถ้ามี)  
4. เก็บโฟลเดอร์ `.well-known` ถ้า Plesk ขอ  
5. เปิดเว็บ `https://โดเมน/th/` ตรวจ SSL

---

## E. แอดมินหลังขึ้นจริง

| งาน | รายละเอียด |
|-----|------------|
| เข้า `/th/admin` | ล็อกอินด้วยบัญชีหลักที่ตั้งในระบบ แล้วไป **ตั้งค่า → บัญชีพนักงาน** เพิ่มคน |
| คนขับ | เพิ่มคนขับจริงในเมนูคนขับ (เริ่มว่าง) |
| การชำระเงิน | ตรวจบัญชีโอน / PromptPay ในตั้งค่าให้ตรงของร้าน |
| ตารางราคา / รถ | ใช้ของในระบบ หรือนำเข้า CSV |
| Discord | จองทดสอบ 1 รายการ ตรวจว่ามีแจ้งเตือน |

อย่าเปิดเผยรหัสแอดมินบนหน้าเว็บ (ถูกปิดข้อความเดโมแล้ว)

---

## F. เช็กลิสต์รับลูกค้า (หลัง deploy)

- [ ] หน้าแรก `/th/` โหลดได้  
- [ ] จองเที่ยวเดียว → ได้เลขจอง / หน้าโวเชอร์  
- [ ] ออเดอร์โผล่ใน Supabase `bookings`  
- [ ] แอดมินเครื่องอื่นเห็นออเดอร์เดียวกัน  
- [ ] อนุมัติ/ปฏิเสธการชำระแล้วสถานะอัปเดตบน cloud  
- [ ] `/th/booking/status` ค้นด้วยเลขจอง + เบอร์ได้  
- [ ] แจ้งเตือน Discord ทำงาน (ถ้าตั้ง webhook)  
- [ ] มือถือจองได้ครบขั้น  

---

## G. ทางเลือก (ยังไม่บังคับ)

### อีเมลโวเชอร์ลูกค้า
ดู `docs/BOOKING_BACKEND.md` ส่วน Edge Function + Resend

### Omise (บัตร)
ใส่ `NEXT_PUBLIC_OMISE_PUBLIC_KEY` และเปิดช่องบัตรในตั้งค่าแอดมิน

### โหมดไม่มี Supabase
เว็บยังจองได้ แต่ข้อมูลอยู่แค่เบราว์เซอร์นั้น — **ไม่เหมาะกับทีมงานหลายเครื่อง**

---

## H. คำสั่งที่ใช้บ่อย

```bash
# ทดสอบ local
npm run dev

# บิลด์เหมือนขึ้นโฮสต์
npm run build:host

# รันเทส
npm test
```

Deploy อัตโนมัติ: `git push origin master` → Actions → สาขา `host` → Plesk pull

---

## สถานะโปรเจกต์ตอนเขียนเอกสารนี้

| ส่วน | สถานะ |
|------|--------|
| UI จอง / แอดมิน | พร้อมใช้งาน |
| ค่าเริ่มต้นว่าง (ไม่ใช่เดโม) | พร้อม |
| Supabase ในเครื่องนี้ | **ยังไม่มี `.env.local`** — ต้องใส่เอง |
| Secrets ใน GitHub Actions | **ต้องใส่เอง** แล้ว rebuild |
| Plesk ชี้สาขา `host` | ตรวจที่แผง Plesk |

เมื่อทำข้อ **B + C + D + F** ครบ ถือว่าพร้อมรับงานจริงแบบหลายเครื่อง
