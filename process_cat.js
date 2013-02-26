/*

The following node.js modules must be installed :

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

//
// Function that takes as input a DOM object and a string filename, 
// extracts the needed informations by using different xpath expressions and
// return a dataset object
//
function process_xml(doc, file_name) {
    
    var ds = {},
        select = require('xpath.js');

    ds.fileName     = file_name;
    ds.content      = format_xpath_result(select(doc, "//idAbs/text()"));
    ds.title        = format_xpath_result(select(doc, "//idCitation/resTitle/text()"));
    ds.acronyme     = format_xpath_result(select(doc, "//rpXTOrgAcronym/text()"));
    ds.department   = format_xpath_result(select(doc, "//rpXTPartName/text()"));
    ds.organisation = format_xpath_result(select(doc, "//rpOrgName/text()"));
    ds.topic        = format_xpath_result(select(doc, "/metadata/dataIdInfo/tpCat/descXT/text()"));
    
    return ds;
}


//
// Function that goes recursivelly through all the directories contained in { root_directory } and return
// an array of Dataset objects.
//
exports.travers_sitg_xml_cat = function (root_directory) {
    
    var catalog_array = [],
        finder = require('findit').find(root_directory),
        fs = require('fs'),
        dom = require('xmldom').DOMParser;

    //This listens for files found
    finder.on('file', function (file) {

        var filename = file.split("/").last

        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            // creation of a DOM object
            var doc = new dom().parseFromString(data);

            // extract the needed information and return a dataset object
            var dataset = process_xml(doc, filename);

            // add the dataset object to the catalog
            catalog_array[catalog_array.length] = dataset;
        });
    });

    return catalog_array;

}