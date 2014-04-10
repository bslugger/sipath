function csvJSON(csv, strDelimiter ){
  strDelimiter = (strDelimiter || ",");
  var lines=csv.match(/[^\r\n]+/g);
 
  var result = [];

  console.log(lines.length);

  var objPattern = new RegExp(
    (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );
  var headers=lines[0].split(',');
 
  for(var i=1;i<lines.length;i++) {
      var j = 0;
      var obj = {};

      var currentline=lines[i];

      while (arrMatches = objPattern.exec(currentline)) {
        if (arrMatches[ 2 ]) {
          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          var strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );
        } else {
          // We found a non-quoted value.
          var strMatchedValue = arrMatches[ 3 ];
        }
        obj[headers[j]] = strMatchedValue;
        j++;
      }
      
 
      //for(var j=0;j<headers.length;j++){
      //    obj[headers[j]] = currentline[j];
      //}
 
      result.push(obj);
 
  }
  //return result; //JavaScript object
  return {
    "contents": result,
    "headers": headers
  }; //JSON
}