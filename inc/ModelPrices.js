import Chart from 'chart.js/auto'
class ModelPrices {
    constructor(data) {
        this.data = data;

        this.events();
    }

    events() {
        new Chart(
            document.querySelector('#canvas'),
            {
              type: 'bar',
              data: {
                labels: this.data.map(row => row.model),
                datasets: [
                  {
                    label: 'Average model price',
                    data: this.data.map(row => row.avgPrice)
                    // Print value on bar also or above it. Currently it shows only on hover
                  }
                ]
              }
            }
          );
    }
}

export default ModelPrices;
