<template>
  <div id="bar-chart" ref="barChart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_fr_FR from "@amcharts/amcharts5/locales/fr_FR";

interface myData {
  apiArr: any;
  chartVariables: any;
  selectedPollutant: string;
}

export default defineComponent({
  name: 'EmissionsBarChart',
  props: {
    api: Array,
    variables: Object,
    pollutant: String
  },
  data(): myData {
    return {
      apiArr: this.api,
      chartVariables: this.variables,
      selectedPollutant: this.pollutant
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
    let cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
      behavior: 'none'
    }));
    cursor.lineY.set('visible', false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: 'year',
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 40
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let pollutantKey = this.selectedPollutant === 'pm25' ? 'pm2.5' : this.selectedPollutant;

    yAxis.children.unshift(am5.Label.new(root, {
      text: this.chartVariables[pollutantKey].unite,
      textAlign: 'center',
      x: am5.percent(50),
      centerX: am5.percent(50),
      y: am5.percent(50),
      centerY: am5.percent(50),
      rotation: -90,
      paddingTop: 0,
      paddingBottom: 15
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: 'Series',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'value',
      valueXField: 'date',
      tooltip: am5.Tooltip.new(root, {
        labelText: '{valueY.formatNumber("#,###")}'
      })
    }));

    series.columns.template.set('fill', am5.color('#21b3e8'));

    let data = [];

    for (let el of this.apiArr) {
      data.push({
        date: new Date(el.x + '').getTime(),
        value: el.y
      });
    }

    series.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
  }
});
</script>

<style scoped>
#bar-chart {
  width: 100%;
  height: 350px;
}
</style>
