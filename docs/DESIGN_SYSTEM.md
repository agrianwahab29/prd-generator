# 🎨 Design System - AI PRD Generator
## "Ocean Intelligence" Visual Direction

---

## 1. Arah Visual (Visual Direction)

### Konsep: "Modern SaaS with Editorial Touch"

**Deskripsi:**
Tampilan professional yang bersih namun memiliki karakter. Dirancang untuk membangun **trust** (kepercayaan pengguna pada AI) namun tetap **warm** dan approachable untuk semua kalangan pengguna.

**Keyword:**
- **Intelligent** (bukan intimidating)
- **Clean** (tidak cluttered)
- **Professional** (bukan kaku)
- **Readable** (fokus pada dokumen panjang)

**Perbandingan dengan arah lain:**
- ❌ Bukan "Purple Gradient Generic SaaS" (terlalu umum)
- ❌ Bukan "Brutalist" (terlalu ekstrim untuk target semua kalangan)
- ❌ Bukan "Playful/Colorful" (kurang professional untuk enterprise)
- ✅ **"Ocean Intelligence"** - Keseimbangan sempurna antara tech-forward dan human-friendly

---

## 2. Palet Warna (Color System)

### 🌊 Primary: Ocean Indigo
Mewakili kecerdasan AI, trustworthiness, dan kedalaman pemikiran.

```css
--primary-50: #EEF2FF   /* Background subtle */
--primary-100: #E0E7FF  /* Light backgrounds */
--primary-200: #C7D2FE  /* Borders light */
--primary-500: #6366F1  /* Light accent */
--primary-600: #4F46E5  /* PRIMARY - Buttons, links */
--primary-700: #4338CA  /* Hover states */
--primary-800: #3730A3  /* Active states */
--primary-900: #312E81  /* Dark text on light bg */
```

### 🔥 Accent: Warm Coral
Mewakili energi kreatif, human touch, dan highlight untuk fitur unggulan.

```css
--accent-400: #FB923C   /* Light highlights */
--accent-500: #F97316   /* ACCENT - CTA sekunder, streaming indicator */
--accent-600: #EA580C   /* Hover states */
--accent-700: #C2410C   /* Active states */
```

### ⚡ Semantic Colors

```css
/* Success - Emerald */
--success-50: #ECFDF5
--success-500: #10B981   /* Save, complete, check */
--success-600: #059669

/* Warning - Amber */
--warning-50: #FFFBEB
--warning-500: #F59E0B   /* Alerts, cautions */
--warning-600: #D97706

/* Error - Rose */
--error-50: #FFF1F2
--error-500: #F43F5E     /* Error states, validation */
--error-600: #E11D48

/* Info - Sky */
--info-50: #F0F9FF
--info-500: #0EA5E9      /* Info badges, tips */
--info-600: #0284C7
```

### 🎨 Neutral: Clean Slate
Untuk text, borders, dan backgrounds dengan readability maksimal.

```css
--slate-50: #F8FAFC      /* Page background */
--slate-100: #F1F5F9     /* Card backgrounds */
--slate-200: #E2E8F0     /* Borders, dividers */
--slate-300: #CBD5E1     /* Disabled states */
--slate-400: #94A3B8     /* Placeholder text */
--slate-500: #64748B     /* Secondary text */
--slate-600: #475569     /* Body text secondary */
--slate-700: #334155     /* Body text */
--slate-800: #1E293B     /* Headings */
--slate-900: #0F172A     /* Primary text, headings */
--slate-950: #020617     /* Maximum contrast text */
```

### 🎯 Special Colors

```css
/* Streaming Gradient - untuk efek AI generating */
--gradient-ai: linear-gradient(90deg, #4F46E5 0%, #F97316 100%);

/* Glow effects */
--glow-primary: 0 0 20px rgba(79, 70, 229, 0.3);
--glow-accent: 0 0 20px rgba(249, 115, 22, 0.3);

/* Glass effect untuk overlay */
--glass-bg: rgba(255, 255, 255, 0.8);
--glass-border: rgba(255, 255, 255, 0.3);
```

---

## 3. Sistem Tipografi (Typography)

### Font Stack

**Font Utama - Inter:**
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```
- Superior readability untuk dokumen panjang
- Great untuk Bahasa Indonesia & Inggris
- Modern geometric sans-serif

**Font Monospace - JetBrains Mono:**
```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```
- Untuk code blocks dalam PRD
- Clear distinction dari body text

### Type Scale (8-point grid)

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| **hero** | 48px | 56px | 700 | Landing page headline |
| **h1** | 36px | 44px | 700 | Page title |
| **h2** | 30px | 38px | 600 | Section headers |
| **h3** | 24px | 32px | 600 | Card titles |
| **h4** | 20px | 28px | 600 | Subsection headers |
| **body-lg** | 18px | 28px | 400 | Important body text |
| **body** | 16px | 24px | 400 | Default body text |
| **body-sm** | 14px | 20px | 400 | Secondary text |
| **caption** | 12px | 16px | 500 | Badges, timestamps, labels |

### Typography Rules

**Headings:**
- Color: `--slate-900` atau `--slate-950`
- Letter spacing: -0.02em (tighter untuk heading besar)
- Font weight: 600-700

**Body Text:**
- Color: `--slate-700` untuk primary, `--slate-500` untuk secondary
- Max-width: 65ch (optimal reading length)
- Line height: 1.75 untuk paragraf panjang (PRD content)

**Links:**
- Default: `--primary-600`
- Hover: `--primary-700` dengan underline
- Visited: `--primary-800`

**Code:**
- Background: `--slate-100`
- Text: `--slate-800`
- Padding: 2px 4px (inline), 16px (blocks)
- Border radius: 4px

---

## 4. Sistem Layout & Spacing

### Container

```css
/* Container widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Padding */
--px-mobile: 16px;
--px-tablet: 24px;
--px-desktop: 32px;
```

### Spacing Scale (4px base)

```css
--space-1: 4px;    /* xs */
--space-2: 8px;    /* sm */
--space-3: 12px;   /* sm+ */
--space-4: 16px;   /* md */
--space-6: 24px;   /* lg */
--space-8: 32px;   /* xl */
--space-12: 48px;  /* 2xl */
--space-16: 64px;  /* 3xl */
--space-20: 80px;  /* 4xl */
--space-24: 96px;  /* 5xl */
```

### Border Radius

```css
--radius-sm: 6px;    /* Inputs, small elements */
--radius-md: 8px;    /* Buttons, cards */
--radius-lg: 12px;   /* Large cards, modals */
--radius-xl: 16px;   /* Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows

```css
/* Layered shadows untuk depth */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Special shadows */
--shadow-glow-primary: 0 0 20px rgba(79, 70, 229, 0.3);
--shadow-glow-accent: 0 0 20px rgba(249, 115, 22, 0.3);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
```

### Layout Patterns

**Landing Page:**
```
┌─────────────────────────────────────┐
│  Hero (asymmetric)                  │
│  ┌────────────┐  ┌──────────────┐ │
│  │   Text     │  │    Visual    │ │
│  │   (60%)    │  │    (40%)     │ │
│  └────────────┘  └──────────────┘ │
├─────────────────────────────────────┤
│  Features (centered grid)          │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Card 1│ │Card 2│ │Card 3│        │
│  └──────┘ └──────┘ └──────┘        │
└─────────────────────────────────────┘
```

**Dashboard:**
```
┌──────────┬────────────────────────────┐
│          │  Header                     │
│ Sidebar  ├────────────────────────────┤
│ (280px)  │  ┌──────┐ ┌──────┐ ┌──────┐│
│          │  │Card  │ │Card  │ │Card  ││
│ Navigation│  └──────┘ └──────┘ └──────┘│
│          │  ┌──────┐ ┌──────┐         │
│          │  │Card  │ │Card  │         │
│          │  └──────┘ └──────┘         │
└──────────┴────────────────────────────┘
```

**Generator Page (Split):**
```
┌─────────────────────────────────────────┐
│ Header                                  │
├──────────────────┬──────────────────────┤
│                  │                      │
│   Input Form     │   Streaming Output   │
│     (45%)        │       (55%)          │
│                  │                      │
│  [Textarea]      │  ┌────────────────┐  │
│  [Select]        │  │ Markdown PRD   │  │
│  [Button]        │  │ (typing effect)│  │
│                  │  └────────────────┘  │
│                  │  [Copy] [Download]    │
└──────────────────┴──────────────────────┘
```

---

## 5. Strategi Animasi & Motion

### Prinsip Dasar
> "Motion yang meaningful" - Animasi memperjelas hierarki, bukan sekadar dekorasi.

### 1. Streaming Text Animation (Fitur Unggulan)

**Cursor Effect:**
```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.cursor {
  animation: blink 1s infinite;
  color: var(--primary-600);
}
```

**Text Reveal:**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
.chunk {
  animation: fadeIn 150ms ease-out;
}
```

**Scroll Behavior:**
- Auto-scroll smooth ke bagian bawah saat konten bertambah
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Duration: 300ms

**Active Glow:**
- Efek glow lemah pada area streaming aktif
- `box-shadow: 0 0 20px rgba(79, 70, 229, 0.2)`

### 2. Page Transitions

**Fade In:**
```css
@keyframes pageEnter {
  from { opacity: 0; }
  to { opacity: 1; }
}
.page {
  animation: pageEnter 300ms ease-out;
}
```

**Slide Up:**
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.section {
  animation: slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3. Micro-interactions

**Button Hover:**
```css
.btn {
  transition: all 150ms ease;
}
.btn:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}
.btn:active {
  transform: scale(0.98);
}
```

**Card Hover:**
```css
.card {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

**Input Focus:**
```css
.input {
  transition: border-color 200ms ease, box-shadow 200ms ease;
  border: 1px solid var(--slate-200);
}
.input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
```

### 4. Loading States

**Skeleton Shimmer:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--slate-100) 25%,
    var(--slate-200) 50%,
    var(--slate-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

**Button Loading:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.btn-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Spinner:**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}
```

### 5. Status Animations

**Success (Checkmark):**
```css
@keyframes popIn {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.checkmark {
  animation: popIn 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

**Error (Shake):**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
.error-shake {
  animation: shake 300ms ease-in-out;
}
```

### 6. Dashboard Interactions

**Card Stagger:**
```css
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 50ms; }
.card:nth-child(3) { animation-delay: 100ms; }
/* etc */
```

**Delete Slide-out:**
```css
@keyframes slideOut {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
.card-deleting {
  animation: slideOut 300ms ease-in forwards;
}
```

**New Card Slide-in:**
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.card-new {
  animation: slideInUp 400ms ease-out;
}
```

### Accessibility

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Komponen Kunci (Key Components)

### Button Variants

**Primary Button:**
```
Background: --primary-600
Text: white
Border radius: --radius-md (8px)
Padding: 12px 24px
Font: body, 500 weight
Shadow: none (flat design)
Hover: --primary-700 + scale(1.02)
Active: --primary-800 + scale(0.98)
Disabled: --slate-300 bg, --slate-400 text
```

**Secondary Button:**
```
Background: white
Border: 1px solid --slate-200
Text: --slate-700
Hover: --slate-50 bg
```

**Accent Button (CTA):**
```
Background: --accent-500
Text: white
Hover: --accent-600
Use for: "Generate PRD", "Create New"
```

**Ghost Button:**
```
Background: transparent
Text: --primary-600
Hover: --primary-50 bg
```

### Card Design

**Standard Card:**
```
Background: white
Border: 1px solid --slate-200
Border radius: --radius-lg (12px)
Padding: --space-6 (24px)
Shadow: --shadow-sm
Hover: --shadow-md + translateY(-4px)
```

**Feature Card (Landing):**
```
Background: white
Border: none
Border radius: --radius-lg
Padding: --space-8 (32px)
Shadow: --shadow-md
Icon: --primary-500 atau --accent-500
Hover: --shadow-lg + subtle gradient overlay
```

**Project Card (Dashboard):**
```
Background: white
Border: 1px solid --slate-200
Border radius: --radius-md
Padding: --space-4
Header: Title (h4) + Timestamp (caption)
Body: Truncated prompt preview
Footer: Deployment badge + Actions
Hover: lift effect
```

### Form Elements

**Input:**
```
Background: white
Border: 1px solid --slate-200
Border radius: --radius-sm (6px)
Padding: 10px 14px
Font: body
Focus: --primary-500 border + ring
Placeholder: --slate-400
Error: --error-500 border
```

**Textarea (Prompt Input):**
```
Min-height: 150px
Max-height: 400px
Resize: vertical
Font: body-lg (18px) untuk readability
```

**Select/Dropdown:**
```
Same styling dengan Input
Chevron icon: --slate-400
Dropdown: --shadow-lg
```

**Label:**
```
Font: body-sm, 500 weight
Color: --slate-700
Margin bottom: --space-1 (4px)
```

### Badges

**Status Badge:**
```
Padding: 2px 8px
Border radius: --radius-full
Font: caption, 500 weight

Variants:
- Success: emerald bg 100 + emerald text 700
- Warning: amber bg 100 + amber text 700
- Error: rose bg 100 + rose text 700
- Info: sky bg 100 + sky text 700
```

**Deployment Badge:**
```
Vercel: Black bg + white text
Netlify: Teal bg (#00C7B7) + white text
VPS: Slate bg + white text
cPanel: Orange bg (#FF6C2C) + white text
```

### Navigation

**Sidebar:**
```
Width: 280px fixed
Background: white
Border right: 1px solid --slate-200
Logo: 40px height
Nav items: padding 12px 16px
Active: --primary-50 bg + --primary-600 text + left border 3px
Hover: --slate-50 bg
```

**Top Header:**
```
Height: 64px
Background: white/80 + backdrop-blur
Border bottom: 1px solid --slate-200
Sticky positioning
```

### Alert/Toast

**Toast (Sonner):**
```
Background: white
Border: 1px solid --slate-200
Border radius: --radius-md
Shadow: --shadow-lg
Border left: 4px solid (warna sesuai type)

Types:
- Success: left border emerald-500
- Error: left border rose-500
- Info: left border sky-500
- Warning: left border amber-500
```

### Markdown Renderer

**Content Area:**
```
Font: body, 16px
Line height: 1.75
Max width: none (full container)

Headings:
- H1: h2 style (30px) + margin top 48px
- H2: h3 style (24px) + margin top 32px
- H3: h4 style (20px) + margin top 24px

Code:
- Inline: --slate-100 bg, --slate-800 text, monospace
- Block: --slate-900 bg, white text, rounded-lg

Blockquote:
- Left border: 4px solid --primary-200
- Background: --primary-50
- Padding: 16px

Lists:
- Spacing: 8px antara items

Tables:
- Header: --slate-100 bg
- Border: 1px solid --slate-200
```

---

## 7. Halaman Spesifik (Page-Specific Design)

### Landing Page

**Hero Section:**
- Background: Subtle gradient dari --primary-50 ke white
- Headline: "Buat PRD Profesional dengan AI"
- Subhead: "Dari ide sampai dokumen spesifikasi dalam hitungan menit"
- CTA Primary: "Coba Gratis" (accent button)
- CTA Secondary: "Lihat Demo" (ghost button)
- Visual: Abstract illustration atau animated code preview

**Features Grid:**
- 3 kolom pada desktop
- Icon + Title + Description
- Icons menggunakan Lucide, warna --primary-500

**Social Proof:**
- Logo cloud (partner/customer)
- Testimonial cards

### Login/Register

**Card:**
- Centered, max-width 420px
- White background
- Shadow xl
- OAuth buttons: Google (white), GitHub (dark)

**Form:**
- Email input
- Password input dengan toggle visibility
- Submit button full width
- Link "Belum punya akun?" / "Sudah punya akun?"

### Dashboard

**Header:**
- Title: "Proyek Saya"
- Button "+ Buat PRD Baru" (accent)
- Search input (optional)

**Empty State:**
- Illustration (empty box/plus)
- Text: "Belum ada proyek"
- CTA: "Buat PRD Pertama Anda"

**Project Grid:**
- Filter tabs: "Semua", "Recent", "Favorit"
- Cards dengan timestamp relatif ("2 jam yang lalu")
- Infinite scroll atau pagination

### Generator Page

**Layout:**
- Two column: 45% input, 55% output
- Gap: 32px

**Left Column (Input):**
- Card dengan header "Deskripsikan Proyek Anda"
- Textarea dengan placeholder examples
- Select deployment target dengan icons
- Button "Generate PRD" (accent, full width)

**Right Column (Output):**
- Card dengan header "Hasil PRD"
- Streaming content area dengan:
  - Gradient text effect saat generating
  - Skeleton shimmer saat loading awal
  - Markdown renderer dengan styling khusus
- Action buttons: Copy, Download PDF, Simpan (muncul setelah complete)

**Loading States:**
- Initial: Skeleton paragraphs
- Streaming: Cursor blink + text reveal
- Complete: Fade-in action buttons

### Settings Page

**Sections:**
- API Key (masked input)
- Provider preference (select)
- Language toggle (ID/EN)
- Delete account (danger zone)

---

## 8. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Adaptations

**< 768px (Mobile):**
- Sidebar jadi drawer/bottom nav
- Generator: Single column (input di atas, output di bawah)
- Cards: Single column
- Typography scale down 10%

**768px - 1024px (Tablet):**
- Sidebar collapse menjadi icons only
- Generator: Tetap 2 column tapi lebih narrow
- Cards: 2 column grid

**> 1024px (Desktop):**
- Full sidebar
- Optimal spacing
- Cards: 3 column grid

---

## 9. Quality Checklist

Sebelum implementasi, pastikan:

- [ ] Semua warna memiliki kontras yang cukup (WCAG AA)
- [ ] Typography readable untuk dokumen panjang
- [ ] Animasi smooth dan tidak mengganggu
- [ ] Layout responsive di semua ukuran
- [ ] Component states (default, hover, active, disabled, error) terdefinisi
- [ ] Dark mode tidak wajib (sesuai request), tapi prepare variables jika diperlukan nanti
- [ ] Accessibility: focus states, reduced motion, screen reader labels
- [ ] Bahasa Indonesia & Inggris terlihat baik (test dengan real content)

---

## 10. Next Steps

Setelah design system disetujui:

1. **Setup Tailwind Config:**
   - Extend colors dengan tokens di atas
   - Extend fontFamily dengan Inter
   - Extend animation dengan keyframes custom

2. **Install shadcn/ui:**
   - Base color: Slate
   - Customize komponen sesuai design system

3. **Implement Page-by-Page:**
   - Landing page
   - Auth pages
   - Dashboard
   - Generator (fitur utama)
   - Settings

4. **Add Animations:**
   - Framer Motion untuk page transitions
   - CSS animations untuk micro-interactions
   - Custom hook untuk streaming effect

---

**Siap untuk implementasi?** Beri tahu saya jika ada yang perlu diubah atau kita lanjut ke tahap B) Build! 🚀
