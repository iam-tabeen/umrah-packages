# Umrah Packages Marketing & Listing Portal

A premium, fast, read-only marketing portal showcasing live Umrah travel packages fetched and parsed from a third-party XML SOAP/REST API. Built on **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Key Features

1. **Server-Side XML API Fetching & Parsing**:
   - Fetches dynamic flight group and room pricing XML payloads.
   - Parses elements server-side using `fast-xml-parser` (protects API credentials and endpoints).
   - Groups flat package structures under their parent flights dynamically, displaying Cheaper Accommodation combos first.
   - Leverages **Incremental Static Regeneration (ISR)** (`revalidate = 900`) to fetch and update package listings every 15 minutes.
   - **Graceful Failure Fallbacks**: Implements automatic, high-fidelity mock data failovers if the third-party endpoint goes offline or responds with malformed data.

2. **Premium User Experience & Aesthetic**:
   - Modern color theme utilizing deep Islamic teal/emerald palettes combined with soft gold accents.
   - CSS-animated sticky blur headers and responsive search filters.
   - Premium layout containing skeletons while the page pre-renders.

3. **Multi-Tiered Client-Side Filters**:
   - **Top bar**: Free-text search (scans package codes, destinations, hotels) + quick horizontal multi-select sector chips.
   - **Sidebar (Desktop) / Slide-up bottom drawer (Mobile)**:
     - Airline filters (radios/checkboxes).
     - Unique duration (nights) tags.
     - Dual-handle range slider (filtering by sharing price).
     - Search-within-filter checklists for Makkah and Medina hotels.
     - Departure Month windows (This Week / This Month / Next Month).
     - Availability toggles (showing packages with seats > 0).

4. **Mobile UX fixes**:
   - Transformed cramped desktop tables into stacked, highly scannable grid cards on mobile screens to prevent overflow and eliminate horizontal scrolling.

5. **WhatsApp Leads Modal**:
   - Clicking "Book Now" opens a contact modal, generating a pre-filled WhatsApp message outlining hotel combinations, departure dates, room types, and price listings.

---

## Directory Structure

```
├── app/
│   ├── globals.css         # Theme overrides and slider thumb styling
│   ├── layout.tsx          # blurred sticky header and contact footer wrapper
│   ├── loading.tsx         # pulse skeleton placeholders loader
│   └── page.tsx            # server component fetching live XML, passing down explorer
├── components/
│   ├── BookNowModal.tsx    # lead modal generating WhatsApp / callback forms
│   ├── FlightGroupCard.tsx # expandable card containing packages (desktop tables/mobile cards)
│   ├── PackagesExplorer.tsx# orchestrator managing filter logic
│   └── RangeSlider.tsx     # dual-range custom input component
├── lib/
│   ├── mockData.ts         # seed mock packages fallback dataset
│   ├── types.ts            # raw DTO and formatted frontend schemas
│   └── umrahApi.ts         # parsing XML, grouping packages, error resilience
```

---

## Getting Started

### 1. Configure Environment Variables
Create a local environment variables file `.env.local` based on `.env.local.example`:
```env
UMRAH_API_URL=https://api.safreibadat.com/api/UmrGroupView/
UMRAH_API_KEY=YOUR_OPTIONAL_BEARER_TOKEN
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## Customizing API Authentication

The API client in `lib/umrahApi.ts` is configured to use standard Bearer token authentication out of the box if `UMRAH_API_KEY` is present.

To modify the headers (e.g. if the provider requires custom API query keys, query parameters, or XML post payloads), modify the fetch headers in [lib/umrahApi.ts](file:///c:/Users/Tabeen%20Haider/Desktop/new%20website/lib/umrahApi.ts):

```typescript
const headers: Record<string, string> = {
  'Accept': 'application/xml, text/xml, */*',
  // Swap headers to fit third-party requirements:
  // 'X-API-KEY': apiKey,
  // 'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
};
```
