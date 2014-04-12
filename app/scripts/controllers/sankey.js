'use strict';

angular.module('a3App')
  .controller('SankeyCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 800,
        height: 1200
    };
    $scope.anchors = {
        leftX: 0,
        rightX: 700,
        xDis: 600,
        leftColWidth: 100,
        rightColWidth: 100,
        scale: 700,
    };

    $scope.data = [1, 2, 3];
    $scope.backgrounds = [];
    $scope.positionTitles = [];
    $scope.backToCareerLinks = [];
    $scope.predicate = "-value";


    var backgroundTag;
    var posTitleTag;

    function insertUniqueEntry(targetArr, input, inputTag, prefix) {
        var insertIndex = -1;
        angular.forEach(targetArr, function(entry, index) {
            if (insertIndex === -1) {
                if (entry[inputTag] === input) {
                    insertIndex = index;
                    return;
                }
            }
        });

        if (insertIndex === -1) {
            var object = {};
            object[inputTag] = input;
            object["value"] = 1;
            if (typeof prefix !== 'undefined') {
                object[prefix+"-index"] = prefix+insertUniqueEntry.uniqID;
                insertUniqueEntry.uniqID++;
            }
            targetArr.push (object);

        } else {
            //console.log("++");
            targetArr[insertIndex].value++;
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    $scope.onDataLoaded = function (data) {
        // Definitely need to find a better way to organize those data
        // Currently using way too many for loop.

        console.log("====onDataLoaded====");
        // console.log(data.contents);
        // console.log(data.headers);
        var contents = data.contents;
        var headers = data.headers;

        // Debug use
        backgroundTag = headers[18];
        posTitleTag = headers[5];
        var totalNumber = contents.length;
        // console.log (backgroundTag);
        // console.log (posTitleTag);

        angular.forEach(contents, function(content) {
            var mBackground = content[backgroundTag];
            var mPosTitle = content[posTitleTag];

            // add unique background
            insertUniqueEntry($scope.backgrounds, mBackground, backgroundTag, "bg");

            angular.forEach($scope.backgrounds, function(background) {
                if (typeof background.outcome === 'undefined') {
                    background.outcome = [];
                }
                if (background[backgroundTag] === mBackground) {
                    insertUniqueEntry(background.outcome, mPosTitle, posTitleTag);
                }
            });

            // add unique position title
            insertUniqueEntry($scope.positionTitles, mPosTitle, posTitleTag, "pos");
            angular.forEach($scope.positionTitles, function(position) {
                if (typeof position.background === 'undefined') {
                    position.background = [];
                }
                if (position[posTitleTag] === mPosTitle) {
                    insertUniqueEntry(position.background, mBackground, backgroundTag);
                }
            });
        });
        
        var cumulatePercentage = 0;
        for (var i = 0; i < $scope.backgrounds.length; i++) {
            var background = $scope.backgrounds[i];
            background.percentage = roundTo(background.value/totalNumber,2);
            background.cumPercentage = cumulatePercentage;
            background.color = getRandomColor();
            for (var j = 0; j < background.outcome.length; j++) {
                var outcome = background.outcome[j];
                //outcome.percentage = outcome.value/totalNumber;
                //outcome.cumPercentage = cumulatePercentage;
                //cumulatePercentage += outcome.percentage;
                // find outcome index
                for (var k = 0; k < $scope.positionTitles.length; k++) {
                    var posTitle = $scope.positionTitles[k];
                    if (outcome[posTitleTag] === posTitle[posTitleTag]) {
                        outcome["pos-index"] = posTitle["pos-index"];
                    }
                }
            }

            background.outcome = background.outcome.sort(function(a,b){
                var i1 = parseInt(a["pos-index"].substr(3));
                var i2 = parseInt(b["pos-index"].substr(3));

                if (i1 < i2) return -1;
                if (i1 > i2) return 1;
                return 0;
            });

            for (var j = 0; j < background.outcome.length; j++) {
                var outcome = background.outcome[j];
                outcome.percentage = roundTo(outcome.value/totalNumber,2);
                outcome.cumPercentage = cumulatePercentage;
                cumulatePercentage += outcome.percentage;
            }
            
        }

        cumulatePercentage = 0;
        for (var i = 0; i < $scope.positionTitles.length; i++) {
            var posTitle = $scope.positionTitles[i];
            posTitle.percentage = roundTo(posTitle.value/totalNumber,2);
            posTitle.cumPercentage = cumulatePercentage;
            posTitle.color = getRandomColor();
            for (var j = 0; j < posTitle.background.length; j++) {
                var background = posTitle.background[j];
                //background.percentage = background.value/totalNumber;
                //background.cumPercentage = cumulatePercentage;
                //cumulatePercentage += background.percentage;
                for (var k = 0; k < $scope.backgrounds.length; k++) {
                    var sBackground = $scope.backgrounds[k];
                    if (background[backgroundTag] === sBackground[backgroundTag]) {
                        background["bg-index"] = sBackground["bg-index"];
                    }
                }
            }

            posTitle.background = posTitle.background.sort(function(a,b){
                var i1 = parseInt(a["bg-index"].substr(2));
                var i2 = parseInt(b["bg-index"].substr(2));

                if (i1 < i2) return -1;
                if (i1 > i2) return 1;
                return 0;
            });
            for (var j = 0; j < posTitle.background.length; j++) {
                var background = posTitle.background[j];
                background.percentage = roundTo(background.value/totalNumber,2);
                background.cumPercentage = cumulatePercentage;
                cumulatePercentage += background.percentage;
            }
        }


        for (var i = 0; i < $scope.backgrounds.length; i++) {
            var background = $scope.backgrounds[i];
            for (var j = 0; j < background.outcome.length; j++) {
                var outcome = background.outcome[j];

                var obj = {};
                obj.background = background[backgroundTag];
                obj.color = background.color;
                obj.position = outcome[posTitleTag];
                obj.bgIndex = background['bg-index'];
                obj.posIndex = outcome['pos-index'];
                obj.startCumPercentage = outcome.cumPercentage;
                obj.startPercentage = outcome.percentage;
                for (var q = 0; q < $scope.positionTitles.length; q++) {
                    var position = $scope.positionTitles[q];
                    if (position[posTitleTag] === obj.position) {
                        for (var r = 0; r < position.background.length; r++) {
                            var posBackground = position.background[r];
                            if (posBackground[backgroundTag] === obj.background) {
                                obj.endCumPercentage = posBackground.cumPercentage;
                                obj.endPercentage = posBackground.percentage;
                            }
                        }
                    }
                }

                // path
                var startX = $scope.anchors.leftX + $scope.anchors.leftColWidth;
                var startY = obj.startCumPercentage;
                var endX = $scope.anchors.rightX;
                var endY = obj.endCumPercentage;
                var startWidth = obj.startPercentage;
                var endWidth = obj.endPercentage;
                var xScale = $scope.anchors.xDis;
                var yScale = $scope.anchors.scale;
                var turnWeight = 0.3;
                var curveWeight = 100;
                var xOffset = 0;
                var yOffset = 30;

                obj.path = svgSankeyPath(startX, startY, endX, endY, startWidth, endWidth, xScale, yScale, turnWeight, curveWeight, xOffset, yOffset);
                $scope.backToCareerLinks.push(obj);
            }
        }

        // console.log($scope.backgrounds);
        // console.log($scope.positionTitles);
        // console.log($scope.backToCareerLinks);
    }

    // This is for static id, could be done in the data base
    // Ex. make columns for machine-friendly background, career
    insertUniqueEntry.uniqID = 0;

    // Load data, this part should be alined with Kevin's
    pathVizService.loadData2($scope.onDataLoaded);

    // options: 1 multiple class1
    //          2 multiple class2
    //          3 single
    $scope.hoverBackground = function(class1, class2, options) {
        jQuery('.highlighted').each(svgRemoveHighlightClass);

        if (options === 1) {
            jQuery('.'+class1).not('.'+class2).each(svgAddHighlightClass);
        } else if (options === 2) {
            jQuery('.'+class2).not('.'+class1).each(svgAddHighlightClass);
        }
        jQuery('.'+class1+'.'+class2).each(svgAddHighlightClass);
    }
  });
