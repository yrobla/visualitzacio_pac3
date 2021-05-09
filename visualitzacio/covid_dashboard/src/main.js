// Import the dependencies and necessary modules
import Vue from 'vue';
import App from './App.vue';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import VueFusionCharts from 'vue-fusioncharts';
import VuePapaParse from 'vue-papa-parse'

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

// Instantiate the Vue instance that controls the application
new Vue({
 el: '#app',
 render: h => h(App)
})

