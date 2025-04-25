const csvFileName5 = "data_tanaman_padi_sumatera_version_1.csv";

d3.csv(csvFileName5)
  .then(function (rows) {
    let variables = {
      riceProduction: [],
      harvestArea: [],
      humidity: [],
      avgTemperature: [],
      rainFall: [],
    };

    rows.forEach((row) => {
      let riceProduction = +row["Produksi"]?.trim();
      let harvestArea = +row["LuasPanen"]?.trim();
      let humidity = +row["Kelembapan"]?.trim();
      let avgTemperature = +row["SuhuAvg"]?.trim();
      let rainFall = +row["CurahHujan"]?.trim();

      if (
        !isNaN(riceProduction) &&
        !isNaN(harvestArea) &&
        !isNaN(humidity) &&
        !isNaN(avgTemperature) &&
        !isNaN(rainFall)
      ) {
        variables.riceProduction.push(riceProduction);
        variables.harvestArea.push(harvestArea);
        variables.humidity.push(humidity);
        variables.avgTemperature.push(avgTemperature);
        variables.rainFall.push(rainFall);
      }
    });

    function correlation(x, y) {
      let n = x.length;
      let sumX = x.reduce((a, b) => a + b, 0);
      let sumY = y.reduce((a, b) => a + b, 0);
      let sumXY = 0;
      let sumX2 = 0;
      let sumY2 = 0;

      for (let i = 0; i < n; i++) {
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
      }

      let numerator = n * sumXY - sumX * sumY;
      let denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
      );

      return numerator / denominator;
    }

    let variablesList = [
      "riceProduction",
      "harvestArea",
      "humidity",
      "avgTemperature",
      "rainFall",
    ];
    let correlationMatrix = {};

    variablesList.forEach((var1) => {
      correlationMatrix[var1] = {};
      variablesList.forEach((var2) => {
        correlationMatrix[var1][var2] = correlation(
          variables[var1],
          variables[var2]
        );
      });
    });

    let matrixData = variablesList.map((var1) =>
      variablesList.map((var2) => correlationMatrix[var1][var2])
    );

    let layout = {
      title: "Correlation Matrix of Variables",
      xaxis: { title: "Variables" },
      yaxis: { title: "Variables" },
      font: { size: 16 },
    };

    Plotly.newPlot(
      "correlation-graph",
      [
        {
          z: matrixData,
          x: variablesList,
          y: variablesList,
          type: "heatmap",
          colorscale: "Viridis",
          colorbar: { title: "Correlation Coefficient" },
        },
      ],
      layout
    );
  })
  .catch(function (error) {
    console.error(error);
  });
