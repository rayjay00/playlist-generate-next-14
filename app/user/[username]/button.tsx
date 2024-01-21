"use client";
import { handleSpotifyAuthCheck } from "@/app/actions";
import { useState } from "react";

export default function Button({ username }: { username: string }) {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    handleSpotifyAuthCheck({ username });
  };
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 my-5 text-white bg-green-600 hover:bg-green-700 max-w-[3000px] mx-auto"
    >
      Generate Playlist from Loved Tracks
    </button>
  );
}
