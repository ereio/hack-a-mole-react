export const initialState = () => {
  return {
    loading: false,
    started: false,
    games: [],
    currentGame: null,
    currentReview: null,
    isActive: false,
    isStarted: false,
    isEnded: false,
    endTime: 0,
    startTime: 0,
    timeLimit: 21,
    score: 0,
    moles: [],
    rows: ['A', 'B', 'C'],
    holes: ['1', '2', '3'],
  };
};
