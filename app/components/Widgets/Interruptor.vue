<template>
    <card>
        <div slot="header">
            <h4 class="card-title">{{config.selectedDevice.name}} - {{config.variableFullName}}</h4>
        </div>
        <i class="fa " :class="[config.icon, getIconColorClass()]" style="font-size: 30px"></i>
        <base-switch @click="value=!value; sendValue()" :value="value" type="config.class" on-text="ON" off-text="OFF" style="margin_top: 10px" class="pull-right" size="lg"></base-switch>
    </card>
</template>

<script>
    export default {
        props:['config'],
        data() {
            return {
                value: false
            };
        },
        watch: {
            config: {
                immediate:true,
                deep: true,
                handler() {}
            }
        },
        methods: {
            getIconColorClass() {
                if (!this.value) {
                    return "text-dark";
                }
                if (this.config.class == "danger") {
                    return "text-danger";
                }
                if (this.config.class == "warning") {
                    return "text-warning";
                }
                if (this.config.class == "primary") {
                    return "text-primary";
                }
                if (this.config.class == "success") {
                    return "text-success";
                }
            },
            sendValue() {
                const toSend = {
                    topic: this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/actdata",
                    msg: {
                        value: this.value
                    }
                }
            }
        }      
    }
</script>