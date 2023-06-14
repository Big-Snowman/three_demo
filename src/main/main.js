import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 掌握gsap 强大的动画库（商用需付费）
import gsap from  'gsap'
// 导入dat.gui (一个轻量级的UI界面控制库)
// 可以帮助我们快速设置变量,在界面当中以UI方式修改里面的值和数据
import * as dat from 'dat.gui'

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

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 100, 100, 100)

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
// 导入纹理
const textureLoader = new THREE.TextureLoader(manager)

// const redBrickTexture = textureLoader.load("./textures/minecraft.png")
// 基础纹理
const redBrickTexture = textureLoader.load("./textures/door/color.jpg")
// 灰度纹理
const redBrickAplhaTexture = textureLoader.load("./textures/door/alpha.jpg")
// 环境遮挡贴图
const redBrickAoteTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")
// 位移纹理贴图
const redBrickHeightTexture = textureLoader.load("./textures/door/height.jpg")
// 粗糙度贴图
const redBrickRoughnessTexture = textureLoader.load("./textures/door/roughness.jpg")
// 金属贴图
const redBrickMetalnessTexture = textureLoader.load("./textures/door/metalness.jpg")
// 法线贴图
const redBricknormalTexture = textureLoader.load("./textures/door/normal.jpg")
// const redBrickTexture = textureLoader.load("./textures/Planks033B_1K_Color.png")

// 纹理相关属性
// 设置纹理偏移
// redBrickTexture.offset.x = 0.5
// 纹理旋转
// redBrickTexture.rotation = Math.PI / 4
// 设置纹理旋转中心点，默认为(0, 0)即左下角
// redBrickTexture.center.set(0.5, 0.5)
// 设置纹理的重复(2,3)表示x轴要重复两次y轴重复3次,同时要设置下面两个纹理重复模式才能生效
// redBrickTexture.repeat.set(2,3)
// 设置纹理重复的模式
// MirroredRepeatWrapping设置镜像重复
// redBrickTexture.wrapS = THREE.MirroredRepeatWrapping
// wrapT设置垂直方向上的重复
// redBrickTexture.wrapT = THREE.RepeatWrapping
// 纹理显示设置
// 当一个纹理像素要显示少于一个纹理图片像素时，默认值为THREE.LinearMipmapLinearFilter
// redBrickTexture.minFilter = THREE.NearestFilter
// 当一个纹理像素要显示多个纹理图片像素时，默认值为THREE.LinearFilter
// redBrickTexture.magFilter = THREE.NearestFilter

// 材质
const material = new THREE.MeshStandardMaterial({
  color:"#ffffff",
  map: redBrickTexture,
  alphaTest: 0,
  // 灰度纹理 控制哪里透明
  alphaMap: redBrickAplhaTexture,
  // 阴影纹理
  aoMap: redBrickAoteTexture,   // 需要设置第二组UV，个人暂时觉得没区别
  // 高低顶点位移纹理
  displacementMap: redBrickHeightTexture,
  // 高低顶点影响程度
  displacementScale: 0.1,
  // 粗糙度
  roughness: 1.6,
  // 粗糙贴图
  roughnessMap: redBrickRoughnessTexture,
  // 金属粗糙度
  metalness: 1.5,
  // 金属贴图
  metalnessMap: redBrickMetalnessTexture,
  // 法线贴图
  normalMap: redBricknormalTexture,
  // 设置遮罩强度
  // aoMapIntensity: 0.5,
  transparent: true,
  // 设置是否渲染两面，默认为单面
  side: THREE.DoubleSide,
  // opacity: 0.5
})

// 给平面设计第二组UV  
cubeGeometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 3)
)

console.log(redBrickTexture);
console.log(material);
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, material)

// 将几何体添加场景中
scene.add(cube)

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(2, 2, 100, 100)
const plane = new THREE.Mesh(
  planeGeometry,
  material
)
console.log(planeGeometry);
plane.position.set(2, 0, 0)
scene.add(plane)
// 给平面设计第二组UV
planeGeometry.setAttribute('uv2',
new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
)

// 添加灯光
// 环境光
// 第二个参数时灯光强度，默认为1
const light = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(light)
// 直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

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