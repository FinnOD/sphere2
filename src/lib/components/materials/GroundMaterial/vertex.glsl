varying vec2 v_uv;
varying vec3 viewZ;
varying vec3 vPos;
varying vec3 cameraPos;
varying vec3 Vnormal;
varying float isWater;

uniform float u_time;
void main() {
    
    v_uv = uv;
    cameraPos = cameraPosition;

    viewZ = -(modelViewMatrix * vec4(position.xyz, 1.)).xyz;

    vec3 pos = position;
    Vnormal = normal;

    // if(length(pos) < 3145.){
    //     vec3 t = normalize(pos);
    //     t += .5*sin(u_time + pos);
    //     pos += t;
    // }

    float dist = length(pos) - 3000.;
    float curve = 500.0;
    float waterness = curve*dist/(abs(curve*dist) + 1.0) + 1.0;
    // waterness = 1.0-pow(1.0-waterness, 1./20.);
    isWater = waterness;

    vec3 offset = 0.1*waterness*(sin(u_time + 10.*pos));
    pos += offset;
    Vnormal += offset;

    Vnormal = normalize(Vnormal);
    vPos = pos;

    // vPos = pos;
    // Vnormal += 1.*waterness*(sin(u_time + 10.*pos)-1.5);
    // Vnormal = normalize(Vnormal);

    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}