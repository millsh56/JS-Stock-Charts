import mockData from "./mockData.js";

function getColor(stock) {
  if (stock === "GME") {
    return "rgba(61, 161, 61, 0.7)";
  }
  if (stock === "MSFT") {
    return "rgba(209, 4, 25, 0.7)";
  }
  if (stock === "DIS") {
    return "rgba(18, 4, 209, 0.7)";
  }
  if (stock === "BNTX") {
    return "rgba(166, 43, 158, 0.7)";
  }
}

const timeChartCanvas = document.querySelector("#time-chart");
const highestPriceChartCanvas = document.querySelector("#highest-price-chart");
const averagePriceChartCanvas = document.querySelector("#average-price-chart");

async function main() {
  //   const response = await fetch(
  //     `https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=c7130ed91f4c494eb0fe1e05335b8969`
  //   );
  //   const data = await response.json();
  // const { GME, MSFT, DIS, BNTX} = mockData;

  function getHighest(mockData) {
    const stocks = Object.keys(mockData);
    const highestHighs = [];

    stocks.forEach((stock) => {
      const highestHigh = mockData[stock].values.reduce(
        (maxHigh, currentValue) => {
          return currentValue.high > maxHigh ? currentValue.high : maxHigh;
        },
        -Infinity
      );

      highestHighs.push(highestHigh);
    });

    return highestHighs;
  }
  const highestHighsArray = getHighest(mockData);
  console.log(highestHighsArray);
  

  let GME = mockData.GME;
  let MSFT = mockData.MSFT;
  let DIS = mockData.DIS;
  let BNTX = mockData.BNTX;

  const stocks = [GME, MSFT, DIS, BNTX];
  stocks.forEach((stock) => stock.values.reverse());

  new Chart(timeChartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: stocks[0].values.map((value) => value.datetime),
      datasets: stocks.map((stock) => ({
        label: stock.meta.symbol,
        data: stock.values.map((value) => parseFloat(value.high)),
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
      })),
    },
  });

  new Chart(highestPriceChartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["GME", "MSFT", "DIS", "BNTX"],
      datasets: [
        {
          label: "Highest Prices",
          data: highestHighsArray,
          backgroundColor: [
            "rgba(61, 161, 61, 0.7)",
            "rgba(209, 4, 25, 0.7)",
            "rgba(18, 4, 209, 0.7)",
            "rgba(166, 43, 158, 0.7)",
          ],
          borderColor: [
            "rgba(61, 161, 61, 0.7)",
            "rgba(209, 4, 25, 0.7)",
            "rgba(18, 4, 209, 0.7)",
            "rgba(166, 43, 158, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}


function calculateAverageStockPrice(mockData) {
    const stocks = Object.keys(mockData);
    const averagePrices = [];
  
    stocks.forEach(stock => {
      const values = mockData[stock].values;
      let sum = 0;
      let count = 0;
  
      values.forEach(value => {
        for (const key in value) {
          if (key !== 'datetime' && !isNaN(value[key])) {
            sum += parseFloat(value[key]);
            count++;
          }
        }
      });
  
      const stockAverage = count !== 0 ? sum / count : 0;
      averagePrices.push(stockAverage);
    });
  
    // Calculate overall average
    let overallSum = 0;
    let overallCount = 0;
  
    stocks.forEach(stock => {
      const values = mockData[stock].values;
      values.forEach(value => {
        for (const key in value) {
          if (key !== 'datetime' && !isNaN(value[key])) {
            overallSum += parseFloat(value[key]);
            overallCount++;
          }
        }
      });
    });
  
    const overallAverage = overallCount !== 0 ? overallSum / overallCount : 0;
    averagePrices.push(overallAverage);
  
    return averagePrices;
  }

  const averageStockPrices = calculateAverageStockPrice(mockData);
console.log(averageStockPrices);

const labelsWithOverall = Object.keys(mockData).concat('Overall');


new Chart(averagePriceChartCanvas.getContext("2d"), {
type: 'pie',
data: {
    labels: labelsWithOverall, 
    datasets: [{
      label: 'Average Stock Prices',
      data: averageStockPrices,
      backgroundColor: [
        "rgba(61, 161, 61, 0.7)",
        "rgba(209, 4, 25, 0.7)",
        "rgba(18, 4, 209, 0.7)",
        "rgba(166, 43, 158, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: 'black',
          fontSize: 12,
          padding: 10
        }
  }}
});




main();

// async function getStockData(data) {
//     const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=c7130ed91f4c494eb0fe1e05335b8969`)
//     const data = await response.json()
//     const stocks = [GME, MSFT, DIS, BNTX];
//     let GME = result.GME
//     let MSFT = result.MSFT
//     let DIS = result.DIS
//     let BTNX = result.BTNX
//     console.log(data)
// }

// console.log(getStockData)
