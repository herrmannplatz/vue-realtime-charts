<template>
  <div id="app">
    <line-chart v-if="chartdata" :chart-data="chartdata" />
  </div>
</template>

<script>
import gql from "graphql-tag";
import moment from "moment";
import LineChart from "./components/LineChart";

const query = gql`
  subscription {
    last_20_min_temp(
      order_by: { five_sec_interval: asc }
      where: { location: { _eq: "Berlin" } }
    ) {
      five_sec_interval
      location
      max_temp
    }
  }
`;

export default {
  name: "App",
  components: {
    LineChart
  },
  data() {
    return {
      chartdata: null
    };
  },
  apollo: {
    $subscribe: {
      chartdata: {
        query,
        result({ data }) {
          let chartData = {
            labels: [],
            datasets: [
              {
                label: "Max temperature every five seconds",
                data: [],
                pointBackgroundColor: [],
                borderColor: "brown",
                fill: false
              }
            ]
          };
          data.last_20_min_temp.forEach(item => {
            const humanReadableTime = moment(item.five_sec_interval).format(
              "LTS"
            );
            chartData.labels.push(humanReadableTime);
            chartData.datasets[0].data.push(item.max_temp);
            chartData.datasets[0].pointBackgroundColor.push("brown");
          });
          this.chartdata = chartData;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  width: 50vw;
  position: relative;
}
</style>
