# Codeway Case Study – Full Stack Developer

Vue.js (Frontend) + Node.js/Express (Backend) + Firebase Authentication + Firestore.


## Proje Yapısı

codeway-case-study/
├── backend/   # Node.js + Express API
├── frontend/  # Vue 3 + Vite
└── README.md  # Bu dosya

---

## Environment Variables

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://your-backend-service.onrender.com
VITE_API_TOKEN=your_api_token_here

Backend (.env)

PORT=3001
API_TOKEN=your_api_token_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"


Kurulum

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm run dev


## Deploy

### Frontend (Vercel)
- Vercel’de frontend deploy edildi: [https://codeway-case-study-green.vercel.app](https://codeway-case-study-green.vercel.app)

### Backend (Render)
- Render üzerinde backend deploy edildi: [https://codeway-backend-amuj.onrender.com](https://codeway-backend-amuj.onrender.com)
Not: Backend root endpoint (`/`) boş döner. Test için `/api/config` veya `/api/admin/config` endpoint’lerini kullanın.