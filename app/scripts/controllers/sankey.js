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
            background.percentage = background.value/totalNumber;
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
                outcome.percentage = outcome.value/totalNumber;
                outcome.cumPercentage = cumulatePercentage;
                cumulatePercentage += outcome.percentage;
            }
            
        }

        cumulatePercentage = 0;
        for (var i = 0; i < $scope.positionTitles.length; i++) {
            var posTitle = $scope.positionTitles[i];
            posTitle.percentage = posTitle.value/totalNumber;
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
                background.percentage = background.value/totalNumber;
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
                // function-ize this part!!!!!
                var ydiff = obj.endCumPercentage - obj.startCumPercentage;
                var turnX1 = 0;
                var turnX2 = 0

                var absYdiff = Math.abs(ydiff);
                var turnX1 = 0.3 - 0.3 * absYdiff;
                var turnX2 = 1 - turnX1;
                var ydrop = 0.1 * ydiff * $scope.anchors.scale;
                var slope = ydiff * $scope.anchors.scale / ((1-2*turnX1) * $scope.anchors.xDis);
                
                var cmds = [];
                // Move to P0
                cmds.push("M" + ($scope.anchors.leftX + $scope.anchors.leftColWidth) + "," + (obj.startCumPercentage * $scope.anchors.scale + 30));
                /*if (ydiff !== 0 ) {
                    var x1 = (0.1 * $scope.anchors.xDis);
                    var y1 = ydrop;
                    var x2 = (-y1 + slope * x1 ) / slope;
                    cmds.push("q" + x2 + "," + 0 + " " + (0.1 * $scope.anchors.xDis) + "," + ydrop);
                }
                
                if (ydiff !== 0 ) {
                    cmds.push("L" + ($scope.anchors.rightX - (turnX1+0.1) * $scope.anchors.xDis) + "," + (obj.endCumPercentage * $scope.anchors.scale - ydrop + 30));
                    var x2 = (ydrop) / slope;
                    cmds.push("q" + x2 + "," + ydrop + " " + (0.1 * $scope.anchors.xDis) + "," + ydrop);
                } else {
                    cmds.push("L" + ($scope.anchors.rightX - turnX1 * $scope.anchors.xDis) + "," + (obj.endCumPercentage * $scope.anchors.scale + 30));
                }*/
                if (ydiff !== 0 ) {
                    cmds.push("l" + (turnX1 * $scope.anchors.xDis) + "," + 0); // Turn X1
                    cmds.push("c" + "100,0 " + ((1 - 2 * turnX1)*$scope.anchors.xDis - 100) + "," + (ydiff*$scope.anchors.scale) + " " + ((1 - 2 * turnX1) * $scope.anchors.xDis) + "," + (ydiff*$scope.anchors.scale));
                    cmds.push("l" + (turnX1 * $scope.anchors.xDis) + "," + 0); // Turn X2
                } else {
                    cmds.push("L" + ($scope.anchors.rightX) + "," + (obj.endCumPercentage * $scope.anchors.scale + 30));
                }

                //cmds.push("l" + (turnX1 * $scope.anchors.xDis) + "," + 0); // Turn X2
                cmds.push("l" + 0 + "," + obj.endPercentage * $scope.anchors.scale);
                /*cmds.push("l" + (-(turnX1) * $scope.anchors.xDis) + "," + 0);
                if (ydiff !== 0 ) {
                    var x1 = -(0.1 * $scope.anchors.xDis);
                    var y1 = -ydrop;
                    var x2 = (-y1 + slope * x1 ) / slope;
                    cmds.push("q" + x2 + "," + 0 + " " + (-0.1 * $scope.anchors.xDis) + "," + -ydrop);
                }

                if (ydiff !== 0 ) {
                    cmds.push("L" + ($scope.anchors.leftX + $scope.anchors.leftColWidth + (turnX1+0.1) * $scope.anchors.xDis) + "," + ((obj.startCumPercentage + obj.startPercentage) * $scope.anchors.scale + ydrop + 30));
                    var x2 = (-ydrop) / slope;
                    cmds.push("q" + x2 + "," + -ydrop + " " + -(0.1 * $scope.anchors.xDis) + "," + -ydrop);
                } else {
                    cmds.push("L" + ($scope.anchors.leftX + $scope.anchors.leftColWidth + turnX1 * $scope.anchors.xDis) + "," + ((obj.startCumPercentage + obj.startPercentage) * $scope.anchors.scale + 30));
                }
                //cmds.push("L" + ($scope.anchors.leftX + $scope.anchors.leftColWidth + turnX1 * $scope.anchors.xDis) + "," + ((obj.startCumPercentage + obj.startPercentage) * $scope.anchors.scale + 30));
                cmds.push("l" + (-turnX1 * $scope.anchors.xDis) + "," + 0); */
                if (ydiff !== 0 ) {
                    cmds.push("l" + (-turnX1 * $scope.anchors.xDis) + "," + 0); // Turn X2
                    cmds.push("c" + "-100,0 " + (100 - (1 - 2 * turnX1) * $scope.anchors.xDis) + "," + (-ydiff*$scope.anchors.scale) + " " + -((1 - 2 * turnX1) * $scope.anchors.xDis) + "," + (-ydiff*$scope.anchors.scale) );
                    cmds.push("l" + (-turnX1 * $scope.anchors.xDis) + "," + 0); // Turn X1
                } else {
                    cmds.push("L" + ($scope.anchors.leftX + $scope.anchors.leftColWidth) + "," + ((obj.endCumPercentage + obj.endPercentage) * $scope.anchors.scale + 30));
                }
                cmds.push("z");

                obj.path = cmds.join(" ");
                $scope.backToCareerLinks.push(obj);
            }
        }

        console.log($scope.backgrounds);
        console.log($scope.positionTitles);
        console.log($scope.backToCareerLinks);
    }

    // This is for static id, could be done in the data base
    // Ex. make columns for machine-friendly background, career
    insertUniqueEntry.uniqID = 0;

    // Load data, this part should be alined with Kevin's
    pathVizService.loadData2($scope.onDataLoaded);

    $scope.hoverBackground = function(class1, class2) {
        jQuery('.highlighted').each(svgRemoveHighlightClass);
        jQuery('.'+class1+'.'+class2).each(svgAddHighlightClass);
    }
  });
