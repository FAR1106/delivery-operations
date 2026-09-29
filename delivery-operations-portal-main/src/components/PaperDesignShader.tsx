/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface PaperDesignShaderProps {
  colors: string[];
  className?: string;
}

// Convert HSL string e.g. "hsl(245, 85%, 65%)" to normalized RGB [r, g, b] (0 to 1)
function parseHslToRgb(hslStr: string): [number, number, number] {
  const match = hslStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) {
    // Default to fallback indigo if parsing fails
    return [0.38, 0.4, 0.9];
  }
  
  const h = parseInt(match[1], 10) / 360;
  const s = parseInt(match[2], 10) / 100;
  const l = parseInt(match[3], 10) / 100;
  
  let r = l;
  let g = l;
  let b = l;
  
  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tTemp = t;
      if (tTemp < 0) tTemp += 1;
      if (tTemp > 1) tTemp -= 1;
      if (tTemp < 1/6) return p + (q - p) * 6 * tTemp;
      if (tTemp < 1/2) return q;
      if (tTemp < 2/3) return p + (q - p) * (2/3 - tTemp) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [r, g, b];
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;

  // Layered wave function to simulate organic fluid motion
  float wave(vec2 p, float speed, float scale, float time) {
    return sin(p.x * scale + time * speed) * cos(p.y * scale + time * speed * 0.8) * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.2;

    // Organic wavy noise generated procedurally
    float n1 = wave(p + vec2(t * 0.25, t * 0.15), 1.0, 1.4, t);
    float n2 = wave(p - vec2(t * 0.35, -t * 0.2), 0.8, 1.9, t * 1.2);
    float n3 = wave(p + vec2(-t * 0.15, t * 0.4), 1.3, 1.1, t * 0.7);

    // Mix specified palette colors using procedural noise coordinates
    vec3 mix1 = mix(u_color1, u_color2, n1);
    vec3 mix2 = mix(mix1, u_color3, n2 * 0.85);
    vec3 finalColor = mix(mix2, u_color1, n3 * 0.35);

    // Add high-end subtle paper texture (grain overlay)
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.035;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function PaperDesignShader({ colors, className = '' }: PaperDesignShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL is not supported in this browser. Falling back to static gradient.');
      return;
    }

    // Parse brand colors
    const c1 = parseHslToRgb(colors[0] || 'hsl(245, 85%, 65%)');
    const c2 = parseHslToRgb(colors[1] || 'hsl(260, 85%, 70%)');
    const c3 = parseHslToRgb(colors[2] || 'hsl(220, 85%, 60%)');

    // Shader helpers
    const createShader = (glContext: WebGLRenderingContext, type: number, source: string) => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader compilation error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry (full screen canvas cover)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const color1Loc = gl.getUniformLocation(program, 'u_color1');
    const color2Loc = gl.getUniformLocation(program, 'u_color2');
    const color3Loc = gl.getUniformLocation(program, 'u_color3');

    // Set colors
    gl.uniform3fv(color1Loc, new Float32Array(c1));
    gl.uniform3fv(color2Loc, new Float32Array(c2));
    gl.uniform3fv(color3Loc, new Float32Array(c3));

    // Resize handler
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    // Render loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) / 1000;
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, currentTime);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full absolute inset-0 block select-none pointer-events-none ${className}`}
      style={{ filter: 'contrast(1.05) saturate(1.1)' }}
    />
  );
}
