var xml = require('xml');
var fs = require('fs');

var routeName = 'Col du Solude';

var elevation;
var line;

loadFile('elevation.json', function (data) {
	elevation = JSON.parse(data);

	loadFile('line1.json', function (data2) {
		line = JSON.parse(data2);

		convert();
	});
});

function loadFile(filename, callback) {
	fs.readFile(__dirname + '/' + filename, function (err, data) {
		if (err) {
			throw err;
		}

		callback(data);
	});
}

function convert() {
	var data = [{
		gpx: [
			{name: routeName},
			{
				wpt: [
					{_attr: {lat: line[0].points[0].lat, lon: line[0].points[0].lon}},
					{ele: elevation[0].valY},
					{name: "-" + routeName}
				]
			},
			{
				trk: [
					{name: "--" + routeName},
					{number: 1},
					{trkseg: []}
				]
			}
		]
	}];

	var trksegs = data[0].gpx[2].trk[2].trkseg;

	var distance = 0;
	var time = 0;

	for (var i = 0, l = line.length; i < l; i++) {
		for (var i2 = 0, l2 = line[i].points.length; i2 < l2; i2++) {
			var p = {
				trkpt: [
					{
						_attr: {
							lat: line[i].points[i2].lat,
							lon: line[i].points[i2].lon
						}
					},
					{ele: elevation[i].valY},
					{time: new Date(time).toISOString()}
				]
			};
			trksegs.push(p);

			time += 4560;
		}

		distance += line[i].distanceKm;
	}

	var a = xml(data, {declaration: true, indent: '  '});


	console.log(a);

//	console.log(distance + "km");
}

/*
 <?xml version="1.0" encoding="UTF-8"?>
 <gpx version="1.0">
 <name>Example gpx</name>
 <wpt lat="46.57638889" lon="8.89263889">
 <ele>2372</ele>
 <name>LAGORETICO</name>
 </wpt>
 <trk>
 <name>Example gpx</name>
 <number>1</number>
 <trkseg>
 <trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>
 <trkpt lat="46.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-14T10:10:52Z</time></trkpt>
 <trkpt lat="46.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-14T10:12:39Z</time></trkpt>
 <trkpt lat="46.57650000" lon="8.89280556"><ele>2373</ele><time>2007-10-14T10:13:12Z</time></trkpt>
 <trkpt lat="46.57638889" lon="8.89302778"><ele>2374</ele><time>2007-10-14T10:13:20Z</time></trkpt>
 <trkpt lat="46.57652778" lon="8.89322222"><ele>2375</ele><time>2007-10-14T10:13:48Z</time></trkpt>
 <trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>
 </trkseg>
 </trk>
 </gpx>
 */