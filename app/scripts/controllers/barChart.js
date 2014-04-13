'use strict';

angular.module('a3App')
  .controller('BarChartCtrl', function ($scope) {
    $scope.svg = {
        width: 300,
        height: 300
    }
    $scope.layout = {
        labelPadding: 20,
        labelHeight: 30,
        gapWidth: 30,
        maxValue: 100
    }
    $scope.data = [{'1st': 25}, {'2nd': 50}, {'3rd': 10}, {'4th': 40}];
    $scope.bars = [];
    $scope.init = function(options) {
        if (options != undefined) {
            $scope.svg = (options.svg)? options.svg: $scope.svg;
            $scope.layout = (options.layout)? options.layout: $scope.layout;
            $scope.data = (options.data)? options.data: $scope.data;
        }
        updateRenderData();
    }
    $scope.showValue = function(bar) {
        bar.isValueShown = true;
    }
    $scope.hideValue = function(bar) {
        bar.isValueShown = false;
    }
    function updateRenderData() {
        $scope.bars.length = 0;
        var l = $scope.layout;
        var barWidth = ( $scope.svg.width - ( $scope.data.length - 1 ) * l.gapWidth ) / $scope.data.length;
        var innerHeight = $scope.svg.height - l.labelHeight;
        var barHeightRatio = innerHeight / l.maxValue;

        for (var i = 0; i < $scope.data.length; i ++) {
            var bar = {};
            var barObject = $scope.data[i];
            for (var key in barObject) {
                if (!barObject.hasOwnProperty(key)) 
                    continue;
                bar.label = key;
                bar.value = barObject[key];
            }
            bar.x = i * ( barWidth + l.gapWidth );
            bar.y = innerHeight * ( 1 - bar.value / l.maxValue );
            bar.width = barWidth;
            bar.height = innerHeight - bar.y;
            bar.isValueShown = false;
            $scope.bars.push(bar);
        }
    }
    updateRenderData();
  });
