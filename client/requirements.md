## Packages
framer-motion | Page transitions, multi-step animations, and UI polish
react-dropzone | Beautiful drag-and-drop area for PDF upload in PatosScore
lucide-react | Already installed, but explicitly noting reliance for tech-themed icons
react-hook-form | Already installed, relying heavily on it for multi-step forms
@hookform/resolvers | Already installed, for Zod validation

## Notes
- Tailwind Config - extend fontFamily:
  fontFamily: {
    display: ["var(--font-display)", "sans-serif"],
    body: ["var(--font-body)", "sans-serif"],
  }
- Tailwind Config - extend colors:
  Add `neon: "hsl(var(--neon))"`
- API endpoints are mocked in hooks using `fetch` pointing to standard paths. If backend is missing, they will fail naturally.
- PDF generation expects backend to return `Blob` with `application/pdf` content type.
- PatosScore expects JSON response with specific scoring fields.
