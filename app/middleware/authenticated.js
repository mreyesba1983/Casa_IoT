//Si el usuario no tiene TOKEN debe ser dirigido a la pagina LOGIN para que inicie sesión
export default function ({ store, direct }) {
    //Llama a la acción de readToken para saber si existe el token
    store.dispatch("readToken");
    //Si no hay TOKEN redireccionamos a la página LOGIN
    if (!store.state.auth) {
        return $nuxt.$router.push("/login");
    }
}