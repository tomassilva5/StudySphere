# StudySphere

![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-010101?logo=socket.io&logoColor=white)

## Project Overview

StudySphere is an academic planning and collaboration platform. It helps students manage tasks, organize study groups, schedule events, and collaborate in real-time.

**License:** Academic use only.

---

## What's Inside

| Feature | Description |
|---|---|
| **Task Management** | Create, edit, and delete academic tasks with categorized filters. |
| **Study Groups & Chat** | Form groups and communicate instantly via real-time WebSocket chat. |
| **Calendar Integration** | Import and synchronize your schedule with Google Calendar. |
| **Real-Time Notifications** | Automated reminders for tasks (15, 30, 60 min) with dedicated sound and visual alerts. |
| **Accessibility Focus** | High-contrast UI toasts and auditory feedback for time-sensitive events. |

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma, MongoDB
- **Real-time:** Socket.IO
- **Deployment:** Hosted on Vercel

---

## Testing the Application

- **Register/Login:** Create your student profile.
- **Test Alerts:** Add a task for 15 minutes in the future; ensure notification settings are active.
- **Collaborate:** Create a study group and invite members to the real-time chat.
- **Sync:** Import your Google Calendar to see external events alongside your tasks.
- **Audit:** Check the notification bell for a persistent, scrollable log of all triggered alerts.

---

## How to Run & Usage

No installation or local setup is required to test the prototype. Simply access the functional application hosted on Vercel at:

🔗 **[https://study-sphere-iota.vercel.app/](https://study-sphere-iota.vercel.app/)**

> **Note:** To view the app in its intended mobile format, press right-click, select **Inspect**, and toggle the **Device Toolbar** to simulate a mobile screen.

---
*© StudySphere | Developed by Tomás Silva, Miguel Azevedo, Francisco Fernandes*
