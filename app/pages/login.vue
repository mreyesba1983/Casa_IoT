<template>
    <div class="container login-page">
        <div class="col-lg-4 col-md-6 ml-auto mr-auto">
            <card class="card-login card-black">
                <template slot="header">
                    <img src="img//card-success.png" alt="" />
                    <h1 class="card-title">Proyectos IngNovaTech</h1>
                </template>

                <div>
                    <base-input name="email" v-model="user.email" placeholder="E-mail" addon-left-icon="fa fa-user"></base-input>
                    <base-input name="password" type="password" v-model="user.password" placeholder="Contraseña" addon-left-icon="fa fa-lock"></base-input>
                </div>

                <div slot="footer">
                    <base-button native-type="submit" type="success" class="mb-3" size="lg" @click="login()" block>Iniciar sesión</base-button>
                </div>

                <div class="pull-left">
                    <h6>
                        <nuxt-link class="link footer-link" to="/register">Registrarse</nuxt-link>
                    </h6>
                </div>

            </card>
        </div>
    </div>
</template>

<script>
    const Cookie = process.client ? require("js-cookie") : undefined;
    export default {
        middleware: 'notAuthenticated',
        name: "login-page",
        layout: "auth",
        data() {
            return {
                user: {
                    email: "",
                    password: ""
                }
            };
        },
        methods: {
            login() {
                this.$axios.post("/login", this.user).then(res => {
                    //Si el inicio de sesión es correcto, notificamos al usuario
                    if (res.data.status == "success") {
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "Bienvenido, " + res.data.userData.name
                        });
                        //Recuperamos el token de inicio de sesión y lo almacenamos en la constante AUTH
                        const auth = {
                            token: res.data.token,
                            userData: res.data.userData
                        };
                        //Guardamos el token en STORE de NUXT, almacena los estados de los datos que deseemos
                        this.$store.commit('setAuth', auth);
                        //Guardamos los datos en localstorage, para tener persistencia de datos
                        localStorage.setItem('auth', JSON.stringify(auth));
                        //Redirigimos a la pagina principal
                        $nuxt.$router.push('/dashboard');
                        return;
                    }
                }).catch(e => {
                    console.log(e.response.data);
                    if (e.response.data.error == "accessError") {
                        this.$notify({
                            type: "warning",
                            icon: "tim-icons icon-simple-remove",
                            message: "Credenciales de acceso incorrectas"
                        });
                    }
                    if (e.response.data.error == "notUser") {
                        this.$notify({
                            type: "danger",
                            icon: "tim-icons icon-alert-circle-exc",
                            message: "Acceso denegado"
                        });
                    }
                });
            }
        }
    }
</script>

<style>
    .navbar-nav .nav-item p {
        line-height: inherit;
        margin-left: 5px;
    }
</style>