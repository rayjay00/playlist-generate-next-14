import { Suspense } from "react";

import { redirect } from "next/navigation";

import { generateplaylist } from "../actions";
import { Playlist } from "./playlist";

async function PlaylistDetails({
  code,
  username,
}: {
  code: string;
  username: string;
}) {
  let missedTracks = [];
  let playlistId = "";
  try {
    const response = await generateplaylist({
      code,
      username,
    });
    missedTracks = response.missedTracks;
    playlistId = response.playlistId;
  } catch (error) {
    redirect(`/user/${username}`);
  }

  return (
    <section className="mx-auto w-[50%]">
      {missedTracks.length > 0 && (
        <div>
          <h2 className="pt-5">
            Sorry 😢, Spotify couldn&apos;t add these tracks:
          </h2>
          <ul className="py-5">
            {missedTracks.map((track) => (
              <li key={track.name}>
                <span className="font-bold pt-2">{track.artist} </span>-{" "}
                {track.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Playlist playlistId={playlistId} />
    </section>
  );
}

export default async function ShopifyAuthCallback({ searchParams }) {
  const { code, state: username } = searchParams;
  if (!code) {
    redirect("/?error=Error in Shopify auth. No code provided");
  }

  if (!username) {
    redirect("/?error=Error in Shopify auth state. No username provided");
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
