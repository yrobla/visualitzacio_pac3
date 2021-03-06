import Vue from 'vue'
import App from './App.vue'
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import VueFusionCharts from 'vue-fusioncharts';
import VuePapaParse from 'vue-papa-parse'

Vue.config.productionTip = false

// Resolve the dependencies
Charts(FusionCharts);
PowerCharts(FusionCharts);
Widgets(FusionCharts);
FusionTheme(FusionCharts);

// filter
var numeral = require("numeral");
Vue.filter("formatNumber", function(value) {
        return numeral(value).format("0,0");
});

Vue.filter("formatTpc", function(value) {
        return numeral(value).format("0.00");
});

// Globally register the components for project-wide use
Vue.use(VueFusionCharts, FusionCharts);
Vue.use(VuePapaParse);

new Vue({
  render: h => h(App),
}).$mount('#app')
