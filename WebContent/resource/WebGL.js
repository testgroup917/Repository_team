
// HelloTriangle_LINE_STRIP.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';



var num=0;
$.get("webservlet",null,function(data){
	
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
		
	var arrayObj = new Array();
	console.log(data.features[219].geometry.coordinates.length);
	console.log(data.features[219].geometry.coordinates[0][0]);
	console.log(lonToMercator(data.features[219].geometry.coordinates[0][0]));
	for(var i=0;i<data.features.length;i++){
	  for(var j=0;j<data.features[i].geometry.coordinates.length;j++){	
	    arrayObj.push(((lonToMercator(data.features[i].geometry.coordinates[j][0])-12867000)/100-2.5)/400-0.317);
	    arrayObj.push(((latToMercator(data.features[i].geometry.coordinates[j][1])-4947000)/100-2.5)/400+0.4117);
	    }
	  
		var vertices = new Float32Array(arrayObj);
		// Write the positions of vertices to a vertex shader
		var n = initVertexBuffers(gl,vertices);
		  if (n < 0) {
		    console.log('Failed to set the positions of the vertices');
		    return;
		  }

	    // Specify the color for clearing <canvas>
		gl.clearColor(0, 0, 0, 1);

		// Clear <canvas>
	    //gl.clear(gl.COLOR_BUFFER_BIT);

	    // Draw the rectangle
		gl.drawArrays(gl.LINE_STRIP, 0, n);
		  
		arrayObj = [];
		  
	};
      
  console.log(num);
   

})


function initVertexBuffers(gl,ver) {
  var vertices = ver;
  console.log(vertices);
  var n = (vertices.length)/2; // The number of vertices
  console.log(n);
  num+=n;
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
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}





function main() {



}

function lonToMercator(x)
{
    var toX = x * 20037508.34 / 180;
    return toX;
    
}
function latToMercator(y)
{
	
    var toY = Math.log(Math.tan((90 + y) * Math.PI / 360)) / (Math.PI / 180);
    toY = toY * 20037508.34 / 180;
    return toY;
}

