$.get("base32servlet", null, function(data) {
	var MAXLAT = 44;
	var MINLAT = 40;
	var MAXLNG = 120;
	var MINLNG = 114;
	var HASHLENGTH = 4;
	var LATLENGTH = 10;
	var LNGLENGTH = 10;


	str = data.split("@");
	var byte_string = deBase32(str[2]);
	var lat_byte_array = deBytes("lat", byte_string);
	var lng_byte_array = deBytes("lng", byte_string);

	var arrayObj=deGeohash(lat_byte_array, lng_byte_array);
	

})




function deGeohash(array1, array2) {
		var arrayObj = new Array();
		var latarray = new Array();
		var lngarray = new Array();
		var latbytearray = array1;
		var lngbytearray = array2;

		for (var i = 0; i <= latbytearray.length; i++) {
			latarray[i] = MINLAT + parseInt(latbytearray[i], 2)
					* (MAXLAT - MINLAT) / Math.pow(2, LATLENGTH);
			lngarray[i] = MINLNG + parseInt(lngbytearray[i], 2)
					* (MAXLNG - MINLNG) / Math.pow(2, LNGLENGTH);
			arrayObj.push(lonToMercator(lngarray[i]));
			arrayObj.push(latToMercator(latarray[i]));
		}
		return arrayObj;

	}

	function deBytes(judge, str) {
		var bytechar = new Array();
		var latbytearray = new Array();
		var lngbytearray = new Array();
		bytechar = str;
		var latbytestring = '';
		var lngbytestring = '';

		for (var i = 0; i < bytechar.length; i++) {
			if (i % 2 == 0) {
				latbytestring += bytechar[i];
			} else {
				lngbytestring += bytechar[i];
			}
		}

		for (var i = 0; i < latbytestring.length / LATLENGTH; i++) {
			latbytearray[i] = latbytestring.substring(i * LATLENGTH, (i + 1)
					* LATLENGTH);

		}

		for (var i = 0; i < lngbytestring.length / LNGLENGTH; i++) {
			lngbytearray[i] = lngbytestring.substring(i * LNGLENGTH, (i + 1)
					* LNGLENGTH);
		}
		if (judge == "lat") {
			return latbytearray;
		} else if (judge == "lng") {
			return lngbytearray;
		} else {
			return 0;
		}

	}

	function deBase32(str) {
		var base32char = new Array();
		var bytearray = "";
		base32char = str;
		console.log(base32char.length);
		for (var i = 0; i < 10000; i++) {
			switch (base32char[i]) {
			case '0':
				x = "00000";
				break;
			case '1':
				x = "00001";
				break;
			case '2':
				x = "00010";
				break;
			case '3':
				x = "00011";
				break;
			case '4':
				x = "00100";
				break;
			case '5':
				x = "00101";
				break;
			case '6':
				x = "00110";
				break;
			case '7':
				x = "00111";
				break;
			case '8':
				x = "01000";
				break;
			case '9':
				x = "01001";
				break;
			case 'b':
				x = "01010";
				break;
			case 'c':
				x = "01011";
				break;
			case 'd':
				x = "01100";
				break;
			case 'e':
				x = "01101";
				break;
			case 'f':
				x = "01110";
				break;
			case 'g':
				x = "01111";
				break;
			case 'h':
				x = "10000";
				break;
			case 'j':
				x = "10001";
				break;
			case 'k':
				x = "10010";
				break;
			case 'm':
				x = "10011";
				break;
			case 'n':
				x = "10100";
				break;
			case 'p':
				x = "10101";
				break;
			case 'q':
				x = "10110";
				break;
			case 'r':
				x = "10111";
				break;
			case 's':
				x = "11000";
				break;
			case 't':
				x = "11001";
				break;
			case 'u':
				x = "11010";
				break;
			case 'v':
				x = "11011";
				break;
			case 'w':
				x = "11100";
				break;
			case 'x':
				x = "11101";
				break;
			case 'y':
				x = "11110";
				break;
			case 'z':
				x = "11111";
				break;
			}
			bytearray += x;
		}
		return bytearray;
	}


function lonToMercator(x)
{
    var toX = x * 20037508.34 / 180;
    return toX;
    console.log(toX);
    
}
function latToMercator(y)
{
	
    var toY = Math.log(Math.tan((90 + y) * Math.PI / 360)) / (Math.PI / 180);
    toY = toY * 20037508.34 / 180;
    return toY;
    console.log(toY);
}
