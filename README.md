# Sitabai College — Enquiry Assistant

A responsive college enquiry chatbot built with plain HTML, CSS, and JavaScript. It runs as a local demo by default; configure Supabase to share FAQ data and synchronize conversations in the cloud.

## Run the local demo

Serve this folder over HTTP (for example, run `npx serve .` and open the URL it prints). Serving over HTTP is recommended so browser storage and the Supabase client work consistently.

When Supabase is not configured, the demo admin login is:

- **Email:** `admin@campus.edu`
- **Password:** `Campus123`

## Connect Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. Open the project's **SQL Editor**, paste in [`supabase-schema.sql`](./supabase-schema.sql), and run it. This creates FAQ, conversation, message, and AI rate-limit tables; installs row-level security policies; and adds the Sitabai College FAQs. Re-running the script refreshes those FAQ seed entries while leaving other FAQ records intact; run it again when updating an existing project to refresh these answers.
3. In Supabase **Authentication > Sign-in / Providers**, enable anonymous sign-ins for student chat history. Create a staff user under **Authentication > Users**.
4. Give that staff user the admin role by editing the example query at the bottom of `supabase-schema.sql` with the staff email, then run that query in SQL Editor. The role is kept in protected `app_metadata` and checked by the database policies.
5. In **Project Settings > API**, copy the Project URL and the **anon / publishable** key into `supabase-config.js`:

   ```js
   window.CAMPUSLY_SUPABASE_CONFIG = {
     url: "https://your-project-id.supabase.co",
     anonKey: "your-public-anon-or-publishable-key",
   };
   ```

6. Store the OpenAI API key only in Supabase Edge Function secrets, then deploy both AI functions:

   ```powershell
   supabase login
   supabase link --project-ref your-project-id
   supabase secrets set OPENAI_API_KEY=your-openai-api-key
   supabase functions deploy campus-chat
   supabase functions deploy voice-session
   ```

   `OPENAI_MODEL` is optional for text chat; its default is `gpt-4o-mini`. Voice chat uses the Realtime API with `gpt-realtime-2.1`. Add an OpenAI billing method if required by your account.
7. Serve the folder over HTTP and reload the app. The sidebar should say **AI assistant + cloud connected**. Admins sign in with the email and password assigned to their Supabase staff account. The old demo credentials are only used when Supabase is not configured.

Only put the public anon/publishable key in the browser. **Never put the OpenAI API key or Supabase `service_role` key in a browser file or GitHub repository.** The OpenAI key belongs in Supabase Edge Function secrets. Voice chat streams microphone audio to OpenAI through WebRTC; users must allow microphone access, and their browser must support WebRTC and microphone capture. Advise students not to share sensitive personal information. Row-level security protects FAQ administration and ensures students can only read their own saved chats.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. To publish it:

1. Push this project to a GitHub repository on the `main` branch.
2. In the repository settings, open **Pages** and select **GitHub Actions** as the build and deployment source.
3. Add the Supabase project URL and public anon/publishable key to `supabase-config.js`; those values are designed to be public. Do not add the OpenAI API key there.
4. Push the changes to `main`, or run **Deploy website to GitHub Pages** from the repository's **Actions** tab. GitHub Pages publishes the site when the workflow succeeds.
5. Configure the OpenAI key as a Supabase secret and deploy the Supabase Edge Functions separately; GitHub Pages does not host backend code.

## Features

- Text AI conversations and live two-way voice conversations that use recent chat and relevant college FAQs.
- FAQ search and suggested questions to help students get started.
- Admin sign-in with a dashboard to add, edit, and delete FAQ entries; connected FAQs update live for other open clients.
- Saved chat history, new conversations, and conversation deletion; Supabase-backed history is private to the signed-in/anonymous browser account.
- Responsive desktop and mobile layouts, keyboard shortcuts, and accessible form labels.
- Searchable and filterable Arts, Commerce, and Science department/subject directory based on the college website.
- Course-detail views; fees, intake, duration, seats, and eligibility are not fabricated when they could not be verified.
- College dashboard with its logo, campus information, and college profile details. Official website links and direct contact details are omitted from the public interface.
- A transparent fallback when the FAQ library has no answer; students are directed to official college support rather than given a made-up answer.

## Student interaction and limitations

Students interact by asking questions, choosing suggested topics, searching FAQs, and continuing a saved conversation. In cloud mode, the AI replies to each message using relevant college FAQs and recent chat turns. Staff can improve answers in the admin dashboard; live FAQ updates appear in open browsers. The current anonymous student identity persists in that browser, so it does not provide cross-device chat history. Add student accounts if that is required.

Supabase provides the cloud database and authentication, and its Edge Function securely calls OpenAI. The database limits each student identity to 30 AI requests per hour. The OpenAI service receives the recent chat turns and selected FAQ context to generate replies; do not ask students to submit sensitive personal information. Before using this as a live college service, have staff verify all displayed facts and FAQ answers, and configure abuse protection and spending limits before enabling public anonymous sign-ins.

## Sitabai College information scope

The website is personalized for **Sitabai Arts, Commerce & Science College, Civil Lines, Akola 444001, Maharashtra**. History, mission, facilities, and department subject areas are summarized from institutional information. Official website links and direct phone/email details are intentionally omitted from the public interface.

The information reviewed did not verify a current fee schedule, current intake dates, seat counts, exact program duration, or current admission eligibility. The prospectus available in the reviewed information is for 2022–23. The app labels those details as unconfirmed; staff should review current college notices and update the FAQ library before relying on those answers.

Without Supabase credentials, the app uses browser `localStorage` and simple FAQ matching. Text AI requires the deployed `campus-chat` Edge Function; live voice requires the deployed `voice-session` Edge Function. Both use Supabase configuration and the `OPENAI_API_KEY` secret. If an AI endpoint fails, the app displays the error so the student can retry.
