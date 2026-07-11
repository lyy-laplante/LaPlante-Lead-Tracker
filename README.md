# LaPlante Lead Tracker — Phase 1 (Netlify-only version)

A simple tool for tracking quote-request leads (website, phone, email referrals) that
haven't scheduled yet, so nobody falls through the cracks.

This version lives entirely inside Netlify — no Supabase account needed. Data is stored
in **Netlify Database** (Postgres) and logins are handled by **Netlify Identity**. Both
are managed from your Netlify project dashboard.

**Worth knowing before you deploy:** Netlify Database is newer than Supabase, and unlike
Phase 1's original version, storage/compute usage draws from your Netlify plan's credits
rather than being free indefinitely. For two users and a small lead list this should be
minor, but keep an eye on usage the first month. See **Site → Database → Usage** after
you deploy.

## 1. Push this to GitHub

1. Create a new repo on GitHub (e.g. `laplante-lead-tracker`) — private is fine
2. From this project folder:
   ```
   git init
   git add .
   git commit -m "Phase 1: lead tracker (Netlify DB + Identity)"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/laplante-lead-tracker.git
   git push -u origin main
   ```

## 2. Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an
   existing project**
2. Connect GitHub, pick the repo you just pushed
3. Leave the build settings as detected (from `netlify.toml`) and click **Deploy**

The first deploy will fail to serve data until the next two steps are done — that's
expected.

## 3. Turn on Netlify Database

1. In your site dashboard, go to **Database** in the left sidebar
2. Click **Create a database manually** (or **Connect** if it offers to set one up)
3. Netlify provisions the database and, on your next deploy, automatically runs the
   migration in `netlify/database/migrations/` to create the `leads` table — no SQL
   editor needed
4. Trigger a redeploy (**Deploys → Trigger deploy → Deploy site**) so the migration runs

## 4. Turn on Netlify Identity and add your logins

1. In your site dashboard, go to **Project configuration → Identity**
2. Click **Enable Identity**
3. Under **Identity → Emails → Confirmation template**, turn on **autoconfirm** so you
   don't need to click an email link before your first login (optional, but simpler for
   an internal tool)
4. Go to **Identity → Invite users**, and invite yourself and Kari by email — you'll each
   get an email to set a password

## 5. Try it

Visit your Netlify URL, log in with the account you just set up, and add a test lead to
confirm everything's wired up.

## Running it locally

```
npm install
netlify dev
```

`netlify dev` (not `npm run dev`) is important here — it links to your real Netlify
Identity instance and spins up a local copy of your database automatically, so
Identity and Database both work the same as production. You'll need the
[Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/)
installed and your project linked (`netlify link`) first.

## Using it

- **Add lead**: top-right button. Fill in whatever you know — only the name is required,
  so a quick phone note takes seconds.
- **Next follow-up date**: this is what drives the "Follow up today" section. Leave it
  blank for leads that don't need a scheduled check-in (e.g. already scheduled, or lost).
- **Status**: update this as a lead moves along. Once a lead is Scheduled or Not moving
  forward, it drops out of the "Follow up today" section automatically.

## A note on how this differs from the Supabase version

- No separate account/dashboard to manage — everything lives under your Netlify project
- Data access is entirely server-side (no public API key exposed to the browser); leads
  are only reachable through this app's own protected routes
- Netlify Identity and Netlify Database are both newer products than Supabase, so if
  something behaves unexpectedly, check `netlify dev`'s terminal output first — it
  usually surfaces the real error clearly

## What's next

Once this feels good day-to-day, Phase 2 adds the daily email digest so you don't have to
remember to check the dashboard — it'll land in your inbox each morning instead.
