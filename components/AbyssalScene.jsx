'use client';

import { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  ScrollControls,
  useScroll,
  Scroll,
  PerformanceMonitor,
} from '@react-three/drei';
import * as THREE from 'three';
import { useAbyssalInput } from '@/hooks/useAbyssalInput';
import { useAdaptiveQuality } from '@/hooks/useAdaptiveQuality';

// ─── GLSL SHADERS ─────────────────────────────────────────────────────────────
const fresnelVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSpeed;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float freq = 2.0 + uSpeed * 3.0;
    pos.z += sin(pos.y * 5.0 + uTime * freq) * 0.1;
    pos.x += sin(pos.y * 3.0 + uTime * freq * 0.7 + pos.x * 2.0) * 0.04;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fresnelFrag = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform float uTransmission;
  uniform float uTime;
  uniform float uFresnelEnabled;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.0) * uFresnelEnabled;

    vec3 edgeColor = vec3(0.7, 0.85, 1.0);
    vec3 biolumColor = vec3(0.1, 0.6, 1.0);
    float pulse = sin(uTime * 1.5 + vUv.y * 10.0) * 0.5 + 0.5;

    vec3 finalColor = mix(uBaseColor, edgeColor, fresnel * 0.9);
    finalColor += biolumColor * fresnel * pulse * 0.3;

    float alpha = 1.0 - uTransmission * fresnel * 0.6;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ─── LIONFISH ─────────────────────────────────────────────────────────────────
function Lionfish({ targetRef, isMobile, fresnelEnabled, fishWorldPos }) {
  const groupRef = useRef();
  const spotLightRef = useRef();
  const bioLightRef = useRef();
  const scroll = useScroll();

  const { scene } = useGLTF('/models/lionfish.glb');

  const prevPos = useRef(new THREE.Vector3());
  const velocity = useRef(0);
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fresnelVert,
        fragmentShader: fresnelFrag,
        transparent: true,
        uniforms: {
          uBaseColor: { value: new THREE.Color('#111111') },
          uTransmission: { value: 0.5 },
          uTime: { value: 0 },
          uSpeed: { value: 0 },
          uFresnelEnabled: { value: 1.0 },
        },
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => {
    let meshCount = 0;
    scene.traverse((child) => {
      if (child.isMesh) {
        meshCount++;
        // Material diagnostik warna merah menyala
        child.material = new THREE.MeshStandardMaterial({
          color: '#ff0044',
          emissive: '#ff0044', 
          emissiveIntensity: 0.8,
          wireframe: true 
        });
        child.castShadow = true;
      }
    });
    // Menampilkan log ke konsol peramban untuk memastikan model ada isinya
    console.log("DIAGNOSTIK: Jumlah Mesh ditemukan dalam GLB = ", meshCount);
  }, [scene]);

  useEffect(() => {
    shaderMat.uniforms.uFresnelEnabled.value = fresnelEnabled ? 1.0 : 0.0;
  }, [fresnelEnabled, shaderMat]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const scrollOffset = scroll.offset;
    const lerpSpeed = isMobile ? 0.09 : 0.06;

    // XY: follow mouse / touch (DITAMBAHKAN FALLBACK 0 UNTUK MENCEGAH NaN)
    const tx = targetRef?.current?.x || 0; 
    const ty = (targetRef?.current?.y || 0) + scrollOffset * -6;
    
    const tVec = new THREE.Vector3(tx, ty, 0);
    currentPos.current.lerp(tVec, lerpSpeed);
    groupRef.current.position.copy(currentPos.current);

    // Expose world pos to DOM layer
    if (fishWorldPos) fishWorldPos.current.copy(currentPos.current);

    // Velocity
    const dist = currentPos.current.distanceTo(prevPos.current);
    velocity.current = THREE.MathUtils.lerp(
      velocity.current,
      (dist / Math.max(delta, 0.001)) * 0.1,
      0.1
    );
    velocity.current = Math.min(velocity.current, 1.0);
    prevPos.current.copy(currentPos.current);

    // Rotation — face direction + dive on scroll
    const dx = tx - currentPos.current.x;
    const dy = ty - currentPos.current.y;
    const divePitch = scrollOffset * -0.2;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.atan2(dx, 5),
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.atan2(-dy, 5) + divePitch,
      0.06
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -dx * 0.3,
      0.08
    );

    // Scale by device (DIPERBESAR SECARA EKSTREM UNTUK DIAGNOSTIK)
    const targetScale = 30.0; // Sebelumnya 0.55 / 0.8
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
    );

    // Shader uniforms
    shaderMat.uniforms.uTime.value = time;
    shaderMat.uniforms.uSpeed.value = velocity.current;

    // Spotlight from above-side
    if (spotLightRef.current) {
      spotLightRef.current.position.set(
        currentPos.current.x + 2,
        currentPos.current.y + 4,
        currentPos.current.z + 2
      );
      spotLightRef.current.target.position.copy(currentPos.current);
      spotLightRef.current.target.updateMatrixWorld();
    }

    // Bioluminescence — off on mobile
    if (bioLightRef.current) {
      if (!isMobile) {
        bioLightRef.current.position.copy(currentPos.current);
        bioLightRef.current.position.y += 0.2;
        bioLightRef.current.intensity = 0.3 + Math.sin(time * 2.0) * 0.1;
      } else {
        bioLightRef.current.intensity = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <spotLight
        ref={spotLightRef}
        position={[2, 4, 2]}
        intensity={8}
        angle={0.35}
        penumbra={0.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#e8d5b0"
      />
      <pointLight
        ref={bioLightRef}
        color="#1a6fff"
        intensity={0.3}
        distance={4}
        decay={2}
      />
    </group>
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function AbyssParticles({ count = 300, isMobile }) {
  const meshRef = useRef();
  const actual = isMobile ? 150 : count;

  const positions = useMemo(() => {
    const arr = new Float32Array(actual * 3);
    for (let i = 0; i < actual; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [actual]);

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < actual; i++) {
      pos.array[i * 3 + 1] -= 0.003;
      if (pos.array[i * 3 + 1] < -15) pos.array[i * 3 + 1] = 15;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#3a6090"
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// ─── SCENE CONTROLLER ─────────────────────────────────────────────────────────
function SceneController() {
  const { scene, camera } = useThree();
  const scroll = useScroll();

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0a0a0a', 0.01);
    camera.position.set(0, 0, 8);
  }, []);

  useFrame(() => {
    const t = scroll.offset;
    if (scene.fog) {
      scene.fog.density = THREE.MathUtils.lerp(0.01, 0.18, t);
    }
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -t * 3, 0.05);
  });

  return null;
}

// ─── LOADING PLACEHOLDER ──────────────────────────────────────────────────────
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#1a3a6f" wireframe />
    </mesh>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
export default function AbyssalScene({ isMobile, fishWorldPos, children }) {
  const { targetRef } = useAbyssalInput({ isMobile });
  const { fresnelEnabled, onDecline, onIncline } = useAdaptiveQuality();

  return (
    <Canvas
      shadows
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      gl={{
        antialias: !isMobile,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8,
      }}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <PerformanceMonitor
        onDecline={onDecline}
        onIncline={onIncline}
        flipflops={3}
        factor={0.5}
        bounds={(r) => [r * 0.4, r * 0.9]}
      />

      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.05} />

      <ScrollControls pages={4} damping={0.3} distance={1}>
        <SceneController />
        <AbyssParticles count={400} isMobile={isMobile} />

        <Suspense fallback={<LoadingFallback />}>
          <Lionfish
            targetRef={targetRef}
            isMobile={isMobile}
            fresnelEnabled={fresnelEnabled}
            fishWorldPos={fishWorldPos}
          />
        </Suspense>

        {/* DOM overlay synced to scroll */}
        <Scroll html style={{ width: '100%' }}>
          {children}
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
}
