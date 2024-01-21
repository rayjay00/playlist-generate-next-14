export interface Track {
  name: string;
  artist: {
    name: string;
  };
  date: {
    "#text": string;
  };
}

export interface MissedTrack {
  name: string;
  artist: string;
}
