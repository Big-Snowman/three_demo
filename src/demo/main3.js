import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 掌握gsap 强大的动画库（商用需付费）
import gsap from  'gsap'
// 导入dat.gui (一个轻量级的UI界面控制库)
// 可以帮助我们快速设置变量,在界面当中以UI方式修改里面的值和数据
import * as dat from 'dat.gui'

// 创建一个场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

// 设置相机位置
camera.position.set(0, 0, 6)
scene.add(camera)

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

// 导入纹理
const textureLoader = new THREE.TextureLoader()
// const redBrickTexture = textureLoader.load("./textures/minecraft.png")
const redBrickTexture = textureLoader.load("./textures/door/color.jpg")
const redBrickAplhaTexture = textureLoader.load("./textures/door/alpha.jpg")
const redBrickAoteTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")
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
const basicMaterial = new THREE.MeshBasicMaterial({
  color: '#00ffff',
  map: redBrickTexture,
  alphaTest: 0,
  alphaMap: redBrickAplhaTexture,
  aoMap: redBrickAoteTexture,   // 需要设置第二组UV，个人暂时觉得没区别
  // 设置遮罩强度
  // aoMapIntensity: 0.5,
  transparent: true,
  combine: THREE.AddOperation,
  // 设置是否渲染两面，默认为单面
  side: THREE.DoubleSide,
  // opacity: 0.5
})

// 给平面设计第二组UV  
cubeGeometry.setAttribute('uv2',
new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 3)
)

console.log(redBrickTexture);
console.log(basicMaterial);
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, basicMaterial)

// 将几何体添加场景中
scene.add(cube)


// 添加平面
const planeGeometry = new THREE.PlaneGeometry(2, 2)
const plane = new THREE.Mesh(
  planeGeometry,
  basicMaterial
)
console.log(planeGeometry);
plane.position.set(4, 0, 0)
scene.add(plane)
// 给平面设计第二组UV
planeGeometry.setAttribute('uv2',
new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
)


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