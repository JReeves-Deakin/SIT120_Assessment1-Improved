import Vuex from "vuex";

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            data: null
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER_DATA(state, data) {
            state.user.data = data;
        }
    },
    actions: {
        loginUser({ commit }, user_data) {
            commit("SET_LOGGED_IN", true);
            commit("SET_USER_DATA", {
                email: user_data.email,
            })
        },
        logoutUser({ commit }) {
            commit("SET_LOGGED_IN", false);
            commit("SET_USER_DATA", null);
        }
    }
});