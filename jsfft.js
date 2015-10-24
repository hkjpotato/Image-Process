
var c1, c2;
var cx1, cx2;
var cw, ch;
var velt;

function log() {
    var str = "";
    for (var i = 0; i < arguments.length; ++i)
	str += arguments[i];
    document.getElementById("log").innerHTML += str;
}

function updateStats(duration, frames) {
    var stats = document.getElementById("stats");
    if (velt.paused) {
        stats.innerHTML = "(paused)";
        return;
    }

    var fps = Math.floor(((frames / duration) * 1000.0) * 100.0) / 100.0;

    // hmm, wish we could pull out the actual video framerate
    if (fps > 19) {
	stats.setAttribute("class", "stat-great");
    } else if (fps > 15) {
	stats.setAttribute("class", "stat-good");
    } else if (fps > 10) {
	stats.setAttribute("class", "stat-ok");
    } else {
	stats.setAttribute("class", "stat-bad");
    }
    stats.innerHTML = "FPS: " + fps;
}

var gLastTime = -1;
var gFrameCount = 0;
var gHaveFloat32 = false;
var gUseFloat32 = false;

function videoIntoOne() {
    var vw = velt.videoWidth;
    var vh = velt.videoHeight;

    var offx = vw > cw ? Math.floor((vw - cw) / 2) : 0;
    var offy = vh > ch ? Math.floor((vh - ch) / 2) : 0;

    cx1.drawImage(velt, -offx, -offy);
    var imdata = cx1.getImageData(0, 0, cw, ch);
    var d = imdata.data;
    for (var i = 0; i < cw*ch; ++i) {
	//var v = (d[i*4+0] + d[i*4+1] + d[i*4+3]) / 3;
	var v = d[i*4+1];
	d[i*4+0] = v;
	d[i*4+1] = v;
	d[i*4+2] = v;
    }
    cx1.putImageData(imdata, 0, 0);

    return imdata;
}

function fftOneIntoTwo(imdata) {
    if (!imdata)
	imdata = cx1.getImageData(0, 0, cw, ch);

    var res_real, res_imag;

    var fft = new FFT(cw, 32);

    var fftres_real = new FFT_ArrayType32(cw*ch);
    var fftres_imag = new FFT_ArrayType32(cw*ch);
    for (var i = 0; i < cw*ch; ++i) {
	fftres_real[i] = imdata.data[i*4] / 255.0;
    }

    var i, j;

    for (j = 0; j < ch; ++j) {
	var row = new FFT_ArrayType32(fftres_real.buffer, j*cw*4, cw);
	var irow = new FFT_ArrayType32(fftres_imag.buffer, j*cw*4, cw);

	fft.forward(row, irow);

	for (i = 0; i < cw; ++i) {
	    row[i] = fft.real[i];
	    irow[i] = fft.imag[i];
	}
    }

    var col = new FFT_ArrayType32(ch);
    var icol = new FFT_ArrayType32(ch);

    for (i = 0; i < cw; ++i) {
	for (j = 0; j < ch; ++j) {
	    col[j] = fftres_real[j*cw+i];
	    icol[j] = fftres_imag[j*cw+i];
	}

	fft.forward(col, icol);

	for (j = 0; j < ch; ++j) {
	    fftres_real[j*cw+i] = fft.real[j];
	    fftres_imag[j*cw+i] = fft.imag[j];
	}
    }

    /* now put back the data */
    for (var j = 0; j < ch; ++j) {
	for (var i = 0; i < cw; ++i) {
	    var rk = fftres_real[j*cw+i];
	    var ik = fftres_imag[j*cw+i];

	    var v = Math.floor(2*Math.sqrt(rk*rk+ik*ik)/cw * 255.0);

	    var x = (i + cw/2) % cw;
	    var y = (j + ch/2) % ch;

	    var k = (y*cw+x)*4;

	    imdata.data[k+0] = v;
	    imdata.data[k+1] = v;
	    imdata.data[k+2] = v;
	    imdata.data[k+3] = 255;
	}
    }
    cx2.putImageData(imdata, 0, 0);
}

function fftOneIntoTwoSlow(imdata) {
    if (!imdata)
	imdata = cx1.getImageData(0, 0, cw, ch);

    var res_real, res_imag;

    var fft = new FFT(cw, 0);

    var fftres_real = new Array(cw*ch);
    var fftres_imag = new Array(cw*ch);
    for (var i = 0; i < cw*ch; ++i) {
	fftres_real[i] = imdata.data[i*4] / 255.0;
    }

    var i, j;

    var row = new Array(cw);
    var irow = new Array(cw);

    for (j = 0; j < ch; ++j) {
	for (i = 0; i < cw; ++i) {
	    row[i] = fftres_real[j*cw+i];
	    irow[i] = 0.0;
	}

	fft.forward(row, irow);

	for (i = 0; i < cw; ++i) {
	    fftres_real[j*cw+i] = fft.real[i];
	    fftres_imag[j*cw+i] = fft.imag[i];
	}
    }

    var col = new Array(ch);
    var icol = new Array(ch);

    for (i = 0; i < cw; ++i) {
	for (j = 0; j < ch; ++j) {
	    col[j] = fftres_real[j*cw+i];
	    icol[j] = fftres_imag[j*cw+i];
	}

	fft.forward(col, icol);

	for (j = 0; j < ch; ++j) {
	    fftres_real[j*cw+i] = fft.real[j];
	    fftres_imag[j*cw+i] = fft.imag[j];
	}
    }

    /* now put back the data */
    for (var j = 0; j < ch; ++j) {
	for (var i = 0; i < cw; ++i) {
	    var rk = fftres_real[j*cw+i];
	    var ik = fftres_imag[j*cw+i];

	    var v = Math.floor(2*Math.sqrt(rk*rk+ik*ik)/cw * 255.0);

	    var x = (i + cw/2) % cw;
	    var y = (j + ch/2) % ch;

	    var k = (y*cw+x)*4;

	    imdata.data[k+0] = v;
	    imdata.data[k+1] = v;
	    imdata.data[k+2] = v;
	    imdata.data[k+3] = 255;
	}
    }
    cx2.putImageData(imdata, 0, 0);
}

function t2() {
    cx1.fillStyle = "black";
    cx1.fillRect(0, 0, cw, ch);
    cx1.fillStyle = "white";
    //cx1.fillRect(2*w/5, h/3, w/5, h/3);
    cx1.beginPath();
    cx1.arc(cw/2, ch/2, cw/6, 0, Math.PI*2, false);
    cx1.fill();

    fftOneIntoTwo();
}

function toggleFloat32() {
    var notes = document.getElementById("notes");
    if (gUseFloat32) {
	notes.innerHTML = "<span>Using JS Arrays.</span><br><a href='javascript:toggleFloat32();'>Switch to using Float32 typed arrays</a>";
	gUseFloat32 = false;
    } else {
	notes.innerHTML = "<span>Using Float32 typed arrays.</span><br><a href='javascript:toggleFloat32();'>Switch to using JS arrays</a>";
	gUseFloat32 = true;
    }
}

function init() {
    c1 = document.getElementById("c");
    c2 = document.getElementById("c2");

    cx1 = c1.getContext("2d");
    cx2 = c2.getContext("2d");

    cw = c1.width;
    ch = c1.height;

    var notes = document.getElementById("notes");
    if (FFT_ArrayType32 && FFT_ArrayType32 != Array) {
	notes.innerHTML = "<span>Using Float32 typed arrays.</span><br><a href='javascript:toggleFloat32();'>Switch to using JS arrays</a>";
	gHaveFloat32 = true;
	gUseFloat32 = true;
    } else {
	notes.innerHTML = "<span>Float32 typed arrays NOT supported, using JS arrays.</span>";
	gHaveFloat32 = false;
	gUseFloat32 = false;
    }

    velt = document.getElementById("v");

    var frame = function() {
	var t = (new Date()).getTime();
	if (gLastTime == -1) {
	    gLastTime = t;
	} else if (t - gLastTime > 2000) {
	    updateStats(t-gLastTime, gFrameCount);
	    gFrameCount = 0;
	    gLastTime = t;
	}

	var imdata = videoIntoOne();
	if (gUseFloat32)
	    fftOneIntoTwo(imdata);
	else
	    fftOneIntoTwoSlow(imdata);

	gFrameCount++;
    };

    velt.addEventListener("timeupdate", frame, false);
}

window.addEventListener("load", init, false);
