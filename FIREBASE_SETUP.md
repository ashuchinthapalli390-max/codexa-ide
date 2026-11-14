# CODEXA STUDIO IDE — FIREBASE INTEGRATION GUIDE
## Complete Setup Guide for the Project Owner • V15 Production Architecture

> **CRITICAL DATA ISOLATION NOTICE:**
> The existing CodeXa Agency database (containing historical members, interns, tasks, classes, and chats) is **100% ISOLATED AND OUT OF SCOPE**. This guide sets up a **brand-new, independent Firebase project** exclusively for the CodeXa Studio IDE website and desktop ecosystem. No existing databases are ever modified or overwritten.

---

### Prerequisites
- A Google account with access to the [Firebase Console](https://console.firebase.google.com/).
- Terminal access to the `site ide` project directory.

---

### Step 1: Create a Brand-New Firebase Project
1. Navigate to [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Project Name: Enter **CodeXa Studio Web** (suggested project ID: `codexa-studio-web` or your own unique ID).
4. Google Analytics: Optional (can be enabled if you want web analytics, or disabled).
5. Click **Create project** and wait for provisioning to finish.

---

### Step 2: Register the Web Application & Copy Web Configuration
1. In your new project overview, click the **Web icon (`</>`)** to add a web app.
2. App nickname: `CodeXa Studio Web App`.
3. (Optional) Check "Also set up Firebase Hosting for this app" if planning to host on Firebase.
4. Click **Register app**.
5. You will see a `firebaseConfig` object with:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId` (if analytics enabled)
6. Copy these values to your `.env.local` file under the `NEXT_PUBLIC_FIREBASE_*` section:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC8ujCMYvV4LBCaWBwEAL-6R8i1imUf3tY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ide-codexa.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ide-codexa
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ide-codexa.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=182155365309
NEXT_PUBLIC_FIREBASE_APP_ID=1:182155365309:web:9e1b25311f9a678039a0d4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MSQWNKL4CE
```

---

### Step 3: Enable Firebase Authentication & Google Sign-In
1. In the left navigation sidebar under **Build**, click **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Google**.
4. Toggle the **Enable** switch.
5. Set the **Project public-facing name** to `CodeXa Studio IDE`.
6. Select your **Project support email**.
7. Click **Save**.
8. Under the **Settings** tab of Authentication:
   - Click **Authorized domains**.
   - Verify `localhost` is present.
   - Add your custom domain (e.g. `codxa-agency.online`, `codexa-studio.com`, etc.) if deploying to production.

---

### Step 4: Provision Cloud Firestore Database
1. In the left sidebar under **Build**, click **Firestore Database**.
2. Click **Create database** (if you have not done so yet).
3. **Database location:** Choose your closest region (e.g. `asia-south1` (Mumbai) or `us-central1`).
4. **Security rules mode:** Choose **Start in production mode** (all read/writes denied by default).
5. Click **Create**.

> [!TIP]
> **Resolution for "Failed to get document because the client is offline":**
> If you see this message or previously experienced it, it happens when the web client calls Firestore before the database has been clicked and created in the Firebase console, or when WebSockets are blocked by a firewall.
> **Our codebase now permanently resolves this:**
> 1. We enable `experimentalForceLongPolling: true` to bypass WebSocket blocks.
> 2. We use multi-tab persistent IndexedDB caching.
> 3. We implement offline-resilient profile fallback: verified Google users are immediately signed in with full role recognition even if Firestore is temporarily offline or being provisioned!
> 4. To enable multi-device sync, simply click **Create database** in the Firebase Console as shown above.

---

### Step 5: Apply Production Firestore Security Rules
1. In the Firestore console, click the **Rules** tab.
2. Replace all contents with the rules from the project's `firestore.rules` file.
3. Click **Publish**.

The rules enforce:
- Default-deny for all unauthorized paths.
- Users can read/write only their own non-privileged profile fields.
- Role elevation (promoting oneself to Founder, CTO, Admin, or Intern) is strictly prohibited.
- Subscription modification is restricted to verified backend services.
- Audit logs and security events are write-only from trusted server credentials.

---

### Step 6: Generate Firebase Admin SDK Credentials (Server-Side)
1. In the Firebase Console, click the **Gear icon (Project settings)** at top left.
2. Select the **Service accounts** tab.
3. Verify that **Firebase Admin SDK (Node.js)** is selected.
4. Click **Generate new private key**, then confirm **Generate key**.
5. A JSON file will download. Open it and extract:
   - `project_id`
   - `client_email`
   - `private_key`
6. Add these to your `.env.local` file:

```env
FIREBASE_ADMIN_PROJECT_ID=codexa-studio-web
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@codexa-studio-web.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...\n-----END PRIVATE KEY-----\n"
```

> **SECURITY NOTE:** Never commit the service account JSON or your `.env.local` to git. The `.gitignore` is already pre-configured to block them.

---

### Step 7: Verify Configuration & Start Application
Run:
```powershell
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000).

When credentials are properly populated:
1. The **Sign In** button in the header will open the Google Sign-In popup.
2. On first sign-in, an idempotent profile document will be created in Firestore under `/users/{uid}` with role `customer`.
3. Click your profile avatar to view the customer dashboard at `/account`.

---

### Step 8: Role-Based Access Control (RBAC) Verification
The system enforces 5 distinct role tiers:
1. **Public Visitor:** No login required. Can view all marketing pages, docs, pricing, and FAQ.
2. **Customer:** Authenticated general user. Can view `/account`, pre-beta reservations, own reviews, and token usage.
3. **Intern (`intern`):** Access to `/intern` (tasks, assigned projects, learning resources). Requires verified invitation.
4. **Agency Member (`agency_member`):** Access to `/agency` (teams, agency resources). Requires verified invitation or read-only linking.
5. **Leadership (`founder`, `co_founder`, `cto`, `hr`, `team_lead`, `admin`):** Access to `/agency/admin` with role-scoped modules (HR, CTO, Admin).

---

### Step 9: Running with Firebase Local Emulators (Optional)
To test locally without internet access or without touching cloud Firestore:
```powershell
npx firebase emulators:start
```
Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in your `.env.local`.
