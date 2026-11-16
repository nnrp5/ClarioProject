---
name: Clario design constraints
description: Standing visual constraints for future Clario website updates.
---

For Clario visual refinements, preserve the navy, white, and orange brand identity, Arabic RTL layout, existing page content, sections, and functionality unless the user explicitly asks to change them. Financial statements must be analyzed in the browser and never uploaded or persisted; show a sample and clear privacy wording before the user selects a file.

Keep all three core services available on the public page and dashboard. The public home starts with a hero and brief idea section, followed by statement upload and summary with compact links to hiring and goal tools; retain the full, separate service views in the dashboard.

The selected app currency is a display preference, separate from each statement's source currency and a saved goal's stored currency. Convert values for display; never rewrite the underlying amounts when the user changes the display currency.

Keep displayed numbers in Arabic-Indic digits and use each currency's standard precision (three decimals for KWD). Keep the navy page background consistent between the public site and dashboard, with a subtle lighter-navy gradient and faint orange corner glow. Use 16px corners for cards and buttons, 12px corners for goal fields, and even 16px gaps between adjacent cards. Keep the fixed four-item mobile navigation and make the local-only statement privacy promise visible near upload.

On dark Clario pages, prefer translucent lighter-navy glass cards with fine borders over bright white or cream surfaces; use orange to emphasize financial scores and key figures.

Keep the goal progress bar 8px tall with an orange fill and visible end marker. Use subtle press feedback, horizontal dashboard-page transitions, and readable contrast for secondary text.

Offer multiple labeled, browser-only statement examples and cycle to a different scenario on each demo refresh. Show a country flag beside the currency code in the global currency selector.

**Why:** The user specified Clario's brand, RTL, privacy, number formatting, gradient, control radii, dark-glass card surfaces, subtle motion, rotating sample examples, and currency flags. They asked to restore the public hero and idea section above compact service cards while keeping the dashboard layout unchanged. Goal data stores a target but no accumulated savings, so forecasts must not imply an actual saved balance.

**How to apply:** Keep statement processing in browser memory only. Preserve the hero and idea section before the compact public analysis and service links; keep dashboard views separate and visually unchanged unless the user changes scope. When adding currency-aware views, retain source amounts and convert only for display. Format user-facing numerals in Arabic and keep shared page backgrounds aligned. Label goal forecasts based on statement surplus as estimates; the progress bar must not imply an actual saved balance unless the user records contributions.
