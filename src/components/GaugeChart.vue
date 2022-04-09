<template>
  <div id="gauge-chart" ref="gaugeChart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface myData {
  currentIndex: string;
}

export default defineComponent({
  name: 'GaugeChart',
  props: {
    index: String
  },
  data(): myData {
    return {
      currentIndex: this.index
    };
  },
  mounted(): void {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(this.$refs.gaugeChart);


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    let chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 160,
      endAngle: 380,
      layout: root.verticalLayout
    }));


    // Create axis and its renderer
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
    let axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -20
    });

    axisRenderer.grid.template.set('visible', false);
    axisRenderer.ticks.template.set('visible', false);
    axisRenderer.labels.template.set('visible', false);

    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: -20,
      max: 100,
      strictMinMax: true,
      renderer: axisRenderer
    }));


    // Add clock hand
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
    let axisDataItem = xAxis.makeDataItem({});

    let clockHand = am5radar.ClockHand.new(root, {
      pinRadius: am5.percent(10),
      radius: am5.percent(70),
      bottomWidth: 20
    })

    clockHand.hand.set('fill', am5.color('#4c595e'));
    clockHand.pin.set('fill', am5.color('#4c595e'));

    axisDataItem.set('bullet', am5xy.AxisBullet.new(root, {
      sprite: clockHand
    }));

    xAxis.createAxisRange(axisDataItem);


    // Create axis ranges bands
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
    let bandsData = [{
      color: '#50f0e6',
      lowScore: -20,
      highScore: 0
    }, {
      color: '#50ccaa',
      lowScore: 0,
      highScore: 20
    }, {
      color: '#f0e641',
      lowScore: 20,
      highScore: 40
    }, {
      color: '#ff5050',
      lowScore: 40,
      highScore: 60
    }, {
      color: '#960032',
      lowScore: 60,
      highScore: 80
    }, {
      color: '#872181',
      lowScore: 80,
      highScore: 100
    }];

    am5.array.each(bandsData, data => {
      let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

      axisRange.setAll({
        value: data.lowScore,
        endValue: data.highScore
      });

      axisRange.get('axisFill').setAll({
        visible: true,
        fill: am5.color(data.color),
        fillOpacity: 0.8
      });
    });

    // Dynamic properties
    let val = 0;

    switch (this.currentIndex) {
      case 'Bon':
        val = -10;
        break;
      case 'Moyen':
        val = 10;
        break;
      case 'Dégradé':
        val = 30;
        break;
      case 'Mauvais':
        val = 50;
        break;
      case 'Très mauvais':
        val = 70;
        break;
      case 'Extrêmement mauvais':
        val = 90;
        break;
    }

    axisDataItem.set('value', val);

    chart.children.push(am5.Label.new(root, {
      text: this.currentIndex,
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));

    // Make stuff animate on load
    chart.appear(1000, 100);
  }
});
</script>

<style scoped>
#gauge-chart {
  width: 100%;
  height: 200px;
}
</style>

