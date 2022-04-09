<template>
  <div id="line-chart" ref="lineChart" v-if="!noMeasurementsMessage"></div>
  <p v-else>Mesures indisponibles : <strong>{{ selectedVariableName }}</strong></p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_fr_FR from '@amcharts/amcharts5/locales/fr_FR';

interface myData {
  apiArr: any;
  selectedVariableName: string;
  selectedMicrosensorId: string;
  noMeasurementsMessage: boolean;
}

export default defineComponent({
  name: 'MicrosensorsChart',
  props: {
    api: Array,
    microsensor: String,
    variable: String
  },
  data(): myData {
    return {
      apiArr: this.api,
      selectedVariableName: this.variable,
      selectedMicrosensorId: this.microsensor,
      noMeasurementsMessage: false
    };
  },
  mounted(): void {
    if (this.apiArr.length > 0) {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      let root = am5.Root.new(this.$refs.lineChart as HTMLElement);
      root.locale = am5locales_fr_FR;

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 0,
        paddingRight: 10,
        layout: root.verticalLayout
      }));

      chart.children.unshift(am5.Label.new(root, {
        text: this.selectedVariableName,
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: -4,
        paddingTop: 0,
        paddingBottom: 0
      }));


      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none'
      }));
      cursor.lineY.set('visible', false);


      // Get data
      let data = [];

      for (let measurement of this.apiArr) {
        if (measurement.variable === this.selectedVariableName) {
          let date = new Date(measurement.time);

          data.push({
            date: date.getTime(),
            value: measurement.valeur
          });
        }
      }


      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'minute',
          count: 15
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {})
      }));

      let unit = this.apiArr.find(microsensor => microsensor.variable === this.selectedVariableName).unite;

      yAxis.children.unshift(
        am5.Label.new(root, {
          rotation: -90,
          text: `Valeur (${unit})`,
          y: am5.p50,
          centerX: am5.p50
        })
      );


      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false
      });

      tooltip.label.set('text', `{valueY} ${unit}`);
      tooltip.get('background').set('fill', am5.color('#fff'));
      tooltip.get('background').set('stroke', am5.color('#000'));

      let concentrations = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Concentrations mesurées',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        connect: false,
        tooltip
      }));

      concentrations.strokes.template.setAll({
        'stroke': am5.color('#21b3e8'),
        'strokeWidth': 2
      });


      // Set data
      concentrations.data.setAll(data);


      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      concentrations.appear(1000);
      chart.appear(1000, 100);

    } else {
      this.noMeasurementsMessage = true;
    }
  }
});
</script>

<style scoped>
#line-chart {
  width: 100%;
  height: 350px;
}
</style>

