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
                    <base-input name="password" v-model="user.password" placeholder="Contraseña" addon-left-icon="fa fa-lock"></base-input>
                </div>

                <div slot="footer">
                    <base-button native-type="submit" type="success" class="mb-3" size="lg" @click="login" block>Iniciar sesión</base-button>
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
        name: "login-page",
        layout: "auth",
        data() {
            return {
                user: {
                    email: "",
                    password: ""
                }
            };
        }
    }
</script>

<style>
    .navbar-nav .nav-item p {
        line-height: inherit;
        margin-left: 5px;
    }
</style>