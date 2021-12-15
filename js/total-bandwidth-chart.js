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
    // cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
        fontSize: "12px",
        fill: am5.color(0x717591),
        paddingTop: 15,
        oversizedBehavior: 'fit'
    });

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "date",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {})
    }));

    var myTooltip = am5.Tooltip.new(root, {
        autoTextColor: false,
        labelText: "{valueY} {label}",
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
        tooltip: myTooltip,
    }));
    series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5
    });
    series.columns.template.adapters.add("fill", (fill, target) => {
        return '#2C3ACF';
    });

    // Set data from API
    $('#reportFilter2').val(4);
    loadData((res) => {
        setData(res)
    })

    $('#reportFilter2').on('change', () => {
        loadData((res) => {
            setData(res);
        })
    })

    function loadData(callbackFn) {
        let fromDate = moment();
        let toDate = moment();
        xRenderer.labels.template.setAll({
            fontSize: "14px"
        });
        switch ($('#reportFilter2').val()) {
            case "2":
                {
                    fromDate = moment().subtract(1, 'days');
                    toDate = moment().subtract(1, 'days');
                    break
                }
            case "3":
                {
                    fromDate = moment().subtract(6, 'days');
                    toDate = moment();
                    break
                }
            case "4":
                {
                    fromDate = moment().subtract(29, 'days');
                    toDate = moment();
                    xRenderer.labels.template.setAll({
                        fontSize: "10px"
                    });
                    break
                }
            case "5":
                {
                    fromDate = moment().startOf('month');
                    toDate = moment().endOf('month');
                    xRenderer.labels.template.setAll({
                        fontSize: "10px"
                    });
                    break
                }
            case "6":
                {
                    fromDate = moment().subtract(1, 'month').startOf('month');
                    toDate = moment().subtract(1, 'month').endOf('month');
                    xRenderer.labels.template.setAll({
                        fontSize: "10px"
                    });
                    break
                }
        }
        $('#txtDateRange2').text(`${fromDate.format("MMM DD")} - ${toDate.format("MMM DD")}`);
        $.ajax({
            url: "https://dapi.massbit.io/api/v1?action=stat.dapi&fromDate=" + fromDate.format('YYYY-MM-DD') + "&toDate=" + toDate.format('YYYY-MM-DD'),
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                if (res && res.result) {
                    callbackFn(res.data);
                }
            }
        });
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    function niceBytes(x) {
        let l = 0,
            n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l) {
            n = n / 1024;
        }
        return ({
            value: n.toFixed(n < 10 && l > 0 ? 1 : 0),
            unit: units[l]
        });
    }

    function setData(resX) {
        // Binding value
        const niceB = niceBytes(resX.bandwidth.total);
        $('#txtTotalBandwidth').text(numberWithCommas(niceB.value));
        $('#txtTotalBandwidthUnit').text(niceB.unit);
        // Generate chart
        var data = resX.bandwidth.data.map((e, i) => {
            return {
                date: moment(e.date).format("MMM DD"),
                value: Number(niceBytes(e.value).value),
                label: niceBytes(e.value).unit
            }
        });
        xAxis.data.setAll(data);
        series.data.setAll(data);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
    }
}); // end am5.ready()