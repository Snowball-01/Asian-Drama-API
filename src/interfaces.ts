export interface IVideoData {
  success: boolean;
  data: {
    title: string;
    id: string;
    image: string;
    description: string;
    episodes: string;
    duration: string;
    aired_on: string;
    rating: string;
    iframe: string;
    downloadlinks: DownloadLinks;
  };
  list_episode: ListEpisode[];
  latest_episodes: LatestEpisodes[];
  source: string;
}

export interface DownloadLinks {
  [key: string]: string;
}

export interface ListEpisode {
  link: string;
  id: string;
  thumb: string;
  title: string;
  uploaded_on: string;
  type: string;
}

export interface LatestEpisodes {
  link: string;
  id: string;
  image: string;
  title: string;
  time_ago: string;
}

export interface ISearchVideoData {
  success: boolean;
  data: string[];
  source: string;
}

export interface MaybeError {
  message: string;
}
