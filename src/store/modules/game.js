const state = {
  //setup
  playerName: '',
  gameDifficulty: '',

  //parameters
  gameStarted: false,
  gameProgress: 0,
  gameBoard: [],

  //default settings
  gameSettings: {}
}

const mutations = {
  setupSettings: (state, settings) => state.gameSettings = settings,
  setDifficulty: (state, difficulty) => state.gameDifficulty = difficulty,
  setPlayer: (state, name) => state.playerName = name,

  setBoard: (state, newBoard) => state.gameBoard = newBoard,
  setMoveCount: (state, count) => state.gameProgress = count,
  setGameProcess: (state, progress) => {
    state.gameStarted = progress
    state.gameProgress = 0
  }
}
const actions = {
  async fetchSettings({ commit, dispatch }) {
    // const result = await axios
    //   .get('https://starnavi-frontend-test-task.herokuapp.com/game-settings');

    const result = { data: require('../../data/game-settings.json') };

    commit('setupSettings', result.data)
    commit('setDifficulty', [...Object.keys(result.data)][0])
    dispatch('generateBoard')
  },

  generateBoard({ commit, state }) {
    let size = state.gameSettings[state.gameDifficulty].field;
    let field = [];
    for (let i = 0; i < size * size; i++) {
      field.push(i);
    }

    commit('setBoard', field);
  },

  startGame({ commit, dispatch }) {
    dispatch('setActiveCell')
    commit('setGameProcess', true)
    console.log('game started')
  },
  finishGame({ commit }) {
    commit('setGameProcess', false)
    console.log('game finished')
  },
  setActiveCell({ commit, state }) {
    let board = [...state.gameBoard]
    let activeAlready = [...board].filter(e => e === 'active')
    let movesLeft = [...board].filter(e => typeof e === 'number');
    if (!activeAlready.length) {
      let nextMove = Math.floor(Math.random() * movesLeft.length);
      board[movesLeft[nextMove]] = 'active';

      commit('setBoard', board);
    } else {
      if (!movesLeft.length) dispatch('finishGame')
    }
  },
  makeMove({ commit, dispatch, state }, { cell, winner }) {
    let board = [...state.gameBoard]
    // console.log(board)
    if (board[cell] === 'active') {
      console.log(winner)
      board[cell] = winner
      commit('setBoard', board);
      dispatch('setActiveCell')
    }
  },

  setPlayer: ({ commit }, newName) => commit('setPlayer', newName),
  setDifficulty: ({ commit, dispatch }, newDifficulty) => {
    commit('setDifficulty', newDifficulty)
    dispatch('generateBoard')
  }
}
const getters = {
  get_playerName: state => state.playerName,
  get_gameDifficulty: state => state.gameDifficulty,
  get_gameSettings: state => state.gameSettings,
  get_gameBoard: state => state.gameBoard,
  get_delay: state => state.gameSettings[state.gameDifficulty].delay
}

const gameModule = {
  state,
  mutations,
  actions,
  getters
};

export default gameModule;
