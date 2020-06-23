// Setting x and y axis names 
var xAxisName = "poverty"
var yAxisName = "Obesity"


var svgHeight = 800;
var svgWidth = 750;

var margin = {
    top: 75,
    right: 50,
    left: 50,
    bottom: 100
};

var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append('svg')
    .classed("chart", true)
    .attr("width", svgHeight)
    .attr('height', svgHeight);

var chartCanvass = svg.append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// function used for updating x-scale var upon click on axis label
function xScale(data, xAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[xAxis]) * .9,
        d3.max(data, d => d[xAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(emptyChartDots, newXScale, chosenXAxis) {

    emptyChartDots.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return emptyChartDots;
  }

function renderLabels(labels, newXScale, chosenXAxis){

    labels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));

    return labels;
}
// function used for updating circles group with new tooltip
function updateToolTip(xAxisName, circlesGroup) {

    var label;

    if (xAxisName === "poverty") {
        label = "Poverty";
        percentSymbol = "%"
        moneySymbol = ""
    } else if (xAxisName === "income") {
        label = "Avg. Income";
        percentSymbol = ""
        moneySymbol = "$"
    } else {
        label = "Avg. Age";
        percentSymbol = ""
        moneySymbol = ""
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`<strong>State:</strong> ${d.state} <br> 
            <strong>${label}:</strong> ${moneySymbol}${d[xAxisName]}${percentSymbol}<br> 
            <strong>${yAxisName}:</strong> ${d.obesity}%`)
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });


    return circlesGroup;
}

// Create group for three x-axis labels
var labelsGroup = chartCanvass.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .style("text-anchor", "middle")
    .style('font-family', "sans-serif")
    .text("% of Pop. in Poverty");

var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .style("text-anchor", "middle")
    .style('font-family', "sans-serif")
    .text("Average Income");

var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .style("text-anchor", "middle")
    .style('font-family', "sans-serif")
    .text("Average Age");

// Setting Chart title
chartCanvass.append("g").append("text")
    .attr("x", (margin.left))
    .attr("y", .75 - (margin.top / 2))
    .attr("text-anchor", "left")
    .style("font-size", "30px")
    .style('font-family', "sans-serif")
    .text(`${xAxisName} vs ${yAxisName}`);

// Setting y axis label
chartCanvass.append('g').append('text')
    .attr("x", 0 - (chartHeight / 2))
    .attr('y', 0 - (margin.left))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style('font-family', "sans-serif")
    .text(`${yAxisName} (% of pop.)`);


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
    xLinearScale = xScale(data, xAxisName)

    var bottomAxis = d3.axisBottom(xLinearScale);

    var xAxis = chartCanvass.append("g")
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    /// Creating the y axis
    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.obesity))
        .range([chartHeight, 0]);

    var yAxis = d3.axisLeft(yScale);

    chartCanvass.append("g")
        .call(yAxis);

    /// Creating the chart dots variable
    var emptyChartDots = chartCanvass.selectAll("circle")
        .data(data)
        .enter()
        .append("g")

    
    /// Creating the chart dots locations
    var chartDots = emptyChartDots.append("g")
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[xAxisName]))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", 10)

    var chartLabels = emptyChartDots.append("g").append("text")
        .text(d => d.abbr)
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[xAxisName]))
        .attr("y", d => yScale(d.obesity) + 3);

    // updateToolTip function above csv import
    var chartDots = updateToolTip(xAxisName, chartDots, yScale);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== xAxisName) {

                // replaces chosenXAxis with value
                xAxisName = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(data, xAxisName);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                chartDots = renderCircles(chartDots, xLinearScale, xAxisName);

                chartLabels = renderLabels(chartLabels, xLinearScale, xAxisName);

                // updates tooltips with new info
                emptyChartDots = updateToolTip(xAxisName, emptyChartDots);

                // changes classes to change bold text
                if (xAxisName === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (xAxisName === 'income') {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

})

