am5.ready(function() {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("totalBandwidthChart");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    const myTheme = am5themes_Animated.new(root);
    myTheme.rule("Grid").setAll({
        stroke: am5.color(0xFFFFFF)
    })
    root.setThemes([
        myTheme
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
        fontSize: "14px",
        fill: am5.color(0x717591)
    });

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "date",
        renderer: xRenderer
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {})
    }));
    var yRenderer = yAxis.get("renderer");
    yRenderer.labels.template.setAll({
        fill: am5.color(0xFF0000),
        fontSize: "0"
    });

    var myTooltip = am5.Tooltip.new(root, {
        autoTextColor: false,
        labelText: "{valueY} TB",
    });

    myTooltip.label.setAll({
        fill: am5.color(0xFFFFFF),
        fontSize: "14px",
    });
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Total Bandwidth",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "date",
        seriesTooltipTarget: "bullet",
        tooltip: myTooltip
    }));
    series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5
    });
    series.columns.template.adapters.add("fill", (fill, target) => {
        return '#2C3ACF';
    });


    // Set data
    var data = [{
        date: "Nov 22",
        value: 111
    }, {
        date: "Nov 26",
        value: 196
    }, {
        date: "Nov 30",
        value: 222
    }, {
        date: "Dec 06",
        value: 280
    }, {
        date: "Dec 10",
        value: 256
    }, {
        date: "Dec 14",
        value: 309
    }, {
        date: "Dec 18",
        value: 280
    }, {
        date: "Dec 22",
        value: 247
    }];
    xAxis.data.setAll(data);
    series.data.setAll(data);
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
}); // end am5.ready()