const csvFileName3 = "data_tanaman_padi_sumatera_version_1.csv";

d3.csv(csvFileName3)
  .then(function (rows) {
    let provinceAverages = {}; 

    rows.forEach((row) => {
      let province = row["Provinsi"]?.trim();
      let riceProduction = +row["Produksi"]?.trim();
      let harvestArea = +row["LuasPanen"]?.trim();
      
      if (!province || isNaN(riceProduction) || isNaN(harvestArea)) return;

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
    
    let sortedIndices = productivities.map((prod, idx) => ({ prod, idx }))
      .sort((a, b) => b.prod - a.prod)
      .map(item => item.idx);
    
    let sortedProvinces = sortedIndices.map(idx => provinces[idx]);
    let sortedProductivities = sortedIndices.map(idx => productivities[idx]);
    
    let productivityData = [{
      x: sortedProvinces,
      y: sortedProductivities,
      type: 'bar',
      marker: {
        color: 'rgb(60, 120, 216)',
        opacity: 0.8
      },
      text: sortedProductivities.map(val => val.toFixed(2)),
      textposition: 'auto'
    }];
    
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
    
    let config = { responsive: true };
    
    Plotly.newPlot("graph3", productivityData, barLayout, config);
  })
  .catch(function (error) {
    console.error(error);
  });