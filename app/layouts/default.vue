<template>

  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    
    <side-bar
      :background-color="sidebarBackground"
      short-title="IoT"
      title="Casa IoT"
    >
      <template slot-scope="props" slot="links">
        {{ props.length }}
        <sidebar-item
          :link="{
            name: 'Principal',
            icon: 'tim-icons icon-tablet-2',
            path: '/dashboard'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Dispositivos',
            icon: 'tim-icons icon-molecule-40',
            path: '/devices'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Alarmas',
            icon: 'tim-icons icon-time-alarm',
            path: '/alarms'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Plantillas',
            icon: 'tim-icons icon-notes',
            path: '/templates'
          }"
        >
        </sidebar-item>
        
      </template>
    </side-bar>
    <!--Share plugin (for demo purposes). You can remove it if don't plan on using it-->
    <sidebar-share :background-color.sync="sidebarBackground"> </sidebar-share>

    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !isFullScreenRoute }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';
  import SidebarShare from '@/components/Layout/SidebarSharePlugin';
  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
  import ContentFooter from '@/components/Layout/ContentFooter.vue';
  import DashboardContent from '@/components/Layout/Content.vue';
  import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';
  import mqtt from 'mqtt';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      SlideYDownTransition,
      ZoomCenterTransition,
      SidebarShare
    },
    data() {
      return {
        sidebarBackground: 'green', //vue|blue|orange|green|red|primary
        client: null
      };
    },
    computed: {
      isFullScreenRoute() {
        return this.$route.path === '/maps/full-screen'
      }
    },
    beforeDestroy() {
      this.$nuxt.$off('mqtt-sender');
    },
    methods: {
      //Función para crear un cliente MQTT que se va a conectar a EMQX desde el FRONTEND
      startMqttClient() {
        const options = {
          host: "localhost",
          port: 8083,
          endpoint: "/mqtt",
          //Si clean esta en true la sesión es limpia y no se guardan los mensajes en el broker
          clean: true,
          connectTimeout: 5000,
          reconnectPeriod: 5000,
          //Información de autenticación del cliente
          clientId: "web_" + this.$store.state.auth.userData.name + "_" + Math.floor(Math.random() * 1000000 + 1),
          username: "Usuario",
          password: "Usuario"
        };

        //Ejemplo de topico: "userId/dId/variableId/sdata"
        const deviceSubscribeTopic = this.$store.state.auth.userData._id + "/+/+/sdata";
        const notifSubscribeTopic = this.$store.state.auth.userData._id + "/+/+/notif";
        
        //Dirección URL para conectar al cliente con EMQX
        const connectUrl = "ws://" + options.host + ":" + options.port + options.endpoint;
        
        try {
          this.client = mqtt.connect(connectUrl, options);  
        } catch (error) {
          console.log(error);
        }
//FUNCIONES DE CONEXIÓN, RECONEXIÓN Y ERROR AL ESTABLECER LA COMUNICACIÓN MQTT
        //Revisamos si la conexión fue exitosa
        this.client.on('connect', () => {
            console.log("CONEXIÓN MQTT -> Exitosa!!!");
            console.log("\n");
            //Realizamos la conexión a todos los dispositivos del cliente
            this.client.subscribe(deviceSubscribeTopic, {qos:0}, (err) => {
              if (err) {
                console.log("Error al conectarse a los dispositivos");
                return;
              }
              console.log("Conexión a dispositivos exitosa!");
              console.log(deviceSubscribeTopic);
            });
            //Realizamos la conexión a todas las notificaciones que genere EMQX
            this.client.subscribe(notifSubscribeTopic, {qos:0}, (err) => {
              if (err) {
                console.log("Error al conectarse a las notificaciones");
                return;
              }
              console.log("Conexión a notificaciones exitosa!");
              console.log(notifSubscribeTopic);
            });
        });
        //Si la conexión falla, repetimos la conexión
        this.client.on('reconnect', (error) => {
            console.log("Reconectando a MQTT");
            console.log(error);
        });
        //Si se presenta un error en la comunicación MQTT
        this.client.on('error', (error) => {
            console.log("MQTT conexión ->  FALLO :(");
            console.log(error);
        });
//FUNCIONES PARA RECIBIR Y ENVIAR MENSAJES MQTT        
        //Si se recibe un mensaje por MQTT ya sea de un dato o de una notificación
        this.client.on('message', (topic, message) => {
          console.log("Mensaje del dispositivo: " + topic + " -> ");
          console.log(message.toString());

          try {
            const splittedTopic = topic.split("/");
            const msgType = splittedTopic[3];

            if (msgType == "sdata") {
              $nuxt.$emit(topic, JSON.parse(message.toString()));
              return;
            } else if (msgType == "notif") {
              this.$notify({
                type: 'danger',
                icon: 'tim-icons icon-alert-circle-exc',
                message: message.toString()
              });
              this.$store.dispatch("getNotifications");
              return;
            } else {

            }
          } catch (error) {
            console.log(error);
          }
        });
        //Función para enviar mensajes por MQTT a EMQX desde el FRONTEND
        $nuxt.$on('mqtt-sender', (toSend) => {
          this.client.publish(toSend.topic, JSON.stringify(toSend.msg));
        });
      },
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      initScrollbar() {
        let docClasses = document.body.classList;
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          // if we are on windows OS we activate the perfectScrollbar function
          initScrollbar('sidebar');
          initScrollbar('main-panel');
          initScrollbar('sidebar-wrapper');

          docClasses.add('perfect-scrollbar-on');
        } else {
          docClasses.add('perfect-scrollbar-off');
        }
      }
    },
    mounted() {
      this.initScrollbar();
      this.startMqttClient();
      this.$store.dispatch("getNotifications");
    }
  };
</script>
<style lang="scss">
  $scaleSize: 0.95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>
