var buffers = [document.createElement("canvas"), document.createElement("canvas")];
var zoom = 3;
buffers.forEach(function (buffer) {
    buffer.width = window.innerWidth / zoom;
    buffer.height = window.innerHeight / zoom;
    buffer.style.zoom = zoom;
});
var x;
var y;
var b0context = buffers[0].getContext('2d');
for(x = 0; x < buffers[0].width; ++x) {
    for(y = 0; y < buffers[0].height; ++y) {
        if (Math.random() > 0.05) {
            b0context.fillStyle = "black";
        } else {
            b0context.fillStyle = "white";
        }
        b0context.fillRect(x, y, 1, 1);
    }
}
var life = function (which) {
    var frontCanvas = buffers[Math.abs((which - 1) % buffers.length)];
    var backCanvas = buffers[which];
    var frontCtx = backCanvas.getContext('2d');
    var backCtx = frontCanvas.getContext('2d');
    var backImage = backCtx.getImageData(0,0,backCanvas.width, backCanvas.height);
    var frontImage = frontCtx.getImageData(0,0,frontCanvas.width, frontCanvas.height);
    var i;
    var neighbors;
    var alive;
    var colorWidth = backImage.width * 4;
    // var buffer = Uint8ClampedArray(backImage.width * 4);
    for(i = 0; i < frontImage.data.length; i += 4) {
        neighbors = 0;
        neighbors += frontImage.data[i - colorWidth] > 0 ? 1 : 0;
        neighbors += frontImage.data[i - colorWidth + 4] > 0 ? 1 : 0;
        neighbors += frontImage.data[i - colorWidth - 4] > 0 ? 1 : 0;
        
        neighbors += frontImage.data[i + colorWidth] > 0 ? 1 : 0;
        neighbors += frontImage.data[i + colorWidth + 4] > 0 ? 1 : 0;
        neighbors += frontImage.data[i + colorWidth - 4] > 0 ? 1 : 0;
        
        neighbors += frontImage.data[i - 4] > 0 ? 1 : 0;
        neighbors += frontImage.data[i + 4] > 0 ? 1 : 0;
        alive = frontImage.data[i] > 0;
        if (neighbors < 2) {
            alive = false; // starves
        } else if (neighbors > 3) {
            alive = false; // overcrowded
        } else if (3 === neighbors) {
            alive = true; // reproduces
        }
        if (Math.random() < 0.0001) {
            // alive = true;
        }
        colorval = alive ? 255 : 0;
        backImage.data[i + 0] = colorval;
        backImage.data[i + 1] = colorval;
        backImage.data[i + 2] = colorval;
        backImage.data[i + 3] = 255;
    }
    backCtx.putImageData(backImage, 0, 0);
    buffers.forEach(function (buffer, index) {
        if (index === which) {
            document.body.appendChild(buffer);
        } else if (buffer.parentElement) {
            buffer.parentElement.removeChild(buffer);
        }
    });
    setTimeout(life.bind(undefined, (which + 1) % 2));
};
life(0);
