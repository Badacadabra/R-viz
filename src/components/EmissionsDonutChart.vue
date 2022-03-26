<template>
  <div id="donut-chart" ref="donutChart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_fr_FR from "@amcharts/amcharts5/locales/fr_FR";

interface myData {
  apiArr: any;
}

export default defineComponent({
  name: 'EmissionsDonutChart',
  props: {
    api: Array
  },
  data(): myData {
    return {
      apiArr: this.api
    };
  },
  mounted(): void {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(this.$refs.donutChart as HTMLElement);
    root.locale = am5locales_fr_FR;

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(50)
    }));


    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: 'value',
      categoryField: 'category',
      fillField: 'color'
    }));

    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('visible', false);

    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    let data = [];

    for (let sector of this.apiArr) {
      data.push({
        value: sector.y,
        category: sector.name,
        color: am5.color(sector.color)
      });
    }

    series.data.setAll(data);


    // Create legend
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      clickTarget: 'none'
    }));

    legend.data.setAll(series.dataItems);

    legend.markers.template.setAll({
      width: 12,
      height: 12
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 20,
      cornerRadiusTR: 20,
      cornerRadiusBL: 20,
      cornerRadiusBR: 20
    });

    legend.labels.template.setAll({
      fontSize: 16,
      fontWeight: '300',
      fontFamily: 'Roboto'
    });

    legend.valueLabels.template.setAll({
      fontSize: 16,
      fontWeight: '400',
      fontFamily: 'Roboto'
    });


    // Play initial series animation
    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    series.appear(1000, 100);
  }
});
</script>

<style scoped>
#donut-chart {
  width: 100%;
  height: 600px;
}
</style>

