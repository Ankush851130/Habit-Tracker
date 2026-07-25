export const MOTIVATIONAL_QUOTES = [
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "Small habits don't add up. They compound.", author: "James Clear" },
  { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { quote: "First we make our habits, then our habits make us.", author: "John Dryden" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Consistency is the true foundation of trust and mastery.", author: "Roy T. Bennett" },
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};
