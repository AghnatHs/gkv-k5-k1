const csvFileName = "data_tanaman_padi_sumatera_version_1.csv";

d3.csv(csvFileName)
  .then(function (rows) {
    let provincesData = {};

    rows.forEach((row) => {
      let province = row["Provinsi"]?.trim();
      let year = row["Tahun"]?.trim();
      let riceProduction = row["Produksi"]?.trim();

      if (!province || !year || isNaN(riceProduction)) return;

      if (!provincesData[province]) {
        provincesData[province] = { x: [], y: [] };
      }

      provincesData[province].x.push(year);
      provincesData[province].y.push(riceProduction);
    });

    let data = Object.keys(provincesData).map((provinsi) => ({
      x: provincesData[provinsi].x,
      y: provincesData[provinsi].y,
      type: "scatter",
      mode: "lines+markers",
      name: provinsi,
      line: {
        width: 2,
      },
    }));

    let layout = {
      title: "Produksi Padi per Provinsi di Sumatera 1993 - 2020",
      xaxis: { title: "Tahun" },
      yaxis: { title: "Produksi Padi" },
      font: { size: 16 },
    };
    let config = { responsive: true };

    Plotly.newPlot("graph", data, layout, config);
  })
  .catch(function (error) {
    console.error(error);
  });
