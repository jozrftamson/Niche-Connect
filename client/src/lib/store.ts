import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  content: string;
  tags: string[];
  platform: 'Twitter' | 'LinkedIn' | 'Instagram';
  timestamp: string;
}

export interface CommentTemplate {
  id: string;
  content: string; // e.g., "Great post {creatorName}, I really liked {topic}!"
  label: string;
}

interface UserState {
  isAuthenticated: boolean;
  user: {
    name: string;
    handle: string;
    points: number;
    avatar: string;
    selectedNiche: string | null;
  } | null;
  
  posts: Post[];
  currentIndex: number;
  
  templates: CommentTemplate[];
  
  // Actions
  login: (name: string) => void;
  logout: () => void;
  selectNiche: (niche: string) => void;
  addPoints: (amount: number) => void;
  nextPost: () => void;
  importTemplates: (templates: CommentTemplate[]) => void;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    creatorName: 'Sarah Drasner',
    creatorHandle: '@sarah_edo',
    avatar: 'https://github.com/sdras.png',
    content: 'The web is becoming more complex, but the tools are getting better. What is your favorite dev tool this year?',
    tags: ['webdev', 'javascript', 'tools'],
    platform: 'Twitter',
    timestamp: '2h ago'
  },
  {
    id: '2',
    creatorName: 'Guillermo Rauch',
    creatorHandle: '@rauchg',
    avatar: 'https://github.com/rauchg.png',
    content: 'Speed is a feature. If your site is slow, your conversion rate drops. Optimize your LCP.',
    tags: ['performance', 'web', 'business'],
    platform: 'Twitter',
    timestamp: '4h ago'
  },
  {
    id: '3',
    creatorName: 'Addy Osmani',
    creatorHandle: '@addyosmani',
    avatar: 'https://github.com/addyosmani.png',
    content: 'JavaScript design patterns are still relevant. Which one do you use the most?',
    tags: ['javascript', 'patterns', 'learning'],
    platform: 'LinkedIn',
    timestamp: '5h ago'
  },
  {
    id: '4',
    creatorName: 'Dan Abramov',
    creatorHandle: '@dan_abramov',
    avatar: 'https://github.com/gaearon.png',
    content: 'React Server Components are a mental model shift. It takes time to click, but when it does, it simplifies so much.',
    tags: ['react', 'rsc', 'frontend'],
    platform: 'Twitter',
    timestamp: '1d ago'
  }
];

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      posts: [],
      currentIndex: 0,
      templates: [
        { id: '1', label: 'Appreciation', content: "Great insights {creatorName}! I especially agree with your point about {topic}." },
        { id: '2', label: 'Question', content: "Thanks for sharing, {creatorName}. How do you handle {topic} in larger projects?" }
      ],

      login: (name) => set({
        isAuthenticated: true,
        user: {
          name,
          handle: `@${name.toLowerCase().replace(/\s/g, '')}`,
          points: 100, // Welcome bonus
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          selectedNiche: null
        }
      }),

      logout: () => set({ isAuthenticated: false, user: null }),

      selectNiche: (niche) => set((state) => ({
        user: state.user ? { ...state.user, selectedNiche: niche } : null,
        posts: MOCK_POSTS, // In a real app, we'd fetch based on niche
        currentIndex: 0
      })),

      addPoints: (amount) => set((state) => ({
        user: state.user ? { ...state.user, points: state.user.points + amount } : null
      })),

      nextPost: () => set((state) => ({
        currentIndex: (state.currentIndex + 1) % state.posts.length
      })),
      
      importTemplates: (newTemplates) => set((state) => ({
        templates: [...state.templates, ...newTemplates]
      }))
    }),
    {
      name: 'engage-flow-storage',
    }
  )
);
