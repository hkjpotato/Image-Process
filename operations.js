MyOperations = {};

MyOperations.multiConstant = function(inputMatrix1, inputMatrix2, param1, param2) {
	var len = inputMatrix1.length;
	var result = new Float32Array(len); 
	for (var i = 0; i <len; i++) {
		result[i] = inputMatrix1[i] * param1;
	}
	return result;
}

MyOperations.multiConstant = function(inputMatrix1, inputMatrix2, param1, param2) {
	if (!param1) {
		alert("Please input valid paramter!");
		return;
	}

	var len = inputMatrix1.length;
	var result = new Float32Array(len); 
	for (var i = 0; i <len; i++) {
		result[i] = inputMatrix1[i] * param1;
	}
	return result;
}

MyOperations.powConstant = function(inputMatrix1, inputMatrix2, param1, param2) {
	if (!param1) {
		alert("Please input valid paramter!");
		return;
	}

	var len = inputMatrix1.length;
	var result = new Float32Array(len); 
	for (var i = 0; i <len; i++) {
		result[i] = Math.pow(inputMatrix1[i], param1);
	}
	return result;
}


MyOperations.negation = function(inputMatrix1, inputMatrix2, param1, param2) {
	var len = inputMatrix1.length;
	var result = new Uint8ClampedArray(len);
	for (var i = 0; i < len; i++) {
		result[i] = 255 - inputMatrix1[i]
	}
	return result;
}


MyOperations.bitAdd = function(inputMatrix1, inputMatrix2, param1, param2) {
	var len = inputMatrix1.length;
	var bit1 = MyOperations.getBit(inputMatrix1);
	var bit2 = MyOperations.getBit(inputMatrix2);
	var result = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		if (bit1[i] & bit2[i]) {
			result[i] = 255;
		} else {
			result[i] = 0;
		}
	}
	return result;
}

MyOperations.bitOr = function(inputMatrix1, inputMatrix2, param1, param2) {
	var len = inputMatrix1.length;
	var bit1 = MyOperations.getBit(inputMatrix1);
	var bit2 = MyOperations.getBit(inputMatrix2);
	var result = new Uint8Array(len);
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
  var side = Math.round(Math.sqrt(weights.length));

  var halfSide = Math.floor(side/2);

  var greyLen = greyMatrix.length;
  var sw = Math.sqrt(greyLen);
  var sh = sw;

  var w = sw;
  var h = sh;

  var retMatrix = new Uint8ClampedArray(greyLen);
  console.time("matrixLoop");
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var dstOff = y*w+x;
      var r=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, y + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, x + cx - halfSide));
          var srcOff = (scy*sw+scx);
          var wt = weights[cy*side+cx];
          r += greyMatrix[srcOff] * wt;
        }
      }
      retMatrix[dstOff] = r;
    }
  }
  console.timeEnd("matrixLoop");

  return retMatrix;
};

