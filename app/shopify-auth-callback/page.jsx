import { Suspense } from "react";

import { redirect } from "next/navigation";

import { generateplaylist } from "../actions";

async function PlaylistDetails({ code, username }) {
  const { missedTracks, playlistId } = await generateplaylist({
    code,
    username,
  });

  return (
    <section className="mx-auto w-[50%]">
      {missedTracks.length > 0 && (
        <div>
          <h2 className="pt-5">
            Sorry 😢, Spotify couldn&apos;t add these tracks:
          </h2>
          <ul className="py-5">
            {missedTracks.map((track) => (
              <li key={track.id}>
                <span className="font-bold pt-2">{track.artist} </span>-{" "}
                {track.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        width="100%"
        height="380"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </section>
  );
}

export default async function ShopifyAuthCallback({ searchParams }) {
  const { code, state: username } = searchParams;
  if (!code) {
    redirect('/?error="Error in Shopify auth. No code provided"');
  }

  if (!username) {
    redirect('/?error="Error in Shopify auth state. No username provided"');
  }

  return (
    <>
      <h1 className="text-center text-2xl pt-2">Playlist Details</h1>
      <Suspense fallback={<h2 className="text-white">loading.....</h2>}>
        <PlaylistDetails code={code} username={username} />
      </Suspense>
    </>
  );
}
