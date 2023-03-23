import { Suspense } from 'react'
import styles from '../styles/Animation.module.scss'
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import TextureComponent from "../components/Animation/TextureComponent"
import { SphereGeometry } from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage, Grid, OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'
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


export default function Home() {
  return (
    <div className={styles.scene}>
    <Suspense fallback={null}>
        {/* <Canvas shadows>
    <ambientLight intensity={0.01} />
  <directionalLight color="blue" position={[0.5, 0.5, 0]} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, -1, 0]} />
        </Canvas> */}
            <Canvas gl={{ logarithmicDepthBuffer: true }} shadows camera={{ position: [-15, 0, 10], fov: 25 }}>
      <fog attach="fog" args={['black', 15, 21.5]} />
      <Stage intensity={0.5} environment="city" shadows={{ type: 'accumulative', bias: -0.001 }} adjustCamera={false}>
        <Kamdo rotation={[0, Math.PI, 0]} />
      </Stage>
      <Grid renderOrder={-1} position={[0, -1.85, 0]} infiniteGrid cellSize={0.6} cellThickness={0.6} sectionSize={3.3} sectionThickness={1.5} sectionColor={[0.5, 0.5, 10]} fadeDistance={30} />
      <OrbitControls autoRotate autoRotateSpeed={0.05} enableZoom={false} makeDefault minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
      <Environment background preset="sunset" blur={0.8} />
    </Canvas>
    </Suspense>
    </div>
  )
}

