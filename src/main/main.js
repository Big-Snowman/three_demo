import * as THREE from 'three'

const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const cubeMaterial = new THREE.LineBasicMaterial({color: 0xffffff})
// 根据集合体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 将几何体天机场景中
scene.add(cube)

// 创建渲染器
const render = new THREE.WebGLRenderer()

render.setSize( window.innerWidth, window.innerHeight )

document.body.appendChild( render.domElement )

// 使用渲染器，通过相机将场景渲染进来
render.render(scene, camera)