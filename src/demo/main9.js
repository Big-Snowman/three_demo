
// 点光源

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 掌握gsap 强大的动画库（商用需付费）
import gsap from  'gsap'
// 导入dat.gui (一个轻量级的UI界面控制库)
// 可以帮助我们快速设置变量,在界面当中以UI方式修改里面的值和数据
import * as dat from 'dat.gui'

// 实例创建一个GUI
const gui = new dat.GUI()

// 目标：灯光与阴影
// 1、材质要满足能够对光照有反应
// 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
// 3、设置光照投射阴影 directionaLight.castShadow = true
// 4、设置物体投射阴影 sphere.castShadow = true
// 5、设置物体接收阴影 plane.receiveShadow = true

// 创建一个场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

// 设置相机位置
camera.position.set(0, 0, 6)
scene.add(camera)

// 纹理加载器管理
const manager = new THREE.LoadingManager()
manager.onLoad = function ( ) {
	console.log( 'Loading complete!')
}
manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
}
manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url )
}

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader(manager)

// 添加一个球
const sphereGeometry = new THREE.SphereGeometry(1, 50, 50)
const material = new THREE.MeshStandardMaterial()
const sphereMaterial = new THREE.MeshStandardMaterial()
sphereMaterial.metalness = 1
sphereMaterial.roughness = 0.2
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

// 投影阴影
sphere.castShadow = true

scene.add(sphere)

// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2;

// 接收阴影
plane.receiveShadow = true
scene.add(plane)

// 添加灯光
// 点光源（类似灯泡）
const pointLight = new THREE.PointLight(0Xff0000, 1)
// 设置阴影的分辨率
pointLight.shadow.mapSize.set(1024, 1024)
pointLight.angle = Math.PI / 30
console.log(pointLight.angle);


// pointLight.position.set( 2, 0, 2);
pointLight.target = sphere
// 开启阴影
pointLight.castShadow = true
scene.add(pointLight)
// 辅助线
const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)

gui.addColor(pointLight, 'color')

gui.add(pointLight.position, 'x')
  .min(-30)
  .max(30)
  .step(0.1)
  .name('光源X坐标')
gui.add(pointLight.position, 'y')
  .min(-30)
  .max(30)
  .step(0.1)
  .name('光源Y坐标')
gui.add(pointLight.position, 'z')
  .min(-30)
  .max(30)
  .step(0.1)
  .name('光源Z坐标')

gui.add(sphere.position, 'x')
  .min(-50)
  .max(50)
  .step(0.1)
gui.add(sphere.position, 'y')
  .min(-50)
  .max(50)
  .step(0.1)
gui.add(sphere.position, 'z')
  .min(-50)
  .max(50)
  .step(0.1)

gui.add(pointLight, 'distance')
  .min(-2)
  .max(30)
  .step(0.01)
gui.add(pointLight, 'decay')
  .min(-1)
  .max(20)
  .step(0.01)


// 创建一个发光的球
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
ball.position.set(2, 1, 0)

ball.add(pointLight)
scene.add(ball)


gui.add(ball.position, 'x')
  .min(-30)
  .max(30)
  .step(0.1)
  .name('光球x坐标')
gui.add(ball.position, 'y')
  .min(-30)
  .max(30)
  .step(0.1)
  .name('光球y坐标')
gui.add(ball.position, 'z')
  .min(-30)
  .max(30)
  .step(0.1)
  .name('光球Z坐标')

// 环境光
// 第二个参数时灯光强度，默认为1
const light = new THREE.AmbientLight(0xffffff, 0.05)
// const light = new THREE.Light(0xffffff, 1)
scene.add(light)


// 创建渲染器
const renderer = new THREE.WebGLRenderer({antialias: true})
// 设置渲染器开始对阴影的计算
renderer.shadowMap.enabled = true
// 设置渲染的尺寸大小
renderer.setSize( window.innerWidth, window.innerHeight )
// 开启后可设置随着离光源的距离增加光照如何减弱。点光源和聚光灯等灯光受其影响。
// renderer.physicallyCorrectLights = true
// 将webgl渲染的canvas内容添加到body
document.body.appendChild( renderer.domElement )

// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(6)
scene.add(axesHelper)

window.addEventListener('dblclick', () => {
  // 双击全屏
  if(!document.fullscreenElement) {
    // 让画布对象全屏
    renderer.domElement.requestFullscreen()
  } else {
    // 退出全屏，使用document对象
    document.exitFullscreen()
  }
})

// 设置时钟
const clock = new THREE.Clock()
let time

function render() {
  time = clock.getElapsedTime()
  ball.position.x = Math.sin(time) * 2
  ball.position.z = Math.cos(time) * 2
  ball.position.y = Math.sin(time) * 2 + 1
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()

// 监听画面变化， 更新渲染画面
window.addEventListener('resize', ( ) => {
  console.log('变化了')
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})