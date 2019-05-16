
// HelloTriangle_LINE_STRIP.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'}\n';
// Fragment shader program
var FSHADER_SOURCE =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 常量值
var MAXLAT = 5465442.1825619700;
var MINLAT = 4865942.2788258400;
var MAXLNG = 13358338.8933333000;
var MINLNG = 12690421.9486666000;
var HASHLENGTH = 4;
var LATLENGTH = 10;
var LNGLENGTH = 10;
var height;
var j=0;
//Rotation angle (degrees/second)
var g_eyeX = 1;

$.get("base32servlet",null,function(data){
	// alert("ok");
	// console.log(data);
	
	  // Retrieve <canvas> element
	  var canvas = document.getElementById('webgl');

	  // Get the rendering context for WebGL
	  var gl = getWebGLContext(canvas);
	  if (!gl) {
	    console.log('Failed to get the rendering context for WebGL');
	    return;
	  }

	  // Initialize shaders
	  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	    console.log('Failed to intialize shaders.');
	    return;
	  }

		
		  // Get the storage location of u_MvpMatrix
		  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
		  if (!u_MvpMatrix) { 
		    console.log('Failed to get the storage location of u_MvpMatrix');
		    return;
		  }
		  // Set the eye point and the viewing volume
		  var mvpMatrix = new Matrix4();
		  document.onkeydown = function(ev){ keydown(ev); };
			    // Specify the color for clearing <canvas>
				gl.clearColor(0, 0, 0, 1);
function draw(){
		  mvpMatrix.setPerspective(30, 1, 1, 100);
		  mvpMatrix.lookAt(g_eyeX, 1, 2, 0, 0, 0, 0, 1, 0);

		  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

		var arrayObj = new Array();
		var str = data.split("@");
		var content=str[3];
		var head=str[1].split(",");
		 height=str[2].split(",");	
		for(var i=0;i<head.length;i++)
		{
			var temp=content.substring(0,head[i]*4);
			var byte_string = deBase32(temp);
			var lat_byte_array = deBytes("lng", byte_string);
			var lng_byte_array = deBytes("lat", byte_string);
			
			 arrayObj=deGeohash(lat_byte_array, lng_byte_array);  
		 
		   var vertices = new Float32Array(arrayObj);
			// Write the positions of vertices to a vertex shader
			var n = initVertexBuffers(gl,vertices);
			  if (n < 0) {
			    console.log('Failed to set the positions of the vertices');
			    return;
			  }
		    // Draw the rectangle
			gl.drawArrays(gl.LINE_STRIP, 0, n);
			arrayObj = [];	
			content=content.replace(temp, '');
		}
}

function keydown(ev) {
    if(ev.keyCode == 39) { // The right arrow key was pressed
      g_eyeX += 0.1;
    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      g_eyeX -= 0.1;
    } else { return; }
    j=0;
    draw(); 
    console.log(g_eyeX)
}
draw();
})



function initVertexBuffers(gl,ver) {
  var vertices = ver;
  // console.log("vertices："+vertices);
  
  var n = (vertices.length)/3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}


function deGeohash(array1, array2) {
	var arrayObj = new Array();
	var latarray = new Array();
	var lngarray = new Array();
	var latbytearray = array1;
	var lngbytearray = array2;
// var z=Math.random()/10;

	for (var i = 0; i < latbytearray.length; i++) {
		latarray[i] = MINLAT + parseInt(latbytearray[i], 2)
				* (MAXLAT - MINLAT) / Math.pow(2, LATLENGTH);
		lngarray[i] = MINLNG + parseInt(lngbytearray[i], 2)
				* (MAXLNG - MINLNG) / Math.pow(2, LNGLENGTH);
// console.log(latarray[i]);
// console.log(lngarray[i]);
// console.log("______________________");
		arrayObj.push((lngarray[i]-(MAXLNG+MINLNG)/2)/(MAXLNG-MINLNG));

		arrayObj.push((height[j]-(2100+200)/2)/(2100-200)/10);

		arrayObj.push((latarray[i]-(MAXLAT+MINLAT)/2)/(MAXLAT-MINLAT));
	}
// console.log("height:");
// console.log((height[j]-(2100+200)/2)/(2100-200)/1000);
	j++;
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
// console.log(base32char.length);
	for (var i = 0; i < base32char.length; i++) {
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

