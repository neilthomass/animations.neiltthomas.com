import React, { useEffect, useRef } from 'react';

// Themes: natural nourishment, intelligent formation, welcoming return
// Visualization: Layers of particles that form and flow like geological strata, showing how all things are shaped by their environment
// Resolves to: NT

const MetaAnimation = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Make canvas fill entire window
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Each particle represents a point of potential, shaped by its environment
    const PARTICLE_COUNT = 18000;
    const STRATA_LAYERS = 12;  // The layers through which formation occurs
    const particles = [];

    // Create particles in stratified rock layers, each finding its natural place
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const stratum = Math.floor(Math.random() * STRATA_LAYERS);
      const thickness = 40 + stratum * 3;
      const depth = stratum * 25;

      // Position within stratum
      const y = Math.random() * height;
      const strataPhase = y * 0.01 + stratum * 0.3;

      // Multiple wave frequencies for each stratum
      const primaryUndulation = Math.sin(strataPhase) * 35;
      const secondaryUndulation = Math.sin(strataPhase * 2 + stratum * 0.8) * 18;
      const tertiaryUndulation = Math.sin(strataPhase * 4 + stratum * 1.5) * 8;

      const totalUndulation = primaryUndulation + secondaryUndulation + tertiaryUndulation;

      // Determine side and position
      const side = Math.random() < 0.5 ? -1 : 1;
      const baseX = centerX + side * (60 + totalUndulation + depth);
      const offsetX = (Math.random() - 0.5) * thickness;

      particles.push({
        x: baseX + offsetX,
        y: y,
        z: (stratum - STRATA_LAYERS/2) * 30 + (Math.random() - 0.5) * 20,
        side: side,
        stratum: stratum,
        flow: Math.random() * Math.PI * 2,
        oscillation: Math.random() * Math.PI * 2,
        velocity: 0.05 + stratum * 0.015,
        brightness: 0.6 + Math.random() * 0.4
      });
    }

    let time = 0;
    let isRunning = true;
    const WAIT_DURATION = 3;        // 3 seconds of original animation
    const GATHER_DURATION = 16;     // 16 seconds to gather into blob (half speed = 2x duration)
    const SPIN_DURATION = 3;        // 3 seconds of accelerating spin
    const EXPLODE_DURATION = 3.5;   // 3.5 seconds to explode outward (2 seconds longer)
    const IMPLODE_DURATION = 1;     // 1 second to reverse and collect at center (much faster)
    const CENTER_DELAY = 0.3;       // 0.3 second pause at sphere
    const META_FORM_DURATION = 2;   // 2 seconds to form Meta logo from center (smoother)
    const BLEND_DURATION = 0.5;     // Medium overlap for smooth transitions
    const TOTAL_ANIMATION = WAIT_DURATION + GATHER_DURATION + SPIN_DURATION + EXPLODE_DURATION + IMPLODE_DURATION + CENTER_DELAY;

    // Mouse tracking for particle repulsion
    let mouseX = -1000;
    let mouseY = -1000;
    const MOUSE_RADIUS = 50; // Radius of mouse influence (half of original)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Account for canvas scaling between display size and internal resolution
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Create Meta logo particles - the twisted infinity symbol
    const ntCanvas = document.createElement('canvas');
    ntCanvas.width = 700;  // Increased canvas size
    ntCanvas.height = 700;
    const ntCtx = ntCanvas.getContext('2d');

    // Draw Meta infinity symbol (proper lemniscate/figure-8)
    const centerCanvasX = 350;
    const centerCanvasY = 350;

    ntCtx.fillStyle = 'white';
    ntCtx.strokeStyle = 'white';
    ntCtx.lineWidth = 50;
    ntCtx.lineCap = 'round';
    ntCtx.lineJoin = 'round';

    // Use parametric equations for a proper infinity symbol (lemniscate of Bernoulli)
    const scale = 140; // Size of the infinity symbol
    const points = [];

    // Generate infinity curve points using parametric equations
    for (let t = 0; t <= Math.PI * 2; t += 0.02) {
      // Lemniscate parametric equations
      const denominator = 1 + Math.sin(t) * Math.sin(t);
      const x = centerCanvasX + (scale * Math.cos(t)) / denominator;
      const y = centerCanvasY + (scale * Math.sin(t) * Math.cos(t)) / denominator;
      points.push({ x, y });
    }

    // Draw the stroked infinity shape (no fill in center)
    ntCtx.beginPath();
    ntCtx.moveTo(points[0].x, points[0].y);
    for (const point of points) {
      ntCtx.lineTo(point.x, point.y);
    }
    ntCtx.closePath();
    ntCtx.stroke();

    const imageData = ntCtx.getImageData(0, 0, 700, 700);
    const ntParticles = [];

    // Sample pixels to create Meta logo particles - less dense
    // Offset to center the 700x700 logo canvas in the dynamic animation canvas
    const offsetX = (width - 700) / 2;
    const offsetY = (height - 700) / 2;

    for (let y = 0; y < 700; y += 5) {  // Increased spacing from 3 to 5
      for (let x = 0; x < 700; x += 5) {  // Increased spacing from 3 to 5
        const i = (y * 700 + x) * 4;
        if (imageData.data[i + 3] > 128) {
          ntParticles.push({
            ntX: x + offsetX,
            ntY: y + offsetY,
            ntZ: (Math.random() - 0.5) * 30,
            // Add random oscillation parameters for each particle
            oscFreqX: 0.5 + Math.random() * 1.5,
            oscFreqY: 0.5 + Math.random() * 1.5,
            oscAmpX: 2 + Math.random() * 4,
            oscAmpY: 2 + Math.random() * 4,
            oscPhaseX: Math.random() * Math.PI * 2,
            oscPhaseY: Math.random() * Math.PI * 2
          });
        }
      }
    }

    // Store original positions for each particle
    particles.forEach((particle, index) => {
      particle.originalX = particle.x;
      particle.originalY = particle.y;
      particle.originalZ = particle.z;

      // Assign random sphere position using Fibonacci sphere algorithm for even distribution
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const i = index;
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / particles.length);
      const sphereRadius = 120;

      // Spherical to Cartesian
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      particle.sphereX = centerX + sphereRadius * x;
      particle.sphereY = centerY + sphereRadius * y;
      particle.sphereZ = sphereRadius * z;

      // Store sphere coordinates in spherical form for rotation
      particle.spherePhi = phi;
      particle.sphereTheta = theta;
      particle.sphereRadius = sphereRadius;
      particle.sphereLocalX = x;
      particle.sphereLocalY = y;
      particle.sphereLocalZ = z;

      // EXPLOSION - particles explode outward from center
      const baseSpeed = 400 + Math.random() * 600; // High speeds for explosion

      // Random direction in 3D space (outward from center)
      const explodeTheta = Math.random() * Math.PI * 2;
      const explodePhi = Math.acos(2 * Math.random() - 1);

      // Positive velocities to explode outward
      particle.explodeVelX = baseSpeed * Math.sin(explodePhi) * Math.cos(explodeTheta);
      particle.explodeVelY = baseSpeed * Math.sin(explodePhi) * Math.sin(explodeTheta);
      particle.explodeVelZ = baseSpeed * Math.cos(explodePhi);

      // Add chaotic variations
      const chaos = (Math.random() - 0.5) * 800;
      particle.explodeVelX += chaos;
      particle.explodeVelY += chaos;
      particle.explodeVelZ += chaos;

      // Store max exploded position for smooth reverse
      particle.maxExplodeX = null;
      particle.maxExplodeY = null;
      particle.maxExplodeZ = null;

      // Assign NT target position if available
      if (index < ntParticles.length) {
        const ntData = ntParticles[index];
        particle.ntX = ntData.ntX;
        particle.ntY = ntData.ntY;
        particle.ntZ = ntData.ntZ;
        particle.ntOscFreqX = ntData.oscFreqX;
        particle.ntOscFreqY = ntData.oscFreqY;
        particle.ntOscAmpX = ntData.oscAmpX;
        particle.ntOscAmpY = ntData.oscAmpY;
        particle.ntOscPhaseX = ntData.oscPhaseX;
        particle.ntOscPhaseY = ntData.oscPhaseY;
        particle.hasNTPosition = true;
      } else {
        // Particles without NT positions should stay off-screen
        particle.ntX = -1000;
        particle.ntY = -1000;
        particle.ntZ = 0;
        particle.hasNTPosition = false;
      }

      // Mouse repulsion velocity
      particle.mouseVelX = 0;
      particle.mouseVelY = 0;
    });

    function animate() {
      if (!isRunning) return;

      time += 0.016;

      // Clear canvas
      ctx.fillStyle = 'rgba(240, 238, 230, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Sort by z-depth
      particles.sort((a, b) => a.z - b.z);

      // Calculate smooth phase transitions with blending
      const gatherStart = WAIT_DURATION;
      const spinStart = WAIT_DURATION + GATHER_DURATION - BLEND_DURATION;
      const explodeStart = WAIT_DURATION + GATHER_DURATION + SPIN_DURATION - BLEND_DURATION;
      const implodeStart = WAIT_DURATION + GATHER_DURATION + SPIN_DURATION + EXPLODE_DURATION;
      const centerStart = WAIT_DURATION + GATHER_DURATION + SPIN_DURATION + EXPLODE_DURATION + IMPLODE_DURATION;
      const metaStart = centerStart + CENTER_DELAY;

      // Calculate blend weights for each phase (0 to 1)
      let waitWeight = 0, gatherWeight = 0, spinWeight = 0, explodeWeight = 0, implodeWeight = 0, centerWeight = 0, metaWeight = 0;

      if (time < gatherStart) {
        waitWeight = 1;
      } else if (time < gatherStart + BLEND_DURATION) {
        const t = (time - gatherStart) / BLEND_DURATION;
        const smoothT = t * t * (3 - 2 * t); // Smoothstep
        waitWeight = 1 - smoothT;
        gatherWeight = smoothT;
      } else if (time < spinStart) {
        gatherWeight = 1;
      } else if (time < spinStart + BLEND_DURATION) {
        const t = (time - spinStart) / BLEND_DURATION;
        const smoothT = t * t * (3 - 2 * t);
        gatherWeight = 1 - smoothT;
        spinWeight = smoothT;
      } else if (time < explodeStart) {
        spinWeight = 1;
      } else if (time < explodeStart + BLEND_DURATION) {
        const t = (time - explodeStart) / BLEND_DURATION;
        const smoothT = t * t * (3 - 2 * t);
        spinWeight = 1 - smoothT;
        explodeWeight = smoothT;
      } else if (time < implodeStart) {
        explodeWeight = 1;
      } else if (time < implodeStart + BLEND_DURATION) {
        const t = (time - implodeStart) / BLEND_DURATION;
        const smoothT = t * t * (3 - 2 * t);
        explodeWeight = 1 - smoothT;
        implodeWeight = smoothT;
      } else if (time < centerStart) {
        implodeWeight = 1;
      } else if (time < centerStart + BLEND_DURATION) {
        const t = (time - centerStart) / BLEND_DURATION;
        const smoothT = t * t * (3 - 2 * t);
        implodeWeight = 1 - smoothT;
        centerWeight = smoothT;
      } else if (time < metaStart) {
        // Center phase - all particles at center blob
        centerWeight = 1;
      } else if (time < metaStart + META_FORM_DURATION) {
        // Transition from center to Meta logo
        const t = (time - metaStart) / META_FORM_DURATION;
        const smoothT = t * t * (3 - 2 * t);
        centerWeight = 1 - smoothT;
        metaWeight = smoothT;
      } else {
        metaWeight = 1;
      }

      // Calculate progress within each phase
      const gatherProgress = Math.min((time - gatherStart) / GATHER_DURATION, 1);
      const spinProgress = Math.min((time - (WAIT_DURATION + GATHER_DURATION)) / SPIN_DURATION, 1);
      const explodeProgress = Math.min((time - (WAIT_DURATION + GATHER_DURATION + SPIN_DURATION)) / EXPLODE_DURATION, 1);
      const implodeProgress = Math.min((time - implodeStart) / IMPLODE_DURATION, 1);
      const metaProgress = Math.min((time - metaStart) / META_FORM_DURATION, 1);

      particles.forEach(particle => {
        // Calculate position for each phase independently
        let waitX = particle.x, waitY = particle.y, waitZ = particle.z;
        let gatherX, gatherY, gatherZ;
        let spinX, spinY, spinZ;
        let explodeX, explodeY, explodeZ;
        let implodeX, implodeY, implodeZ;
        let centerPosX, centerPosY, centerPosZ;
        let metaX, metaY, metaZ;

        // WAIT PHASE: Original stratified animation
        if (waitWeight > 0) {
          const strataPhase = particle.y * 0.01 + particle.stratum * 0.3 + time * 0.03;
          const primaryUndulation = Math.sin(strataPhase) * 35;
          const secondaryUndulation = Math.sin(strataPhase * 2 + particle.stratum * 0.8) * 18;
          const tertiaryUndulation = Math.sin(strataPhase * 4 + particle.stratum * 1.5) * 8;
          const totalUndulation = primaryUndulation + secondaryUndulation + tertiaryUndulation;
          const depth = particle.stratum * 25;
          const thickness = 40 + particle.stratum * 3;
          const targetX = centerX + particle.side * (60 + totalUndulation + depth);
          const strataDrift = Math.sin(particle.flow + time * 0.6 + particle.stratum * 0.4) * thickness * 0.7;

          particle.tempX = particle.tempX || particle.x;
          particle.tempY = particle.tempY || particle.y;
          particle.tempZ = particle.tempZ || particle.z;

          particle.tempX = particle.tempX * 0.94 + (targetX + strataDrift) * 0.06;
          particle.tempY += particle.velocity;
          particle.tempY += Math.sin(particle.oscillation + time * 0.8) * 0.3;
          particle.tempZ += Math.sin(time * 0.3 + particle.flow + particle.stratum * 0.6) * 0.25;

          if (particle.tempY > height + 40) {
            particle.tempY = -40;
            particle.flow = Math.random() * Math.PI * 2;
          }

          waitX = particle.tempX;
          waitY = particle.tempY;
          waitZ = particle.tempZ;
        }

        // GATHER PHASE: Move to plasma ball (oscillating mass)
        if (gatherWeight > 0) {
          // Very smooth easing with slower start and end
          const ease = gatherProgress < 0.5
            ? 2 * gatherProgress * gatherProgress * gatherProgress
            : 1 - Math.pow(-2 * gatherProgress + 2, 3) / 2;

          const startX = waitWeight > 0 ? waitX : particle.x;
          const startY = waitWeight > 0 ? waitY : particle.y;
          const startZ = waitWeight > 0 ? waitZ : particle.z;

          // Direction vector from center to particle's sphere position
          const dx = particle.sphereX - centerX;
          const dy = particle.sphereY - centerY;
          const dz = particle.sphereZ;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const dirX = dx / dist;
          const dirY = dy / dist;
          const dirZ = dz / dist;

          // Plasma oscillation - particles pulse in and out radially
          const baseFreq = time * 3;
          const harmonic1 = Math.sin(baseFreq + particle.spherePhi * 2) * 40;
          const harmonic2 = Math.sin(baseFreq * 1.7 + particle.sphereTheta * 3) * 25;
          const harmonic3 = Math.sin(baseFreq * 2.3 + particle.spherePhi * 5) * 15;

          // Combined oscillation amplitude
          const radialPulse = harmonic1 + harmonic2 + harmonic3;
          const plasmaIntensity = gatherProgress;

          // Position oscillates along the radial direction
          const plasmaX = particle.sphereX + dirX * radialPulse * plasmaIntensity;
          const plasmaY = particle.sphereY + dirY * radialPulse * plasmaIntensity;
          const plasmaZ = particle.sphereZ + dirZ * radialPulse * plasmaIntensity;

          gatherX = startX + (plasmaX - startX) * ease;
          gatherY = startY + (plasmaY - startY) * ease;
          gatherZ = startZ + (plasmaZ - startZ) * ease;
        }

        // SPIN PHASE: Rotating plasma with extreme oscillations
        if (spinWeight > 0) {
          const angularAcceleration = spinProgress * spinProgress * spinProgress;
          const totalRotation = angularAcceleration * 15;

          const localX = particle.sphereLocalX;
          const localY = particle.sphereLocalY;
          const localZ = particle.sphereLocalZ;

          // Rotate the particle
          const rotatedX = localX * Math.cos(totalRotation) - localZ * Math.sin(totalRotation);
          const rotatedY = localY;
          const rotatedZ = localX * Math.sin(totalRotation) + localZ * Math.cos(totalRotation);

          // Calculate distance from center for radial oscillations
          const dist = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY + rotatedZ * rotatedZ);
          const dirX = rotatedX / dist;
          const dirY = rotatedY / dist;
          const dirZ = rotatedZ / dist;

          // Intense plasma oscillations that increase with spin
          const intensity = spinProgress;
          const freq = time * 5;
          const wave1 = Math.sin(freq + particle.spherePhi * 4) * 50;
          const wave2 = Math.cos(freq * 1.3 + particle.sphereTheta * 5) * 35;
          const wave3 = Math.sin(freq * 2.1 + (particle.spherePhi + particle.sphereTheta) * 3) * 20;

          const radialOscillation = (wave1 + wave2 + wave3) * intensity;

          // Apply pulsation along radial direction
          spinX = centerX + particle.sphereRadius * dirX + dirX * radialOscillation;
          spinY = centerY + particle.sphereRadius * dirY + dirY * radialOscillation;
          spinZ = particle.sphereRadius * dirZ + dirZ * radialOscillation;
        }

        // EXPLODE PHASE: Particles explode outward from center
        if (explodeWeight > 0) {
          const startX = spinWeight > 0 ? spinX : (gatherWeight > 0 ? gatherX : particle.sphereX);
          const startY = spinWeight > 0 ? spinY : (gatherWeight > 0 ? gatherY : particle.sphereY);
          const startZ = spinWeight > 0 ? spinZ : (gatherWeight > 0 ? gatherZ : particle.sphereZ);

          // Calculate explosion position with acceleration
          const dt = explodeProgress * EXPLODE_DURATION;
          explodeX = startX + particle.explodeVelX * dt;
          explodeY = startY + particle.explodeVelY * dt;
          explodeZ = startZ + particle.explodeVelZ * dt;

          // Store the maximum exploded position
          if (explodeProgress >= 1) {
            particle.maxExplodeX = explodeX;
            particle.maxExplodeY = explodeY;
            particle.maxExplodeZ = explodeZ;
          }
        }

        // IMPLODE PHASE: Particles reverse trajectory back to center
        if (implodeWeight > 0) {
          // Use stored max exploded position as starting point
          const maxX = particle.maxExplodeX !== null ? particle.maxExplodeX : (explodeWeight > 0 ? explodeX : centerX);
          const maxY = particle.maxExplodeY !== null ? particle.maxExplodeY : (explodeWeight > 0 ? explodeY : centerY);
          const maxZ = particle.maxExplodeZ !== null ? particle.maxExplodeZ : (explodeWeight > 0 ? explodeZ : 0);

          // Reverse the explosion - travel back along the same path
          const reverseProgress = 1 - implodeProgress; // Start from max, go back to center
          const reverseVelX = particle.explodeVelX;
          const reverseVelY = particle.explodeVelY;
          const reverseVelZ = particle.explodeVelZ;

          // Calculate position by reversing the velocity from max position
          const dt = reverseProgress * IMPLODE_DURATION;
          implodeX = centerX + reverseVelX * dt;
          implodeY = centerY + reverseVelY * dt;
          implodeZ = 0 + reverseVelZ * dt;
        }

        // CENTER PHASE: All particles gather into a static bigger ball
        if (centerWeight > 0) {
          // Use particle's original sphere position for radial distribution
          const phi = particle.spherePhi;
          const theta = particle.sphereTheta;

          // Static sphere - half the previous size
          const blobRadius = 60; // Half of 120

          const blobX = Math.sin(phi) * Math.cos(theta) * blobRadius;
          const blobY = Math.sin(phi) * Math.sin(theta) * blobRadius;
          const blobZ = Math.cos(phi) * blobRadius;

          centerPosX = centerX + blobX;
          centerPosY = centerY + blobY;
          centerPosZ = blobZ;
        }

        // META PHASE: All particles form Meta logo from center
        if (metaWeight > 0) {
          const ease = 1 - Math.pow(1 - metaProgress, 3);
          const startX = centerWeight > 0 ? centerPosX : centerX;
          const startY = centerWeight > 0 ? centerPosY : centerY;
          const startZ = 0;

          if (particle.hasNTPosition) {
            // Particles with NT positions move from center to Meta logo position
            const baseMetaX = startX + (particle.ntX - startX) * ease;
            const baseMetaY = startY + (particle.ntY - startY) * ease;

            // Add random oscillation around Meta position
            const oscX = Math.sin(time * particle.ntOscFreqX + particle.ntOscPhaseX) * particle.ntOscAmpX;
            const oscY = Math.cos(time * particle.ntOscFreqY + particle.ntOscPhaseY) * particle.ntOscAmpY;

            // Oscillation intensity increases as particles settle into Meta logo
            const oscIntensity = Math.min(metaProgress * 2, 1);

            metaX = baseMetaX + oscX * oscIntensity;
            metaY = baseMetaY + oscY * oscIntensity;
            metaZ = particle.ntZ;
          } else {
            // Unused particles stay at center and will fade out
            metaX = centerX;
            metaY = centerY;
            metaZ = 0;
          }
        }

        // Blend all active phases together
        particle.x =
          (waitWeight > 0 ? waitX * waitWeight : 0) +
          (gatherWeight > 0 ? gatherX * gatherWeight : 0) +
          (spinWeight > 0 ? spinX * spinWeight : 0) +
          (explodeWeight > 0 ? explodeX * explodeWeight : 0) +
          (implodeWeight > 0 ? implodeX * implodeWeight : 0) +
          (centerWeight > 0 ? centerPosX * centerWeight : 0) +
          (metaWeight > 0 ? metaX * metaWeight : 0);

        particle.y =
          (waitWeight > 0 ? waitY * waitWeight : 0) +
          (gatherWeight > 0 ? gatherY * gatherWeight : 0) +
          (spinWeight > 0 ? spinY * spinWeight : 0) +
          (explodeWeight > 0 ? explodeY * explodeWeight : 0) +
          (implodeWeight > 0 ? implodeY * implodeWeight : 0) +
          (centerWeight > 0 ? centerPosY * centerWeight : 0) +
          (metaWeight > 0 ? metaY * metaWeight : 0);

        particle.z =
          (waitWeight > 0 ? waitZ * waitWeight : 0) +
          (gatherWeight > 0 ? gatherZ * gatherWeight : 0) +
          (spinWeight > 0 ? spinZ * spinWeight : 0) +
          (explodeWeight > 0 ? explodeZ * explodeWeight : 0) +
          (implodeWeight > 0 ? implodeZ * implodeWeight : 0) +
          (centerWeight > 0 ? centerPosZ * centerWeight : 0) +
          (metaWeight > 0 ? metaZ * metaWeight : 0);

        // Mouse repulsion during meta phase
        if (metaWeight > 0 && particle.hasNTPosition) {
          const dx = particle.x - mouseX;
          const dy = particle.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MOUSE_RADIUS && distance > 0) {
            // Repulsion force - stronger when closer, but gentler
            const force = (1 - distance / MOUSE_RADIUS) * 0.8; // Reduced from 30 to 0.8
            const angle = Math.atan2(dy, dx);
            particle.mouseVelX += Math.cos(angle) * force;
            particle.mouseVelY += Math.sin(angle) * force;
          }

          // Apply velocity with damping for smoother settling
          particle.x += particle.mouseVelX;
          particle.y += particle.mouseVelY;
          particle.mouseVelX *= 0.85; // Slower damping for slower settling
          particle.mouseVelY *= 0.85;
        }

        // Draw particles with smooth opacity transitions
        const depthFactor = (particle.z + 200) / 400;
        let baseOpacity = 0.25 + depthFactor * 0.25;

        // Blend opacity based on phase weights - all particles visible through all phases
        let opacity = baseOpacity * (waitWeight + gatherWeight + spinWeight + explodeWeight + implodeWeight + centerWeight);

        // During meta phase, keep all particles visible - they all stay at center
        if (metaWeight > 0) {
          if (particle.hasNTPosition) {
            opacity += (0.3 + metaProgress * 0.5) * metaWeight;
          } else {
            // Unused particles stay visible at center
            opacity += baseOpacity * metaWeight;
          }
        }

        // Scale down particles during meta formation
        let size = 0.6 + depthFactor * 1;
        if (metaWeight > 0) {
          // Scale from current size down to smaller size for Meta logo
          const targetSize = particle.hasNTPosition ? 1.2 : 0.5;
          size = size + (targetSize - size) * metaProgress;
        }

        const brightness = metaWeight > 0.5 ? 40 : (60 + particle.brightness * 20);

        if (opacity > 0 && size > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      particles.length = 0;
      time = 0;
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#F0EEE6',
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default MetaAnimation;
