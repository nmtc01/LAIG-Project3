attribute vec3 aVertexPosition; //Model matrix
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;  //View Matrix
uniform mat4 uPMatrix; //projection matrix 
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vCoords;


void main(){

    gl_Position = vec4(aVertexPosition.x * 0.5 + 0.75, aVertexPosition.y * 0.5 - 0.75, aVertexPosition.z, 1.0);
    vTextureCoord = aTextureCoord; 
    vCoords = aVertexPosition;
}