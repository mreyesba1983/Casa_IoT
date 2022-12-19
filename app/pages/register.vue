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
                    <base-input name="password" type="password" v-model="user.password" placeholder="Contraseña" addon-left-icon="fa fa-lock"></base-input>
                </div>
                <div slot="footer">
                    <base-button native-type="submit" type="warning" class="mb-3" size="lg" @click="register()" block>Registrar usuario</base-button>
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
        middleware: 'notAuthenticated',
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
        },
        methods: {
            register() {
                this.$axios.post("/register", this.user).then(res => {
                    console.log(res.data);
                    //Si el usuario fue creado correctamente, notificamos al usuario
                    if (res.data.status == "Success") {
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "Usuario registrado correctamente!!!"
                        });
                        //Se limpia el formulario
                        this.user.name = "";
                        this.user.lastname = "";
                        this.user.email = "";
                        this.user.password = "";
                        return;
                    }
                })
                .catch(e => {
                    console.log(e.response.data);
                    //Si el usuario existe se muestra un mensaje indicando que ya existe el usuario
                    if (e.response.data.error.errors.email.kind == "unique") {
                        this.$notify({
                            type: "danger",
                            icon: "tim-icons icon-alert-circle-exc",
                            message: "El usuario ya existe!!!"
                        });
                        return;
                    }
                    //Si se presenta un error creando el usuario se muestra un mensaje
                    else {
                        this.$notify({
                            type: "danger",
                            icon: "tim-icons icon-alert-circle-exc",
                            message: "Error al crear el usuario..."
                        });
                        return;
                    }
                })
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