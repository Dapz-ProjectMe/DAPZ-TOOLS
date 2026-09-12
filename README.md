# DAPZ TOOLS — CLEAN FINAL

## Struktur
```text
DAPZ-TOOLS/
├── index.html
├── account.html
├── admin/
│   └── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── core/
│       │   ├── guest-limit.js
│       │   ├── supabase.js
│       │   └── tools.js
│       └── pages/
│           ├── admin.js
│           ├── account.js
│           └── home.js
├── supabase/
│   ├── schema.sql
│   └── guest-limit.md
└── README.md
```

## Setup
1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Aktifkan Email/Password Auth.
4. Konfigurasi Google OAuth jika diperlukan.
5. Isi URL dan Publishable/anon key di `assets/js/core/supabase.js`.
6. Jangan pernah menaruh `service_role` key di frontend.
7. Jalankan melalui HTTP server, lalu tes register/login.
8. Ambil UUID akun admin dari Authentication → Users.
9. Jalankan `update public.profiles set is_admin=true where id='YOUR-UUID';`.
10. Buka `/admin/`.

## Catatan
Tool cards saat ini adalah UI/fondasi. Limit 3 guest memakai localStorage untuk testing. Untuk production, quota harus dipindahkan ke server/edge karena localStorage dapat di-reset. Tool media membutuhkan backend, rate limit, batas upload, dan kepatuhan terhadap aturan platform/copyright.


## Code style

All HTML, CSS, JavaScript, SQL, and Markdown files are intentionally formatted with readable indentation and separated sections so they are easier to edit on a phone or laptop.
