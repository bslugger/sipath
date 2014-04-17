'use strict';

angular.module('a3App')
  .controller('SankeyCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 900,
        height: 450,
        yOffset: 0
    };
    $scope.anchors = {
        leftX: 0,
        rightX: 700,
        xDis: 550,
        leftColWidth: 150,
        rightColWidth: 150,
        scale: 400,
        baseHeight: 0
    };

    $scope.anchors.xDis = $scope.svg.width - $scope.anchors.leftColWidth - $scope.anchors.rightColWidth;
    $scope.anchors.rightX = $scope.svg.width - $scope.anchors.rightColWidth;

    $scope.data = [1, 2, 3];
    $scope.backgrounds = [];
    $scope.positionTitles = [];
    $scope.backToCareerLinks = [];
    $scope.predicate = "-value";
    $scope.selectedBg = "";
    $scope.selectedPos = "";
    $scope.selectedBgName = "";
    $scope.selectedPosName = "";
    $scope.backToCareerLinks.filterWithClass = filterWithClass;
    $scope.isSelected = isSelected;
    $scope.labelSize = labelSize;


    var backgroundTag;
    var posTitleTag;

    function labelSize(width, height, scaleWidth, scaleHeight) {
        var wSize = width * scaleWidth;
        var hSize = height * scaleHeight;
        return (hSize > wSize)? wSize : hSize;
    }

    function indexToName(index, key, arr) {
        if (index === "") {
            return "";
        }
        for (var i = 0; i < arr.length; i++) {
            var entry = arr[i];
            if (entry[key] === index) {
                return entry.name;
            }
        }
        return "";
    }

    // option 0: only bg
    // option 1: only pos
    // option 2: both
    function filterWithClass(bgIndex, posIndex, option) {
        var resultArr = [];
        var inputArr = this;
        if (typeof option === 'undefined') {
            option = 0;
        }
        for (var i = 0; i < inputArr.length; i++) {
            var input = inputArr[i];
            if (option === 0) {
                // background
                if (input.bgIndex === bgIndex) {
                    resultArr.push(input);
                }
            } else if (option === 1) {
                if (input.posIndex === posIndex) {
                    resultArr.push(input);
                }
            } else if (option === 2) {
                if (input.bgIndex === bgIndex && input.position === posIndex) {
                    resultArr.push(input);
                }
            }
        }
        return resultArr;
    }

    // option 0: bg
    // option 1: pos
    function isSelected(index, option) {
        if (typeof option === 'undefined') {
            option = 0;
        }
        if (option === 0) {
            if ($scope.selectedBg === index) {
                return true;
            }
        } else if (option === 1) {
            if ($scope.selectedPos === index) {
                return true;
            }
        }

        return false;
    }

    function insertUniqueEntry(targetArr, input, inputTag, prefix) {
        var insertIndex = -1;
        angular.forEach(targetArr, function(entry, index) {
            if (insertIndex === -1) {
                if (entry.name === input) {
                    insertIndex = index;
                    return;
                }
            }
        });

        if (insertIndex === -1) {
            var object = {};
            object.name = input;
            object["value"] = 1;
            if (typeof prefix !== 'undefined') {
                object[prefix+"Index"] = prefix+insertUniqueEntry.uniqID;
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
        console.log(data.headers);
        var contents = data.contents;
        var headers = data.headers;

        // Debug use
        backgroundTag = headers[22];
        posTitleTag = headers[5];
        var totalNumber = contents.length;
        console.log (backgroundTag);
        console.log (posTitleTag);

        angular.forEach(contents, function(content) {
            var mBackground = content[backgroundTag];
            var mPosTitle = content[posTitleTag];

            // add unique background
            insertUniqueEntry($scope.backgrounds, mBackground, backgroundTag, "bg");

            angular.forEach($scope.backgrounds, function(background) {
                if (typeof background.outcome === 'undefined') {
                    background.outcome = [];
                }
                if (background.name === mBackground) {
                    insertUniqueEntry(background.outcome, mPosTitle, posTitleTag);
                }
            });

            // add unique position title
            insertUniqueEntry($scope.positionTitles, mPosTitle, posTitleTag, "pos");
            angular.forEach($scope.positionTitles, function(position) {
                if (typeof position.background === 'undefined') {
                    position.background = [];
                }
                if (position.name === mPosTitle) {
                    insertUniqueEntry(position.background, mBackground, backgroundTag);
                }
            });
        });
        
        var cumulatePercentage = 0;
        for (var i = 0; i < $scope.backgrounds.length; i++) {
            var background = $scope.backgrounds[i];
            background.percentage = 0;//roundTo(background.value/totalNumber,2);
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
                    if (outcome.name === posTitle.name) {
                        outcome["posIndex"] = posTitle["posIndex"];
                    }
                }
            }

            background.outcome = background.outcome.sort(function(a,b){
                var i1 = parseInt(a["posIndex"].substr(3));
                var i2 = parseInt(b["posIndex"].substr(3));

                if (i1 < i2) return -1;
                if (i1 > i2) return 1;
                return 0;
            });

            for (var j = 0; j < background.outcome.length; j++) {
                var outcome = background.outcome[j];
                outcome.percentage = roundTo(outcome.value/totalNumber,2);
                background.percentage += outcome.percentage;
                outcome.cumPercentage = cumulatePercentage;
                cumulatePercentage += outcome.percentage;
            }
            
        }

        cumulatePercentage = 0;
        for (var i = 0; i < $scope.positionTitles.length; i++) {
            var posTitle = $scope.positionTitles[i];
            posTitle.percentage = 0;// = roundTo(posTitle.value/totalNumber,2);
            posTitle.cumPercentage = cumulatePercentage;
            posTitle.color = getRandomColor();
            for (var j = 0; j < posTitle.background.length; j++) {
                var background = posTitle.background[j];
                //background.percentage = background.value/totalNumber;
                //background.cumPercentage = cumulatePercentage;
                //cumulatePercentage += background.percentage;
                for (var k = 0; k < $scope.backgrounds.length; k++) {
                    var sBackground = $scope.backgrounds[k];
                    if (background.name === sBackground.name) {
                        background["bgIndex"] = sBackground["bgIndex"];
                    }
                }
            }

            posTitle.background = posTitle.background.sort(function(a,b){
                var i1 = parseInt(a["bgIndex"].substr(2));
                var i2 = parseInt(b["bgIndex"].substr(2));

                if (i1 < i2) return -1;
                if (i1 > i2) return 1;
                return 0;
            });
            for (var j = 0; j < posTitle.background.length; j++) {
                var background = posTitle.background[j];
                background.percentage = roundTo(background.value/totalNumber,2);
                posTitle.percentage += background.percentage;
                background.cumPercentage = cumulatePercentage;
                cumulatePercentage += background.percentage;
            }
            //cumulatePercentage = roundTo(cumulatePercentage, 2);
            //posTitle.percentage = roundTo(posTitle.percentage, 2);
        }


        for (var i = 0; i < $scope.backgrounds.length; i++) {
            var background = $scope.backgrounds[i];
            for (var j = 0; j < background.outcome.length; j++) {
                var outcome = background.outcome[j];

                var obj = {};
                obj.background = background.name;
                obj.startColor = background.color;
                obj.position = outcome.name;
                obj.bgIndex = background['bgIndex'];
                obj.posIndex = outcome['posIndex'];
                obj.startCumPercentage = outcome.cumPercentage;
                obj.startPercentage = outcome.percentage;
                for (var q = 0; q < $scope.positionTitles.length; q++) {
                    var position = $scope.positionTitles[q];
                    if (position.name === obj.position) {
                        for (var r = 0; r < position.background.length; r++) {
                            var posBackground = position.background[r];
                            if (posBackground.name === obj.background) {
                                obj.endColor = position.color;
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
                var yOffset = $scope.svg.yOffset;

                obj.path = svgSankeyPath(startX, startY, endX, endY, startWidth, endWidth, xScale, yScale, turnWeight, curveWeight, xOffset, yOffset);
                obj.highlighted = false;
                obj.selected = false;
                $scope.backToCareerLinks.push(obj);
            }
        }

        console.log($scope.backgrounds);
        console.log($scope.positionTitles);
        console.log($scope.backToCareerLinks);
        //$scope.backToCareerLinks.filterWithClass();
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
        for (var i = 0; i < $scope.backToCareerLinks.length; i++) {
            var obj = $scope.backToCareerLinks[i];
            obj.highlighted = false;
            if (options === 1) {
                if (obj.bgIndex === class1) {
                    obj.highlighted = true;
                }
            } else if (options === 2) {
                if (obj.posIndex === class2) {
                    obj.highlighted = true;
                }
            } else if (options === 0) {
                if (obj.bgIndex === class1 && obj.posIndex === class2) {
                        obj.highlighted = true;
                }
            }

        }
    }

    $scope.leaveHighlightedArea = function() {
        for (var i = 0; i < $scope.backToCareerLinks.length; i++) {
            var obj = $scope.backToCareerLinks[i];
            obj.highlighted = false;
        }
    }

    $scope.clickBackground = function(class1, class2, options) {
        var selectedBg = $scope.selectedBg;
        var selectedPos = $scope.selectedPos;
        if (options === 0) {
            if (selectedBg === class1 && selectedPos === class2) {
                selectedBg = "";
                selectedPos = "";
            } else {
                selectedBg = class1;
                selectedPos = class2;
            }

        } else if (options === 1) {
            if (selectedBg === class1) {
                selectedBg = "";
            } else {
                selectedBg = class1;
            }

        } else if (options === 2) {
            if (selectedPos === class2) {
                selectedPos = "";
            } else {
                selectedPos = class2;
            }
        }

        
        for (var i = 0; i < $scope.backToCareerLinks.length; i++) {
            var obj = $scope.backToCareerLinks[i];
            obj.selected = false;
            if (selectedBg === "" && selectedPos === "") {
                continue;
            }
            if ((selectedBg === "" || obj.bgIndex === selectedBg) && (selectedPos === "" || obj.posIndex === selectedPos)) {
                obj.selected = true;
            }

        }

        $scope.selectedBg = selectedBg;
        $scope.selectedPos = selectedPos;
        $scope.selectedBgName = indexToName($scope.selectedBg, "bgIndex", $scope.backgrounds);
        $scope.selectedPosName = indexToName($scope.selectedPos, "posIndex", $scope.positionTitles);
    }
  });
