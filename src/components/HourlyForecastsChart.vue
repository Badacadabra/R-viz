<template>
  <div id="bubble-chart" ref="bubbleChart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';

interface myData {
  apiObj: any;
}

export default defineComponent({
  name: 'HourlyForecastsChart',
  props: {
    api: Object
  },
  data(): myData {
    return {
      apiObj: this.api
    };
  },
  mounted(): void {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(this.$refs.bubbleChart as HTMLElement),
        responsive = am5themes_Responsive.newEmpty(root);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      responsive
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
        paddingLeft: 10,
        paddingRight: 0
      })
    );

    // Create axes and their renderers
    let yRenderer = am5xy.AxisRendererY.new(root, {
      visible: false,
      minGridDistance: 20,
      inversed: true,
      inside: true
    });

    yRenderer.grid.template.set('visible', false);

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        renderer: yRenderer,
        categoryField: 'pollutant',
        position: 'absolute',
        x: 0,
        y: -30
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {
      visible: false,
      minGridDistance: 40,
      opposite: true
    });

    xRenderer.grid.template.set('visible', true);

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xRenderer,
        categoryField: 'hour'
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        calculateAggregates: true,
        stroke: am5.color(0xffffff),
        clustered: false,
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: 'hour',
        categoryYField: 'pollutant',
        valueField: 'value'
      })
    );

    series.columns.template.setAll({
      forceHidden: true
    });

    let circleTemplate = am5.Template.new({ radius: 15 } as any);

    // Add circle bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series.bullets.push(function () {
      let graphics = am5.Circle.new(root, {
          stroke: series.get('stroke'),
          fill: series.get('fill'),
          tooltipText: '{concentration} µg/m³'
        }, circleTemplate as any
      );
      return am5.Bullet.new(root, {
        sprite: graphics
      });
    });

    // Set up heat rules
    // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
    series.set('heatRules', [{
      target: circleTemplate,
      min: 5,
      max: 10,
      dataField: 'value',
      key: 'radius',
      customFunction: function(sprite, min, max, value) {
        switch (value) {
          case 1: // Bon
            sprite.set('fill' as any, am5.color('#50f0e6'));
            break;
          case 2: // Moyen
            sprite.set('fill' as any, am5.color('#50ccaa'));
            break;
          case 3: // Dégradé
            sprite.set('fill' as any, am5.color('#f0e641'));
            break;
          case 4: // Mauvais
            sprite.set('fill' as any, am5.color('#ff5050'));
            break;
          case 5: // Très mauvais
            sprite.set('fill' as any, am5.color('#960032'));
            break;
          case 6: // Extrêmement mauvais
            sprite.set('fill' as any, am5.color('#872181'));
            break;
          default: // Indisponible
            sprite.set('fill' as any, am5.color('#dddddd'));
        }
      }
    }]);

    let data = [];

    for (let i = 1; i < this.apiObj.data.prevision_horaire.length; i++) {

      for (let j = 0; j < this.apiObj.data.prevision_horaire[i].horaires.length; j++) {
        var poll = '';

        for (let k = 0; k < this.apiObj.data.legendes.polluants.length; k++) {
          if (this.apiObj.data.legendes.polluants[k].code_polluant_eu === this.apiObj.data.prevision_horaire[i].code_polluant_eu) {
            poll = this.apiObj.data.legendes.polluants[k].label;
          }
        }

        data.push({
          hour: this.apiObj.data.prevision_horaire[i].horaires[j].horaire.split('h').reverse().toString().replace(',', ' h'),
          pollutant: poll,
          value: this.apiObj.data.prevision_horaire[i].horaires[j].indice_atmo,
          concentration: this.apiObj.data.prevision_horaire[i].horaires[j].concentration
        });
      }

    }

    series.data.setAll(data);

    let pollutants = [];

    for (let l = 1; l < this.apiObj.data.legendes.polluants.length - 1; l++) {
      pollutants.push({
        pollutant: this.apiObj.data.legendes.polluants[l].label
      });
    }

    yAxis.data.setAll(pollutants);

    xAxis.data.setAll([
      { hour: '0 h' },
      { hour: '1 h' },
      { hour: '2 h' },
      { hour: '3 h' },
      { hour: '4 h' },
      { hour: '5 h' },
      { hour: '6 h' },
      { hour: '7 h' },
      { hour: '8 h' },
      { hour: '9 h' },
      { hour: '10 h' },
      { hour: '11 h' },
      { hour: '12 h' },
      { hour: '13 h' },
      { hour: '14 h' },
      { hour: '15 h' },
      { hour: '16 h' },
      { hour: '17 h' },
      { hour: '18 h' },
      { hour: '19 h' },
      { hour: '20 h' },
      { hour: '21 h' },
      { hour: '22 h' },
      { hour: '23 h' }
    ]);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    chart.appear(1000, 100);

    // Responsive
    // https://www.amcharts.com/docs/v5/concepts/responsive/
    responsive.addRule({
      relevant: am5themes_Responsive.widthL,
      applying: function () {
        circleTemplate.set('radius' as any, 5);
        yAxis.setAll({
          'x': -5,
          'y': -20
        });
      },
      removing: function () {
        circleTemplate.set('radius' as any, 15);
        yAxis.setAll({
          'x': 0,
          'y': -30
        });
      }
    });
  }
});
</script>

<style scoped>
#bubble-chart {
  width: 90%;
  height: 300px;
  margin: auto;
}
</style>

