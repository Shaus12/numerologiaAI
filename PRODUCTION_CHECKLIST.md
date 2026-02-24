# Production readiness checklist

Use this before submitting to the App Store / Google Play.

---

## Must fix before release

### 1. **Android RevenueCat key**
- **File:** `src/constants/RevenueCat.ts`
- Replace `androidApiKey: 'goog_REPLACE_WITH_YOUR_ANDROID_KEY'` with your **Production** Android public SDK key from [RevenueCat](https://app.revenuecat.com) → Project Settings → API keys.
- If you only ship on iOS, you can leave it as-is; Android builds will not configure purchases until you add a real key.

### 2. **Edge function password (secure, no secrets in code)**
- The app sends your edge function password in the `X-App-Secret` header. The password is **never** stored in the repo.
- **Local development:** Create a `.env` file in the project root (it’s gitignored) with:
  ```bash
  EXPO_PUBLIC_APP_SECRET=the_exact_password_you_set_in_supabase_edge_function
  ```
  Restart the dev server after adding or changing `.env`.
- **Production (EAS Build):** Set the same password in EAS Secrets so it’s injected at build time:
  1. Open [expo.dev](https://expo.dev) → your project → **Secrets**.
  2. Add a secret: name **EXPO_PUBLIC_APP_SECRET**, value = same password as in your Supabase edge function.
  3. Run a new build (`eas build ...`); the binary will contain the value, and the secret never appears in your repo or in plain text in EAS after creation.
- Use the same value in your Supabase edge function (e.g. env var or config) so it can validate the header.

---

## Recommended

### 3. **Store listings**
- **Privacy policy URL** – Use a stable URL (e.g. your site or a Gist) and reference it in the app (Settings/Profile already link to in-app Privacy & Terms).
- **App Store / Play Store descriptions** – Fill in descriptions, keywords, screenshots, and age rating.

### 4. **Version and build**
- **app.json** – `version` is `1.0.0`; bump as needed. For EAS Submit, build numbers are handled by EAS.
- Run a production build and test on a real device:
  - `eas build --platform ios --profile production` (or your profile)
  - `eas build --platform android --profile production`

### 5. **Optional**
- **Error reporting** – e.g. Sentry or Bugsnag for production errors.
- **Analytics** – If you want events (e.g. onboarding completion, paywall views), add a provider.
- **Console logs** – `console.error` is used in a few places (RevenueCat, AI service). Consider a logger that no-ops or forwards to your backend in production.

---

## Already in good shape

- **RevenueCat** – iOS production key in use; platform-specific config added for Android.
- **Custom paywall** – Implemented with Apple-compliant billing copy (e.g. “Billed annually at …”).
- **Translations** – 8 languages (EN, ES, PT, FR, DE, RU, AR, HE).
- **Profile photo** – Persisted to app storage and user profile.
- **Notifications** – Permission flow and daily 08:00 reminder with OS handling.
- **App config** – Bundle IDs, EAS project, OTA updates URL, splash, icons.
- **Encryption** – `ITSAppUsesNonExemptEncryption: false` set for iOS export compliance.
- **Touch debug** – Wrapped in `__DEV__`, so no logging in release builds.

---

## Quick pre-submit test

1. Install production build on a real device.
2. Complete onboarding, open Oracle, trigger one AI request.
3. Open Paywall, check pricing and “Restore” / Terms / Privacy links.
4. Enable notifications, confirm reminder time (08:00).
5. Change language in Settings, then reopen app and confirm language persists.
6. Add a profile photo, leave Profile and return; confirm photo persists.

Once **§1** (and **§2** if your edge function uses the secret) are done, you’re in a good position to submit.
