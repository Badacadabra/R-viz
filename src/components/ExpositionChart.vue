<template>
  <div id="bar-chart" ref="barChart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_fr_FR from "@amcharts/amcharts5/locales/fr_FR";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

interface myData {
  apiObj: any;
  selectedPollutant: string;
  selectedThreshold: string;
  selectedScope: string;
  selectedCity: any;
  selectedDepartment: string;
}

export default defineComponent({
  name: 'ExpositionChart',
  props: {
    api: Object,
    pollutant: String,
    threshold: String,
    scope: String,
    city: Object,
    department: String
  },
  data(): myData {
    return {
      apiObj: this.api,
      selectedPollutant: this.pollutant,
      selectedThreshold: this.threshold,
      selectedScope: this.scope,
      selectedCity: this.city,
      selectedDepartment: this.department
    };
  },
  mounted(): void {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(this.$refs.barChart as HTMLElement);
    root.locale = am5locales_fr_FR;

    root.numberFormatter.setAll({
      numberFormat: '# a',
      bigNumberPrefixes: [
        { 'number': 1e+3, 'suffix': 'k' },
        { 'number': 1e+6, 'suffix': 'M' }
      ],
      smallNumberPrefixes: []
    });

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: 'year',
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    yAxis.children.unshift(am5.Label.new(root, {
      text: 'Nombre d\'habitants',
      textAlign: 'center',
      x: am5.percent(50),
      centerX: am5.percent(50),
      y: am5.percent(50),
      centerY: am5.percent(50),
      rotation: -90,
      paddingTop: 0,
      paddingBottom: 15
    }));


    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: 'Series 1',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'value',
      sequencedInterpolation: true,
      categoryXField: 'year',
      tooltip: am5.Tooltip.new(root, {
        labelText:'{valueY.formatNumber("#,###")}'
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
    series.columns.template.adapters.add('fill', (fill, target: any) => {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', (stroke, target: any) => {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });


    // Set data
    let data = [],
        values = this.apiObj[this.selectedThreshold].valeurs,
        thisYear = new Date().getFullYear();

    for (let year in values) {
      if (parseInt(year) > (thisYear - 7) && values[year][this.selectedPollutant]) {
        data.push({
          year,
          value: values[year][this.selectedPollutant].exposition_population
        });
      }
    }

    xAxis.data.setAll(data);
    series.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

    this.$emit('chartReady');


    // Set exporting
    // https://www.amcharts.com/docs/v5/concepts/exporting/
    let dataExport = [],
        territory = this.selectedScope === 'city' ? this.selectedCity.code : this.selectedDepartment;

    console.log(this.selectedScope);

    for (let year in values) {
      if (parseInt(year) > (thisYear - 7) && values[year][this.selectedPollutant]) {
        dataExport.push({
          annee: year,
          valeur: values[year][this.selectedPollutant].exposition_population,
          unite: 'Nombre d\'habitants',
          polluant: this.selectedPollutant,
          seuil: this.selectedThreshold,
          territoire: territory
        });
      }
    }

    am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {}),
      filePrefix: `exposition_${this.selectedPollutant}_${this.selectedThreshold}_${territory}`,
      dataSource: dataExport,
      jpgOptions: {
        disabled: true
      },
      pdfOptions: {
        disabled: true
      },
      pdfdataOptions: {
        disabled: true
      }
    });
  }
});
</script>

<style scoped>
#bar-chart {
  width: 100%;
  height: 350px;
}
</style>

