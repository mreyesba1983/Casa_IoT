<template>
    <div class="row">
        <div class="col-4">
            <Indicador :config="config1"></Indicador>
        </div>
        <div class="col-4">
            <Indicador :config="config2"></Indicador>
        </div>
        <div class="col-4">
            <Indicador :config="config3"></Indicador>
        </div>
        
        <button @click="sendData()">SEND</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: false,
                config1: {
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
                config2: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Humedad",
                    variable:"Var2",
                    icon: "fa-circle",
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                },
                config3: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Velocidad",
                    variable:"Var3",
                    icon: "fa-circle",
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
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
