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
const sphere = new THREE.Mesh(sphereGeometry, material)

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
// 环境光
// 第二个参数时灯光强度，默认为1
const light = new THREE.AmbientLight(0xffffff, 0.05)
// const light = new THREE.Light(0xffffff, 1)
// scene.add(light)
// 直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(10, 10, 10)
directionalLight.castShadow = true

// 设置阴贴图的模糊度
directionalLight.shadow.radius = 18
// 设置阴影贴图的分辨率（默认为512*512）
directionalLight.shadow.mapSize.set(4096, 4096)

// 设置平行光投射相机的属性（切记这必须在添加辅助线之前完成）
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 200
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -5
directionalLight.shadow.camera.right = 5

scene.add(directionalLight)

// 平行光光源辅助线
const SpotLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(SpotLightHelper)


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

gui.add(directionalLight.shadow.camera, 'near')
  .min(0)
  .max(20)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.sphere()
    SpotLightHelper.update()
  })
gui.add(directionalLight.shadow.camera, 'far')
  .min(0)
  .max(23)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
  })
gui.add(directionalLight.shadow.camera, 'top')
  .min(-10)
  .max(10)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
  })
gui.add(directionalLight.shadow.camera, 'left')
  .min(-10)
  .max(10)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
  })
gui.add(directionalLight.shadow.camera, 'right')
  .min(-10)
  .max(10)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
  })
gui.add(directionalLight.shadow.camera, 'bottom')
  .min(-10)
  .max(10)
  .step(0.1)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
  })

// 创建渲染器
const renderer = new THREE.WebGLRenderer({antialias: true})
// 设置渲染器开始对阴影的计算
renderer.shadowMap.enabled = true
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