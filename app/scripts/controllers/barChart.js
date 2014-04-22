'use strict';

angular.module('a3App')
  .controller('BarChartCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 190,
        height: 150
    }
    $scope.layout = {
        labelPadding: 20,
        labelBarPadding: 10,
        labelHeight: 30,
        gapWidth: 15,
        maxValue: 1400
    }
    $scope.data = [{'1st': 25}, {'2nd': 50}, {'3rd': 10}, {'4th': 40}];
    $scope.bars = [];

    pathVizService.registerObserverCallback('selectedCourseTerms', function (rawDataList) {
        $scope.data = $scope.parseRawData(rawDataList[0]);
        updateRenderData();
    });

    $scope.parseRawData = function (rawData) {
    // Convert from: {'1st': 25, '2nd': 50, '3rd': 10, '4th': 40}
    // To: [{'1st': 25}, {'2nd': 50}, {'3rd': 10}, {'4th': 40}]
        var data = [];
        for (var key in rawData) {
            if (!rawData.hasOwnProperty(key)) 
                continue;
            var obj = {};
            obj[key] = rawData[key];
            data.push(obj);
        }
        return data;
    }

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
    function getMaxValue() {
        var max = -999999;
        for (var i = 0; i < $scope.data.length; i ++) {
            var obj = $scope.data[i];
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) 
                    continue;
                var value = parseInt(obj[key]);
                max = (value > max)? value: max;
            }
        }
        return max;
    }
    function updateRenderData() {
        $scope.bars.length = 0;
        var l = $scope.layout;

        l.maxValue = getMaxValue();
        console.log(l.maxValue);


        var barWidth = ( $scope.svg.width - ( $scope.data.length - 1 ) * l.gapWidth ) / $scope.data.length;
        var innerHeight = $scope.svg.height - l.labelHeight;
        var barHeightRatio = (innerHeight - 25) / l.maxValue;

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
            bar.y = innerHeight - bar.value * barHeightRatio;
            bar.width = barWidth;
            bar.height = innerHeight - bar.y;
            bar.isValueShown = false;
            $scope.bars.push(bar);
        }
    }
    updateRenderData();
  });
