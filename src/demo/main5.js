import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 掌握gsap 强大的动画库（商用需付费）
import gsap from  'gsap'
// 导入dat.gui (一个轻量级的UI界面控制库)
// 可以帮助我们快速设置变量,在界面当中以UI方式修改里面的值和数据
import * as dat from 'dat.gui'
// RGBE加载器(用于加载hdr环境图)
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 加载 hdr环境图
const rgbeLoader = new RGBELoader()
// 异步的
rgbeLoader.loadAsync('textures/hdr/004.hdr').then((texture) => {
  // 设置材质的映射模式
  texture.mapping = THREE.EquirectangularReflectionMapping
  // texture.mapping = THREE.EquirectangularRefractionMapping
  scene.background = texture
  scene.environment = texture
})

// 纹理贴图加载进度
const div = document.createElement('div')
div.style.width = '200px'
div.style.height = '200px'
div.style.position = 'fixed'
div.style.right = 0
div.style.top = 0
div.style.color = '#fff'
document.body.appendChild(div)

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
  div.innerHTML = itemsLoaded / itemsTotal === 1 ? '' : `纹理加载中----${parseInt((itemsLoaded / itemsTotal) * 100)}%`
}
manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url )
}

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader(manager)
const envMapTexture = cubeTextureLoader.load([
  "./textures/environmentMaps/2/px.jpg",
  "./textures/environmentMaps/2/nx.jpg",
  "./textures/environmentMaps/2/py.jpg",
  "./textures/environmentMaps/2/ny.jpg",
  "./textures/environmentMaps/2/pz.jpg",
  "./textures/environmentMaps/2/nz.jpg",
])

// 创建几何体
const sphereFeometry = new THREE.SphereGeometry(1, 30, 30)
// 创建材质
const material = new THREE.MeshStandardMaterial({
  metalness: 1,
  roughness: 0,
  // encMap配置没有则会找场景的默认环境贴图 scene.environment
  // envMap: envMapTexture,
})
// 根据几何体和材质创建物体
const sphere = new THREE.Mesh(sphereFeometry, material)

scene.add(sphere)
// 给场景添加背景
scene.background = envMapTexture
// 给场景所以的物体添加默认的环境贴图
scene.environment = envMapTexture

// 添加灯光
// 环境光
// 第二个参数时灯光强度，默认为1
const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)
// 直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(-30, 2, -10)
// scene.add(directionalLight)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({antialias: true})
// 设置渲染的尺寸大小
renderer.setSize( window.innerWidth, window.innerHeight )
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

function render() {
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