am5.ready(function() {

    // Create root and chart
    var root = am5.Root.new("worldChart");

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // ====================================
    // Create map
    // ====================================

    var chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "none",
        panY: "none",
        wheelY: "none",
        pinchZoom: false,
        fill: "0xf3f3f3"
    }));
    var continentSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_continentsLow,
        exclude: ["antarctica"],
        fill: am5.color(0xE9EEF5)
    }));

    // Create polygon series
    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_usaLow,
            fill: am5.color(0xE9EEF5)
        })
    );

    // =================================
    // Set up point series
    // =================================

    // Load store data
    // am5.net.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/TargetStores.json").then(function(result) {
    //     var stores = am5.JSONParser.parse(result.response);
    //     setupStores(stores);
    //     debugger
    // });

    var currentSeries;
    var regionalSeries = {};
    setupStores({
        query_results: [
            { "co_loc_n": "Aberdeen", "CO_LOC_REF_I": "848", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-98.4405850", "LATTD_I": "45.4574520", "mail_city_n": "Aberdeen", "count": 1106 },
            { "co_loc_n": "Abilene", "CO_LOC_REF_I": "219", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-99.7672590", "LATTD_I": "32.4054170", "mail_city_n": "Abilene", "count": 1136 },
            { "co_loc_n": "Abingdon", "CO_LOC_REF_I": "1871", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-76.3163080", "LATTD_I": "39.4602330", "mail_city_n": "Abingdon", "count": 1184 },
            { "co_loc_n": "Abington", "CO_LOC_REF_I": "2173", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-70.9276830", "LATTD_I": "42.1105190", "mail_city_n": "Abington", "count": 1256 },
        ]
    }, 1)
    setupStores({
        query_results: [
            { "co_loc_n": "Abington Township", "CO_LOC_REF_I": "1256", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-75.1161540", "LATTD_I": "40.1248190", "mail_city_n": "Abington", "count": 1469 },
            { "co_loc_n": "Acworth", "CO_LOC_REF_I": "2091", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-84.6837830", "LATTD_I": "34.0397090", "mail_city_n": "Acworth", "count": 1324 },
            { "co_loc_n": "Addison", "CO_LOC_REF_I": "1850", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-96.8538540", "LATTD_I": "32.9509510", "mail_city_n": "Addison", "count": 1082 },
            { "co_loc_n": "Ahwatukee", "CO_LOC_REF_I": "909", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-111.9815420", "LATTD_I": "33.3213790", "mail_city_n": "Phoenix", "count": 1368 },
            { "co_loc_n": "Aiken", "CO_LOC_REF_I": "1310", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-81.7111320", "LATTD_I": "33.5041290", "mail_city_n": "Aiken", "count": 956 },
            { "co_loc_n": "Alabaster", "CO_LOC_REF_I": "2276", "MAIL_ST_PROV_C": "US", "LNGTD_I": "-86.8039770", "LATTD_I": "33.2248950", "mail_city_n": "Alabaster", "count": 1041 }
        ]
    }, 2)

    // Parses data and creats map point series for domestic and state-level
    function setupStores(data, type) {
        // Init country-level series
        regionalSeries.US = {
            markerData: [],
            series: createSeries("stores", type)
        };

        // Set current series
        currentSeries = regionalSeries.US.series;

        // Process data
        am5.array.each(data.query_results, function(store, idx) {
            // Get store data
            var store = {
                state: store.MAIL_ST_PROV_C,
                long: am5.type.toNumber(store.LNGTD_I),
                lat: am5.type.toNumber(store.LATTD_I),
                location: store.co_loc_n,
                city: store.mail_city_n,
                count: am5.type.toNumber(store.count)
            };

            // Process city-level data
            if (regionalSeries[store.city] == undefined) {
                regionalSeries[store.city] = {
                    target: store.city,
                    type: "city",
                    name: store.city,
                    count: store.count,
                    stores: 1,
                    label: type == 1 ? 'Gateway' : 'Node',
                    state: store.state,
                    markerData: [],
                    geometry: {
                        type: "Point",
                        coordinates: [store.long, store.lat]
                    }
                };
                regionalSeries[store.state].markerData.push(regionalSeries[store.city]);
            } else {
                regionalSeries[store.city].stores++;
                regionalSeries[store.city].label = regionalSeries[store.city].label == 'Gateway' ? 'Gateways' : 'Nodes';
                regionalSeries[store.city].count += store.count;
            }

            // Process individual store
            regionalSeries[store.city].markerData.push({
                name: store.location,
                count: store.count,
                stores: 1,
                label: type == 1 ? 'Gateway' : 'Node',
                state: store.state,
                geometry: {
                    type: "Point",
                    coordinates: [store.long, store.lat]
                }
            });
        });
        regionalSeries.US.series.data.setAll(regionalSeries.US.markerData);
    }

    // Finds polygon in series by its id
    function getPolygon(id) {
        var found;
        polygonSeries.mapPolygons.each(function(polygon) {
            if (polygon.dataItem.get("id") == id) {
                found = polygon;
            }
        })
        return found;
    }

    // Creates series with heat rules
    function createSeries(heatfield, type) {
        // Create point series
        var pointSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                valueField: heatfield,
                calculateAggregates: true
            })
        );

        // Add store bullet
        var circleTemplate = am5.Template.new(root);
        pointSeries.bullets.push(function() {
            var container = am5.Container.new(root, {});

            var tooltip = am5.Tooltip.new(root, {
                getFillFromSprite: false,
                getStrokeFromSprite: false,
                getLabelFillFromSprite: false,
                fill: am5.color(0xFFFFFF),
                autoTextColor: false,
            });
            tooltip.get("background").setAll({
                fill: am5.color(0x27319B),
                strokeWidth: 0,
                stroke: am5.color(0x27319B),
            });
            var circle = container.children.push(am5.Circle.new(root, {
                radius: 12,
                fill: type == 1 ? am5.color(0x00B159) : am5.color(0xFBAF1D),
                fillOpacity: 1,
                cursorOverStyle: "pointer",
                strokeWidth: 0.5,
                stroke: am5.color(0xffffff),
                tooltip: tooltip,
                tooltipText: "Country: {name}\n{label}: {stores}",
            }, circleTemplate));

            var label = container.children.push(am5.Label.new(root, {
                text: "{stores}",
                fill: am5.color(0xffffff),
                fontSize: '12px',
                populateText: true,
                centerX: am5.p50,
                centerY: am5.p50,
                textAlign: "left"
            }));

            return am5.Bullet.new(root, {
                sprite: container
            });
        });

        // Add heat rule for circles
        pointSeries.set("heatRules", [{
            target: circleTemplate,
            dataField: "value",
            min: 10,
            max: 24,
            key: "radius",
        }])



        // Set up drill-down
        // TODO

        return pointSeries;
    }
}); // end am5.ready()