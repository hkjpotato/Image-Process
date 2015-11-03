MyOperations = {};

MyOperations.multiConstant = function(inputMatrix1, inputMatrix2, param) {
	if (typeof (param.factor) === "undefined") {
		alert("Please input valid factor!");
		return;
	}

	var len = inputMatrix1.length;
	var result = new Float32Array(len); 
	for (var i = 0; i <len; i++) {
		result[i] = inputMatrix1[i] * param.factor;
	}
	return result;
}

MyOperations.powConstant = function(inputMatrix1, inputMatrix2, param) {
	if (typeof param.factor === "undefined") {
		alert("Please input valid factor!");
		return;
	}

	var len = inputMatrix1.length;
	var result = new Float32Array(len); 
	for (var i = 0; i <len; i++) {
		result[i] = Math.pow(inputMatrix1[i], param.factor);
	}
	return result;
}

MyOperations.negation = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
	var result = new Uint8ClampedArray(len);
	for (var i = 0; i < len; i++) {
		result[i] = 255 - inputMatrix1[i]
	}
	return result;
}

MyOperations.translation = function(inputMatrix1, inputMatrix2, param) {
	if (typeof (param.x) === "undefined") {
		alert("Please input valid X!");
		return;
	}
	if (typeof (param.y) === "undefined") {
		alert("Please input valid Y!");
		return;
	}
	var len = inputMatrix1.length;
  	var side = Math.round(Math.sqrt(len));
  	console.log(side);
	var result = new Uint8ClampedArray(len);
	for (var y = 0; y < side; y++) { 
		for (var x = 0; x < side; x++) {
			var currPos = y * side + x;
			if (((x + param.x) < side ) && ((y + param.y) < side)) {
				var currPos = x + y * side;
				result[currPos + param.x + param.y * side] = inputMatrix1[currPos];
			}
		}
	}
	return result;
}

MyOperations.rotation = function(inputMatrix1, inputMatrix2, param) {
	if (typeof param.angle === "undefined") {
		alert("Please input valid angle!");
		return;
	}
	var angle = (param.angle % 360) * (Math.PI / 180);
	var len = inputMatrix1.length;
  	var side = Math.round(Math.sqrt(len));

  	var centerX = Math.round(side/2) - 1;
  	var centerY = Math.round(side/2) - 1;
  	console.log(centerX);
  	console.log(centerY);
  	console.log(angle * 2);
  	console.log(Math.cos(angle));
  	console.log(Math.sin(angle));


	var result = new Float64Array(len);
	for (var y = 0; y < side; y++) { 
		for (var x = 0; x < side; x++) {
			var resX = Math.round(Math.cos(angle) * (x - centerX) - Math.sin(angle) * (y - centerY)) + centerX;
			var resY = Math.round((Math.sin(angle) * (x - centerX) + Math.cos(angle) * (y - centerY))) + centerY;
			if (!result[resY * side + resX]) {
				result[resY * side + resX] = inputMatrix1[y * side + x];
			}
		}
	}
	console.log("done");
	return result;
}

MyOperations.transposition = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
  	var side = Math.round(Math.sqrt(len));
  	console.log(side);
	var result = new Uint8ClampedArray(len);
	for (var y = 0; y < side; y++) { 
		for (var x = 0; x < side; x++) {
			var currPos = y * side + x;
			var resPos = x * side + y;
			result[resPos] = inputMatrix1[currPos];
		}
	}
	return result;
}

MyOperations.reflectHorizon = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
  	var side = Math.round(Math.sqrt(len));
  	console.log(side);
	var result = new Uint8ClampedArray(len);
	for (var y = 0; y < side; y++) { 
		for (var x = 0; x < side; x++) {
			var currPos = y * side + x;
			var resPos = y * side + (side - 1 - x);
			result[resPos] = inputMatrix1[currPos];
		}
	}
	return result;
}

MyOperations.reflectVertical = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
  	var side = Math.round(Math.sqrt(len));
  	console.log(side);
	var result = new Uint8ClampedArray(len);
	for (var y = 0; y < side; y++) { 
		for (var x = 0; x < side; x++) {
			var currPos = y * side + x;
			var resPos = (side - 1 - y) * side  + x;
			result[resPos] = inputMatrix1[currPos];
		}
	}
	return result;
}

MyOperations.addition = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;

	var result = new Uint16Array(len);
	// var maxValue = 0;
	// for (var i = 0; i <len; i++) {
	// 	result[i] = inputMatrix1[i] + inputMatrix2[i];
	// 	if (result[i] > maxValue) {
	// 		maxValue = result[i];
	// 	}
	// }

	// var test = new Int16Array(len);
	// for (var i = 0; i <len; i++) {
	// 	test[i] = inputMatrix1[i] + inputMatrix2[i];
	// }

	var test2 = new Uint8ClampedArray(len);
	for (var i = 0; i <len; i++) {
		test2[i] = inputMatrix1[i] + inputMatrix2[i];
	}
	// var equal = true;
	// for (var i = 0; i <len; i++) {
	// 	if (test[i] != result[i]) {
	// 		equal = false;
	// 	}
	// }

	// for (var i = 0; i <len; i++) {
	// 	result[i] = 255 + result[i] - maxValue;
	// }

	// for (var i = 0; i <len; i++) {
	// 	test[i] = 255 + test[i] - maxValue;
	// }


	// for (var i = 0; i <len; i++) {
	// 	if (test[i] != result[i]) {
	// 		equal2 = false;
	// 		console.log(result[i] + " " + test[i]);
	// 	}
	// }
	return test2;
}

MyOperations.substraction = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
	// var result = new Int16Array(len);
	// var minValue = 0;
	// for (var i = 0; i <len; i++) {
	// 	result[i] = inputMatrix1[i] - inputMatrix2[i];
	// 	if (result[i] < minValue) {
	// 		minValue = result[i];
	// 	}
	// }

	// for (var i = 0; i <len; i++) {
	// 	result[i] = 0 + (result[i] - minValue);
	// }

	var result = new Uint8ClampedArray(len);
	// var minValue = 0;
	for (var i = 0; i <len; i++) {
		result[i] = inputMatrix1[i] - inputMatrix2[i];
		// if (result[i] < minValue) {
		// 	// minValue = result[i];
		// }
	}

	// for (var i = 0; i <len; i++) {
	// 	result[i] = 0 + (result[i] - minValue);
	// }
	return result;
}

MyOperations.multiImage2 = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
	var result = new Float32Array(len);
	var maxValue = 0;
	for (var i = 0; i <len; i++) {
		result[i] = inputMatrix1[i] * inputMatrix2[i];
		if(result[i] > maxValue) {
			maxValue = result[i];
		}
	}

	for (var i = 0; i <len; i++) {
		result[i] = result[i]/maxValue * 255;
	}

	return result;
}

MyOperations.bitAdd = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
	var bit1 = MyOperations.getBit(inputMatrix1);
	var bit2 = MyOperations.getBit(inputMatrix2);
	var result = new Uint8ClampedArray(len);
	for (var i = 0; i < len; i++) {
		if (bit1[i] & bit2[i]) {
			result[i] = 255;
		} else {
			result[i] = 0;
		}
	}
	return result;
}

MyOperations.convolution = function(inputMatrix1, inputMatrix2, param) {
	console.log("testing");
	var result;
	result = Filters.myConvolute(inputMatrix1, inputMatrix2);

	var maxValue = 0;
	var minValue = 100000;
	var len = result.length;
	for (var i = 0; i < len; i++) {
		if(result[i] > maxValue) {
			maxValue = result[i];
		}
		if (result[i] < minValue) {
			minValue = result[i];
		}
	}
	console.log(result);
	for (var i = 0; i <len; i++) {
		result[i] = 255 * (result[i] - minValue)/(maxValue - minValue);
	}
	console.log(result);
	return result;
}

MyOperations.bitOr = function(inputMatrix1, inputMatrix2, param) {
	var len = inputMatrix1.length;
	var bit1 = MyOperations.getBit(inputMatrix1);
	var bit2 = MyOperations.getBit(inputMatrix2);
	var result = new Uint8ClampedArray(len);
	for (var i = 0; i < len; i++) {
		if (bit1[i] | bit2[i]) {
			result[i] = 255;
		} else {
			result[i] = 0;
		}
	}
	return result;
}
//helper methods
MyOperations.getBit = function(inputMatrix) {
	var len = inputMatrix.length;
	var result = new Uint8Array(len); 
	var mean = MyOperations.getMean(inputMatrix);
	for (var i = 0; i <len; i++) {
		if (inputMatrix[i] >= mean) {
			result[i] = 1;
		} else {
			result[i] = 0;
		}

	}
	return result;
}

MyOperations.getMean = function(inputMatrix) {
	var len = inputMatrix.length;
	var sum = 0;
	for (var i = 0; i <len; i++) {
		sum += inputMatrix[i];
	}
	return (sum/len);
}





































//The reset is the image convolution logic
Filters = {};
Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img,0,0);
  return ctx.getImageData(0,0,c.width,c.height);
};

Filters.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};
//filterImage method in Filters scale
//take the filter and image as argument
Filters.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i=2; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};

//convolution filters
//temporary values
Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function(w,h) {
  return this.tmpCtx.createImageData(w,h);
};

Filters.convolute = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  // var alphaFac = opaque ? 1 : 0;
  console.time("matrixLoopRock");

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy*side+cx];
          // r += src[srcOff] * wt;
          // g += src[srcOff+1] * wt;
          // b += src[srcOff+2] * wt;
          // a += src[srcOff+3] * wt;
        }
      }
      // dst[dstOff] = r;
      // dst[dstOff+1] = g;
      // dst[dstOff+2] = b;
      // dst[dstOff+3] = a + alphaFac*(255-a);
      dst[dstOff] = 0;
      dst[dstOff+1] = 125;
      dst[dstOff+2] = 125;
      dst[dstOff+3] = 255;

    }
  }

  console.timeEnd("matrixLoopRock");

  return output;
};



Filters.myConvolute = function(greyMatrix, weights) {
  // weights = [1/10,1/10,1/10,1/10,1/10,1/10,1/10, 1/10,1/10];
  console.log("haha");
  // greyMatrix = [3,45,45,10,125,125,125,125,125];
  // weights = [-1,2,1/4,1/4];
  // weights = [  -2, -1, 0,
	 //   -1, 1, 1,
	 //   0, 1, 2 ];
  var side = Math.round(Math.sqrt(weights.length));

  var halfSide = Math.floor(side/2);

  console.log("halfside: " + halfSide);
  var greyLen = greyMatrix.length;

  var sw = Math.sqrt(greyLen);
  var sh = sw;

  var w = sw;
  var h = sh;

  var retMatrix = new Float32Array(greyLen);
  // var retMatrix = new Array(greyLen);

  console.time("matrixLoop");
  // var outside = 0;
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var dstOff = y*w+x;
      var r=0;

      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
        	var scy = y + cy - halfSide;
	        var scx = x + cx - halfSide;
        	// var scy = Math.min(sh-1, Math.max(0, y + cy - halfSide));
	        // var scx = Math.min(sw-1, Math.max(0, x + cx - halfSide));
	        // var srcOff = (scy*sw+scx);
	        // var wt = weights[cy*side+cx];
	        // r += greyMatrix[srcOff] * wt;
	        var upperLimit = sh -1;
        	// if ((scy <= upperLimit) && (scx <= upperLimit) && (scx >= 0) && (scx >= 0)) {
        	//   // var scy = Math.min(sh-1, Math.max(0, y + cy - halfSide));
	        //   // var scx = Math.min(sw-1, Math.max(0, x + cx - halfSide));
	        //   var srcOff = (scy*sw+scx);
	        //   var wt = weights[cy*side+cx];
	        //   r += greyMatrix[srcOff] * wt;
        	// }

        	var check = (scy <= upperLimit) & (scx <= upperLimit) & (scy >= 0) & (scx >= 0);
        	// console.log(check);
        	if (check) {
	          var srcOff = (scy*sw+scx);
	          var wt = weights[cy*side+cx];
	          // console.log(wt);
	          r += greyMatrix[srcOff] * wt;
        	} 
        }
      }
      retMatrix[dstOff] = r;
    }
  }
  // console.log(outside);

  console.timeEnd("matrixLoop");

  return retMatrix;
};

