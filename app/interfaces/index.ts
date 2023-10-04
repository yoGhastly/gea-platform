export interface Post {
  postId: string;
  date: string;
  title: string;
  image: string;
  created_at: string;
  group: string;
  description: string;
}


export interface Event {
  day: string;
  time: string[];
  activity: string;
  group: string;
  place: string;
}
