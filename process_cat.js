/*

prerequest:
  --> npm install findit
  --> npm install xmldom
  --> rpm install xpath.js

*/


function getVal(myarray) {
    if (myarray[0]) {
        return myarray[0].toString().replace(","," ").replace("\n", " ");
    } else {
        return "";
    }

}

function dataset(doc, filename) {
    var dataset = {},
        select = require('xpath.js');
    dataset.filename = filename;
    dataset.content = getVal(select(doc, "//idAbs/text()"));
    dataset.title = getVal(select(doc, "//idCitation/resTitle/text()"));
    dataset.acronyme = getVal(select(doc, "//rpXTOrgAcronym/text()"));
    dataset.department = getVal(select(doc, "//rpXTPartName/text()"));
    dataset.organisation = getVal(select(doc, "//rpOrgName/text()"));
    dataset.topic = getVal(select(doc, "/metadata/dataIdInfo/tpCat/descXT/text()"));
    return dataset;
}

exports.travers_sitg_xml_cat = function (directory) {
    //console.log("filename, title, topic, organisation, acronyme, departement, title");
    //console.log("acronyme, title");
    
    var cat = [],
        finder = require('findit').find(directory),
        fs = require('fs'),
        dom = require('xmldom').DOMParser;
        //output = fs.createWriteStream(outputfile);

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