//Estados donde se almacena la información que deseemos
export const state = () => ({
    auth: null,
    devices: []
});

//Para guardar información debemos convertirla en estados con MUTATIONS
export const mutations = {
    //Almacena la información de acceso del usuario como estados
    setAuth(state, incomingAuth) {
        state.auth = incomingAuth;
    },
    //Almacena la información de los dispositivos como estados
    setDevices(state, devices) {
        state.devices = devices;
    }
};

//Acciones para tomar decisiones
export const actions = {
    //Lee la información del usuario con su TOKEN de acceso y lo almacena en estado de STORE
    readToken() {
        let auth = null;
        try {
            auth = JSON.parse(localStorage.getItem("auth"));
        } catch (error) {
            console.log(error);
        }
        this.commit("setAuth", auth);
    },
    //Lista los dispositivos asociados al usuario y los almacena como estados en STORE
    getDevices() {
        const axiosHeader = {
            headers: {
                token: this.state.auth.token,
            },
        };
        this.$axios.get("/device", axiosHeader).then((res) => {
            console.log(res.data.data);
            this.commit("setDevices", res.data.data);
        });
    }
};