---
name: Clario design constraints
description: Standing visual constraints for future Clario website updates.
---

For Clario visual refinements, preserve the navy, white, and orange brand identity, Arabic RTL layout, existing page content, sections, and functionality unless the user explicitly asks to change them. Financial statements must be analyzed in the browser and never uploaded or persisted; show a sample and clear privacy wording before the user selects a file.

Keep the three core services available on both the public page and dashboard. On the dashboard, statement analysis, the hiring simulation, and the financial goal remain separate services.

The selected app currency is a display preference, separate from each statement's source currency and a saved goal's stored currency. Convert values for display; never rewrite the underlying amounts when the user changes the display currency.

Keep displayed numbers in Arabic-Indic digits and use each currency's standard precision (three decimals for KWD). Keep the navy page background consistent between the public site and dashboard, use a fixed four-item bottom navigation on mobile, and make the local-only statement privacy promise visible near the upload action.

**Why:** The user specified Clario's brand, RTL, privacy, and page structure, and requested these number-formatting and navigation choices for the MVP.

**How to apply:** Keep statement processing in browser memory only. Preserve access to all three services from both the public page and dashboard, and keep their dashboard pages separate unless the user changes scope. When adding currency-aware views, retain source amounts and convert only for display. Format user-facing numerals in Arabic and keep shared page backgrounds aligned.
