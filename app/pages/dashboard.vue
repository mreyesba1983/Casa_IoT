<template>
    <div class="row" v-if="$store.state.devices.length > 0">
        <div v-for="(widget, index) in $store.state.selectedDevice.template.widgets" :key="index" :class="[widget.column]">
<!--SE PUEDE ELIMINAR-->
            <json :value="fixWidget(widget)"></json>
            <RTchart v-if="widget.widget == 'chart'" :config="fixWidget(widget)"></RTchart>
            <Interruptor v-if="widget.widget == 'switch'" :config="fixWidget(widget)"></Interruptor>
            <Boton v-if="widget.widget == 'button'" :config="fixWidget(widget)"></Boton>
            <Indicador v-if="widget.widget == 'indicator'" :config="fixWidget(widget)"></Indicador>
        </div>
    </div>
</template>

<script>
    import Json from '../components/Json.vue';
    export default {
        components: { Json },
        middleware: 'authenticated',
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {
            fixWidget(widget) {
                //Creamos una copia no referencial para evitar comportamientos no deseados
                var widgetCopy = JSON.parse(JSON.stringify(widget));
                widgetCopy.selectedDevice.dId = this.$store.state.selectedDevice.dId;
                widgetCopy.selectedDevice.name = this.$store.state.selectedDevice.name;
                widgetCopy.userId = this.$store.state.selectedDevice.userId;
                return widgetCopy;
            }
        }
    }
</script>