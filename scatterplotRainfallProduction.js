const csvFileName4 = "data_tanaman_padi_sumatera_version_1.csv";

d3.csv(csvFileName4)
  .then(function (rows) {
    let scatterData = {};
    let provinceAverages = {};

    rows.forEach((row) => {
      let province = row["Provinsi"]?.trim();
      let year = row["Tahun"]?.trim();
      let riceProduction = +row["Produksi"]?.trim();
      let harvestArea = +row["LuasPanen"]?.trim();
      let humidity = +row["Kelembapan"]?.trim();
      let avgTemperature = +row["SuhuAvg"]?.trim();
      let rainFall = +row["CurahHujan"]?.trim();

      if (
        !province ||
        !year ||
        isNaN(riceProduction) ||
        isNaN(humidity) ||
        isNaN(harvestArea) ||
        isNaN(avgTemperature) ||
        isNaN(rainFall)
      )
        return;

      if (!scatterData[province]) {
        scatterData[province] = { x: [], y: [] };
      }
      scatterData[province].x.push(rainFall);
      scatterData[province].y.push(riceProduction);

      if (!provinceAverages[province]) {
        provinceAverages[province] = {
          totalProduction: 0,
          totalRainfall: 0,
          count: 0,
        };
      }
      provinceAverages[province].totalProduction += riceProduction;
      provinceAverages[province].totalRainfall += rainFall;
      provinceAverages[province].count += 1;
    });

    let avgScatterData = [];
    for (let province in provinceAverages) {
      let avg = provinceAverages[province];
      avgScatterData.push({
        x: [avg.totalRainfall / avg.count],
        y: [avg.totalProduction / avg.count],
        type: "scatter",
        mode: "markers",
        name: province,
        marker: {
          size: 12,
          opacity: 0.8,
        },
        text: province,
      });
    }

    let scatterLayout = {
      title:
        "Hubungan Rata-rata Curah Hujan dan Produksi Padi per Provinsi di Sumatera",
      xaxis: {
        title: "Rata-rata Luas Panen",
        zeroline: true,
        tickformat: ",.0f",
      },
      yaxis: {
        title: "Rata-rata Produksi Padi",
        zeroline: true,
        tickformat: ",.0f",
      },
      font: { size: 16 },
      hovermode: "closest",
      annotations: avgScatterData.map((item) => ({
        x: item.x[0],
        y: item.y[0],
        text: item.name,
        showarrow: true,
        arrowhead: 0,
        ax: 0,
        ay: -30,
      })),
    };
    let config = { responsive: true };
    Plotly.newPlot("graph4", avgScatterData, scatterLayout, config);
  })
  .catch(function (error) {
    console.error(error);
  });
