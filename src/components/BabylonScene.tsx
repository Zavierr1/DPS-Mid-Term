import React, { useEffect, useRef } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Mesh } from '@babylonjs/core';

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine and scene
    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;

    // Create camera
    const camera = new FreeCamera('camera', new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());

    // Create lighting
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create floating geometric shapes
    const shapes: Mesh[] = [];
    
    // Create cubes
    for (let i = 0; i < 8; i++) {
      const cube = MeshBuilder.CreateBox(`cube${i}`, { size: 0.5 }, scene);
      const material = new StandardMaterial(`cubeMat${i}`, scene);
      
      // Set random cyber colors
      const colors = [
        new Color3(0, 0.83, 1), // cyber blue
        new Color3(0.55, 0.36, 0.96), // cyber purple
        new Color3(0.06, 0.73, 0.51), // cyber green
        new Color3(0.96, 0.62, 0.04), // cyber orange
      ];
      
      material.diffuseColor = colors[i % colors.length];
      material.emissiveColor = colors[i % colors.length].scale(0.2);
      cube.material = material;
      
      // Random position
      cube.position = new Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 20
      );
      
      shapes.push(cube);
    }

    // Create spheres
    for (let i = 0; i < 6; i++) {
      const sphere = MeshBuilder.CreateSphere(`sphere${i}`, { diameter: 0.8 }, scene);
      const material = new StandardMaterial(`sphereMat${i}`, scene);
      
      const colors = [
        new Color3(0.93, 0.28, 0.6), // cyber pink
        new Color3(0, 0.83, 1), // cyber blue
        new Color3(0.55, 0.36, 0.96), // cyber purple
      ];
      
      material.diffuseColor = colors[i % colors.length];
      material.emissiveColor = colors[i % colors.length].scale(0.3);
      sphere.material = material;
      
      sphere.position = new Vector3(
        (Math.random() - 0.5) * 15,
        Math.random() * 8 + 3,
        (Math.random() - 0.5) * 15
      );
      
      shapes.push(sphere);
    }

    // Render loop
    const renderLoop = () => {
      scene.render();
    };

    engine.runRenderLoop(renderLoop);

    // Handle resize
    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
      style={{ outline: 'none' }}
    />
  );
};

export default BabylonScene;