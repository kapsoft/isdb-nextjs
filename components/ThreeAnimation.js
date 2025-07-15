'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeAnimation() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const ballsRef = useRef([]);
  const ballBodiesRef = useRef([]);
  const freezeBallsRef = useRef(false);
  const ballsCreatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset the balls created flag
    ballsCreatedRef.current = false;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 17);
    camera.lookAt(0, -2, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Floor constants - smaller
    const floorSize = 10;

    // Create textures
    function createBasketballTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      // Base orange color
      ctx.fillStyle = '#f0851a';
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw basketball lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, 128);
      ctx.lineTo(256, 128);
      ctx.stroke();
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.lineTo(128, 256);
      ctx.stroke();
      
      // Curved lines
      ctx.beginPath();
      ctx.arc(128, 128, 60, 0, Math.PI * 2);
      ctx.stroke();
      
      return new THREE.CanvasTexture(canvas);
    }

    function createFootballTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      // Base brown color
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw football laces
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(118, 78, 20, 100);
      
      // Draw football seams
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.ellipse(128, 128, 100, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      return new THREE.CanvasTexture(canvas);
    }

    function createBaseballTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      // Base white color
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw baseball seams
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 5;
      
      // Draw curved seams
      ctx.beginPath();
      ctx.arc(128, 128, 75, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(128, 128, 75, Math.PI * 1.25, Math.PI * 1.75);
      ctx.stroke();
      
      return new THREE.CanvasTexture(canvas);
    }

    function createPuckTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      // Base black color
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw circular grooves
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      
      for (let radius = 20; radius < 120; radius += 20) {
        ctx.beginPath();
        ctx.arc(128, 128, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      return new THREE.CanvasTexture(canvas);
    }

    // Create basketball court texture
    function createBasketballCourtTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      // Base white oak floor color - lighter
      ctx.fillStyle = '#d4c4a8';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Create true parquet pattern - alternating square panels
      const panelSize = 128; // Large square panels like Celtics floor
      
      // Draw alternating parquet panels
      for (let y = 0; y < 1024; y += panelSize) {
        for (let x = 0; x < 1024; x += panelSize) {
          // Determine if this panel should have horizontal or vertical grain
          const isHorizontal = (Math.floor(x / panelSize) + Math.floor(y / panelSize)) % 2 === 0;
          
          // White oak color variation for each panel
          const colorVariation = Math.random() * 25;
          const baseR = 200 + colorVariation;
          const baseG = 180 + colorVariation;
          const baseB = 140 + colorVariation;
          const baseColor = `rgb(${baseR}, ${baseG}, ${baseB})`;
          
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, panelSize, panelSize);
          
          // Add wood grain lines based on orientation
          ctx.strokeStyle = 'rgba(139, 119, 101, 0.3)';
          ctx.lineWidth = 1;
          
          if (isHorizontal) {
            // Horizontal grain lines
            for (let i = 0; i < panelSize; i += 8) {
              ctx.beginPath();
              ctx.moveTo(x, y + i);
              ctx.lineTo(x + panelSize, y + i);
              ctx.stroke();
            }
          } else {
            // Vertical grain lines
            for (let i = 0; i < panelSize; i += 8) {
              ctx.beginPath();
              ctx.moveTo(x + i, y);
              ctx.lineTo(x + i, y + panelSize);
              ctx.stroke();
            }
          }
          
          // Draw panel borders
          ctx.strokeStyle = 'rgba(139, 119, 101, 0.4)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, panelSize, panelSize);
        }
      }
      
      // Court dimensions (scaled to texture)
      const courtWidth = 900;
      const courtHeight = 900;
      const courtX = (1024 - courtWidth) / 2;
      const courtY = (1024 - courtHeight) / 2;
      
      // Draw court boundary
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.strokeRect(courtX, courtY, courtWidth, courtHeight);
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(1024/2, 1024/2, 120, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw center line
      ctx.beginPath();
      ctx.moveTo(courtX, 1024/2);
      ctx.lineTo(courtX + courtWidth, 1024/2);
      ctx.stroke();
      
      // Draw free throw lanes (paint area)
      const laneWidth = 160;
      const laneHeight = 190;
      
      // Top lane (paint) - ISDB blue instead of green
      ctx.fillStyle = 'rgba(29, 78, 216, 0.8)'; // ISDB blue
      ctx.fillRect(1024/2 - laneWidth/2, courtY, laneWidth, laneHeight);
      
      // Bottom lane (paint)
      ctx.fillRect(1024/2 - laneWidth/2, courtY + courtHeight - laneHeight, laneWidth, laneHeight);
      
      // Lane outlines
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(1024/2 - laneWidth/2, courtY, laneWidth, laneHeight);
      ctx.strokeRect(1024/2 - laneWidth/2, courtY + courtHeight - laneHeight, laneWidth, laneHeight);
      
      // Three point lines (arcs)
      ctx.beginPath();
      ctx.arc(1024/2, courtY + courtHeight - 30, 240, Math.PI * 1.25, Math.PI * 1.75);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(1024/2, courtY + 30, 240, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
      
      return new THREE.CanvasTexture(canvas);
    }

    // Create floor
    const floorGeometry = new THREE.BoxGeometry(floorSize, 0.2, floorSize);
    const floorMaterial = new THREE.MeshBasicMaterial({
      map: createBasketballCourtTexture()
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -5, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -floorSize;
    directionalLight.shadow.camera.right = floorSize;
    directionalLight.shadow.camera.top = floorSize;
    directionalLight.shadow.camera.bottom = -floorSize;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
    
    const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight1.position.set(10, 10, -10);
    scene.add(fillLight1);

    // Create textures
    const textures = {
      basketball: createBasketballTexture(),
      football: createFootballTexture(),
      baseball: createBaseballTexture(),
      puck: createPuckTexture()
    };

    // Ball type definitions
    const ballTypes = [
      {
        type: 'basketball',
        geometry: new THREE.SphereGeometry(0.5, 24, 24),
        material: new THREE.MeshStandardMaterial({
          map: textures.basketball,
          roughness: 0.7,
          metalness: 0.2
        }),
        mass: 0.6,
        count: 15
      },
      {
        type: 'football',
        geometry: (() => {
          const geo = new THREE.SphereGeometry(0.48, 24, 24);
          geo.scale(1, 0.6, 0.6);
          return geo;
        })(),
        material: new THREE.MeshStandardMaterial({
          map: textures.football,
          roughness: 0.7,
          metalness: 0.2
        }),
        mass: 0.45,
        count: 15
      },
      {
        type: 'baseball',
        geometry: new THREE.SphereGeometry(0.3, 24, 24),
        material: new THREE.MeshStandardMaterial({
          map: textures.baseball,
          roughness: 0.7,
          metalness: 0.2
        }),
        mass: 0.15,
        count: 15
      },
      {
        type: 'puck',
        geometry: new THREE.CylinderGeometry(0.3, 0.3, 0.1, 24),
        material: new THREE.MeshStandardMaterial({
          map: textures.puck,
          roughness: 0.7,
          metalness: 0.5
        }),
        mass: 0.3,
        count: 15
      }
    ];

    // Build queue of balls to create with mixed types
    const ballQueue = [];
    ballTypes.forEach(type => {
      for (let i = 0; i < type.count; i++) {
        ballQueue.push(type);
      }
    });

    // Shuffle array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    shuffleArray(ballQueue);

    // Create ball function
    function createBall(type) {
      const ball = new THREE.Mesh(type.geometry, type.material);
      
      // Randomize position - 30% smaller
      const posX = (Math.random() - 0.5) * floorSize * 0.8;
      const posY = 11 + Math.random() * 22;
      const posZ = (Math.random() - 0.5) * floorSize * 0.8;
      
      ball.position.set(posX, posY, posZ);
      
      // Randomize rotation
      ball.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      ball.castShadow = true;
      scene.add(ball);
      
      // Create physics body
      const body = {
        velocity: { 
          x: (Math.random() - 0.5) * 0.2,
          y: 0, 
          z: (Math.random() - 0.5) * 0.2 
        },
        acceleration: { x: 0, y: -0.06, z: 0 },
        position: { x: posX, y: posY, z: posZ },
        mass: type.mass,
        restitution: 0.6,
        friction: 0.98,
        radius: type.type === 'puck' ? 0.8 : (type.geometry.parameters.radius || 1.0),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.03,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.03
        }
      };
      
      ballsRef.current.push(ball);
      ballBodiesRef.current.push(body);
    }

    // Create balls with delay
    let index = 0;
    function createNextBall() {
      if (index < ballQueue.length) {
        createBall(ballQueue[index]);
        index++;
        
        // Calculate delay for next ball
        const baseDelay = 80;
        const maxDelay = 200;
        const progress = index / ballQueue.length;
        const delay = baseDelay + progress * (maxDelay - baseDelay);
        
        setTimeout(createNextBall, delay);
      }
    }

    // Start creating balls after a short delay (only once)
    if (!ballsCreatedRef.current) {
      ballsCreatedRef.current = true;
      setTimeout(createNextBall, 500);
    }

    // Update ball physics
    function updateBallPhysics() {
      if (freezeBallsRef.current) return;

      const floorY = -5;
      const halfFloor = floorSize / 2;
      
      for (let i = 0; i < ballsRef.current.length; i++) {
        const ball = ballsRef.current[i];
        const body = ballBodiesRef.current[i];
        
        if (!body) continue;
        
        // Apply gravity
        body.velocity.y += body.acceleration.y;
        body.velocity.x *= body.friction;
        body.velocity.z *= body.friction;
        
        // Update position
        body.position.x += body.velocity.x;
        body.position.y += body.velocity.y;
        body.position.z += body.velocity.z;
        
        // Floor collision - ensure proper positioning
        const radius = body.radius;
        if (body.position.y - radius < floorY) {
          body.position.y = floorY + radius;
          body.velocity.y = -body.velocity.y * body.restitution;
          
          // Additional damping when on floor to prevent bouncing
          if (Math.abs(body.velocity.y) < 0.1) {
            body.velocity.y = 0;
          }
        }
        
        // Wall collisions
        if (body.position.x + radius > halfFloor) {
          body.position.x = halfFloor - radius;
          body.velocity.x = -body.velocity.x * body.restitution;
        } else if (body.position.x - radius < -halfFloor) {
          body.position.x = -halfFloor + radius;
          body.velocity.x = -body.velocity.x * body.restitution;
        }
        
        if (body.position.z + radius > halfFloor) {
          body.position.z = halfFloor - radius;
          body.velocity.z = -body.velocity.z * body.restitution;
        } else if (body.position.z - radius < -halfFloor) {
          body.position.z = -halfFloor + radius;
          body.velocity.z = -body.velocity.z * body.restitution;
        }
        
        // Ball-to-ball collision detection
        for (let j = i + 1; j < ballBodiesRef.current.length; j++) {
          const otherBody = ballBodiesRef.current[j];
          if (!otherBody) continue;
          
          const dx = body.position.x - otherBody.position.x;
          const dy = body.position.y - otherBody.position.y;
          const dz = body.position.z - otherBody.position.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          const combinedRadius = body.radius + otherBody.radius;
          
          if (distance < combinedRadius) {
            const overlap = combinedRadius - distance;
            
            if (distance < 0.001) continue;
            
            const nx = dx / distance;
            const ny = dy / distance;
            const nz = dz / distance;
            
            const totalMass = body.mass + otherBody.mass;
            const body1Ratio = otherBody.mass / totalMass;
            const body2Ratio = body.mass / totalMass;
            
            body.position.x += nx * overlap * body1Ratio * 0.5;
            body.position.y += ny * overlap * body1Ratio * 0.5;
            body.position.z += nz * overlap * body1Ratio * 0.5;
            
            otherBody.position.x -= nx * overlap * body2Ratio * 0.5;
            otherBody.position.y -= ny * overlap * body2Ratio * 0.5;
            otherBody.position.z -= nz * overlap * body2Ratio * 0.5;
            
            const v1n = body.velocity.x * nx + body.velocity.y * ny + body.velocity.z * nz;
            const v2n = otherBody.velocity.x * nx + otherBody.velocity.y * ny + otherBody.velocity.z * nz;
            
            const elasticity = 0.5;
            
            const v1nAfter = (v1n * (body.mass - otherBody.mass) + 2 * otherBody.mass * v2n) / totalMass;
            const v2nAfter = (v2n * (otherBody.mass - body.mass) + 2 * body.mass * v1n) / totalMass;
            
            const v1nFinal = v1n + (v1nAfter - v1n) * elasticity;
            const v2nFinal = v2n + (v2nAfter - v2n) * elasticity;
            
            body.velocity.x = body.velocity.x + (v1nFinal - v1n) * nx;
            body.velocity.y = body.velocity.y + (v1nFinal - v1n) * ny;
            body.velocity.z = body.velocity.z + (v1nFinal - v1n) * nz;
            
            otherBody.velocity.x = otherBody.velocity.x + (v2nFinal - v2n) * nx;
            otherBody.velocity.y = otherBody.velocity.y + (v2nFinal - v2n) * ny;
            otherBody.velocity.z = otherBody.velocity.z + (v2nFinal - v2n) * nz;
            
            body.rotationSpeed.x += (Math.random() - 0.5) * 0.01;
            body.rotationSpeed.y += (Math.random() - 0.5) * 0.01;
            body.rotationSpeed.z += (Math.random() - 0.5) * 0.01;
            
            otherBody.rotationSpeed.x += (Math.random() - 0.5) * 0.01;
            otherBody.rotationSpeed.y += (Math.random() - 0.5) * 0.01;
            otherBody.rotationSpeed.z += (Math.random() - 0.5) * 0.01;
          }
        }
        
        // Update THREE.js mesh position and rotation
        ball.position.copy(body.position);
        
        ball.rotation.x += body.rotationSpeed.x;
        ball.rotation.y += body.rotationSpeed.y;
        ball.rotation.z += body.rotationSpeed.z;
        
        body.rotationSpeed.x *= 0.99;
        body.rotationSpeed.y *= 0.99;
        body.rotationSpeed.z *= 0.99;
      }
    }

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
      
      // Add slow rotation effect after 30 seconds, stopping by 60 seconds
      if (elapsedTime > 30 && elapsedTime < 60) {
        const rotationProgress = (elapsedTime - 30) / 30; // 0 to 1 over 30 seconds
        const rotationIntensity = Math.sin(rotationProgress * Math.PI) * 0.02; // Peak at 50% through
        
        for (let i = 0; i < ballsRef.current.length; i++) {
          const ball = ballsRef.current[i];
          const body = ballBodiesRef.current[i];
          
          if (body) {
            // Rotation speed proportional to ball size (larger balls rotate slower)
            const sizeFactor = 1 / (body.radius * 2);
            
            // Add slow rotation around Y axis
            ball.rotation.y += rotationIntensity * sizeFactor;
            
            // Add slight rotation around X and Z axes for more natural movement
            ball.rotation.x += rotationIntensity * sizeFactor * 0.3;
            ball.rotation.z += rotationIntensity * sizeFactor * 0.3;
          }
        }
      } else if (elapsedTime >= 60) {
        // After 60 seconds, ensure all movement and rotation stops completely
        for (let i = 0; i < ballBodiesRef.current.length; i++) {
          const body = ballBodiesRef.current[i];
          const ball = ballsRef.current[i];
          if (body) {
            // Stop all velocities
            body.velocity.x = 0;
            body.velocity.y = 0;
            body.velocity.z = 0;
            
            // Stop all rotation speeds
            body.rotationSpeed.x = 0;
            body.rotationSpeed.y = 0;
            body.rotationSpeed.z = 0;
            
            // Ensure ALL balls and pucks are properly positioned on the floor
            const floorY = -5;
            const radius = body.radius;
            
            // Force position on floor for all objects
            body.position.y = floorY + radius;
            
            // Special handling for pucks to ensure they lie flat
            if (ball.geometry.type === 'CylinderGeometry') {
              // Make puck lie flat (reset rotation to flat position)
              ball.rotation.x = 0;
              ball.rotation.z = 0;
              // Keep Y rotation for visual variety but ensure it's stable
              ball.rotation.y = Math.round(ball.rotation.y / (Math.PI / 4)) * (Math.PI / 4);
            }
            
            // Ensure no objects extend beyond floor boundaries
            const halfFloor = floorSize / 2;
            if (body.position.x + radius > halfFloor) {
              body.position.x = halfFloor - radius;
            } else if (body.position.x - radius < -halfFloor) {
              body.position.x = -halfFloor + radius;
            }
            
            if (body.position.z + radius > halfFloor) {
              body.position.z = halfFloor - radius;
            } else if (body.position.z - radius < -halfFloor) {
              body.position.z = -halfFloor + radius;
            }
          }
        }
      }
      
      updateBallPhysics();
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
} 