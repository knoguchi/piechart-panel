'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie'], function (_export, _context) {
  "use strict";

  var _, $;

  function link(scope, elem, attrs, ctrl) {
    var data, panel;
    elem = elem.find('.piechart-panel');
    var $tooltip = $('<div id="tooltip">');

    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });

    function setElementHeight() {
      try {
        var height = ctrl.height || panel.height || ctrl.row.height;
        if (_.isString(height)) {
          height = parseInt(height.replace('px', ''), 10);
        }

        height -= 5; // padding
        height -= panel.title ? 24 : 9; // subtract panel title bar

        elem.css('height', height + 'px');

        return true;
      } catch (e) {
        // IE throws errors sometimes
        return false;
      }
    }

    function formatter(label, slice) {
      return "<div style='font-size:" + ctrl.panel.fontSize + ";text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
    }

    function addPieChart() {
      var width = elem.width();
      var height = elem.height();

      var size = Math.min(width, height);

      var plotCanvas = $('<div></div>');
      var plotCss = {
        top: '10px',
        margin: 'auto',
        position: 'relative',
        height: size - 20 + 'px'
      };

      plotCanvas.css(plotCss);

      var $panelContainer = elem.parents('.panel-container');
      var backgroundColor = $panelContainer.css('background-color');

      var dataset = ctrl.data;
      var options = {
        legend: {
          show: false
        },
        grid: {
          hoverable: true,
          clickable: false
        }
      };

      if (panel.pieType === 'pie' || panel.pieType == 'donut') {
        options.series = {
          pie: {
            show: true,
            stroke: {
              color: backgroundColor,
              width: parseFloat(ctrl.panel.strokeWidth).toFixed(1)
            },
            label: {
              show: ctrl.panel.legend.show && ctrl.panel.legendType === 'On graph',
              formatter: formatter
            },
            highlight: {
              opacity: 0.0
            }
          }
        };
        if (panel.pieType === 'donut') {
          options.series.pie.innerRadius = 0.5;
        }
      } else if (panel.pieType === 'bar') {
        // transform data structure
        var data = [];
        var ticks = [];
        var maxLen = ctrl.data.length;
        for (var i = 0; i < maxLen; i++) {
          ticks.push([maxLen - i, ctrl.data[i].label]);
          data.push([ctrl.data[i].data, maxLen - i]);
        }

        options.series = {
          bars: {
            show: true,
            horizontal: true
          }
        };

        options.bars = {
          align: "center",
          barWidth: 0.5
        };

        dataset = [{ data: data, color: "#5482ff" }];

        var max_value = _.max(_.map(data, function (e) {
          return e[0];
        }));
        panel.decimals = Math.floor(Math.abs(Math.log10(max_value)));

        options.xaxis = {
          max: _.min([max_value * 1.2, 1.0]),
          tickFormatter: function tickFormatter(v, axis) {
            return ctrl.formatValue(v);
          }
        };

        options.yaxis = {
          ticks: ticks
        };

        options.grid.borderWidth = 0;
        options.grid.labelMargin = 5;
      }

      elem.html(plotCanvas);
      $.plot(plotCanvas, dataset, options);
      plotCanvas.bind("plothover", function (event, pos, item) {
        if (!item) {
          $tooltip.detach();
          return;
        }

        var body;
        var formatted = ctrl.formatValue(item.series.data[item.dataIndex][0]);

        body = '<div class="graph-tooltip-small"><div class="graph-tooltip-time">';
        body += '<div class="graph-tooltip-value" style="text-overflow: ellipsis">' + item.series.yaxis.ticks[item.dataIndex].label;
        body += " " + formatted + '</div>';
        body += "</div></div>";

        $tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
      });
    }

    function render() {
      if (!ctrl.data) {
        return;
      }

      data = ctrl.data;
      panel = ctrl.panel;

      if (setElementHeight()) {
        addPieChart();
      }
    }
  }

  _export('default', link);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}],
    execute: function () {}
  };
});
//# sourceMappingURL=rendering.js.map
