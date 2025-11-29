export const DEMO_VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
// Using Tears of Steel as it has a cinematic/tech vibe suitable for a demo

export const INITIAL_PROJECTS = [
  {
    id: '1',
    title: 'Q3 Business Review & AI Strategy',
    uploadDate: '2023-10-15',
    duration: '45:20',
    thumbnailUrl: 'https://picsum.photos/seed/tech1/300/200',
    status: 'ready' as const,
    transcriptContext: 'A detailed discussion about Q3 financial results, the impact of generative AI on business workflows, and future roadmap strategies for Q4.'
  },
  {
    id: '2',
    title: 'Marketing Automation Masterclass',
    uploadDate: '2023-10-22',
    duration: '1:02:15',
    thumbnailUrl: 'https://picsum.photos/seed/marketing/300/200',
    status: 'ready' as const,
    transcriptContext: 'An educational webinar explaining the latest trends in marketing automation, email segmentation, and CRM integration for 2024.'
  },
  {
    id: '3',
    title: 'Product Launch: Nexus V2',
    uploadDate: '2023-10-28',
    duration: '28:45',
    thumbnailUrl: 'https://picsum.photos/seed/product/300/200',
    status: 'processing' as const,
    transcriptContext: 'Keynote speech introducing the new Nexus V2 product line, highlighting features like speed, durability, and cloud sync.'
  }
];

export const MOCK_CLIPS = [
  {
    id: 'c1',
    title: 'AI Impact Overview',
    startTime: 10,
    endTime: 45,
    summary: 'High-level overview of how AI is changing the landscape.',
    viralScore: 85,
    tags: ['#AI', '#FutureOfWork', '#TechTrends']
  },
  {
    id: 'c2',
    title: 'Financial Highlights',
    startTime: 120,
    endTime: 160,
    summary: 'Key financial metrics and growth areas for Q3.',
    viralScore: 65,
    tags: ['#Finance', '#Growth', '#Q3']
  }
];
