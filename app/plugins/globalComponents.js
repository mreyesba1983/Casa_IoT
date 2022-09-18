import Vue from 'vue'
import BaseInput from '@/components/Inputs/BaseInput.vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import Card from '@/components/Cards/Card.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseCheckbox from '@/components/Inputs/BaseCheckbox.vue';
import { Input, InputNumber, Tooltip, Popover } from 'element-ui';
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */
import Indicador from '/components/Widgets/Indicador.vue';
import Boton from '/components/Widgets/Boton.vue';
import Interruptor from '/components/Widgets/Interruptor.vue';
import RTchart from '/components/Widgets/RTchart.vue';
import ElementUI from '/node_modules/element-ui';


Vue.component(BaseInput.name, BaseInput);
Vue.component(BaseDropdown.name, BaseDropdown);
Vue.component(Card.name, Card);
Vue.component(BaseCheckbox.name, BaseCheckbox);
Vue.component(BaseButton.name, BaseButton);
Vue.component(Input.name, Input);
Vue.component(InputNumber.name, InputNumber);
Vue.use(Tooltip);
Vue.use(Popover);
Vue.use(ElementUI);
Vue.component(Indicador.name, Indicador);
Vue.component(Boton.name, Boton);
Vue.component(Interruptor.name, Interruptor);
Vue.component(RTchart.name, RTchart);