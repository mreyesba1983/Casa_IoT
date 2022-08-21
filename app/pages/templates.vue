<template>
    <div class="row">
        <div class="col-4">
            <Indicador :config="configIndicator"></Indicador>
        </div>
        <div class="col-4">
            <Boton :config="configButton"></Boton>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: false,
                configIndicator: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable:"Var1",
                    icon: "fa-circle",
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                },
                configButton: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable:"Var1",
                    icon: "fa-paper-plane",
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger',
                    message: "{'fanstatus': 'stop'}"
                }
            }
        },
        methods: {
            sendData() {
                this.value = !this.value;
                const toSend = {
                    value: this.value
                }
                this.$nuxt.$emit("userid/1234/Var1/sdata", toSend);
            }
        }
    }
</script>
