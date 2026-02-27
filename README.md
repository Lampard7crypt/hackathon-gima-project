# 🏀 GIMA (MVP)
*For the Unstoppable: The Elite Platform for Adaptive Sports Athletes & Coaches*

GIMA is a premium, specialized web application built to connect physically handicapped athletes (such as wheelchair basketball or rugby players) with coaches. Designed with an emphasis on accessibility and modern aesthetics, the platform serves as a "LinkedIn + Hudl" for adaptive sports, featuring real-time data tracking, communication tools, and powerful AI analysis capabilities.

## 🌟 Core Value Proposition

Visually rich and technically robust, GIMA solves the fragmentation in adaptive sports by providing:
1. **Athletes** a specialized platform to record their stats, track their injury history, generate performance QR codes, and gain instant, AI-driven insights on their career trajectory.
2. **Coaches** a dedicated recruitment and analysis dashboard to discover top athletic talent, review their performance tables, and initiate direct communication.

---

## ✨ Features (MVP)

* **Dual-Role Onboarding:** Seamlessly split user experiences tailored specifically for Athletes vs. Coaches.
* **Player Dashboard:** 
  * Beautiful glassmorphic UI displaying Career & Season Averages.
  * Tabulated real-time tracking of Game History and Match Results (W/L metrics).
  * Comprehensive Injury History timeline with clear recovery statuses.
  * Instantly generate an embedded **QR Code** linking directly to the athlete's profile.
* **Coach Dashboard:**
  * Robust player discovery engine with multi-faceted search filters (Sport, Name, etc.).
  * **Affiliation System:** Send and manage affiliation requests directly to promising athletes.
* **Integrated Coach-Player Messaging:** A localized, floating Chat UI panel allowing coaches and affiliated players to communicate directly on the platform.
* **AI Analysis Suite (Simulated API):**
  * **One-Tap Summary:** Synthesizes the athlete's performance trends over time.
  * **Training Recommendations:** AI-generated recovery and skill enhancement drills tailored to the specific disability and sport.
  * **Vendor Assistance:** Matches athletes with specialized equipment vendors for custom wheelchairs and ergonomic frames.

---

## 🛠️ Technology Stack

Designed entirely with custom styling for a bespoke, premium feel:
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphic rendering, explicitly avoiding generic utility frameworks like Tailwind for maximal uniqueness).
* **Architecture:** Mocked Serverless API Endpoints (`/api/ai/*`) ready to scale into OpenAI LLM integration.
* **Components:** React Hooks (`useState`), `qrcode.react`

---

## 🚀 Local Development Setup

To run GIMA locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gima
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Experience the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. 
   
   *Note: For the current MVP phase, authentication utilizes a Mock Auth Flow. You may enter any simulated email/password combination on the `/login` or `/register` screens to securely bypass and test the Athlete or Coach dashboards directly!*
