/*
 * JS FFT, optimized by Corban Brook, modified by Vlad
 */

var FFT_ArrayTypeUint32;
var FFT_ArrayType32;
var FFT_ArrayType64;

try {
    new Uint32Array(1);
    FFT_ArrayTypeUint32 = Uint32Array;
} catch (x) {
    try {
	new WebGLUintArray(1);
	FFT_ArrayTypeUint32 = WebGLUintArray;
    } catch (x) {
	FFT_ArrayTypeUint32 = Array;
    }
}

try {
    new Float32Array(1);
    FFT_ArrayType32 = Float32Array;
} catch (x) {
    try {
	new WebGLFloatArray(1);
	FFT_ArrayType32 = WebGLFloatArray;
    } catch (x) {
	// not supported
	FFT_ArrayType32 = null;
    }    
}

try {
    new Float64Array(1);
    FFT_ArrayType64 = Float64Array;
} catch (x) {
    // 64-bit not supported
    FFT_ArrayType64 = null;
}

if ("console" in window) {
  console.log("uint: ", FFT_ArrayTypeUint32, "float: ", FFT_ArrayType32, "double: ", FFT_ArrayType64);
}

function FFT(bufferSize, floatSize) {
    var k = Math.floor(Math.log(bufferSize) / Math.LN2);
    if (Math.pow(2, k) != bufferSize) {
	throw "Invalid buffer size, must be a power of 2.";
    }

    this.bufferSize = bufferSize;

    if (floatSize === undefined)
	floatSize = 32;

    if (floatSize == 32) {
	if (!FFT_ArrayType32)
	    throw "32-bit float typed arrays not supported";
	var ArrayType = FFT_ArrayType32;
    } else if (floatSize == 64) {
	if (!FFT_ArrayType64)
	    throw "64-bit float typed arrays not supported";
	var ArrayType = FFT_ArrayType64;
    } else if (floatSize == 0) {
	var ArrayType = Array;
    } else {
	throw "Invalid floatSize";
    }

    this.spectrum         = new ArrayType(bufferSize/2);
    this.real             = new ArrayType(bufferSize);
    this.imag             = new ArrayType(bufferSize);
    
    this.reverseTable     = new FFT_ArrayTypeUint32(bufferSize);

    var limit = 1;
    var bit = bufferSize >> 1;

    while (limit < bufferSize) {
	for (var i = 0; i < limit; i++) {
	    this.reverseTable[i + limit] = this.reverseTable[i] + bit;
	}

	limit = limit << 1;
	bit = bit >> 1;
    }

    this.sinTable = new ArrayType(bufferSize);
    this.cosTable = new ArrayType(bufferSize);

    for (var i = 0; i < bufferSize; i++) {
	this.sinTable[i] = Math.sin(-Math.PI/i);
	this.cosTable[i] = Math.cos(-Math.PI/i);
    }
};

FFT.prototype.spectrum = function() {
    var bufferSize  = this.bufferSize,
    real            = this.real,
    imag            = this.imag,
    spectrum        = this.spectrum;

    if (!spectrum) {
	var i = bufferSize/2;
	while (i--) {
	    spectrum[i] = 2 * Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / bufferSize;
	}
    }

    return spectrum;
};

FFT.prototype.forward = function(inreal, inimag) {
    // Locally scope variables for speed up
    var bufferSize  = this.bufferSize,
    cosTable        = this.cosTable,
    sinTable        = this.sinTable,
    reverseTable    = this.reverseTable,
    real            = this.real,
    imag            = this.imag;

    if (bufferSize !== inreal.length) {
	throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + inreal.length;
    }

    if (inimag) {
	if (bufferSize !== inimag.length) {
	    throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + inimag.length;
	}

	for (var i = 0; i < bufferSize; i++) {
	    real[i] = inreal[reverseTable[i]];
	    imag[i] = inimag[reverseTable[i]];
	}
    } else {
	for (var i = 0; i < bufferSize; i++) {
	    real[i] = inreal[reverseTable[i]];
	    imag[i] = 0;
	}
    }

    var halfSize = 1, 
    phaseShiftStepReal, 
    phaseShiftStepImag, 
    currentPhaseShiftReal, 
    currentPhaseShiftImag, 
    off, 
    tr, 
    ti, 
    tmpReal, 
    i;

    while (halfSize < bufferSize) {
	phaseShiftStepReal = cosTable[halfSize];
	phaseShiftStepImag = sinTable[halfSize];
	currentPhaseShiftReal = 1.0;
	currentPhaseShiftImag = 0.0;


	for (var fftStep = 0; fftStep < halfSize; fftStep++) {
	    i = fftStep;

	    while (i < bufferSize) {
		off = i + halfSize;
		tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
		ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

		real[off] = real[i] - tr;
		imag[off] = imag[i] - ti;
		real[i] += tr;
		imag[i] += ti;

		i += halfSize << 1;
	    }

	    tmpReal = currentPhaseShiftReal;
	    currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
	    currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
	}

	halfSize = halfSize << 1;
    }

    this.spectrum = null;
};

// shell benchmark
if (!("window" in this)) {
    var FFT_TABLE_SIZE=2048;

    var data = new Float32Array(FFT_TABLE_SIZE);

    for (var i = 0; i < FFT_TABLE_SIZE/2; i++) {
	data[i] = Math.random();
	data[i+1] = data[i] * 0.95;
    }

    var fft = new FFT(FFT_TABLE_SIZE);

    var count = 10000;

    var t0 = Date.now();

    for (var i = 0; i < count; i++) {
	fft.forward(data);
    }

    var t1 = Date.now();

    print(count + " FFTs: " + (t1-t0) + " ms (" + ((t1-t0) / count) + "ms per FFT)\n");
}


