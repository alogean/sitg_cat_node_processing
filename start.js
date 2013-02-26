var processor = require('./process_cat.js');

var cat = processor.travers_sitg_xml_cat('./sitg_catalog');

console.log(JSON.stringify(cat));