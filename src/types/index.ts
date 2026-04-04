export interface Partner {
  name: string;
  image?: string;
  imageId?: string;
  description?: string;
  url?: string;
}

export interface TimelineEvent {
  year: number;
  type: 'milestone' | 'event' | 'award' | 'team' | 'other';
  title: string;
  description: string;
  icon?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageId?: string;
  duration: string;
  icon?: string;
}

