export default function initialState() {
  return {
    loading: false,
    started: false,
    allGames: [],
    currentGame: null,
    currentReview: null,
    isActive: false,
    isStarted: false,
    isEnded: false,
    endTime: 0,
    startTime: 0,
    timeLimit: 10,
    score: 0,
    moles: [],
    rows: ['A', 'B', 'C'],
    holes: ['1', '2', '3'],
  };
}
