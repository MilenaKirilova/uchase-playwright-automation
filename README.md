This repository contains an automated test solution built with **Playwright** and **TypeScript**,
following the **Page Object Model (POM)** pattern and executed via **GitHub Actions CI**.

---

## Part 1 – Onboarding Flow

The onboarding flow for a student user is automated, including role selection, grade selection,
and completion of the onboarding process.
The test validates that the user is redirected to the dashboard and sees lessons only for the selected grade.

Due to the stateful nature of onboarding (completed only once per user),
the test is skipped if onboarding has already been completed.

---

## Part 2 – Critical User Journey

The selected user journey covers logging in, searching for a lesson, and opening lesson content.
This flow is critical for the business, as it ensures users can discover and access educational materials after authentication.
Validating this journey guarantees a smooth learning experience and core platform usability.

To ensure **deterministic and repeatable test execution**, user authentication is used so the test remains independent from the onboarding state.

---

## Route Guard & Negative Scenarios

Additional tests validate route access control and negative scenarios:
- Users who have not completed onboarding are redirected from `/dashboard` to `/onboarding-process`
- Users are redirected away from onboarding when it is already completed
- Onboarding failure is handled correctly when a backend API error occurs (no redirect to `/dashboard`)

---

## CI

Tests are executed automatically via **GitHub Actions** on **Chromium (Desktop Chrome)**.

---

## Running Tests

```bash
npx playwright test