// Setting x and y axis names 
var xAxisName = "Poverty"
var yAxisName = "Obesity"


var svgHeight = 750;
var svgWidth = 750;

var margin = {
    top: 75,
    right: 50,
    left: 50,
    bottom: 50
};

var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append('svg')
    .classed("chart",true)
    .attr("width", svgHeight)
    .attr('height', svgHeight);

var chartCanvass = svg.append('g')
    
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Setting Chart title
chartCanvass.append("g").append("text")
    .attr("x", (margin.left))
    .attr("y", .75 - (margin.top / 2))
    .attr("text-anchor", "left")
    .style("font-size", "30px")
    .style('font-family',"sans-serif")
    .text(`${xAxisName} vs ${yAxisName}`);

// Setting y axis label
chartCanvass.append('g').append('text')
    .attr("x", 0 - (chartHeight / 2))
    .attr('y', 0 - (margin.left))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style('font-family',"sans-serif")
    .text(`${yAxisName} (% of pop.)`);

// Setting x axis label
chartCanvass.append('g').append('text')
    .attr("transform",
        "translate(" + (chartWidth / 2) + " ," +
        (chartHeight + margin.top - 35) + ")")
    .style("text-anchor", "middle")
    .style('font-family',"sans-serif")
    .text(`${xAxisName} (% of pop.)`);


d3.csv('assets/data/data.csv').then(function (data) {
    console.log(data);

    // Casting data types
    data.forEach(d => {
        d.healthcare = +d.healthcare;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
    })

    /// Creating the x axis
    var xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.poverty))
        .range([0, chartWidth]);

    var xAxis = d3.axisBottom(xScale);

    chartCanvass.append("g")
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    /// Creating the y axis
    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.obesity))
        .range([chartHeight, 0]);

    var yAxis = d3.axisLeft(yScale);

    chartCanvass.append("g")
        .call(yAxis);

    /// Creating tool tips
    var toolTip = d3.select("body").append("div")
        .attr("class", "tooltip d3-tip");

    /// Creating the chart dots variable
    var chartDots = chartCanvass.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    // Adding scatter dot locations
    chartDots.append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", 10)
        
    // Adding scatter dot text 
    chartDots.append("g").append("text")
        .text(d => d.abbr)
        .classed("stateText", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.obesity) + 3);

    // Adding tool tip 
    chartDots.on("mouseover", function (d) {
        toolTip
            .style("display", "block")
            .style("opacity", 1);
        toolTip.html(`<strong>State:</strong> ${d.state} <br> 
            <strong>${xAxisName}:</strong> ${d.poverty}%<br> 
            <strong>${yAxisName}:</strong> ${d.obesity}%`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function () {
        toolTip.style("display", "none");
    });

})

