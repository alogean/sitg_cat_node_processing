/*

This modul dpends of the following modules:

  --> npm install findit
  --> npm install xmldom
  --> rpm install xpath.js

*/

function format_xpath_result(myarray) {
    if (myarray[0]) {
        return myarray[0].toString().replace(","," ").replace("\n", " ");
    } else {
        return "";
    }

}

/*

*/
function dataset(doc, file_name) {
    
    var ds = {},
        select = require('xpath.js');

    ds.fileName     = file_name;
    ds.content      = format_xpath_result(select(doc, "//idAbs/text()"));
    ds.title        = format_xpath_result(select(doc, "//idCitation/resTitle/text()"));
    ds.acronyme     = format_xpath_result(select(doc, "//rpXTOrgAcronym/text()"));
    ds.department   = format_xpath_result(select(doc, "//rpXTPartName/text()"));
    ds.organisation = format_xpath_result(select(doc, "//rpOrgName/text()"));
    ds.topic        = format_xpath_result(select(doc, "/metadata/dataIdInfo/tpCat/descXT/text()"));

    return dataset;
}

/*

This function go recursivelly through all the directories, parse all the xml files 
and put the xpath results in a dataset object.

*/
exports.travers_sitg_xml_cat = function (directory) {

    //console.log("filename, title, topic, organisation, acronyme, departement, title");
    //console.log("acronyme, title");
    
    var cat = [],
        finder = require('findit').find(directory),
        fs = require('fs'),
        dom = require('xmldom').DOMParser;

    //This listens for files found
    finder.on('file', function (file) {

        var filename = file.split("/").last
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var doc = new dom().parseFromString(data);
            var ds = dataset(doc, filename);
            cat[cat.length] = ds;
            //console.log(ds.filename + "," + ds.title + "," + ds.topic + "." + ds.organisation + "," + ds.acronyme + "," + ds.department + "," + ds.title);
            console.log(ds.topic + "," + ds.title);
        });
    });

    return cat;


}