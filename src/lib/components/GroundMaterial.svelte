<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { BackSide } from 'three';

    const { clock } = useThrelte();
	const uniforms = {
		u_resolution: { value: { x: null, y: null } },
		u_time: { value: clock.getElapsedTime() },
		u_mouse: { value: { x: null, y: null } }
	};

	const vShader = `
    varying vec2 v_uv;
    varying vec3 viewZ;
    varying vec3 vPos;
    varying vec3 Vnormal;
    
    uniform float u_time;
    void main() {
        
        v_uv = uv;

        viewZ = -(modelViewMatrix * vec4(position.xyz, 1.)).xyz;

        vec3 pos = position;
        Vnormal = normal;

        if(length(pos) < 3145.){
            pos.y += 0.5*sin(u_time + pos.x+pos.y);
        }
        vPos = pos;

        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }`;

	const fShader = `
    varying vec2 v_uv;
    varying vec3 Vnormal;
    varying vec3 vPos;
    varying vec3 viewZ;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    uniform vec3 u_color;
    uniform float u_time;
    
    void main() {
        float distance = length(viewZ);
        float b = .00000005;
        float fogAmount = 1.0 - exp( -distance*distance*b   );
        vec3  fogColor  = vec3(0.5,0.6,0.7);
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec3 n = normalize(Vnormal);// 
        n = (n* 0.5 + 0.5)*clamp(dot(n, vec3(-1.0, -1.0, -1.0)), 0.1, 1.0);
        // n = 
        
        vec3 col = vec3(0.0);
        if(length(vPos) < 3147.)
            col = n;
        else if(length(vPos) < 3148.)
            col = n*vec3(0.98, 0.92, 0.36)*0.4;
        else
            col = n*vec3(0.1, 0.2, 0.8);
            
        
        
        col = mix( col, fogColor, fogAmount );
        // col = floor(col*vec3(10.))/10.;
        gl_FragColor = vec4(col, 1.0);
    }`;

	useFrame(({ clock }) => {
		uniforms['u_time']['value'] = clock.getElapsedTime();
        // console.log();
	});
</script>

<T.ShaderMaterial vertexShader={vShader} fragmentShader={fShader} {uniforms} side={BackSide} flatShading={false}/>

<!-- <T.MeshPhongMaterial color={'#66aa44'} wireframe={false} side={BackSide} /> -->
