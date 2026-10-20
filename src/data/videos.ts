import initialVideosJson from './videos.json';

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  youtubeId: string;
  youtubeUrl: string;
  duration: string;
  publishDate: string;
  viewsCount: number;
  desc: string;
}

export const initialVideos: VideoItem[] = initialVideosJson as VideoItem[];
