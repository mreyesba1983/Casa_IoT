//Estados donde se almacena la información que deseemos
export const state = () => ({
    auth: null,
    devices: []
});

//Para guardar información debemos convertirla en estados con MUTATIONS
export const mutations = {
    setAuth(state, incomingAuth) {
        state.auth = incomingAuth;
    }
};

//Acciones para tomar decisiones
export const actions = {
    readToken() {
        let auth = null;
        try {
            auth = JSON.parse(localStorage.getItem("auth"));
        } catch (error) {
            console.log(error);
        }
        this.commit('setAuth', auth);
    }
};