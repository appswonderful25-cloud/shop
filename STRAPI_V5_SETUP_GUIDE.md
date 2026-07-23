# دليل إعداد Strapi v5 لنظام المراسلة

## ملخص التغييرات التي تم إجراؤها

### 1. إصلاح مشاكل API في Next.js
تم تحديث ملف `src/app/(dashboard)/messages/lib/api.ts` للتوافق مع Strapi v5:
- **تحديث دالة `unwrap`**: الآن تدعم كل من Strapi v4 (format `{ id, attributes: {...} }`) و Strapi v5 (format مباشر)
- **تصحيح مسارات API**: 
  - `/messages-conversation` → `/messages-conversations` (جمع)
- **تحديث دالة الاسترجاع**: تدعم كل من `json.data` (v4) و `json` (v5)

### 2. إعداد متغيرات البيئة
تم إنشاء ملف `.env.local` في المشروع Next.js:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_AUTH_REGISTER_URL=http://localhost:3000/api/auth/register
NEXT_PUBLIC_SOCKET_URL=http://localhost:1337
```

### 3. تحديث Socket.IO
تم تحديث:
- **Next.js**: `src/components/hooks/SocketConnection.tsx`
  - استخدام متغير البيئة `NEXT_PUBLIC_SOCKET_URL`
  - إضافة logs للتصحيح
  
- **Strapi**: `config/plugins.ts`
  - تحديث `contentTypes` لتشمل `user-messages` و `messages-conversation`
  - إضافة handlers كاملة للـ Socket events:
    - `join_conversation`
    - `leave_conversation`
    - `send_message`
    - `new_thread`
    - `disconnect`

### 4. إصلاح الصلاحيات في Strapi
تم إنشاء ملفات policies و تحديث routes:

**Policies الجديدة:**
- `src/api/user-messages/policies/user-messages.ts`
- `src/api/messages-conversation/policies/messages-conversation.ts`

**تحديث Routes:**
- استخدام الإعدادات الافتراضية للـ auth في Strapi v5

### 5. إصلاح مشاكل TypeScript في Strapi ✅
تم إصلاح جميع أخطاء TypeScript في المشروع:

**إصلاح Policies:**
- إضافة نوع `any` للـ context parameter في جميع دوال policies
- إزالة التبعيات غير الضرورية من `strapi`

**إصلاح Routes:**
- إزالة `auth: false` من جميع الملفات (coupons, notification, orders, product, returns, teams, wallets)
- استخدام الإعدادات الافتراضية لـ Strapi v5

**الملفات المعدلة:**
- `src/api/coupons/routes/coupons.ts`
- `src/api/notification/routes/notification.ts`
- `src/api/orders/routes/orders.ts`
- `src/api/product/routes/product.ts`
- `src/api/returns/routes/returns.ts`
- `src/api/teams/routes/teams.ts`
- `src/api/wallets/routes/wallets.ts`
- `src/api/user-messages/routes/user-messages.ts`
- `src/api/messages-conversation/routes/messages-conversation.ts`
- `src/api/user-messages/policies/user-messages.ts`
- `src/api/messages-conversation/policies/messages-conversation.ts`

**نتيجة البناء:** ✅ نجح البناء بدون أخطاء TypeScript

## خطوات الإعداد

### الخطوة 1: تشغيل Strapi Backend
```bash
cd C:\Users\hasan\strapi-fresh-backend
npm run develop
```

### الخطوة 2: تشغيل Next.js Frontend
```bash
cd C:\Users\hasan\Downloads\shopshop-main\shopshop-main
npm run dev
```

### الخطوة 3: التحقق من الاتصال
1. افتح المتصفح على `http://localhost:3000`
2. سجل الدخول
3. اذهب إلى صفحة Messages
4. تحقق من:
   - ظهور جدول المحادثات
   - حالة الاتصال Socket (دائرة خضراء = متصل)
   - إمكانية إنشاء محادثة جديدة
   - إمكانية إرسال رسائل

## المشاكل التي تم حلها

### المشكلة 1: API Response Format
**المشكلة:** الكود كان يتوقع Strapi v4 format (`{ id, attributes: {...} }`) لكن Strapi v5 يرجع format مباشر.

**الحل:** تحديث دالة `unwrap` للتعامل مع كلا النسختين.

### المشكلة 2: مسارات API غير صحيحة
**المشكلة:** مسار `/messages-conversation` لم يكن صحيحاً في Strapi v5.

**الحل:** تغييره إلى `/messages-conversations` (جمع).

### المشكلة 3: Socket.IO غير مهيأ
**المشكلة:** Socket.IO في Strapi لم يكن معداً للتعامل مع نظام المراسلة.

**الحل:** تحديث `config/plugins.ts` بإضافة event handlers كاملة.

### المشكلة 4: الصلاحيات
**المشكلة:** Routes كانت `auth: false` مما يسمح بالوصول غير المصرح به.

**الحل:** إنشاء policies واستخدام الإعدادات الافتراضية لـ Strapi v5.

### المشكلة 5: أخطاء TypeScript في Strapi ✅
**المشكلة:** 19 خطأ TypeScript بسبب:
- استخدام `auth: false` غير صالح في Strapi v5
- استخدام `auth: { required: true }` غير صالح
- عدم تحديد أنواع parameters في policies

**الحل:**
- إزالة جميع إعدادات `auth` من routes والاعتماد على الإعدادات الافتراضية
- استخدام `any` لـ context parameters في policies
- إزالة التبعيات غير الضرورية من `strapi` package

## اختبار النظام

### اختبار API:
```bash
# اختبار جلب المحادثات
curl http://localhost:1337/api/user-messages -H "Authorization: Bearer YOUR_TOKEN"

# اختبار إنشاء محادثة
curl -X POST http://localhost:1337/api/user-messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"subject": "Test", "statusRead": false, "online": false}}'
```

### اختبار Socket.IO:
افتح console في المتصفح وتحقق من:
- ظهور "Socket connected successfully"
- عند إرسال رسالة، تحقق من "new_message" event

## ملاحظات هامة

1. **تأكد من تشغيل Strapi أولاً** قبل تشغيل Next.js
2. **إعادة تشغيل السيرفرات** بعد أي تغيير في متغيرات البيئة
3. **تحقق من الـ token** في cookies للتأكد من تسجيل الدخول
4. **Strapi v5 يستخدم format مباشر** بدون `attributes` wrapping
5. **Socket.IO يعمل على المنفذ 1337** نفسه Strapi

## استكشاف الأخطاء

### المشكلة: "No access token found"
**الحل:** تأكد من تسجيل الدخول وأن cookie `accessToken` موجود

### المشكلة: "Socket connection error"
**الحل:** 
- تأكد أن Strapi يعمل على المنفذ 1337
- تحقق من CORS settings في `config/plugins.ts`
- تحقق من firewall

### المشكلة: "Invalid data format received"
**الحل:** تأكد أن Strapi v5 يعمل وأن API يرجع data بشكل صحيح

### المشكلة: "Failed to mark messages as read"
**الحل:** تحقق من permissions في Strapi Admin لـ user-messages API

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من console logs في المتصفح
2. تحقق من Strapi server logs
3. تأكد من إعدادات متغيرات البيئة
4. تأكد من أن Strapi v5 يعمل بشكل صحيح