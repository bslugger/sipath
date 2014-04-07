'use strict';

angular.module('a3App')
  .controller('DataCtrl', function ($scope, pathVizService) {
    $scope.data;
    $scope.axisSourceIndices = [18, 5];
    $scope.axes = [];
    $scope.svg = {
        width: 800,
        height: 1200
    };
    $scope.paths = [];
    function getXCoordByAxisIndex (index, length) {
        console.log(index * $scope.svg.width / (length - 1));
        return index * ($scope.svg.width-200) / (length - 1);
    };
    function getYCoordByAxisIndex (index, length) {
        return index * ($scope.svg.height-50) / (length - 1) +20;
    };
    function isNameInArray (value, array) {
        var i = -1;
        angular.forEach(array, function (item, index) {
            if (item.name === value)
                i = index;
        });
        return i;
    }
    $scope.onDataLoaded = function (data) {
        console.log(data);
        // Create axis
        angular.forEach($scope.axisSourceIndices, function(axisSourceIndex, axisNewIndex) {
            var labels = [];
            var axisId = 'axis-' + String(axisNewIndex);
            angular.forEach(data, function (row, index) {
                // Skip headers
                if (index === 0)
                    return;
                var value = row[axisSourceIndex].trim();
                if (isNameInArray(value, labels) == -1) {
                    labels.push({name: value, paths: []});
                }
            });
            // axisNewIndex will be the new index
            $scope.axes.push({
                id: axisId,
                labels: labels,
                x: getXCoordByAxisIndex(axisNewIndex, $scope.axisSourceIndices.length)
            });
        });
        
        // Create labels
        angular.forEach($scope.axes, function(axis, index) {
            angular.forEach(axis.labels, function (label, index) {
                label.x = axis.x;
                label.y = getYCoordByAxisIndex(index, axis.labels.length);
                label.id = axis.id + '-label-' + index;
            });
        });

        // Create paths
        angular.forEach(data, function (row, index) {
            var path = [];
            var pathId = 'path-' + String(index - 1);
            angular.forEach($scope.axisSourceIndices, function(axisSourceIndex, axisNewIndex) {
                if (index === 0)
                    return;
                var value = row[axisSourceIndex].trim();
                var axis = $scope.axes[axisNewIndex];
                var labelIndex = isNameInArray(value, axis.labels);
                var coord = [axis.x+30, axis.labels[labelIndex].y];
                path.push(coord.join(" "));
                axis.labels[labelIndex].paths.push(pathId);
            });
            $scope.paths.push({ d:'M ' + path.join(' L '), id: pathId });
        });
        console.log($scope.axes);
        
    }

    pathVizService.loadData($scope.onDataLoaded);

    $scope.showPathByLabel = function (index) {
        var label = $scope.axes[index.axis].labels[index.label];
        var paths = label.paths;

        function svgRemoveHighlightClass () {
                var oldClass = $(this).attr('class');
                if (oldClass.indexOf(' highlighted') != -1) {
                    $(this).attr('class', oldClass.replace(' highlighted', ''));
                }
        }
        function svgAddHighlightClass () {
            var oldClass = $(this).attr('class');
            $(this).attr('class', oldClass + ' highlighted');
            $('svg')[0].appendChild(this);
        }

        jQuery('.highlighted').each(svgRemoveHighlightClass);
        
        jQuery('#' + label.id).each(svgAddHighlightClass);
        angular.forEach(paths, function (pathId, index) {
            jQuery( '.data-path#' + pathId).each(svgAddHighlightClass);
        });

        jQuery('g').each(function() {
            $('svg')[0].appendChild(this);
        });
    }
  });
