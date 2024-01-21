import Image from "next/image";
import { redirect } from "next/navigation";

import Button from "./button";

async function getUser(username: string) {
  const songsResponse = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=${username}&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=500`
  );
  const userResponse = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${process.env.LAST_FM_API_KEY}&format=json`
  );
  const [songsData, userData] = await Promise.all(
    [songsResponse, userResponse].map((res) => res.json())
  );

  if (!songsData.lovedtracks) redirect("/?error='User not found'");

  return { tracks: songsData, user: userData.user };
}

// todo: fix type
export default async function User({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const { tracks, user } = await getUser(params.username);
  const lovedTracksCount = tracks.lovedtracks.track.length;

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between px-7 py-4 bg-black"></header>
      <section className="flex flex-col max-w-[600px] mx-auto">
        <div className="flex items-center gap-4 mx-auto justify-around">
          <Image
            src={user.image[3]["#text"]}
            className="rounded-full"
            width={75}
            height={75}
            alt="user avatar"
          />
          <div className="text-white">
            <div className="font-bold">{user.name}</div>
            <div className="text-sm">
              Total Play Count: {Number(user.playcount).toLocaleString()}
            </div>
            <div className="text-sm">
              Unique Track Plays: {Number(user.track_count).toLocaleString()}
            </div>
            <div className="text-sm">
              Loved Tracks: {Number(lovedTracksCount).toLocaleString()}
            </div>
          </div>
        </div>
        <Button username={params.username} />
      </section>
    </>
  );
}
