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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const cubeMaterial = new THREE.LineBasicMaterial({color: 0xc0c000})
// 根据集合体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set(5,0,2)
cube.position.x = 0
// 实例创建一个GUI
const gui = new dat.GUI()
gui.add(cube.position, 'x')
.min(0)
.max(5)
.step(0.01)
.name('移动X轴坐标')
.onChange((value)=> {
  console.log('值被修改了', value);
})

// 修改物体的颜色
const params = {
  color: '#ffff00',
  fn: () => {
    // 做些什么
    gsap.to(cube.position, {z: 6, duration: 3, yoyo: true, repeat: 1, repeatDelay: 0.5})
  }
}
gui.addColor(params, 'color').onChange((value) => {
  console.log(value);
  cube.material.color.set(value)
})
// 选项框
gui.add(cube, 'visible').name('是否显示')
// 点击按钮出发某个事件
gui.add(params, 'fn').name('向Z轴运动')
//
let folder = gui.addFolder('设置立方体')
console.log(cube);
folder.add(cube.material, 'fog')
folder.add(cube.material, 'clipShadows')
folder.add(cube.material, 'clipIntersection')
folder.add(cube.material, 'alphaToCoverage')
folder.add(cube.material, 'depthTest')
folder.add(cube.material, 'forceSinglePass')
folder.add(cube.material, 'toneMapped')
folder.add(cube.material, 'transparent')
folder.add(cube.material, 'vertexColors')

// 将几何体天机场景中
scene.add(cube)

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
// 设置时钟
const clock = new THREE.Clock()

// 自己写动画函数
// let time
// function render() {
//   // 获取时钟运行的总时长
//   time = clock.getElapsedTime()
//   // let deltaTime = clock.getDelta()
//   // console.log("时钟运行总时长:", time)
//   // console.log("两次获取时间的间隔时长:", deltaTime)
//   let t = time % 6
//   cube.position.x = t
//   // 旋转
//   cube.rotation.x += 0.01
//   cube.rotation.y += 0.01
//   cube.rotation.z += 0.01
//   // 使用渲染器，通过相机将场景渲染进来
//   renderer.render(scene, camera)
//   requestAnimationFrame(render)
// }

// 利用gsap设置动画

// 可以创建时间轴
// const tl = gsap.timeline()
// tl.to(element1, {duration: 1, x: 200})
//   .to(element2, {duration: 1, y: 200})

const animation1 = gsap.to(cube.position, {
  x: 5, 
  duration: 5,
  ease: "power1.inOut",
  repeat: -1,          // 重复次数  (无限是 -1)
  repeatDelay: 0.5,   //  重复延迟0.5秒
  yoyo: true,         // 反向
  onComplete: () => {
    console.log('动画已完成')
  },
  onStart: () => {
    console.log('动画已开始');
  }
})
gsap.to(cube.rotation, {
  x: 2 * Math.PI, 
  duration: 5,
  ease: "power1.inOut",
  repeat: -1,          // 重复次数  (无限是 -1)
  repeatDelay: 0.5,   //  重复延迟0.5秒
  yoyo: true,         // 反向
})

window.addEventListener('click', () => {
  console.log(animation1);
  if(animation1.isActive()) {
    // 暂停
    animation1.pause()
  } else {
    // 恢复
    animation1.resume()
  }
})

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