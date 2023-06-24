
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

// 初始化场景
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
// 更新摄像头宽高比
camera.aspect = window.innerWidth / window.innerHeight
// 更新摄像头得投影矩阵
camera.updateProjectionMatrix()

camera.position.set(-50, 50, 130)

scene.add(camera)


// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
})
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

// window.addEventListener('dblclick', () => {
//   // 双击全屏
//   if(!document.fullscreenElement) {
//     // 让画布对象全屏
//     renderer.domElement.requestFullscreen()
//   } else {
//     // 退出全屏，使用document对象
//     document.exitFullscreen()
//   }
// })

function render() {
  // 渲染场景
  renderer.render(scene, camera)
  // 控制器更新
  controls.update()
  // 引擎自动更新渲染器
  requestAnimationFrame(render)
}

render()

// 监听画面变化， 更新渲染画面
window.addEventListener('resize', ( ) => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})


// // 添加平面
// const planeGeometry = new THREE.PlaneGeometry(100, 100)
// const planeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff
// })
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.rotation.x = -Math.PI / 2
// scene.add(plane)

// 创建一个巨大得天空球体
const skyGeometry = new THREE.SphereGeometry(100, 60, 40)
// const skeMaterial = new THREE.MeshBasicMaterial({
//   map:
// })