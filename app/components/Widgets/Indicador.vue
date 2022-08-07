<template>
    <card>
        <div slot="header">
            <h4 class="card-title">{{config.selectedDevice.name}} - {{config.variableFullName}}</h4>
        </div>

        <i class="fa " :class="[config.icon]"></i>
    </card>
</template>

<script>
    export default {
        //props:['config'],
        data() {
            return {
                config: {
                    userId: "userid",
                    selectedDevice: {
                        name: "Home",
                        dId: "1234",
                        templateName: "Sensores",
                        templateId: "1234567890abcdef",
                        saverRule: "false"
                    },
                    variableFullName: "Temperatura",
                    variable:"1234Temperatura",
                    icon: "fa-sun",
                    column: 'col-6',
                    widget: 'indicator',
                    class: 'danger'
                }
            }
        }
    }
</script>