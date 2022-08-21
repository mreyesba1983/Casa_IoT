<template>
    <card>
        <div slot="header">
            <h4 class="card-title">{{config.selectedDevice.name}} - {{config.variableFullName}}</h4>
        </div>
        <div class="row">
            <div class="col-4">
                <i class="fa " :class="[config.icon, getIconColorClass()]" style="font-size: 60px"></i>
            </div>
            <div class="col-8">
                <base-button @click="sendValue" :type="config.class" class="mb-3 pull-right" size="lg">ADD</base-button>
            </div>
        </div>
        

        
    </card>
</template>

<script>
import BaseButton from '../BaseButton.vue';
    export default {
  components: { BaseButton },
        props: ['config'],
        data() {
            return {
                sending: false
            };
        },
        mounted() {

            },
        methods: {
            sendValue() {
                this.sending = true;
                setTimeout(() => {
                    this.sending = false;
                }, 500);

                const toSend = {
                    topic: this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/actdata",
                    msg: {
                        value: this.config.message
                    }
                };
                console.log(toSend);
                this.$nuxt.$emit('mqtt-sender', toSend);
            },
            getIconColorClass() {
                if (!this.sending) {
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
            }
        }
    }
</script>