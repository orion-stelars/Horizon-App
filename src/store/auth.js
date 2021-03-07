export default {
  state() {
    return {
      user: null
    };
  },
  mutations: {
    SET_USER(state, value) {
      state.user = value;
    }
  },
  actions: {
    setUser({ commit }, payload) {
      commit("SET_USER", payload);
      const localStorageData = payload ? JSON.stringify(payload) : null;
      localStorage.setItem("user", localStorageData);
      if (localStorageData) {
        localStorage.setItem("token", payload.token);
      } else localStorage.setItem("token", null);
    },
    logout({ commit }) {
      commit("SET_USER", null);
      localStorage.setItem("user", null);
      localStorage.setItem("token", null);
    }
  },
  namespaced: true
};
