import React, { forwardRef, Suspense, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei';

type PetAction = 'idle' | 'talk' | 'eat' | 'jump';

export type Pet3DHandle = {
  playAction: (a: PetAction) => void;
};

type Pet3DProps = {
  modelPath?: string; // e.g. '/assets/models/pet.glb'
  initialAction?: PetAction;
  onActionFinished?: (action: PetAction) => void;
  scale?: number;
};

function PetModel({ modelPath, action, onActionFinished, scale = 1 }: { modelPath: string; action: PetAction; onActionFinished?: (a: PetAction) => void; scale?: number }) {
  const { scene, animations } = useGLTF(modelPath) as any;
  const { actions, mixer } = useAnimations(animations, scene);
  const current = useRef<any>(null);

  useEffect(() => {
    if (!actions) return;

    const mapNames = {
      idle: ['Idle', 'idle', 'IDLE'],
      talk: ['Talk', 'talk', 'Speak', 'Speech'],
      eat: ['Eat', 'eat', 'Chew'],
      jump: ['Jump', 'jump'],
    } as Record<string, string[]>;

    const names = mapNames[action] || Object.keys(actions);
    const foundName = names.find((n: string) => actions[n]);
    const anim = foundName ? actions[foundName] : Object.values(actions)[0];

    if (!anim) return;
    if (current.current && current.current !== anim) {
      current.current.fadeOut(0.15);
    }
    anim.reset().fadeIn(0.15).play();
    current.current = anim;

    // call finished after clip duration if non-looping
    const clip = anim.getClip ? anim.getClip() : null;
    if (clip && clip.duration && anim.loop === undefined) {
      const durationMs = (clip.duration / (mixer?.timeScale || 1)) * 1000;
      const t = setTimeout(() => onActionFinished?.(action), durationMs);
      return () => clearTimeout(t);
    } else {
      // fallback notify
      const t = setTimeout(() => onActionFinished?.(action), 900);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, actions, mixer, onActionFinished, scene]);

  // gentle idle motion
  useFrame((state) => {
    if (scene) scene.rotation.y = Math.sin(state.clock.elapsedTime / 3) * 0.04;
  });

  return <primitive object={scene} scale={scale} />;
}

const Pet3D = forwardRef<Pet3DHandle, Pet3DProps>(({ modelPath = '/assets/models/pet.glb', initialAction = 'idle', onActionFinished, scale = 1 }, ref) => {
  const actionRef = useRef<PetAction>(initialAction);
  const [tick, setTick] = useState(0);

  useImperativeHandle(ref, () => ({
    playAction: (a: PetAction) => {
      actionRef.current = a;
      setTick(t => t + 1);
    },
  }), []);

  const handleFinished = (a: PetAction) => {
    // After expressive action return to idle
    actionRef.current = 'idle';
    setTick(t => t + 1);
    onActionFinished?.(a);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 1.2, 3.5], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <PetModel modelPath={modelPath} action={actionRef.current} onActionFinished={handleFinished} scale={scale} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
});

export default Pet3D;
