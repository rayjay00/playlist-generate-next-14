"use client";
export function Playlist({ playlistId }: { playlistId: string }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
      width="100%"
      height="380"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
  );
}
