import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber'
// https://github.com/pmndrs/drei
import { useGLTF, Detailed, Environment, MeshTransmissionMaterial, Lightformer } from '@react-three/drei'
import { EffectComposer, DepthOfField,Outline } from '@react-three/postprocessing'
import { CanvasTexture, LineSegments } from 'three';
import { RGBELoader } from 'three-stdlib'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'

// eslint-disable-next-line react-hooks/rules-of-hooks
function Banana({ index, z, speed }) {
    
    const ref = useRef()
    // useThree gives you access to the R3F state model
    const { viewport, camera } = useThree()
    // getCurrentViewport is a helper that calculates the size of the viewport
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z])
    // useGLTF is an abstraction around R3F's useLoader(GLTFLoader, url)
    // It can automatically handle draco and meshopt-compressed assets without you having to
    // worry about binaries and such ...
    /* @ts-ignore */
    const { nodes } = useGLTF('/mylogo.glb')
    // By the time we're here the model is loaded, this is possible through React suspense

    // Local component state, it is safe to mutate because it's fixed data
    const [data] = useState({
        // Randomly distributing the objects along the vertical
        y: THREE.MathUtils.randFloatSpread(height * 2),
        // This gives us a random value between -1 and 1, we will multiply it with the viewport width
        x: THREE.MathUtils.randFloatSpread(2),
        // How fast objects spin, randFlost gives us a value between min and max, in this case 8 and 12
        spin: THREE.MathUtils.randFloat(8, 12),
        // Some random rotations, Math.PI represents 360 degrees in radian
        rX: Math.random() * Math.PI,
        rZ: Math.random() * Math.PI
    })

    // useFrame executes 60 times per second
    useFrame((state, dt) => {
        // Make the X position responsive, slowly scroll objects up at the Y, distribute it along the Z
        // dt is the delta, the time between this frame and the previous, we can use it to be independent of the screens refresh rate
        // We cap dt at 0.1 because now it can't accumulate while the user changes the tab, it will simply stop
        /* @ts-ignore */
        if (dt < 0.1) ref.current.position.set(index === 0 ? 0 : data.x * width, (data.y += dt * speed), -z)
        // Rotate the object around
        /* @ts-ignore */
        ref.current.rotation.set((data.rX += dt / data.spin), Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI, (data.rZ += dt / data.spin))
        // If they're too far up, set them back to the bottom
        if (data.y > height * (index === 0 ? 4 : 1)) data.y = -(height * (index === 0 ? 4 : 1))
    })
   

    const materialProps = ({
        backside: false,
        samples: 4,
        resolution: 128,
        transmission: 0.6,
        clearcoat: 0,
        clearcoatRoughness: 0.0,
        thickness: 0.55,
        chromaticAberration: 5,
        anisotropy: 0.3,
        roughness: 0.0,
        distortion: 1,
        distortionScale: 1,
        temporalDistortion: 0.4,
        ior: 0.83,
        color: '#62da7e',
        gColor: '#78ff75',
        shadow: '#0a4816',
    })

    // Using drei's detailed is a nice trick to reduce the vertex count because
    // we don't need high resolution for objects in the distance. The model contains 3 decimated meshes ...
    return (
        /* @ts-ignore */
        <Detailed ref={ref} distances={[0, 80, 100]}>
            <mesh geometry={nodes.Cylinder.geometry}>
                {/* <meshPhysicalMaterial {...materialProps} */}
                <meshToonMaterial color={'#19bc17'} wireframe={false} />
                
                {/* <MeshTransmissionMaterial reflectivity={0.5} {...materialProps} /> scale={[0.1, 0.1, 0.1]} */}
            </mesh>
     
            
        </Detailed>
    )
}

export default function Bananas({ speed = 2, count = 30, depth = 50, easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)) }) {
    
    return (
        // No need for antialias (faster), dpr clamps the resolution to 1.5 (also faster than full resolution)
        <Canvas gl={{  preserveDrawingBuffer: true }} dpr={[1.5, 1.5]} camera={{ position: [0, 0, 10], fov: 35, near: 0.01, far: depth + 15 }}>
         {/* <Canvas shadows orthographic camera={{ position: [10, 20, 20], zoom: 80 }} gl={{ preserveDrawingBuffer: true }}> */}
          
        {/* <color attach="background" args={['#ffbf40']} /> */ }
            <spotLight position={[10, 20, 10]} penumbra={1} intensity={3} color="orange" />
            {/* Using cubic easing here to spread out objects a little more interestingly, i wanted a sole big object up front ... */}
            {Array.from({ length: count }, (_, i) => <Banana key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */)}
            {/* <Environment preset="sunset" /> */}
            {/* Multisampling (MSAA) is WebGL2 antialeasing, we don't need it (faster) */}
            <EffectComposer multisampling={0}>
                {/* <DepthOfField target={[0, 0, 65]} focalLength={0.4} bokehScale={14} height={700} /> */}
                <Outline
                    blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
                    blur // whether the outline should be blurred
                    edgeStrength={1}
                    hiddenEdgeColor='#ffffff' // the color of hidden edges (behind another mesh)
                    kernelSize={KernelSize.HUGE}
                    pulseSpeed={0.01}
                    visibleEdgeColor='#000000' // the color of visible edges
                />
            </EffectComposer>
        </Canvas>
        
    )
}
