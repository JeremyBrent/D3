// Setting x and y axis names 
var xAxisName = "poverty"
var yAxisName = "obesity"


var svgHeight = 800;
var svgWidth = 800;

var margin = {
    top: 75,
    right: 50,
    left: 100,
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

// function used for updating y-scale var upon click on axis label
function yScale(data, yAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[yAxis]) * .95,
        d3.max(data, d => d[yAxis]) * 1.05])
        .range([chartHeight, 0]);

    return yLinearScale
}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function moveCircles(emptyChartDots, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    emptyChartDots.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));;

    return emptyChartDots;
}

// Function used to move the labels on the scatter dots 
function moveLabels(labels, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    labels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return labels;
}

// Function used for updating the titles
function updateTitle(xlabel, ylabel, chartTitle) {
    chartTitle.text(`${capitalize(xlabel)} vs. ${capitalize(ylabel)}`)

    return chartTitle
}

// function used for updating circles group with new tooltip
function updateToolTip(xAxisName, yAxisName, circlesGroup) {

    var xlabel;
    var ylabel;

    if (xAxisName === "poverty") {
        xlabel = "Poverty";
        percentSymbol = "%"
        moneySymbol = ""
    } else if (xAxisName === "income") {
        xlabel = "Avg. Income";
        percentSymbol = ""
        moneySymbol = "$"
    } else {
        xlabel = "Avg. Age";
        percentSymbol = ""
        moneySymbol = ""
    }

    if (yAxisName === "obesity") {
        ylabel = "Obesity";
    } else if (yAxisName === "smokes") {
        ylabel = "Smokers";
    } else {
        ylabel = "Lacking Healthcare";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`<strong>State:</strong> ${d.state} <br> 
            <strong>${xlabel}:</strong> ${moneySymbol}${d[xAxisName]}${percentSymbol}<br> 
            <strong>${ylabel}:</strong> ${d[yAxisName]}%`)
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

// Function to capitalize words at 0th index, used in chart title
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create group for three x-axis labels
var xlabelsGroup = chartCanvass.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .style("text-anchor", "middle")
    .style('font-family', "sans-serif")
    .text("% of Pop. in Poverty");

var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .style("text-anchor", "middle")
    .style('font-family', "sans-serif")
    .text("Average Income");

var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .style("text-anchor", "middle")
    .style('font-family', "sans-serif")
    .text("Average Age");

// Setting y axis label
var ylabelsGroup = chartCanvass.append('g')
    .attr("transform", `translate(${0 - margin.left}, ${chartHeight / 2})`)

var obesityLabel = ylabelsGroup.append('text')
    .attr("y", 45)
    .attr("dy", "1em")
    .classed("active", true)
    .attr("value", "obesity")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style('font-family', "sans-serif")
    .text(`% Obese`);

var smokeLabel = ylabelsGroup.append('text')
    .attr("y", 25)
    .attr("dy", "1em")
    .classed("inactive", true)
    .attr("value", "smokes")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style('font-family', "sans-serif")
    .text(`% of Smokers`);

var healthcareLabel = ylabelsGroup.append('text')
    .attr("y", 5)
    .attr("dy", "1em")
    .classed("inactive", true)
    .attr("value", "healthcare")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style('font-family', "sans-serif")
    .text(`% Lacking Healthcare`);

// Setting Chart title
var chartTitle = chartCanvass.append("g").append("text")
    .attr("x", 0)
    .attr("y", .75 - (margin.top / 2))
    .attr("text-anchor", "left")
    .style("font-size", "30px")
    .style('font-family', "sans-serif")
    .text(`${capitalize(xAxisName)} vs ${capitalize(yAxisName)}`);

// Looping through data
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
    yLinearScale = yScale(data, yAxisName)

    var leftAxis = d3.axisLeft(yLinearScale);

    var yAxis = chartCanvass.append("g")
        .call(leftAxis);

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
        .attr("cy", d => yLinearScale(d[yAxisName]))
        .attr("r", 10)

    // Creating Chart labels
    var chartLabels = emptyChartDots.append("g").append("text")
        .text(d => d.abbr)
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[xAxisName]))
        .attr("y", d => yLinearScale(d[yAxisName]) * 1.01);

    // updateToolTip function above csv import
    var emptyChartDots = updateToolTip(xAxisName, yAxisName, emptyChartDots);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
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
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates circles with new x values
                chartDots = moveCircles(chartDots, xLinearScale, yLinearScale, xAxisName, yAxisName);

                chartLabels = moveLabels(chartLabels, xLinearScale, yLinearScale, xAxisName, yAxisName);

                // updates tooltips with new info
                emptyChartDots = updateToolTip(xAxisName, yAxisName, emptyChartDots);

                // updates chart title 
                chartTitle = updateTitle(xAxisName, yAxisName, chartTitle)

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

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== yAxisName) {

                // replaces chosenYAxis with value
                yAxisName = value;

                // console.log(chosenYAxis)

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(data, yAxisName);

                // updates y axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // updates circles with new y values
                chartDots = moveCircles(chartDots, xLinearScale, yLinearScale, xAxisName, yAxisName);

                chartLabels = moveLabels(chartLabels, xLinearScale, yLinearScale, xAxisName, yAxisName);

                // updates tooltips with new info
                emptyChartDots = updateToolTip(xAxisName, yAxisName, emptyChartDots);

                // updates chart title 
                chartTitle = updateTitle(xAxisName, yAxisName, chartTitle)

                // changes classes to change bold text
                if (yAxisName === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (yAxisName === 'smokes') {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
})

