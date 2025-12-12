import { FeedbackItem, Sentiment } from './types';

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: '1',
    source: 'Review',
    text: "The new UI is sleek, but I can't find the logout button anymore. It's really frustrating.",
    date: '2023-10-25',
    sentiment: Sentiment.Negative,
    emotion: 'Frustrated',
    topics: ['UI/UX', 'Navigation'],
    intensity: 7,
    actionableInsight: 'Improve visibility of account management controls.'
  },
  {
    id: '2',
    source: 'Twitter',
    text: "Absolutely loving the new dark mode! Best update in years. 🔥",
    date: '2023-10-26',
    sentiment: Sentiment.Positive,
    emotion: 'Excited',
    topics: ['Dark Mode', 'Design'],
    intensity: 9,
    actionableInsight: 'Highlight dark mode in marketing materials.'
  },
  {
    id: '3',
    source: 'Support',
    text: "My package was delayed by 3 days. The product is fine, but shipping needs work.",
    date: '2023-10-24',
    sentiment: Sentiment.Neutral,
    emotion: 'Disappointed',
    topics: ['Shipping', 'Logistics'],
    intensity: 5,
    actionableInsight: 'Investigate carrier delays in this region.'
  },
  {
    id: '4',
    source: 'Email',
    text: "Customer service agent was very rude when I asked for a refund.",
    date: '2023-10-23',
    sentiment: Sentiment.Negative,
    emotion: 'Angry',
    topics: ['Customer Service', 'Refunds'],
    intensity: 9,
    actionableInsight: 'Review support ticket #4421 and retrain staff.'
  },
  {
    id: '5',
    source: 'Review',
    text: "Great value for money. Does exactly what it says on the box.",
    date: '2023-10-26',
    sentiment: Sentiment.Positive,
    emotion: 'Satisfied',
    topics: ['Pricing', 'Value'],
    intensity: 6,
    actionableInsight: 'Maintain current pricing strategy.'
  }
];
