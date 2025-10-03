import { Publication } from '../lib/searchEngine';
import { User } from '../lib/auth';

export interface UserProfileStats {
  saved: number;
  favorites: number;
}

export interface ProfileContextData {
  user: User;
  savedPublications: Publication[];
  favoritePublications: Publication[];
  stats: UserProfileStats;
}
