

<template>

<div id="ancestor">
    <div class="container-fluid" id="app">
        <div class="row">
            <div id="sidebar" class="col-md-3 col-sm-4 col-xs-12 sidebar">
                <div id="info">
                    <div class="wrapper-left">
                        <div id="total-cases-wrapper" class="bigger"><b>{{ data.totalCases | formatNumber }}</b> <span class="big">casos</span></div>
                        <div class="temp-max-min">
                            <div class="max-desc">
                                <div id="max-detail">
                                    <span id="trend-up" v-if="data.trend == 'up' ">&#9650;&nbsp;</span>
                                    <span id="trend-down" v-if="data.trend == 'down' ">&#9660;&nbsp;</span>
                                    <span class="big">{{ data.totalTrend | formatTpc}}%</span> </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="wrapper-right" class="selector-radio">
                    <label class="radiogroup">
                        <input type="radio" id="radio-total" name="periodSelector" value="all" v-model="periodSelector" @change="periodSelectorChanged">
                        <label for="radio-total">Total</label>
                    </label>
                    <label class="radiogroup">
                        <input type="radio" id="radio-30" name="periodSelector" value="30" v-model="periodSelector" @change="periodSelectorChanged">
                        <label for="radio-30">Darrers 30 dies</label>
                    </label>
                    <label class="radiogroup">
                        <input type="radio" id="radio-7" name="periodSelector" value="7" v-model="periodSelector" @change="periodSelectorChanged">
                        <label for="radio-7">Darrers 7 dies</label>
                    </label>
                    <label class="radiogroup">
                        <input type="radio" id="radio-1" name="periodSelector" value="1" v-model="periodSelector" @change="periodSelectorChanged">
                        <label for="radio-1">Darrer dia</label>
                    </label>
                </div>
                <div id="wrapper-bars">
                  <h2>Per regions sanitàries</h2>
                  <fusioncharts type="bar2d" width="100%" height="250" dataformat="json" :datasource="regionBarChartData">
                  </fusioncharts>

                  <h2>Per edat</h2>
                  <fusioncharts type="bar2d" width="100%" height="250" dataformat="json" :datasource="ageBarChartData">
                  </fusioncharts>

                </div>
            </div>
                  <div id="main_app">

                    <div class="filters-box">
                      <p><button v-on:click="resetFilters">Esborrar filtres</button></p>
                      <div class="selector-check">

                        <h2>Filtre per regions sanitàries</h2>
                        <button v-on:click="selectAllRegions">Totes les regions</button>

                          <li v-for="region in data.regions">
                            <input type="checkbox" :id="region" :value="region" v-model="selectedRegions"  @change="regionsChanged">
                            <label :for="region">{{ region}}</label>
                          </li>
                        </ul>
                      </div>
                      <div class="selector-check">
                        <h2>Filtre per edat</h2>
                        <button v-on:click="selectAllAges">Totes les edats</button>

                        <li v-for="age in data.ages">
                          <input type="checkbox" :id="age" :value="age" v-model="selectedAges"  @change="agesChanged">
                          <label :for="age">{{ age}}</label>
                        </li>

                      </div>

                    </div>
                    <div id="chart-container">
                      <button v-on:click="resetTimeFilter" v-show="selectedRange != ''">&lt;&lt;&nbsp;Tornar</button>
                    <fusioncharts type="msline" width="100%" height="80%" dataformat="json" :datasource="lineChartData" :events="lineChartEvents">
                    </fusioncharts></div>
                  </div>
              </div>
        </div>
        <div class="site-footer">
          <span>&copy; Yolanda Robla 2021</span>
          <p>Dades proporcionades per: <a href="http://governobert.gencat.cat/ca/dades_obertes/dades-obertes-covid-19/" target="_blank">Departament de Salut - Generalitat de Catalunya</a>
          </p></div>
        </div>

    </div>
</div>

</div>

</template>

<script>

export default {
    name: 'app',
    props: [],
    data() {
      var self=this;
        return {
            cleanedCovidData: '', // the processed csv file
            periodSelector: "all",
            selectedRegions: [],
            selectedAges: [],
            selectedRange: "",
            data: {
                currentPeriod: "",
                totalCases: 0,
                trend: "",
                totalTrend: "",
                trendTranslated: "",
                trendInterval: "",
                regions: [],
                ages: []
            },
            lineChartData: {
                chart: {
                    caption: "Evolució del Covid a Catalunya",
                    baseFont: "Roboto",
                    chartTopMargin: "0",
                    showHoverEffect: "1",
                    theme: "fusion",
                    showaxislines: "1",
                    numberSuffix: " casos",
                    drawCrossLine: "1",
                    formatNumberScale: "0",
                    showAxisLines: "0",
                    showYAxisValues: "0",
                    anchorRadius: "4",
                    divLineAlpha: "0",
                    labelFontSize: "13",
                    labelAlpha: "65",
                    labelFontBold: "0",
                    rotateLabels: "0",
                    slantLabels: "0",
                    canvasPadding: "20",
                    baseFontSize: "12",
                    captionFontSize:"25",
                    captionFontColor: "#5499c7",
                    chartTopMargin: "30",
                },
                categories: [],
                dataset: []
            },
            lineChartEvents: {
              dataPlotClick: function(e) {
                if (self.selectedRange == "") {
                  self.selectedRange = e.data.categoryLabel;
                  self.setLineChartDataMonth();
                }
              }
            },
            regionBarChartData: {
                chart: {
                  baseFont: "Roboto",
                  showHoverEffect: "1",
                  theme: "fusion",
                  numberSuffix: " casos",
                  bgColor: "#5499c7",
                  canvasBgColor: "#5499c7",
                  paletteColors: "#ffffff",
                  plotToolText: "$dataValue",
                  showAxisLines: "0",
                  showYAxisValues: "0",
                  divLineAlpha: "0",
                  labelFontSize: "12",
                  labelFontColor: "#ffffff",
                  labelBinSize: "0",
                  formatNumberScale: "0",
                  minLabelWidthPercent: "45",
                },
                data: {}
            },
            ageBarChartData: {
                chart: {
                    baseFont: "Roboto",
                    showHoverEffect: "1",
                    theme: "fusion",
                    numberSuffix: " casos",
                    bgColor: "#5499c7",
                    canvasBgColor: "#5499c7",
                    paletteColors: "#ffffff",
                    plotToolText: "$dataValue",
                    showAxisLines: "0",
                    showYAxisValues: "0",
                    divLineAlpha: "0",
                    labelFontSize: "12",
                    labelFontColor: "#ffffff",
                    labelBinSize: "0",
                    formatNumberScale: "0",

                },
                data: {}
            }

        };
    },
    methods: {
        cleanData: function(rawCovidData) {
            // parsejarem la data correctament
            var cleanedData;
            var regions = [];
            var ages = [];
            cleanedData = rawCovidData.map(element => {
                if (element.TipusCasData && Number(element.Total) > 0) {
                  // aprofitem per treue els valors de regions i edats
                  if (!regions.includes(element.RegioSanitariaDescripcio)) {
                    regions.push(element.RegioSanitariaDescripcio);
                  }
                  if (!ages.includes(element.EdatRang)) {
                    ages.push(element.EdatRang);
                  }

                    return {
                        EdatRang: String(element.EdatRang),
                        NumCasos: Number(element.Total),
                        RegioSanitaria: String(element.RegioSanitariaDescripcio),
                        TipusCasData: new Date(element.TipusCasData)
                    }
                }
            });
            cleanedData.pop();
            this.cleanedCovidData = cleanedData;
            this.data.regions = regions.sort();
            this.data.ages = ages.sort();

            this.organizeSummaryInfo();
            this.setLineChartData();
        },

        fetchCovidData: async function() {
            let papa = this.$papa;
            return new Promise(function(complete) {
                papa.parse('./data/covid_data.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    delimiter: ",",
                    complete
                });
            });
        },

        periodSelectorChanged(event) {
            this.periodSelector = event.target.value;
            this.organizeSummaryInfo();
        },

        regionsChanged(event) {
          this.selectedAges = [];

          if (this.selectedRange != "") {
            this.setLineChartDataMonth();
          }
          else {
            this.setLineChartData();
          }
        },

        agesChanged(event) {
          this.selectedRegions = [];
          if (this.selectedRange != "")
            this.setLineChartDataMonth();
          else
            this.setLineChartData();
        },

        resetFilters(event) {
          this.selectedAges = [];
          this.selectedRegions = [];
          this.selectedRange = "";
          this.setLineChartData();
        },
        resetTimeFilter(event) {
          this.selectedRange = "";
          this.setLineChartData();
        },
        selectAllRegions(event) {
          this.selectedAges = [];
          this.selectedRegions = this.data.regions;
          if (this.selectedRange != "")
            this.setLineChartDataMonth();
          else
            this.setLineChartData();
        },
        selectAllAges(event) {
          this.selectedRegions = [];
          this.selectedAges = this.data.ages;
          if (this.selectedRange != "")
            this.setLineChartDataMonth();
          else
            this.setLineChartData();
        },
        setLineChartDataMonth() {
          current_month = this.selectedRange;
            var lineData = [];

            var covid_data = this.cleanedCovidData;
            var line_data = [];

            // treiem el mes i l'any de la label
            var filter_month = Number(current_month.split("/")[0]);
            var filter_year = Number(current_month.split("/")[1]);

              // veiem si hi ha agrupacio per categories
              var group_criteria = "";
              var datasets = {};
              var current_values = {};
              if (this.selectedAges.length>0) {
                group_criteria = "age";

                // el dataset es per cada edat
                for (var i=0;i<this.selectedAges.length;i++) {
                  datasets[this.selectedAges[i]] = [];
                  current_values[this.selectedAges[i]] = 0;
                }
              }
              else if (this.selectedRegions.length >0) {
                group_criteria = "region";

                // el dataset es per cada regio
                for (var i=0;i<this.selectedRegions.length;i++) {
                  datasets[this.selectedRegions[i]] = [];
                  current_values[this.selectedRegions[i]] = 0;
                }
              }
              else {
                // dataset unic
                datasets["Total"] = [];
                current_values["Total"] = 0;
              }
              // agrupem per dies
              var categories = [];
              var values = [];

              var current_month = covid_data[0].TipusCasData.getUTCMonth()+1;
              var current_year = covid_data[0].TipusCasData.getUTCFullYear();
              var current_day = covid_data[0].TipusCasData.getDate();
              var current_value = covid_data[0].NumCasos;

              // el valor actual del criteri
              if (current_month == filter_month && current_year == filter_year) {
                if (group_criteria == "age") {
                  current_values[covid_data[0].EdatRang] = current_value;
                }
                else if (group_criteria == "region") {
                  current_values[covid_data[0].RegioSanitaria] = current_value;
                } else {
                  current_values["Total"] = current_value;
                }
              }

              for (var i=1;i<covid_data.length;i++) {
                  var data_month = covid_data[i].TipusCasData.getUTCMonth()+1;
                  var data_year = covid_data[i].TipusCasData.getUTCFullYear();
                  var data_day = covid_data[i].TipusCasData.getDate();

                  if (data_month == filter_month && data_year == filter_year) {
                    if ((data_month != current_month || data_year != current_year || data_day != current_day) && current_month==filter_month && current_year==filter_year) {
                      categories.push({"label": current_day+"/"+current_month});

                      if (group_criteria == "") {
                        datasets["Total"].push({"value": current_values["Total"]});
                        current_values["Total"] = 0;
                      } else {
                        // volquem tots els valors al dataset i inicialitzem a zero
                        for (const [key, value] of Object.entries(datasets)) {
                          datasets[key].push({"value": current_values[key]});
                          current_values[key] = 0;
                        };
                      }
                      current_month = data_month;
                      current_year = data_year;
                      current_day = data_day;
                    } else
                    {
                      current_month = data_month;
                      current_year = data_year;
                      current_day = data_day;

                      // el valor s'imputa a cada dataset
                      if (group_criteria == "") {
                        current_values["Total"] += Number(covid_data[i].NumCasos);
                      } else if (group_criteria == "age") {
                        current_values[covid_data[i].EdatRang] += Number(covid_data[i].NumCasos);
                      }
                      else if (group_criteria == "region") {
                        current_values[covid_data[i].RegioSanitaria] += Number(covid_data[i].NumCasos);
                      }
                    }
                  }
                  if (current_month > filter_month && current_year > filter_year) break;
              }

              // hem d'imputar el darrer bloc
              if (current_month == filter_month && current_year == filter_year) {
                categories.push({"label": current_day+"/"+current_month});

                if (group_criteria == "") {
                  datasets["Total"].push({"value": current_values["Total"]});
                  current_values["Total"] = 0;
                } else {
                  // volquem tots els valors al dataset i inicialitzem a zero
                  for (const [key, value] of Object.entries(datasets)) {
                    datasets[key].push({"value": current_values[key]});
                    current_values[key] = 0;
                  };
                }
              }

              // carreguem categories
              this.lineChartData.categories = [{category: categories}];

              if (group_criteria == "") {
                this.lineChartData.dataset = [{seriesname: "Total", data: datasets["Total"]}];
              } else {
                // mapejem per dataset
                this.lineChartData.dataset = [];
                for (const [key, value] of Object.entries(datasets)) {
                  this.lineChartData.dataset.push({
                    "seriesname": key,
                    "data": datasets[key]
                  });
                }
              }

        },
        organizeSummaryInfo: function() {
            // calculem les dades segons el periodSelector
            switch (this.periodSelector) {
                case "all":
                case "":
                    this.data.currentPeriod = "";
                    this.data.trendInterval = "als darrers 90 dies";
                    break;
                case "30":
                    this.data.currentPeriod = this.data.trendInterval = "als darrers 30 dies";
                    break;
                case "7":
                    this.data.currentPeriod = this.data.trendInterval = "als darrers 7 dies";
                    break;
                case "1":
                    this.data.currentPeriod = "al darrer dia";
                    this.data.trendInterval = "darrers 2 dies";
                    break;
            }

            // fem recompte del total
            this.calculatePeriodSummary(this.periodSelector, this.cleanedCovidData);
            this.fillBarChartData(this.periodSelector, this.cleanedCovidData);
        },

        calculatePeriodSummary: function(current_period, covid_data) {
            var total_cases, max_date, trend_period;
            total_cases = 0;
            max_date = covid_data[covid_data.length - 1].TipusCasData;

            switch (current_period) {
                case "all":
                case "":
                    // totes les dades
                    for (var i = 0; i < covid_data.length; i++) {
                        if (covid_data[i]) {
                            total_cases = total_cases + covid_data[i].NumCasos;
                        }
                    }
                    trend_period = 90;
                    break;

                case "30":
                case "7":
                case "1":
                    var start_date = new Date();
                    start_date.setDate(max_date.getDate() - Number(current_period));
                    for (var i = 0; i < covid_data.length; i++) {
                        if (covid_data[i] && covid_data[i].TipusCasData >= start_date) {
                            total_cases = total_cases + covid_data[i].NumCasos;
                        }
                    }
                    trend_period = Number(current_period);
                    break;
            }

            this.data.totalCases = total_cases;

            // tendencia
            var interval_1 = new Date();
            interval_1.setDate(max_date.getDate() - (trend_period * 2));
            var interval_2 = new Date();
            interval_2.setDate(max_date.getDate() - (trend_period));

            var cases_1 = 0;
            var cases_2 = 0;
            for (var i = 0; i < covid_data.length; i++) {
                if (covid_data[i] && covid_data[i].TipusCasData >= interval_1 && covid_data[i].TipusCasData < interval_2) {
                    cases_1 = cases_1 + covid_data[i].NumCasos;
                }
                if (covid_data[i] && covid_data[i].TipusCasData >= interval_2) {
                    cases_2 = cases_2 + covid_data[i].NumCasos;
                }
            }
            if (cases_2 > cases_1) {
                this.data.trend = "up";
                this.data.trendTranslated = "més"
            } else {
                this.data.trend = "down";
                this.data.trendTranslated = "menys";
            }
            this.data.totalTrend = Math.abs((cases_2 - cases_1) / cases_1) * 100
        },

        fillBarChartData: function(current_period, covid_data) {
            var total_cases, max_date, trend_period;
            total_cases = 0;
            max_date = covid_data[covid_data.length - 1].TipusCasData;

            if (current_period != "" && current_period !="all") {
              var start_date = new Date();
              start_date.setDate(max_date.getDate() - Number(current_period));
            }

            var grouped_regions = {};
            var grouped_age = {};
            var total_casos = 0;
            var region = "";
            var age = "";

            for (var i = 0; i < covid_data.length; i++) {
              if ((current_period != "" && current_period!="all" && covid_data[i].TipusCasData>=start_date) || current_period=="" || current_period=="all" ) {
                  total_casos = covid_data[i].NumCasos;
                  region = covid_data[i].RegioSanitaria;
                  age = covid_data[i].EdatRang;

                  // dades per regio
                  if (region in grouped_regions) {
                    grouped_regions[region] += total_casos;
                  } else {
                    grouped_regions[region] = total_casos;
                  }

                  // dades per edat
                  if (age in grouped_age) {
                    grouped_age[age] += total_casos;
                  } else {
                    grouped_age[age] = total_casos;
                  }
              }
            }

            // ordenem les regions de més a menys casos
            var llista_regions = Object.keys(grouped_regions).map(function(key) { return [key,grouped_regions[key]];});
            llista_regions.sort(function (first, second) { return second[1]-first[1];});
            var final_regions = [];
            for (var i=0;i<llista_regions.length;i++) {
                final_regions.push({"label":llista_regions[i][0], "value": llista_regions[i][1]});
            }
            this.regionBarChartData.data=final_regions;

            // i ordenem les edats per clau
            var claus = Object.keys(grouped_age).sort();
            var llista_edats = [];
            for (var i=0;i<claus.length;i++) {
              llista_edats.push({"label": claus[i], "value": grouped_age[claus[i]]});
            }
            this.ageBarChartData.data = llista_edats;
        },

        setLineChartData: function() {
            var lineData = [];

            var current_period = this.periodSelector;
            var covid_data = this.cleanedCovidData;
            var line_data = [];

              // veiem si hi ha agrupacio per categories
              var group_criteria = "";
              var datasets = {};
              var current_values = {};
              if (this.selectedAges.length>0) {
                group_criteria = "age";

                // el dataset es per cada edat
                for (var i=0;i<this.selectedAges.length;i++) {
                  datasets[this.selectedAges[i]] = [];
                  current_values[this.selectedAges[i]] = 0;
                }
              }
              else if (this.selectedRegions.length >0) {
                group_criteria = "region";

                // el dataset es per cada regio
                for (var i=0;i<this.selectedRegions.length;i++) {
                  datasets[this.selectedRegions[i]] = [];
                  current_values[this.selectedRegions[i]] = 0;
                }
              }
              else {
                // dataset unic
                datasets["Total"] = [];
                current_values["Total"] = 0;
              }
              // agrupem per mesos
              var categories = [];
              var values = [];

              var current_month = covid_data[0].TipusCasData.getUTCMonth()+1;
              var current_year = covid_data[0].TipusCasData.getUTCFullYear();
              var current_value = covid_data[0].NumCasos;

              // el valor actual del criteri
              if (group_criteria == "age") {
                current_values[covid_data[0].EdatRang] = current_value;
              }
              else if (group_criteria == "region") {
                current_values[covid_data[0].RegioSanitaria] = current_value;
              } else {
                current_values["Total"] = current_value;
              }

              for (var i=1;i<covid_data.length;i++) {
                  var data_month = covid_data[i].TipusCasData.getUTCMonth()+1;
                  var data_year = covid_data[i].TipusCasData.getUTCFullYear();

                  if (data_month != current_month || data_year != current_year) {
                    categories.push({"label": current_month+"/"+current_year});

                    if (group_criteria == "") {
                      datasets["Total"].push({"value": current_values["Total"]});
                      current_values["Total"] = 0;
                    } else {
                      // volquem tots els valors al dataset i inicialitzem a zero
                      for (const [key, value] of Object.entries(datasets)) {
                        datasets[key].push({"value": current_values[key]});
                        current_values[key] = 0;
                      };
                    }
                    current_month = data_month;
                    current_year = data_year;
                  } else
                  {
                    current_month = data_month;
                    current_year = data_year;

                    // el valor s'imputa a cada dataset
                    if (group_criteria == "") {
                      current_values["Total"] += Number(covid_data[i].NumCasos);
                    } else if (group_criteria == "age") {
                      current_values[covid_data[i].EdatRang] += Number(covid_data[i].NumCasos);
                    }
                    else if (group_criteria == "region") {
                      current_values[covid_data[i].RegioSanitaria] += Number(covid_data[i].NumCasos);
                    }
                  }
              }
              // hem d'imputar el darrer bloc
              categories.push({"label": current_month+"/"+current_year});

              if (group_criteria == "") {
                datasets["Total"].push({"value": current_values["Total"]});
                current_values["Total"] = 0;
              } else {
                // volquem tots els valors al dataset i inicialitzem a zero
                for (const [key, value] of Object.entries(datasets)) {
                  datasets[key].push({"value": current_values[key]});
                  current_values[key] = 0;
                };
              }

              // carreguem categories
              this.lineChartData.categories = [{category: categories}];

              if (group_criteria == "") {
                this.lineChartData.dataset = [{seriesname: "Total", data: datasets["Total"]}];
              } else {
                // mapejem per dataset
                this.lineChartData.dataset = [];
                for (const [key, value] of Object.entries(datasets)) {
                  this.lineChartData.dataset.push({
                    "seriesname": key,
                    "data": datasets[key]
                  });
                }
              }

        },

        organizeAllDetails: async function() {
            // top level organization
            var covid_data;

            covid_data = await this.fetchCovidData();
            this.cleanData(covid_data.data);
        }
    },
    mounted: async function() {
        this.periodSelector = "all";
        this.selectedRange = "";
        await this.organizeAllDetails();
    },
    filters: {}
};

</script>
