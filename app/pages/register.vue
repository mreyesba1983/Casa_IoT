<template>
    <div class="container login-page">
        <div class="col-lg-4 col-md-6 ml-auto mr-auto">
            <card class="card-login card-black">
                <template slot="header">
                    <img src="img//card-warning.png" alt="" />
                    <h1 class="card-title">Proyectos IngNovaTech</h1>
                </template>
                <div>
                    <base-input name="name" v-model="user.name" placeholder="Nombres" addon-left-icon="fa fa-user"></base-input>
                    <base-input name="lastname" v-model="user.lastname" placeholder="Apellidos" addon-left-icon="fa fa-user-circle"></base-input>
                    <base-input name="email" v-model="user.email" placeholder="E-mail" addon-left-icon="fa fa-envelope"></base-input>
                    <base-input name="password" v-model="user.password" placeholder="Contraseña" addon-left-icon="fa fa-lock"></base-input>
                </div>
                <div slot="footer">
                    <base-button native-type="submit" type="warning" class="mb-3" size="lg" @click="register" block>Registrar usuario</base-button>
                </div>
                <div class="pull-right">
                    <h6>
                        <nuxt-link class="link footer-link" to="/login">Iniciar sesión</nuxt-link>
                    </h6>
                </div>
            </card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "register",
        layout: "auth",
        data() {
            return {
                user: {
                    name: "",
                    lastname: "",
                    email: "",
                    password: ""
                }                
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