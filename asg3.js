// Vertex shader program
var VSHADER_SOURCE = `
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   varying vec2 v_UV;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
   }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform int u_whichTexture;
    void main() {
       if(u_whichTexture == -2){
           gl_FragColor = u_FragColor; }
       else if(u_whichTexture == -1){
           gl_FragColor = vec4(v_UV, 1.0, 1.0); }
    
       else if(u_whichTexture == 0){
           gl_FragColor = texture2D(u_Sampler0, v_UV);}

       else if(u_whichTexture == 1){
           gl_FragColor = texture2D(u_Sampler1, v_UV); }

       else if(u_whichTexture == 2){
           gl_FragColor = texture2D(u_Sampler2, v_UV); }
       else if(u_whichTexture == 3){
           gl_FragColor = texture2D(u_Sampler3, v_UV); }
       else { 
            gl_FragColor = vec4(1, .2, .2, 1);
       }
    }
   
    `

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix
let u_whichTexture;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;


let g_migong = false;
let g_Animation = false;
let g_set_Location = 0;
let Shift_and_Click = false;

var g_vertexBufferCube = null;
var g_Angle = 0;
var head_animation = 0;
var g_tails_animation = 0;
var g_Angle2 = 0;

let g_BoolTailAnimation = false;
let g_globool = true;

let g_globalAngleX = 0;
let g_globalAngleY = 0;
let g_globalAngleZ = 0;

var g_start_time = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_start_time;
let g_camera = new Camera();


function setupCanvas() {
    canvas = document.getElementById('webgl');

    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}); 
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }


    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_sampler0');
        return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_sampler1');
        return;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_sampler2');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_sampler3');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



function initTextures() {
    var image0 = new Image();
    if (!image0) {
        console.log('Failed to create the image0 object');
        return false;
    }


    image0.onload = function () {
        sendTextureToTEXTURE0(image0);
    };

    if (g_globool === true) {
        image0.src = 'minecraftbrick.jpeg';
    }

    var image1 = new Image();
    if (!image1) {
        console.log('Failed to create the image1 object');
        return false;
    }

    image1.onload = function () {
        sendTextureToTEXTURE1(image1);
    };

    if (g_globool === true) {
        image1.src = 'sky.jpeg';
    }

    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image2 object');
        return false;
    }

    image2.onload = function () {
        sendTextureToTEXTURE2(image2);
    };
    if (g_globool === true) {
        image2.src = 'brick.jpeg';
    }

}

function sendTextureToTEXTURE0(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture0 object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler0, 0);

    console.log("successfully render the sky.jpg")


}

function sendTextureToTEXTURE1(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture1 object');
        return false;
    }


    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler1, 1);

    console.log("successfully render the Grass.png")
}

function sendTextureToTEXTURE2(image) {
    var texture = gl.createTexture();

    if (!texture) {
        console.log('Failed to create the texture2 object');
        return false;
    }


    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE2);

    gl.bindTexture(gl.TEXTURE_2D, texture);


    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler2, 2);

    console.log("successfully render the soil.jpg")
}

function main() {
    setupCanvas();
    connectVariablesToGLSL();
    

    initTextures();
    document.onkeydown = keydown;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var currentAngle = [g_globalAngleX, g_globalAngleY];
    requestAnimationFrame(tick);
}

function tick() {
    g_seconds = performance.now() / 1000.0 - g_start_time;
    updateAnimation();
    renderAllShapes();
    requestAnimationFrame(tick);
}

function updateAnimation() {
    if (g_Animation) {
        g_set_Location = ((Math.sin(g_seconds * 3)) / 30) - (.3);
        g_Angle = 10 * Math.sin(g_seconds);
        head_animation = 12 * Math.sin(g_seconds);
        g_Angle2 = 3 * Math.sin(g_seconds);
    }
    if (g_BoolTailAnimation) {
        g_tails_animation = 5 * Math.sin(g_seconds);
    }
}

function keydown(ev) {
    if (ev.keyCode === 68) {
        g_camera.right();
    } else if (ev.keyCode === 65) {
        g_camera.left();
    } else if (ev.keyCode === 87) {
        g_camera.forward();
    } else if (ev.keyCode === 83) {
        g_camera.backward();
    } else if (ev.keyCode === 69) {
        g_camera.rotRight();
    } else if (ev.keyCode === 81) {
        g_camera.rotLeft();
    } else if (ev.keyCode === 90) {
        g_camera.upward();
    } else if (ev.keyCode === 88) {
        g_camera.downward();
    }
    renderAllShapes();
}

function renderAllShapes() {
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngleX, 1, 0, 0)
    globalRotMat.rotate(g_globalAngleY, 0, 1, 0);
    globalRotMat.rotate(g_globalAngleZ, 0, 0, 1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var duration = performance.now() - startTime;
    SendTextToHTML(" ms:" + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");


    drawSetting();
    if (g_migong) {
        draw_migong();
    } else {
        drawMap();
    }
}

function SendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    htmlElm.innerHTML = text;
}

function drawSetting() {
    var floor = new Cube();
    floor.textureNum = 2;
    floor.matrix.translate(-0, -.75, -0);
    floor.matrix.scale(35, .01, 35);
    floor.matrix.translate(-.15, 0, -.15);
    floor.drawCubeFast();

    var sky = new Cube();
    sky.color = [0, 0.95, 1, 1];
    sky.textureNum = 1;
    sky.matrix.translate(-1, 0, -1);
    sky.matrix.scale(100, 100, 100);
    sky.matrix.translate(-.5, -.5, -.5);
    sky.drawCubeFast();

}

let g_map = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], 
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]

function drawMap() {
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            for (z = 0; z < g_map[x][y]; z++) {
                var cube_rendering = new Cube();
                if (g_map[x][y] === 0) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_map[x][y] === 1) {
                    cube_rendering.textureNum = 2;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_map[x][y] >= 2) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                }
            }
        }
    }
}

let g_migongmap = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2],
    [2,0,2,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,2],
    [2,0,2,0,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,0,2,0,2],
    [2,0,2,0,2,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,2,2,2,0,2,0,2,0,2,0,2,0,2,0,2,2,2,2,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,2,2,2,2,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,2,2,2,2,2,2,2,2,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0,0,0,0,0,2,0,2,0,2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]

function draw_migong() {
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            for (z = 0; z < g_migongmap[x][y]; z++) {
                var cube_rendering = new Cube();
                if (g_migongmap[x][y] === 0) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] === 2) {
                    cube_rendering.textureNum = 2;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] > 2 && g_migongmap[x][y] < 7) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] >= 7) {
                    cube_rendering.color = [1, 1, 1, 1];
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                }
            }
        }
    }
}

