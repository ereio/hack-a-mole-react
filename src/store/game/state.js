export default function initialState() {
  return {
    loading: false,
    currentGame: null,
    isActive: false,
    isStarted: false,
    isEnded: false,
    startTime: 0,
    endTime: 0,
    timeLimit: 5,
    rows: ['A', 'B', 'C'],
    holes: ['1', '2', '3'],
    score: 0,
    moles: [],
  };
}
