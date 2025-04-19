const csvFileName = "data_tanaman_padi_sumatera_version_1.csv";

d3.csv(csvFileName)
  .then(function (rows) {
    let provincesData = {};
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

      if (!province || !year || isNaN(riceProduction) || isNaN(humidity) || isNaN(harvestArea) || isNaN(avgTemperature) || isNaN(rainFall)) return;

      if (!provincesData[province]) {
        provincesData[province] = { x: [], y: [] };
      }

      provincesData[province].x.push(year);
      provincesData[province].y.push(riceProduction);

      if(!scatterData[province]) {
        scatterData[province] = { x: [], y: [] };
      }
      scatterData[province].x.push(harvestArea);
      scatterData[province].y.push(riceProduction);


      if (!provinceAverages[province]) {
        provinceAverages[province] = {
          totalProduction: 0,
          totalHarvestArea: 0,
          count: 0
        };
      }
      provinceAverages[province].totalProduction += riceProduction;
      provinceAverages[province].totalHarvestArea += harvestArea;
      provinceAverages[province].count += 1;
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


    let avgScatterData = [];
    for (let province in provinceAverages) {
      let avg = provinceAverages[province];
      avgScatterData.push({
        x: [avg.totalHarvestArea / avg.count], 
        y: [avg.totalProduction / avg.count], 
        type: "scatter",
        mode: "markers",
        name: province,
        marker: {
          size: 12,
          opacity: 0.8
        },
        text: province
      });
    }

    let scatterLayout = {
      title: "Hubungan Rata-rata Curah Hujan dan Produksi Padi per Provinsi di Sumatera",
      xaxis: { 
        title: "Rata-rata Luas Panen",
        zeroline: true,
        tickformat: ",.0f" 
      },
      yaxis: { 
        title: "Rata-rata Produksi Padi",
        zeroline: true,
        tickformat: ",.0f" 
      },
      font: { size: 16 },
      hovermode: "closest",
      annotations: avgScatterData.map(item => ({
        x: item.x[0],
        y: item.y[0],
        text: item.name,
        showarrow: true,
        arrowhead: 0,
        ax: 0,
        ay: -30
      }))
    };
    
    Plotly.newPlot("graph2", avgScatterData, scatterLayout, config);

    let productivityData = [];
    let provinces = [];
    let productivities = [];
    
    
    for (let province in provinceAverages) {
      let avg = provinceAverages[province];
      let avgProduction = avg.totalProduction / avg.count;
      let avgHarvestArea = avg.totalHarvestArea / avg.count;
      let productivity = avgProduction / avgHarvestArea;
      
      provinces.push(province);
      productivities.push(productivity);
    }
    
    
    let sortedIndices = productivities.map((prod, idx) => ({ prod, idx })).sort((a, b) => b.prod - a.prod).map(item => item.idx);
    
    let sortedProvinces = sortedIndices.map(idx => provinces[idx]);
    let sortedProductivities = sortedIndices.map(idx => productivities[idx]);
    
    
    productivityData.push({
      x: sortedProvinces,
      y: sortedProductivities,
      type: 'bar',
      marker: {
        color: 'rgb(60, 120, 216)',
        opacity: 0.8
      },
      text: sortedProductivities.map(val => val.toFixed(2)),
      textposition: 'auto'
    });
    
    let barLayout = {
      title: 'Rata-rata Produktivitas Padi per Provinsi di Sumatera (1993-2020)',
      xaxis: {
        title: 'Provinsi',
        tickangle: -45
      },
      yaxis: {
        title: 'Produktivitas (ton/ha)',
        zeroline: true
      },
      font: { size: 16 },
      margin: {
        b: 100
      }
    };
    
    Plotly.newPlot("graph3", productivityData, barLayout, config);
  })
  .catch(function (error) {
    console.error(error);
  });
