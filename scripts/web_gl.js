document.addEventListener("DOMContentLoaded", function()
{

    const canvas = document.getElementById("webgl_canvas");
    const gl = canvas.getContext("webgl");
    const vertexShaderSource = `
        attribute vec2 a_position;
        uniform mat3 u_matrix;
        
        void main() {
            gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(1, 0, 0, 1);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
        -0.5, -0.5,
        0.5, -0.5,
        0.0,  0.5
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    let isAnimating = false;

    function animate() {
        if (!isAnimating) return;
        gl.clear(gl.COLOR_BUFFER_BIT);

        const angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const matrix = [
            cos, -sin, 0,
            sin,  cos, 0,
            0,     0, 1
        ];
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(animate);
    }

    const startButton = document.getElementById("webgl_start");

    startButton.addEventListener("click", function() {
        isAnimating = !isAnimating;
        if (isAnimating) {
            animate();
            startButton.textContent = "Start WebGL Animation";
        } else {
            startButton.textContent = "Stop WebGL Animation";
        }
    });
});
