import React, { useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Mesh } from 'three'

export default function TextureComponent() {
    const gltf = useLoader(
      GLTFLoader,
      "/models/laptop/scene.gltf"
    )

    useEffect(() => {
      gltf.scene.scale.set(0.1, 0.1, 0.1)
      gltf.scene.position.set(0.5, -0.5, 3)
      gltf.scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
          object.material.envMapIntensity = 20
        }
      })
    }, [gltf])
    
  return <primitive object={gltf.scene}/>
}
