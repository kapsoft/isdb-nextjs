'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FootballAnimation() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const footballsRef = useRef([]);
  const lastLaunchTimeRef = useRef(0);
  const startTimeRef = useRef(null);
  const isQBThrowingRef = useRef(false);
  const throwAnimationStartTimeRef = useRef(0);
  const qbLeftUpperArmRef = useRef(null);
  const qbLeftLowerArmRef = useRef(null);
  const qbLeftHandRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Constants
    const launchInterval = 2500; // ms

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 120, 180);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 200, 100);
    scene.add(directionalLight);

    // Create field with detailed texture
    function createFieldTexture() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1024;
      canvas.height = 2048 + 400; // Additional height for end zones

      // Draw green field
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#006400');  // Dark green
      gradient.addColorStop(0.5, '#008000'); // Medium green
      gradient.addColorStop(1, '#006400');  // Dark green

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Field dimensions
      const fieldBorderX = 50;  // Pixels from edge
      const fieldBorderY = 150;  // Pixels from edge, increased to account for end zones
      const fieldWidth = canvas.width - 2 * fieldBorderX;
      const fieldHeight = canvas.height - 2 * fieldBorderY;

      // Calculate end zone dimensions
      const mainFieldHeight = fieldHeight * 0.8; // 80% for main field
      const endZoneHeight = fieldHeight * 0.1; // 10% for each end zone

      // Draw white border around entire field (including end zones)
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 8;
      ctx.strokeRect(fieldBorderX, fieldBorderY, fieldWidth, fieldHeight);

      // Draw goal lines (separating end zones from main field)
      ctx.beginPath();
      // Top goal line
      ctx.moveTo(fieldBorderX, fieldBorderY + endZoneHeight);
      ctx.lineTo(fieldBorderX + fieldWidth, fieldBorderY + endZoneHeight);
      // Bottom goal line
      ctx.moveTo(fieldBorderX, fieldBorderY + endZoneHeight + mainFieldHeight);
      ctx.lineTo(fieldBorderX + fieldWidth, fieldBorderY + endZoneHeight + mainFieldHeight);
      ctx.stroke();

      // Draw yard lines on main field
      ctx.lineWidth = 4;
      const yardLines = 10; // 10 segments = 11 lines including end zones
      const lineSpacing = mainFieldHeight / yardLines;

      for (let i = 1; i < yardLines; i++) {
        const y = fieldBorderY + endZoneHeight + i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(fieldBorderX, y);
        ctx.lineTo(fieldBorderX + fieldWidth, y);
        ctx.stroke();
      }

      // Draw yard numbers - positioned between yard lines, straddling them
      ctx.fillStyle = 'white';
      ctx.font = 'bold 80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Top side yard numbers (oriented correctly)
      for (let i = 1; i < yardLines; i++) {
        // Skip midfield (we'll add 50 separately)
        if (i === 5) continue;

        let num = i * 10;
        if (i > 5) num = (10 - i) * 10; // 40,30,20,10 on the right half

        // Position numbers between the lines (straddling the yard lines)
        const y = fieldBorderY + endZoneHeight + i * lineSpacing;

        ctx.save();
        ctx.translate(fieldBorderX + fieldWidth/4, y);
        ctx.rotate(-Math.PI/2); // Rotate 90 degrees counter-clockwise
        ctx.fillText(num.toString(), 0, 0);
        ctx.restore();
      }

      // 50 yard line
      ctx.save();
      ctx.translate(fieldBorderX + fieldWidth/4, fieldBorderY + endZoneHeight + 5 * lineSpacing);
      ctx.rotate(-Math.PI/2);
      ctx.fillText('50', 0, 0);
      ctx.restore();

      // Bottom side yard numbers (same pattern)
      for (let i = 1; i < yardLines; i++) {
        if (i === 5) continue; // Skip midfield for 50

        let num = i * 10;
        if (i > 5) num = (10 - i) * 10; // 40,30,20,10 on the right half

        // Position numbers between the lines (straddling the yard lines)
        const y = fieldBorderY + endZoneHeight + i * lineSpacing;

        ctx.save();
        ctx.translate(fieldBorderX + 3*fieldWidth/4, y);
        ctx.rotate(-Math.PI/2); // Rotate 90 degrees counter-clockwise
        ctx.fillText(num.toString(), 0, 0);
        ctx.restore();
      }

      // 50 yard line on bottom side
      ctx.save();
      ctx.translate(fieldBorderX + 3*fieldWidth/4, fieldBorderY + endZoneHeight + 5 * lineSpacing);
      ctx.rotate(-Math.PI/2);
      ctx.fillText('50', 0, 0);
      ctx.restore();

      // Add hash marks
      ctx.lineWidth = 2;

      // Left hash marks
      for (let i = 0; i <= yardLines; i++) {
        for (let j = 1; j < 5; j++) {
          const y = fieldBorderY + endZoneHeight + i * lineSpacing - j * (lineSpacing/5);
          ctx.beginPath();
          ctx.moveTo(fieldBorderX + fieldWidth/3, y);
          ctx.lineTo(fieldBorderX + fieldWidth/3 + 10, y);
          ctx.stroke();
        }
      }

      // Right hash marks
      for (let i = 0; i <= yardLines; i++) {
        for (let j = 1; j < 5; j++) {
          const y = fieldBorderY + endZoneHeight + i * lineSpacing - j * (lineSpacing/5);
          ctx.beginPath();
          ctx.moveTo(fieldBorderX + 2*fieldWidth/3, y);
          ctx.lineTo(fieldBorderX + 2*fieldWidth/3 - 10, y);
          ctx.stroke();
        }
      }

      return canvas;
    }

    function createField() {
      // Create texture from canvas
      const fieldCanvas = createFieldTexture();
      const texture = new THREE.CanvasTexture(fieldCanvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Create field material with texture
      const material = new THREE.MeshLambertMaterial({ map: texture });

      // Create field plane
      const fieldWidth = 160;
      const fieldLength = 380; // 320 (100 yards) + 60 (two 10-yard end zones)
      const geometry = new THREE.PlaneGeometry(fieldWidth, fieldLength);

      const field = new THREE.Mesh(geometry, material);
      field.rotation.x = -Math.PI/2; // Lay flat
      field.position.y = 0;

      scene.add(field);
      return field;
    }

    // Create goal posts
    function createGoalPosts() {
      const yellowMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
      const blueMaterial = new THREE.MeshLambertMaterial({ color: 0x0033A0 });

      // Create left goal post
      const leftPost = createGoalPost(yellowMaterial, blueMaterial);
      leftPost.position.set(0, 0, -150 - 30); // 10 yards (30 units) behind goal line
      scene.add(leftPost);

      // Create right goal post
      const rightPost = createGoalPost(yellowMaterial, blueMaterial);
      rightPost.position.set(0, 0, 150 + 30); // 10 yards (30 units) behind goal line
      scene.add(rightPost);
    }

    function createGoalPost(yellowMaterial, blueMaterial) {
      const postGroup = new THREE.Group();

      // Base
      const baseGeometry = new THREE.CylinderGeometry(3, 3, 2, 16);
      const base = new THREE.Mesh(baseGeometry, blueMaterial);
      base.position.y = 1;
      postGroup.add(base);

      // Center post
      const centerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
      const center = new THREE.Mesh(centerGeometry, yellowMaterial);
      center.position.y = 12;
      postGroup.add(center);

      // Crossbar
      const crossbarGeometry = new THREE.CylinderGeometry(0.4, 0.4, 18, 8);
      crossbarGeometry.rotateZ(Math.PI/2);
      const crossbar = new THREE.Mesh(crossbarGeometry, yellowMaterial);
      crossbar.position.y = 22;
      postGroup.add(crossbar);

      // Uprights
      const uprightGeometry = new THREE.CylinderGeometry(0.4, 0.4, 15, 8);

      const leftUpright = new THREE.Mesh(uprightGeometry, yellowMaterial);
      leftUpright.position.set(-9, 29.5, 0);
      postGroup.add(leftUpright);

      const rightUpright = new THREE.Mesh(uprightGeometry, yellowMaterial);
      rightUpright.position.set(9, 29.5, 0);
      postGroup.add(rightUpright);

      return postGroup;
    }

    // Create quarterback with more realistic features
    function createQuarterback() {
      const qbGroup = new THREE.Group();

      // Colors - White jersey with green number
      const jerseyMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF }); // White jersey
      const pantsMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const skinMaterial = new THREE.MeshLambertMaterial({ color: 0xE0AC69 });
      const helmetMaterial = new THREE.MeshLambertMaterial({ color: 0x004D98 }); // Blue helmet
      const facemaskMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 }); // Gray facemask
      const shoulderPadMaterial = new THREE.MeshLambertMaterial({ color: 0xDDDDDD }); // Off-white pads

      // Improved helmet with facemask
      const helmetGeometry = new THREE.SphereGeometry(1.4, 16, 16);
      helmetGeometry.scale(1, 0.85, 1.1); // Make it more football helmet-shaped
      const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
      helmet.position.y = 7.2;
      qbGroup.add(helmet);

      // Facemask
      const facemaskGroup = new THREE.Group();

      // Vertical bars
      for (let i = -2; i <= 2; i++) {
        const barGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 8);
        const bar = new THREE.Mesh(barGeometry, facemaskMaterial);
        bar.position.set(i * 0.4, 0, 0);
        bar.rotation.x = Math.PI/2;
        facemaskGroup.add(bar);
      }

      // Horizontal bars
      for (let i = 0; i < 2; i++) {
        const barGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8);
        const bar = new THREE.Mesh(barGeometry, facemaskMaterial);
        bar.position.set(0, -0.4 - i * 0.4, 0);
        bar.rotation.z = Math.PI/2;
        facemaskGroup.add(bar);
      }

      facemaskGroup.position.set(0, 7.2, 1.2);
      qbGroup.add(facemaskGroup);

      // Neck
      const neckGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.7, 16);
      const neck = new THREE.Mesh(neckGeometry, skinMaterial);
      neck.position.y = 6;
      qbGroup.add(neck);

      // Shoulder pads
      const shoulderPadsGeometry = new THREE.BoxGeometry(6, 1, 3);
      shoulderPadsGeometry.translate(0, 0.5, 0); // Move origin to bottom
      const shoulderPads = new THREE.Mesh(shoulderPadsGeometry, shoulderPadMaterial);
      shoulderPads.position.y = 5;
      qbGroup.add(shoulderPads);

      // Add pad details - rounded edges on top
      const leftPadGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
      leftPadGeometry.rotateZ(Math.PI/2);
      const leftPad = new THREE.Mesh(leftPadGeometry, shoulderPadMaterial);
      leftPad.position.set(-2.5, 5.5, 0);
      qbGroup.add(leftPad);

      const rightPadGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
      rightPadGeometry.rotateZ(Math.PI/2);
      const rightPad = new THREE.Mesh(rightPadGeometry, shoulderPadMaterial);
      rightPad.position.set(2.5, 5.5, 0);
      qbGroup.add(rightPad);

      // Torso (jersey)
      const torsoGeometry = new THREE.BoxGeometry(4, 4, 2);
      torsoGeometry.translate(0, -2, 0); // Move origin to top
      const torso = new THREE.Mesh(torsoGeometry, jerseyMaterial);
      torso.position.y = 5;
      qbGroup.add(torso);

      // Jersey number (1) - Create with canvas texture
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 128;
      canvas.height = 128;
      ctx.fillStyle = '#00AA00'; // Green number
      ctx.font = 'bold 100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', 64, 64);

      const numberTexture = new THREE.CanvasTexture(canvas);
      const numberMaterial = new THREE.MeshBasicMaterial({
        map: numberTexture,
        transparent: true,
        side: THREE.DoubleSide
      });

      // Front jersey number
      const frontNumberPlane = new THREE.PlaneGeometry(2, 2);
      const frontNumberMesh = new THREE.Mesh(frontNumberPlane, numberMaterial);
      frontNumberMesh.position.set(0, 3, 1.1);
      qbGroup.add(frontNumberMesh);

      // Back jersey number
      const backNumberMesh = new THREE.Mesh(frontNumberPlane, numberMaterial);
      backNumberMesh.position.set(0, 3, -1.1);
      backNumberMesh.rotation.y = Math.PI;
      qbGroup.add(backNumberMesh);

      // Arms with elbow joint
      // Upper arms
      const upperArmGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 12);

      // Left upper arm (throwing arm) - raised position
      const leftUpperArm = new THREE.Mesh(upperArmGeometry, jerseyMaterial);
      leftUpperArm.position.set(2.3, 5, 0);
      leftUpperArm.rotation.z = -Math.PI/3; // More raised angle
      qbGroup.add(leftUpperArm);

      const rightUpperArm = new THREE.Mesh(upperArmGeometry, jerseyMaterial);
      rightUpperArm.position.set(-2.5, 4.5, 0);
      rightUpperArm.rotation.z = Math.PI/6;
      qbGroup.add(rightUpperArm);

      // Lower arms
      const lowerArmGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 12);

      // Left lower arm (throwing arm) - adjusted for throwing position
      const leftLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
      leftLowerArm.position.set(3.8, 4.3, 0.3); // Moved higher and slightly forward
      leftLowerArm.rotation.z = -Math.PI/2; // Horizontal position ready to throw
      leftLowerArm.rotation.y = Math.PI/12; // Slight angle forward
      qbGroup.add(leftLowerArm);

      const rightLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
      rightLowerArm.position.set(-3.5, 3.2, 0);
      rightLowerArm.rotation.z = Math.PI/3;
      qbGroup.add(rightLowerArm);

      // Hands
      const handGeometry = new THREE.SphereGeometry(0.4, 12, 12);

      // Left hand (throwing hand) - adjusted position
      const leftHand = new THREE.Mesh(handGeometry, skinMaterial);
      leftHand.position.set(5.3, 4.3, 0.5); // Moved to end of forearm
      qbGroup.add(leftHand);

      const rightHand = new THREE.Mesh(handGeometry, skinMaterial);
      rightHand.position.set(-4.5, 2.2, 0);
      qbGroup.add(rightHand);

      // Hip pads
      const hipPadsGeometry = new THREE.BoxGeometry(4.2, 1, 2.2);
      const hipPads = new THREE.Mesh(hipPadsGeometry, shoulderPadMaterial);
      hipPads.position.y = 0.5;
      qbGroup.add(hipPads);

      // Pants
      const pantsGeometry = new THREE.BoxGeometry(4, 4, 2);
      pantsGeometry.translate(0, -2, 0); // Move origin to top
      const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
      pants.position.y = 0;
      qbGroup.add(pants);

      // Thigh pads
      const leftThighPadGeometry = new THREE.BoxGeometry(1.5, 2, 1);
      const leftThighPad = new THREE.Mesh(leftThighPadGeometry, shoulderPadMaterial);
      leftThighPad.position.set(1, -1.5, 0);
      qbGroup.add(leftThighPad);

      const rightThighPadGeometry = new THREE.BoxGeometry(1.5, 2, 1);
      const rightThighPad = new THREE.Mesh(rightThighPadGeometry, shoulderPadMaterial);
      rightThighPad.position.set(-1, -1.5, 0);
      qbGroup.add(rightThighPad);

      // Legs
      const upperLegGeometry = new THREE.CylinderGeometry(0.7, 0.6, 4, 12);

      const leftLeg = new THREE.Mesh(upperLegGeometry, pantsMaterial);
      leftLeg.position.set(1, -4, 0);
      qbGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(upperLegGeometry, pantsMaterial);
      rightLeg.position.set(-1, -4, 0);
      qbGroup.add(rightLeg);

      // Lower legs/socks
      const lowerLegGeometry = new THREE.CylinderGeometry(0.6, 0.5, 3, 12);

      const leftLowerLeg = new THREE.Mesh(lowerLegGeometry, pantsMaterial);
      leftLowerLeg.position.set(1, -7.5, 0);
      qbGroup.add(leftLowerLeg);

      const rightLowerLeg = new THREE.Mesh(lowerLegGeometry, pantsMaterial);
      rightLowerLeg.position.set(-1, -7.5, 0);
      qbGroup.add(rightLowerLeg);

      // Shoes
      const shoeGeometry = new THREE.BoxGeometry(1, 0.5, 2);
      shoeGeometry.translate(0, -0.25, 0.5); // Shift origin to top and back

      const leftShoe = new THREE.Mesh(shoeGeometry, new THREE.MeshLambertMaterial({ color: 0x222222 }));
      leftShoe.position.set(1, -9, 0);
      qbGroup.add(leftShoe);

      const rightShoe = new THREE.Mesh(shoeGeometry, new THREE.MeshLambertMaterial({ color: 0x222222 }));
      rightShoe.position.set(-1, -9, 0);
      qbGroup.add(rightShoe);

      // Store references to QB arm parts for animation
      qbLeftUpperArmRef.current = leftUpperArm;
      qbLeftLowerArmRef.current = leftLowerArm;
      qbLeftHandRef.current = leftHand;

      // Set initial arm position (cocked back ready to throw)
      qbLeftUpperArmRef.current.rotation.set(0, 0, -Math.PI/3);
      qbLeftLowerArmRef.current.rotation.set(0, Math.PI/12, -Math.PI/2);

      // Position quarterback
      qbGroup.position.set(-40, 10, -110); // Raised y position to account for height
      qbGroup.rotation.y = Math.PI/4;

      scene.add(qbGroup);
      return qbGroup;
    }

    // Create football
    function createFootball() {
      // Create a more football-shaped geometry (elongated sphere with pointed ends)
      const ballGeometry = new THREE.SphereGeometry(1, 24, 16);
      ballGeometry.scale(1.8, 0.6, 0.6);
      const ballMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

      const ball = new THREE.Mesh(ballGeometry, ballMaterial);

      // Add white laces
      const laceGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.3);
      const laceMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });

      for (let i = 0; i < 4; i++) {
        const lace = new THREE.Mesh(laceGeometry, laceMaterial);
        lace.position.set(0, 0, 0.35);
        lace.position.x = (i * 0.2) - 0.3;
        ball.add(lace);
      }

      // Initial orientation - long axis along x-axis (perpendicular to yard markers)
      ball.rotation.z = Math.PI/2;

      ball.userData.velocity = new THREE.Vector3();
      ball.userData.initialRotation = ball.rotation.clone(); // Store initial rotation
      ball.userData.spiralAngle = 0; // For tracking spiral rotation

      return ball;
    }

    // Launch footballs with QB throwing animation
    function launchFootball() {
      // If QB is already in throwing animation, don't start a new one
      if (isQBThrowingRef.current) return;

      // Start the throwing animation
      isQBThrowingRef.current = true;
      throwAnimationStartTimeRef.current = Date.now();

      // The ball will be created and launched during the animation
      // at the appropriate moment (see animate function)
    }

    // Create and launch the football at the appropriate point in the throwing animation
    function createAndLaunchFootball() {
      const ball = createFootball();

      // Get the current hand position for accurate ball positioning
      const handWorldPosition = new THREE.Vector3();
      qbLeftHandRef.current.getWorldPosition(handWorldPosition);

      // Set initial position at the QB's hand
      ball.position.copy(handWorldPosition);

      // Use parabolic trajectory for the launch
      const g = 9.8; // gravity

      // Choose a target point on the field
      const targetZ = Math.random() * 160 - 40; // From -40 to +120 on z-axis
      const targetX = Math.random() * 100 - 50; // From -50 to +50 on x-axis

      // Calculate horizontal distance to target
      const deltaX = targetX - ball.position.x;
      const deltaZ = targetZ - ball.position.z;
      const horizontalDistance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

      // Calculate launch angle and direction
      const direction = Math.atan2(deltaX, deltaZ);

      // Optimal launch angle for maximum distance is 45 degrees
      // Use a range between 35 and 45 degrees for variation but good distance
      const angle = (35 + Math.random() * 10) * Math.PI / 180; // 35-45 degrees vertical

      // Calculate speed needed to reach the target using projectile motion formula
      // R = v²sin(2θ)/g, solve for v: v = sqrt(Rg/sin(2θ))
      const speed = Math.sqrt((horizontalDistance * g) / Math.sin(2 * angle));

      // Cap the speed to prevent overthrows but ensure good arcs
      const maxSpeed = 38;
      const minSpeed = 30;
      const actualSpeed = Math.min(Math.max(speed, minSpeed), maxSpeed);

      // Set velocity components
      ball.userData.velocity.x = actualSpeed * Math.cos(angle) * Math.sin(direction);
      ball.userData.velocity.y = actualSpeed * Math.sin(angle); // Vertical component
      ball.userData.velocity.z = actualSpeed * Math.cos(angle) * Math.cos(direction);

      // Calculate landing position
      const verticalVelocity = ball.userData.velocity.y;
      const timeToApex = verticalVelocity / g;
      const totalFlightTime = 2 * timeToApex;
      const landingX = ball.position.x + ball.userData.velocity.x * totalFlightTime;
      const landingZ = ball.position.z + ball.userData.velocity.z * totalFlightTime;

      // Define field boundaries
      const maxFieldWidth = 65;
      const maxFieldLength = 150;

      // If landing would be out of bounds, adjust velocity
      if (Math.abs(landingX) > maxFieldWidth || landingZ < -150 || landingZ > 150) {
        const scaleFactor = 0.75;
        ball.userData.velocity.x *= scaleFactor;
        ball.userData.velocity.y *= scaleFactor;
        ball.userData.velocity.z *= scaleFactor;
      }

      // Add trail effect
      const trailGeometry = new THREE.BufferGeometry();
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      const trailMaterial = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
      });

      const points = [];
      points.push(ball.position.clone());

      trailGeometry.setFromPoints(points);
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      scene.add(trail);

      ball.userData.trail = trail;
      ball.userData.trailPoints = points;

      footballsRef.current.push(ball);
      scene.add(ball);

      return ball;
    }

    // Animate the quarterback's throwing motion
    function animateQBThrow(currentTime) {
      if (!isQBThrowingRef.current) return;

      // Total throwing animation time in milliseconds
      const throwDuration = 1000;
      const elapsed = currentTime - throwAnimationStartTimeRef.current;
      const progress = Math.min(elapsed / throwDuration, 1);

      if (progress < 0.35) {
        // Phase 1: Wind-up (0-35% of animation)
        // QB pulls arm back further
        const windupProgress = progress / 0.35;
        qbLeftUpperArmRef.current.rotation.z = -Math.PI/3 - (Math.PI/6) * windupProgress;
        qbLeftLowerArmRef.current.rotation.z = -Math.PI/2 - (Math.PI/6) * windupProgress;

      } else if (progress < 0.6) {
        // Phase 2: Forward motion (35-60% of animation)
        // QB brings arm forward rapidly
        const forwardProgress = (progress - 0.35) / 0.25;
        qbLeftUpperArmRef.current.rotation.z = -Math.PI/2 + (Math.PI/2) * forwardProgress;
        qbLeftLowerArmRef.current.rotation.z = -Math.PI*2/3 + (Math.PI*2/3) * forwardProgress;

        // At 50% of the animation, create and launch the football
        if (progress >= 0.5 && progress < 0.51) {
          createAndLaunchFootball();
        }

      } else if (progress < 1) {
        // Phase 3: Follow-through (60-100% of animation)
        // QB completes the throwing motion
        const followThroughProgress = (progress - 0.6) / 0.4;
        qbLeftUpperArmRef.current.rotation.z = 0 + (Math.PI/6) * followThroughProgress;
        qbLeftLowerArmRef.current.rotation.z = 0 - (Math.PI/6) * followThroughProgress;
      } else {
        // Animation complete, reset to starting position
        isQBThrowingRef.current = false;

        // Set next throw time
        lastLaunchTimeRef.current = currentTime;

        // Gradually reset arm position over 500ms
        setTimeout(() => {
          qbLeftUpperArmRef.current.rotation.set(0, 0, -Math.PI/3);
          qbLeftLowerArmRef.current.rotation.set(0, Math.PI/12, -Math.PI/2);
        }, 500);
      }
    }

    // Update footballs
    function updateBalls(deltaTime) {
      for (let i = footballsRef.current.length - 1; i >= 0; i--) {
        const ball = footballsRef.current[i];

        // Update velocity (gravity)
        ball.userData.velocity.y -= 9.8 * deltaTime;

        // Update position
        ball.position.x += ball.userData.velocity.x * deltaTime;
        ball.position.y += ball.userData.velocity.y * deltaTime;
        ball.position.z += ball.userData.velocity.z * deltaTime;

        // Add current position to trail
        ball.userData.trailPoints.push(ball.position.clone());
        ball.userData.trail.geometry.setFromPoints(ball.userData.trailPoints);

        // Maintain the football's orientation with the nose perpendicular to yard markers
        // Only add a slight spiral around the x-axis (long axis of the ball)
        // This prevents end-over-end tumbling
        ball.rotation.copy(ball.userData.initialRotation);

        // Add a slight spiral effect around the long axis (x-axis)
        ball.rotateX(0.1); // Slight spiral rotation - the ball will only rotate around its long axis

        // Check for bounce
        if (ball.position.y < 1 && ball.userData.velocity.y < 0) {
          if (Math.abs(ball.userData.velocity.y) > 1) {
            ball.userData.velocity.y *= -0.6;
            ball.userData.velocity.x *= 0.9;
            ball.userData.velocity.z *= 0.9;
            ball.position.y = 1;
          } else {
            ball.userData.velocity.y = 0;
            ball.userData.velocity.x *= 0.95;
            ball.userData.velocity.z *= 0.95;
            ball.position.y = 1;
          }
        }

        // Remove ball only (keep trail) when out of bounds or stopped
        if (
          ball.position.y < 0 || 
          Math.abs(ball.position.x) > 70 || // Narrower bounds for removal (safety check)
          Math.abs(ball.position.z) > 180 || // Shorter field bounds for removal
          (Math.abs(ball.userData.velocity.x) < 0.1 && 
           Math.abs(ball.userData.velocity.y) < 0.1 && 
           Math.abs(ball.userData.velocity.z) < 0.1 && 
           ball.position.y <= 1)
        ) {
          scene.remove(ball);
          footballsRef.current.splice(i, 1);

          // Note: intentionally NOT removing the trail
        }
      }
    }

    // Animation function
    const clock = new THREE.Clock();
    startTimeRef.current = Date.now();

    function animate() {
      frameRef.current = requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - startTimeRef.current) / 1000;

      // Check if it's time to start a new throw
      if (!isQBThrowingRef.current && currentTime - lastLaunchTimeRef.current > launchInterval) {
        launchFootball();
      }

      // Animate quarterback's throwing motion if in progress
      animateQBThrow(currentTime);

      // Update footballs
      updateBalls(deltaTime);

      // Slow camera rotation for a dynamic view
      const t = currentTime * 0.00005;
      camera.position.x = Math.sin(t) * 150;
      camera.position.z = Math.cos(t) * 200;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    // Create scene elements
    createField();
    createGoalPosts();
    createQuarterback();

    // Start animation
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