import { CreatePollForm } from "@/components/polls/create-poll-form"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

/**
 * Server Component page that renders the Create Poll screen.
 *
 * Why:
 * - Enforces authentication on the server before exposing poll-creation UI, reducing client-side JS and preventing unauthenticated access.
 * - Aligns with App Router patterns by using server-side redirects instead of client guards.
 *
 * Behavior:
 * - Retrieves the current user with `getUser()` (server Supabase client); if absent, issues a server redirect to `/auth/login`.
 * - Renders `CreatePollForm` (Client Component) for interactive form state and submission (currently posts to API; can be migrated to Server Actions).
 *
 * Assumptions:
 * - Supabase session cookies are available on the server (middleware keeps refresh tokens current).
 * - Database tables are protected by RLS; server checks are defense-in-depth.
 * - The presence of a Supabase user is sufficient to create polls (email confirmation may be enforced upstream in project settings).
 *
 * Edge cases:
 * - Expired/invalid session: user is redirected before any UI renders.
 * - Slow auth fetch: page awaits `getUser()`; no partial content is sent.
 * - Client navigations after sign-out will hit this page on the server and redirect accordingly.
 *
 * Connections:
 * - Uses `CreatePollForm` from `components/polls/create-poll-form`.
 * - Depends on `lib/auth#getUser` and Next.js `redirect`.
 * - Created polls are listed in `app/polls/page.tsx` and viewed in `app/polls/[id]/page.tsx`.
 */
export default async function CreatePollPage() {
  // Fetch the authenticated user on the server to gate access
  const user = await getUser()
  if (!user) {
    // Server-side redirect prevents unauthenticated users from seeing the page
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Poll</h1>
          <p className="text-gray-600">
            Ask a question and let the community vote on the options
          </p>
        </div>

        {/* Client Component that handles interactive form state and submission */}
        <CreatePollForm />

        <div className="mt-8 text-center">
          <Link 
            href="/polls" 
            className="text-primary hover:underline text-sm"
          >
            ← Back to all polls
          </Link>
        </div>
      </div>
    </div>
  )
}
