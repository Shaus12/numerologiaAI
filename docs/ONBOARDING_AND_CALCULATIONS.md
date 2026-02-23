# Onboarding & Calculations Summary

## 1. What We Use vs. Don’t Use from Onboarding

### Collected during onboarding

| Screen        | Data collected     | Stored in `userProfile`? | Used anywhere? |
|---------------|--------------------|---------------------------|-----------------|
| Language      | `language`         | Yes (via `userData`)      | **Yes** – UI, AI language, dates |
| Identity      | `identity` (gender)| Yes                       | **No** |
| Name          | `name`             | Yes                       | **Yes** – Home, Profile, Oracle, Match, AI |
| Birth time    | `knowsBirthTime`   | Yes                       | **No** |
| Relationship  | `relationshipStatus` | Yes                    | **No** |
| Focus         | `focus`            | Yes                       | **No** |
| Challenge     | `challenge`        | Yes                       | **No** |
| Expectations  | `expectations`     | Yes                       | **No** |
| Birthdate     | `birthdate`        | Yes                       | **Yes** – all numerology + AI reading |

### Summary

- **Used:** `name`, `birthdate`, `language`.
- **Stored but unused:** `identity`, `knowsBirthTime`, `relationshipStatus`, `focus`, `challenge`, `expectations`.

The AI reading, Oracle, and Match prompts only receive **name** (where relevant), **birthdate** (via pre-calculated numbers), and **language**. No personalization from focus, challenge, relationship, or expectations is implemented.

---

## 2. How We Calculate Everything

All numerology is **deterministic math** in `src/utils/numerology.ts` (Pythagorean system). **No AI is used for the numbers.**

### Letter–number map (Pythagorean)

Used for name-based numbers (A–Z only; non-letters stripped):

| 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| A,J,S | B,K,T | C,L,U | D,M,V | E,N,W | F,O,X | G,P,Y | H,Q,Z | I,R |

### Reduction rule

Sum digits until you get a single digit (1–9) or a **master number** (11, 22, 33). Master numbers are kept; otherwise we reduce to one digit.

---

### Life Path Number

- **Input:** Birthdate (day, month, year).
- **Steps:**
  1. Reduce day, month, and year to single digits (or 11/22/33).
  2. Add those three values.
  3. Reduce the sum to one digit (or 11/22/33).
- **Used for:** Main analysis, Oracle context, Match, daily insight.

---

### Destiny Number

- **Input:** Full name.
- **Steps:** Sum the number for **every letter** in the name, then reduce.
- **Implementation:** `calculateNameNumber(name, 'all')`.

---

### Soul Urge Number

- **Input:** Full name.
- **Steps:** Sum only **vowels** (A, E, I, O, U), then reduce.
- **Implementation:** `calculateNameNumber(name, 'vowels')`.

---

### Personality Number

- **Input:** Full name.
- **Steps:** Sum only **consonants**, then reduce.
- **Implementation:** `calculateNameNumber(name, 'consonants')`.

---

### Personal Year Number

- **Input:** Birthdate + current year (default: this year).
- **Steps:**
  1. Reduce birth day and birth month to one digit each (or 11/22/33).
  2. Reduce current year to one digit (e.g. 2025 → 9).
  3. Add day + month + year; reduce the sum.
- **Used for:** Shown on Home; feeds Daily Number.

---

### Daily Number

- **Input:** Personal Year number + date (default: today).
- **Steps:**
  1. Reduce Personal Year to one digit (or 11/22/33).
  2. Reduce day and month of the date to one digit each.
  3. Add the three and reduce.
- **Used for:** Home screen “energy today” and daily insight context.

---

## 3. Where Calculations Run

- **CalculatingScreen** (after onboarding): Computes Life Path, Destiny, Soul Urge, Personality, Personal Year, Daily Number from `userData.name` and `userData.birthdate`, then saves to `numerologyResults` and passes the same numbers (plus name, birthdate, language) to **AI** for the written reading only.
- **MatchScreen:** Partner’s Life Path is computed with `NumerologyEngine.calculateLifePath(partnerBirthdate)`; that number (and user’s) is sent to the AI for the compatibility text.

---

## 4. AI Usage (text only)

- **Endpoint:** One Supabase Edge Function: `gemini-proxy`.
- **Request:** `POST` with body `{ "prompt": "<string>" }`.
- **Used for:** Generating the analysis reading, Oracle answers, Match compatibility text, and daily insight sentence. Numbers are always calculated in the app; AI only turns them (and context) into prose.
