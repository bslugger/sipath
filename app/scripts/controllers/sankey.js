'use strict';

angular.module('a3App')
  .controller('SankeyCtrl', function ($scope, pathVizService) {
    /**
     * Sankey's layout parameters
     */
    $scope.svg = {
        width: 900,
        height: 800,
        yOffset: 0
    };
    $scope.anchors = {
        leftX: 0,
        rightX: 700,
        xDis: 550,
        leftColWidth: 150,
        rightColWidth: 150,
        scale: 385,
        minHeight: 10,
        borderWidth: 1,
        borderColor: "#E6E6E6"
    };
    $scope.uiParam = {
        offset: 0,
    };

    $scope.highlightBar = {
        offset: 2,
        width: 4
    };

    /**
     * caculated layout parameters based on svg size
     */
    $scope.anchors.xDis = $scope.svg.width - $scope.anchors.leftColWidth - $scope.anchors.rightColWidth;
    $scope.anchors.rightX = $scope.svg.width - $scope.anchors.rightColWidth;
    

    /**
     *  UI Util
     *  Color and Text size
     */
    var backgroundColor = [
        "#1C364C",
        "#2A5172",
        "#386C98",
        "#6089AD",
        "#80A1BD",
        "#bf812d",
        "#dfc27d",
        "#f6e8c3",
        "#f5f5f5",
        "#c7eae5",
        "#80cdc1",
        "#35978f",
        "#01665e"
    ];

    var posColor = [
        "#082D1D",
        "#115B3A",
        "#1A8856",
        "#22B573",
        "#35978f",
        "#4EC48F"
    ];

    /**
     *  Function for AngularJS HTML DOM get 
     *  interaction state
     */
    backgroundColor.getNext = getNext;
    posColor.getNext = getNext;
    $scope.labelSize = labelSize;
    $scope.isSelected = isSelected;
    $scope.isHighlighted = isHighlighted;  

    /**
     *  Parameters for User highlight/selection state
     */
    $scope.predicate = "-value"; // not sure what it is
    $scope.highlightedBgIndex = -1;
    $scope.highlightedPosIndex = -1;
    $scope.selectedBgIndex = -1;
    $scope.selectedPosIndex = -1;
    $scope.selectedBgName = pathVizService.selectedBgName;
    $scope.selectedPosName = pathVizService.selectedPosName;

    

    /**
     * UI Util
     */
    function labelSize(width, height, scaleWidth, scaleHeight) {
        var wSize = width * scaleWidth;
        var hSize = height * scaleHeight;
        return (hSize > wSize)? wSize : hSize;
    }

    /**
     * if iterate === true
     *     The whole Background/Position block will be highlighted
     *     once one of it's child is highlighted
     * if iterate !=== true
     *     Only the highlighted child will be highlighted, other
     *     element in the same group remain the same.
     * 
     * Check if certain HTML Element is Highlighted
     * @param  {int}    bgKey   
     * @param  {int}    posKey  
     * @param  {bool}   iterate iterate through each element 
     * @param  {Array}  data    input Array Data (bg or pos)
     * @param  {int}    option  
     *         0 : bg Array with pos Data as an element
     *         1 : pos Array with bg Data as an element
     * @return {Boolean}    highlighted status
     */
    function isHighlighted(bgKey, posKey, iterate, data, option) {
        var hBgIndex = $scope.highlightedBgIndex;
        var hPosIndex = $scope.highlightedPosIndex;
        var label = '';
        if (typeof option === 'undefined') {
            option = 0;
        }
        if (option === 0) {
            label = 'positions';
        } else {
            label = 'backgrounds';
        }
        if (iterate) {
            var check = true;
            if (hBgIndex !== -1 && hPosIndex !== -1) {
                if (option === 0) {
                    check = (bgKey === hBgIndex);
                } else if (option === 1) {
                    check = (posKey === hPosIndex);
                }
            }
            if (check) {
                for (var entryKey in data[label]) {
                    var entry = data[label][entryKey];
                    if (option === 0) {
                        if (hPosIndex === entryKey) {
                            return true;
                        }
                    } else if (option === 1) {
                        if (hBgIndex === entryKey) {
                            return true;
                        }
                    }
                }
            }
        }
        {
            if (hBgIndex !== -1 && hPosIndex !== -1) {
                return (bgKey === hBgIndex) && (posKey === hPosIndex);
            } else if (hBgIndex !== -1) {
                return (bgKey === hBgIndex);
            } else if (hPosIndex !== -1) {
                return (posKey === hPosIndex);
            }
        }
    }

    /**
     * if iterate === true
     *     The whole Background/Position block will be selected
     *     once one of it's child is selected
     * if iterate !=== true
     *     Only the selected child will be selected, other
     *     element in the same group remain the same.
     * 
     * Check if certain HTML Element is Selected
     * @param  {int}    bgKey   
     * @param  {int}    posKey  
     * @param  {bool}   iterate iterate through each element 
     * @param  {Array}  data    input Array Data (bg or pos)
     * @param  {int}    option  
     *         0 : bg Array with pos Data as an element
     *         1 : pos Array with bg Data as an element
     * @return {Boolean}    selected status
     *
     * TODO:// This part of code is exactly as same as isHighlighted.
     *         Combine them together later.
     */
    function isSelected(bgKey, posKey, iterate, data, option) {
        var sBgIndex = $scope.selectedBgIndex;
        var sPosIndex = $scope.selectedPosIndex;
        var label = '';
        if (typeof option === 'undefined') {
            option = 0;
        }
        if (option === 0) {
            label = 'positions';
        } else {
            label = 'backgrounds';
        }
        if (iterate) {
            var check = true;
            if (sBgIndex !== -1 && sPosIndex !== -1) {
                if (option === 0) {
                    check = (bgKey === sBgIndex);
                } else if (option === 1) {
                    check = (posKey === sPosIndex);
                }
            }
            if (check) {
                for (var entryKey in data[label]) {
                    var entry = data[label][entryKey];
                    if (option === 0) {
                        if (sPosIndex === entryKey) {
                            return true;
                        }
                    } else if (option === 1) {
                        if (sBgIndex === entryKey) {
                            return true;
                        }
                    }
                }
            }
        }
        {
            if (sBgIndex !== -1 && sPosIndex !== -1) {
                return (bgKey === sBgIndex) && (posKey === sPosIndex);
            } else if (sBgIndex !== -1) {
                return (bgKey === sBgIndex);
            } else if (sPosIndex !== -1) {
                return (posKey === sPosIndex);
            }
        }

        return false;
    }

    /**
     * UI Interaction Function
     */

    /**
     * mark element as highlighted when user's mouse over
     * @param  {string} class1  bg-[index] ex. bg-0, bg-1
     * @param  {string} class2  pos-[index] ex. pos-0, pos-1
     * @param  {int}    options 
     *         1 highlight all elements have same bg-[index]
     *         2 highlight all elements have same pos-[index]
     *         3 highlight elements have exactly match of 
     *           both bg- and pos-[index]
     */
    $scope.hoverBackground = function(class1, class2, options) {
        
        var class1Index = class1.split("-")[1];
        var class2Index = class2.split("-")[1];
        if (options === 1) {
            // heighlight all same background
            $scope.highlightedBgIndex = class1Index

        } else if (options === 2) {
            $scope.highlightedPosIndex = class2Index
        } else if (options === 0) {
            $scope.highlightedBgIndex = class1Index;
            $scope.highlightedPosIndex = class2Index;
        }
    }

    /**
     * remove all highlighted status when mouse out
     */
    $scope.leaveHighlightedArea = function() {
        $scope.highlightedBgIndex = -1;
        $scope.highlightedPosIndex = -1;

    }

    /**
     * mark element as selected/deselect when user clicks on it
     *     if the clicked element is not selected, select it
     *     if the clicked element is selected, deselect it
     * @param  {string} class1  bg-[index] ex. bg-0, bg-1
     * @param  {string} class2  pos-[index] ex. pos-0, pos-1
     * @param  {int}    options 
     *         1 select all elements have same bg-[index]
     *         2 select all elements have same pos-[index]
     *         3 select elements have exactly match of 
     *           both bg- and pos-[index]
     */
    $scope.clickBackground = function(class1, class2, options) {
        // class1 - background;
        // class2 - position;    
        var class1Index = class1.split("-")[1];
        var class2Index = class2.split("-")[1];

        var selectedBg = $scope.selectedBgIndex;
        var selectedPos = $scope.selectedPosIndex;

        if (options === 0) {
            if (selectedBg === class1Index && selectedPos === class2Index) {
                selectedBg = -1;
                selectedPos = -1;
            } else {
                selectedBg = class1Index;
                selectedPos = class2Index;
            }

        } else if (options === 1) {
            if (selectedBg === class1Index) {
                selectedBg = -1;
            } else {
                selectedBg = class1Index;
            }

        } else if (options === 2) {
            if (selectedPos === class2Index) {
                selectedPos = -1;
            } else {
                selectedPos = class2Index;
            }
        }

        $scope.selectedBgIndex = selectedBg;
        $scope.selectedPosIndex = selectedPos;
        $scope.selectedBgName.value = $scope.backgroundIdTable[$scope.selectedBgIndex];
        $scope.selectedPosName.value = $scope.jobIdTable[$scope.selectedPosIndex];

        //console.log($scope.selectedBgName.value);
        //console.log($scope.selectedPosName.value);
    }

    /**
     * Data Manipulate Function
     */
     
    function updateCategoryData(data, table, firstId, secondId, secondLabel, colorArr) {
        var result = {};
        for (var tbId in table) {
            var tableEntry = table[tbId];
            var tableKey = tbId;
            var object = {};
            //object.background_id = tableKey;
            object.peopleCount = 0;
            object.color = colorArr.getNext();
            object[secondLabel] = {};
            result[tbId] = object;
        }

        for (var i = 0; i < data.length; i++) {
            var entry = data[i];
            var mFirstId = entry[firstId];
            var mSecondId = entry[secondId];
            result[mFirstId].peopleCount++;
            if (typeof result[mFirstId][secondLabel][mSecondId] === 'undefined') {
                result[mFirstId][secondLabel][mSecondId] = {};
                result[mFirstId][secondLabel][mSecondId].peopleCount = 1;
            } else {
                result[mFirstId][secondLabel][mSecondId].peopleCount++;
            }

        }
        return result;
    }

    function updateCategoryRect(dataArr, secondLabel) {
        var totalNumber = $scope.totalNumber;
        var scale = $scope.anchors.scale;
        var cumPercentage = 0;
        for (var firstDataKey in dataArr) {
            //console.log(dataKey);
            var firstData = dataArr[firstDataKey];
            var firstPercentage = 0;
            firstData.cumPercentage = cumPercentage;
            for (var secondDataKey in firstData[secondLabel]) {
                var secondData = firstData[secondLabel][secondDataKey];
                var tmp = roundTo(secondData.peopleCount/totalNumber * $scope.anchors.scale, 0);
                secondData.percentage = (tmp > $scope.anchors.minHeight)?tmp:$scope.anchors.minHeight;
                firstPercentage += secondData.percentage;
                secondData.cumPercentage = cumPercentage;
                cumPercentage += secondData.percentage;
                firstPercentage = roundTo(firstPercentage, 2);
                cumPercentage = roundTo(cumPercentage, 2);
            }
            firstData.percentage = firstPercentage;
        }
        $scope.totalPercentage = cumPercentage;
    }

    function updateSankeyPath() {
        var paths = $scope.sankeyPaths;
        var bgData = $scope.backgroundData;
        var posData = $scope.positionData;
        console.log(bgData);
        for (var bgKey in bgData) {
            var background = bgData[bgKey];
            for (var posKey in background['positions']) {
                var position = background['positions'][posKey];
                var obj = {};
                obj.bgId = bgKey;
                obj.bgColor = background.color;
                obj.posId = posKey;
                obj.posColor = posData[posKey].color;
                obj.startCumPercentage = position.cumPercentage;
                obj.startPercentage = position.percentage;
                obj.endCumPercentage = posData[posKey]['backgrounds'][bgKey].cumPercentage;
                obj.endPercentage = posData[posKey]['backgrounds'][bgKey].percentage;

                // path
                var startX = $scope.anchors.leftX + $scope.anchors.leftColWidth;
                var startY = obj.startCumPercentage;
                var endX = $scope.anchors.rightX;
                var endY = obj.endCumPercentage;
                var startWidth = obj.startPercentage;
                var endWidth = obj.endPercentage;
                var xScale = $scope.anchors.xDis;
                var yScale = 1;//$scope.anchors.scale;
                var turnWeight = 0.3;
                var curveWeight = 100;
                var xOffset = 0;
                var yOffset = $scope.svg.yOffset;
                obj.path = svgSankeyPath(startX, startY, endX, endY, startWidth, endWidth, xScale, yScale, turnWeight, curveWeight, xOffset, yOffset, $scope.totalPercentage);
                paths.push(obj);
            }
        }        
    }

    /**
     *  Main Function Part
     */
    console.log("==== SANKEY ====");
    $scope.backgroundIdTable = pathVizService.backgroundIdTable;
    $scope.jobIdTable = pathVizService.jobIdTable;
    $scope.alumniData = pathVizService.alumniDataSankey;
    //console.log($scope.backgroundIdTable);
    //console.log($scope.jobIdTable);
    //console.log($scope.alumniData);
    
    $scope.totalPercentage = 0;
    $scope.totalNumber = $scope.alumniData.length;
    $scope.backgroundData = updateCategoryData($scope.alumniData, $scope.backgroundIdTable, "background_id", "position_id", "positions",backgroundColor);
    //console.log($scope.backgroundData);
    $scope.positionData = updateCategoryData($scope.alumniData, $scope.jobIdTable, "position_id", "background_id", "backgrounds",posColor);
    $scope.sankeyPaths = [];
    //console.log($scope.positionData);
    updateCategoryRect($scope.backgroundData, 'positions');
    updateCategoryRect($scope.positionData, 'backgrounds');
    updateSankeyPath();
    console.log($scope.totalPercentage);

  });
