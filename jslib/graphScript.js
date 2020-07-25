d3.csv("content/GFKB_Original_RelativeAbundances.csv", d3.autoType).then(function(data, rows) {
  var graphData = [];

  // pruning and handling of data
  for (var i = 0; i < data.length; i++) {
    var obj = {};
    var sciNameSplit = data[i].SciName.split(" ");
    var genusName = sciNameSplit[0];
    var speciesName = sciNameSplit[0] + " " + sciNameSplit[1];
    obj.genusName = genusName;
    obj.speciesName = speciesName;

    // adding up all of the relative abundances
    var relativeAbundance = 0;
    // very inefficient and horrible code, but hey, it works
    for (let [key, value] of Object.entries(data[i])) {
      if (key != "SciName" && key != "TaxId" && key != "Lineage" && key != "Accessions") {
        // console.log("test relative abundance: ", key);
        if (typeof(value) == 'number') {
          relativeAbundance += value;
        }
      }
    }
    // console.log("relativeAbundance: ", relativeAbundance);
    obj.relativeAbundance = relativeAbundance;
    graphData.push(obj);
  }

  // for species data:
  var speciesData = {};
  for (var i = 0; i < graphData.length; i++) {
    var speciesName = graphData[i].speciesName;
    var relativeAbundance = graphData[i].relativeAbundance;
    speciesData[speciesName] = relativeAbundance;
  }

  // for genus data:
  var genusData = {};
  for (var i = 0; i < graphData.length; i++) {
    var genusName = (graphData[i].genusName).replace(/[\[\]']+/g, '');
    var relativeAbundance = graphData[i].relativeAbundance;
    if (!genusData[genusName]) {
      genusData[genusName] = relativeAbundance;
    } else {
      genusData[genusName].relativeAbundance += relativeAbundance;
    }
  }


  //init() adds event listeners to the button to pass the data
  function init() {
    d3.select("#genus")
      .on("click", function(d, i) {
        pieChart(genusData, 'genus') //pass the data and the key
      })
    d3.select("#species")
      .on("click", function(d, i) {
        pieChart(speciesData, 'species')
      })

    pieChart(speciesData) //creates default pie-chart
  }

  init(); //calls init() on load

  function pieChart(dataSet, graphLevel) {
    // Clear the div so we can reload the graph
    d3.select('#doughnut_chart').html('');

    // setting the subtitle of the graph based on genus/species level
    var graphLevelText;
    if (graphLevel == "genus") {
      var graphSubTitle = document.getElementById("graph_level_title");
      graphLevelText = "Genus Level";
      graphSubTitle.innerText = graphLevelText;
    } else {
      var graphSubTitle = document.getElementById("graph_level_title");
      graphLevelText = "Species Level"
      graphSubTitle.innerText = graphLevelText;
    }

    console.log("dataset: ", dataSet);
    // size of chart
    var width_doughnut = 450
    var height_doughnut = 450
    var margin_doughnut = 10

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius_doughnut = Math.min(width_doughnut, height_doughnut) / 2 - margin_doughnut;

    var svg_doughnut = d3.select("#doughnut_chart")
      .append("svg")
      .attr("width", width_doughnut)
      .attr("height", height_doughnut)
      .append("g")
      .attr("transform", "translate(" + width_doughnut / 2 + "," + height_doughnut / 2 + ")");


    // DEBUGGING & TESTING
    // var speciesDataTest = {};
    // var counter = 0;
    // for (var key in speciesData) {
    //   speciesDataTest[key] = speciesData[key];
    //   counter++;
    //   if (counter > 5) {
    //     break;
    //   }
    // }

    // set the color scale
    var color = d3.scaleOrdinal().range(d3.schemeCategory10);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {
        // console.log(d.value);
        return d.value;
      });

    // Telling chart what data to use:
    // genusData for genus, speciesData for species
    var data_ready = pie(d3.entries(dataSet));

    // The arc generator
    var arc_doughnut = d3.arc()
      .innerRadius(radius_doughnut * 0.3) // This is the size of the donut hole
      .outerRadius(radius_doughnut * 0.8)

    // Arc that won't be drawn, just for slice enlarging on highlight
    var arcHighlight = d3.arc()
      .innerRadius(radius_doughnut / 2)
      .outerRadius(radius_doughnut * 0.9);

    // for hover tooltip
    var hoverDiv = d3.select("body").append("div")
      .attr("class", "tooltip-donut")
      .style("opacity", 0);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg_doughnut
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc_doughnut)
      .attr('fill', function(d) {
        return (color(d.data.key))
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .attr('transform', 'translate(0, 0)')
      .on('mouseover', function(d, i) {
        // for hover tooltips
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '.85');
        hoverDiv.transition()
          .duration(50)
          .style("opacity", 1);
        var roundedRelativeAbundance = Math.round((d.value + Number.EPSILON) * 100) / 100
        let hoverInfo = d.data.key + ": " + roundedRelativeAbundance + "%";
        hoverDiv.html(hoverInfo)
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 15) + "px");
        // for slice enlargement
        d3.select(this)
          .transition()
          .attr('d', arcHighlight(d));
      })
      .on('mouseout', function(d, i) {
        // for hover tooltips
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '1');
        hoverDiv.transition()
          .duration('50')
          .style("opacity", 0);
        // for slice enlargement
        d3.select(this)
          .transition()
          .attr('d', arc_doughnut(d));
      });

    // Adding text in center
    svg_doughnut.append("text")
      .attr("text-anchor", "middle")
      .text(graphLevelText);

  }
});
