---
name: Clario design constraints
description: Standing visual constraints for future Clario website updates.
---

For Clario visual refinements, preserve the navy, white, and orange brand identity, Arabic RTL layout, existing page content, sections, and functionality unless the user explicitly asks to change them. Financial statements must be analyzed in the browser and never uploaded or persisted; show a sample and clear privacy wording before the user selects a file.

Keep the three core services available on both the public page and dashboard. On the dashboard, statement analysis, the hiring simulation, and the financial goal remain separate services.

The selected app currency is a display preference, separate from each statement's source currency and a saved goal's stored currency. Convert values for display; never rewrite the underlying amounts when the user changes the display currency.

Keep displayed numbers in Arabic-Indic digits and use each currency's standard precision (three decimals for KWD). Keep the navy page background consistent between the public site and dashboard, with a subtle lighter-navy gradient and faint orange corner glow. Use consistent 16px corners for cards, buttons, and fields, with even 16px gaps between adjacent cards. Keep the fixed four-item mobile navigation and make the local-only statement privacy promise visible near upload.

Offer multiple labeled, browser-only statement examples and cycle to a different scenario on each demo refresh. Show a country flag beside the currency code in the global currency selector.

**Why:** The user specified Clario's brand, RTL, privacy, page structure, number formatting, gradient, consistent radii, rotating sample examples, and flags in the currency selector. Goal data stores a target but no accumulated savings, so forecasts must not imply an actual saved balance.

**How to apply:** Keep statement processing in browser memory only. Preserve access to all three services from both the public page and dashboard, and keep their dashboard pages separate unless the user changes scope. When adding currency-aware views, retain source amounts and convert only for display. Format user-facing numerals in Arabic and keep shared page backgrounds aligned. Label goal forecasts based on statement surplus as estimates; the progress bar must not imply an actual saved balance unless the user records contributions.
