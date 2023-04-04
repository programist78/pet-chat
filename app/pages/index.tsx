import { Suspense } from 'react'
import styles from '../styles/Animation.module.scss'
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import TextureComponent from "../components/Animation/TextureComponent"
import { SphereGeometry } from 'three'
import Bananas from "../components/Animation/Bananas"
import {FadeIn, LeftMiddle} from "../components/Animation/Elements" 
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import dynamic from 'next/dynamic'

const DynamicBananas = dynamic(() => import('../components/Animation/Bananas'), {
  loading: () => <p>Loading...</p>,
})
function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (active ? mesh.current.rotation.x : mesh.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      {/* <sphereGeometry args={[1, 1, 1]}/> */}
      {/* <octahedronGeometry args={[1, 3]}/> */}
      {/* <meshNormalMaterial /> */}
      {/* <meshBasicMaterial color={hovered ? 'hotpink' : 'dark'} /> */}
      <meshStandardMaterial color={hovered ? 'hotpink' : 'white'} />
    </mesh>
  )
}





// export default function Home() {
//   return (
//     <div className={styles.scene}>
//     <Suspense fallback={null}>
//         <Canvas shadows>
//     <ambientLight intensity={0.01} />
//   <directionalLight color="blue" position={[0.5, 0.5, 0]} />
//     <Box position={[-1.2, 0, 0]} />
//     <Box position={[1.2, -1, 0]} />
//         </Canvas>
//     </Suspense>
//     </div>
//   )
// }

export default function App() {
  const [speed, set] = useState(1)
  return (
    <div className={styles.scene}>
      <Suspense fallback={null}>
        <DynamicBananas speed={speed} />
        <FadeIn />
      </Suspense>
      <LeftMiddle>
        <input type="range" min="0" max="10" value={speed} step="1" onChange={(e) => set(e.target.value)} />
      </LeftMiddle>
    </div>
  )
}
