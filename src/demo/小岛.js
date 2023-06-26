
// 点光源

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入水面
// three 官方
import { Water } from 'three/examples/jsm/objects/Water2'
// 导入glft 载入库
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 因为导入的这个模型压缩过，所以要导入下面这个解压的工具
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 初始化场景
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(-50, 50, 130)
// 更新摄像头宽高比
camera.aspect = window.innerWidth / window.innerHeight
// 更新摄像头得投影矩阵
camera.updateProjectionMatrix()

scene.add(camera)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
  // 对数深度缓冲区
  logarithmicDepthBuffer: true,
})

renderer.outputEncoding = THREE.sRGBEncoding;

// 设置渲染器开始对阴影的计算
renderer.shadowMap.enabled = true
// 设置渲染的尺寸大小
renderer.setSize( window.innerWidth, window.innerHeight )
// 监听画面变化， 更新渲染画面
window.addEventListener('resize', ( ) => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
})

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

function render() {
  // 渲染场景
  renderer.render(scene, camera)
  // 控制器更新
  controls.update()
  // 引擎自动更新渲染器
  requestAnimationFrame(render)
}

render()

// 创建一个巨大得天空球体
const skyGeometry = new THREE.SphereGeometry(1000, 60, 40)
const skyMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('./textures/sky.jpg')
})
skyGeometry.scale(1, 1, -1)
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(sky)

// 视频纹理
const video = document.createElement('video')
video.src = './textures/sky.mp4'
video.loop = true
// video.autoplay = true

window.addEventListener('click', () => {
  if(video.paused) {
    video.play()
    skyMaterial.map = new THREE.VideoTexture(video)
    skyMaterial.map.needsUpdate = true
  }
})

// 载入环境纹理hdr
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync('./assets/050.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-100, 100, 10)
scene.add(light)

// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 64)
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  // waterNormals: new THREE.TextureLoader().load( './textures/water/waternormals.jpg', function ( texture ) {
  //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // } ),
  // waterColor: 0x001e0f,
  // waterColor: 0x0080ff,
  color: 0xeeeeff,
  // 水的流向
  flowDirection: new THREE.Vector2(1, 1),
  // 水面波纹大小
  scale: 1
})
water.position.y = 3
water.rotation.x = -Math.PI / 2
scene.add(water)

// 添加小岛模型
// 实例化gltf载入库
const loader = new GLTFLoader()
// 实例化 draco 载入库
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
// dracoLoader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
// dracoLoader.preload();
// 添加draco载入库
loader.setDRACOLoader(dracoLoader)

loader.load('./mod/island2.glb', (gltf) => {
  scene.add(gltf.scene)
})