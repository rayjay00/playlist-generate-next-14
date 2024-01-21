import { getLovedTracksAndRedirect } from "./actions";

// todo: fix type
export default function Home({ searchParams }: { searchParams: any }) {
  const errorMessage = searchParams.error;
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="w-full mx-auto max-w-md px-6 py-12 rounded-xl shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Playlist Generator</h1>
        <p>Generate a Spotify playlist from your last.fm loved tracks</p>
        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}
        <form action={getLovedTracksAndRedirect} className="grid space-y-6">
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="text-black flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="username"
              placeholder="Enter your last.fm username"
              name="username"
              required
            />
          </div>
          <button
            className="bg-green-600 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
