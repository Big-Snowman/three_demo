import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 掌握gsap 强大的动画库（商用需付费）
import gsap from  'gsap'
// 导入dat.gui (一个轻量级的UI界面控制库)
// 可以帮助我们快速设置变量,在界面当中以UI方式修改里面的值和数据
import * as dat from 'dat.gui'


const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

// 添加物体
// 创建几何体
const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0
])
// 因为传入的 vertices 数组是一维数组，所以后面的 3 是告诉每 3 个数为一个点
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 材质
const material = new THREE.MeshBasicMaterial({color: 0xc0c000})
// 根据几何体和材质创建物体
const mesh = new THREE.Mesh(geometry, material)

// 根据集合体和材质创建物体

// 将几何体天机场景中
scene.add(mesh)

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