# Socket.IO Setup for Strapi 5

هذا الملف يشرح كيفية إعداد Socket.IO server في Strapi 5 للعمل مع نظام المراسلة الفوري.

## الخطوة 1: تثبيت Socket.IO في Strapi

في مشروع Strapi الخاص بك، قم بتثبيت الحزم المطلوبة:

```bash
npm install socket.io
npm install --save-dev @types/socket.io
```

## الخطوة 2: إنشاء Socket.IO Server

أنشئ ملف `config/socket.js` في مشروع Strapi:

```javascript
module.exports = ({ env }) => ({
  socket: {
    enabled: true,
    options: {
      cors: {
        origin: env('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
      },
    },
  },
});
```

## الخطوة 3: إنشاء Socket Service

أنشئ ملف `src/api/socket/services/socket.js`:

```javascript
const { createServer } = require('http');
const { Server } = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    if (!io) {
      io = new Server(httpServer, {
        cors: {
          origin: process.env.FRONTEND_URL || 'http://localhost:3000',
          credentials: true,
        },
      });

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Join room for specific conversation
        socket.on('join_conversation', (conversationId) => {
          socket.join(`conversation_${conversationId}`);
          console.log(`Socket ${socket.id} joined conversation_${conversationId}`);
        });

        // Leave conversation room
        socket.on('leave_conversation', (conversationId) => {
          socket.leave(`conversation_${conversationId}`);
        });

        // Handle new message
        socket.on('send_message', async (data) => {
          try {
            // Save message to Strapi database
            const message = await strapi.entityService.create('api::messages-conversation.messages-conversation', {
              data: {
                content: data.content,
                isRead: data.isRead,
                image: data.image,
                conversation: data.conversation,
                users_permissions_user: data.users_permissions_user,
              },
              populate: ['users_permissions_user']
            });

            // Broadcast to all clients in the conversation room
            io.to(`conversation_${data.conversation}`).emit('new_message', message);

            // Also update the thread's sender
            await strapi.entityService.update('api::user-message.user-message', data.conversation, {
              data: {
                sender: data.users_permissions_user,
              },
            });
          } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', { message: 'Failed to send message' });
          }
        });

        // Handle new thread creation
        socket.on('new_thread', async (data) => {
          try {
            const thread = await strapi.entityService.create('api::user-message.user-message', {
              data: {
                subject: data.subject,
                statusRead: false,
                online: false,
                user: data.user,
                sender: data.sender,
              },
              populate: ['user', 'sender']
            });

            // Broadcast to all connected clients
            io.emit('new_thread', thread);
          } catch (error) {
            console.error('Error creating thread:', error);
          }
        });

        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
    }
    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
```

## الخطوة 4: تحديث Strapi Server

عدّل ملف `src/server.js` (أو `src/index.js` حسب إصدار Strapi):

```javascript
const strapi = require('@strapi/strapi');
const socketService = require('./src/api/socket/services/socket');

const app = strapi();

app.start().then(() => {
  const httpServer = app.server;
  socketService.init(httpServer);
  console.log('Socket.IO server initialized');
});
```

## الخطوة 5: إضافة متغيرات البيئة

في `.env` في مشروع Strapi:

```env
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## الخطوة 6: تحديث الصلاحيات في Strapi Admin

1. اذهب إلى Strapi Admin
2. Settings → Users & Permissions → Roles
3. للـ Role المناسب (مثلاً Authenticated أو Public):
   - أضف صلاحيات `find` و `findOne` لـ `user-message`
   - أضف صلاحيات `create` و `find` لـ `messages-conversation`
   - تأكد من تفعيل الصلاحيات للحقول المطلوبة

## الخطوة 7: اختبار الاتصال

بعد تشغيل Strapi server، يجب أن ترى:
- "Client connected" في console عند الاتصال من Next.js
- الدائرة الخضراء في واجهة Next.js تعني الاتصال ناجح
- الدائرة الحمراء تعني عدم الاتصال

## الأحداث (Events) المستخدمة

### من Client إلى Server:
- `join_conversation` - الانضمام لغرفة محادثة
- `leave_conversation` - مغادرة غرفة محادثة
- `send_message` - إرسال رسالة جديدة
- `new_thread` - إنشاء محادثة جديدة

### من Server إلى Client:
- `new_message` - رسالة جديدة وصلت
- `new_thread` - محادثة جديدة وصلت
- `error` - خطأ في العملية

## ملاحظات هامة

1. تأكد أن Strapi يعمل على المنفذ 1337 (أو عدّل في Next.js)
2. تأكد من تفعيل CORS في Socket.IO server
3. الرسائل تُحفظ في قاعدة البيانات عبر Strapi Entity Service
4. Socket.IO يُستخدم فقط للتحديثات الفورية، ليس للتخزين
