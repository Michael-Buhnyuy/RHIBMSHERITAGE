export interface Partner {
  name: string;
  image: string;
  description?: string;
  url?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Program {
  name: string;
  description: string;
  image: string;
  icon?: string;
  duration?: string;
}
