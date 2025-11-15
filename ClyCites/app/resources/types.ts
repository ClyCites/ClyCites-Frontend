export type Resource = {
  id: number;
  title: string;
  description: string;
  category: 'guide' | 'article' | 'video' | 'technical';
  image: string;
  type: 'PDF' | 'Article' | 'Video' | 'Documentation';
  size?: string;
  duration?: string;
  date: string;
  url: string;
};

export type ApiResponse = {
  data: Resource[];
  success: boolean;
  message?: string;
};
