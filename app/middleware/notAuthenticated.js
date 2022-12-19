//Si el usuario tiene TOKEN debe ser dirigido a la pagina DASHBOARD para que inicie sesión
export default function ({ store, direct }) {
  //Llama a la acción de readToken para saber si existe el token
  store.dispatch("readToken");
  //Si no hay TOKEN redireccionamos a la página DASHBOARD
  if (store.state.auth) {
    return $nuxt.$router.push("/dashboard");
  }
}
