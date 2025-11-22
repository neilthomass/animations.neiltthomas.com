import React, { useEffect, useRef } from 'react';

const TetheredFlow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let time = 0;
    let animationFrame;

    const bgColor = '#F0EEE6';

    class Node {
      constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.size = size;
        this.type = type;
        this.speed = Math.random() * 0.01 + 0.005;
        this.direction = Math.random() * Math.PI * 2;
        this.angle = Math.random() * Math.PI * 2;
        this.connections = [];
        this.opacity = Math.random() * 0.4 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.flowOffset = Math.random() * 100;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.moveRange = Math.random() * 30 + 20;

        this.shapeType = Math.random() > 0.6 ? 'rect' : 'line';
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      }

      update() {
        const noiseX = Math.sin(time * this.speed + this.phase) * this.moveRange;
        const noiseY = Math.cos(time * this.speed * 0.7 + this.phase) * this.moveRange;

        if (this.type === 'heaven') {
          this.x = this.originX + noiseX;
          this.y = this.originY + noiseY * 0.7;
        } else if (this.type === 'earth') {
          this.x = this.originX + noiseX * 0.6 + Math.sin(time * 0.02 + this.flowOffset) * 10;
          this.y = this.originY + noiseY * 0.8;
        } else if (this.type === 'vibe') {
          this.x = this.originX + Math.sin(time * 0.03) * 20;
          this.y = this.originY + Math.cos(time * 0.04) * 20;
          this.size = 6 + Math.sin(time * 0.05 + this.phase) * 2;
        }

        this.rotation += this.rotationSpeed;
      }

      draw() {
        if (this.type === 'heaven') {
          ctx.fillStyle = `rgba(30, 30, 30, ${this.opacity + 0.2})`;
        } else if (this.type === 'earth') {
          ctx.fillStyle = `rgba(25, 25, 25, ${this.opacity + 0.2})`;
        } else {
          ctx.fillStyle = `rgba(15, 15, 15, ${this.opacity + 0.4})`;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.shapeType === 'rect') {
          const pulseSize = this.size * (1 + Math.sin(time * this.pulseSpeed) * 0.2);
          ctx.fillRect(-pulseSize/2, -pulseSize/2, pulseSize, pulseSize);
        } else {
          const pulseLength = this.size * 2 * (1 + Math.sin(time * this.pulseSpeed) * 0.2);
          ctx.fillRect(-pulseLength/2, -1, pulseLength, 2);
        }

        ctx.restore();
      }
    }

    class FlowingPath {
      constructor(startX, startY, endX, endY, height, speed) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.height = height;
        this.speed = speed;
        this.points = [];
        this.opacity = 0.07;

        this.controlPoints = [];
        const segments = 3;
        for (let i = 0; i < segments; i++) {
          this.controlPoints.push({
            x: this.startX + (this.endX - this.startX) * ((i + 1) / (segments + 1)),
            y: this.startY + (this.endY - this.startY) * ((i + 1) / (segments + 1)),
            offsetX: Math.random() * 100 - 50,
            offsetY: Math.random() * 100 - 50,
            phaseOffset: Math.random() * Math.PI * 2
          });
        }
      }

      update() {
        for (const point of this.controlPoints) {
          point.currentOffsetX = Math.sin(time * this.speed + point.phaseOffset) * point.offsetX;
          point.currentOffsetY = Math.cos(time * this.speed + point.phaseOffset) * point.offsetY;
        }

        this.points = [{ x: this.startX, y: this.startY }];

        for (const point of this.controlPoints) {
          this.points.push({
            x: point.x + point.currentOffsetX,
            y: point.y + point.currentOffsetY
          });
        }

        this.points.push({ x: this.endX, y: this.endY });
      }

      draw() {
        ctx.strokeStyle = `rgba(20, 20, 20, ${this.opacity + 0.08})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length - 2; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }

        const last = this.points.length - 1;
        ctx.quadraticCurveTo(
          this.points[last - 1].x,
          this.points[last - 1].y,
          this.points[last].x,
          this.points[last].y
        );

        ctx.stroke();
      }
    }

    let nodes = [];
    let flowingPaths = [];

    const initNodes = () => {
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width * 0.8 + width * 0.1;
        const y = Math.random() * height * 0.4;
        const size = Math.random() * 4 + 2;

        nodes.push(new Node(x, y, size, 'heaven'));
      }

      for (let i = 0; i < 15; i++) {
        const bias = Math.random() * Math.random();
        const x = width * bias * 0.7 + width * 0.1;
        const y = height * 0.4 + Math.random() * height * 0.2;
        const size = Math.random() * 4 + 2;

        nodes.push(new Node(x, y, size, 'earth'));
      }

      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width * 0.7 + width * 0.15;
        const y = height * 0.6 + Math.random() * height * 0.35;
        const size = Math.random() * 4 + 2;

        nodes.push(new Node(x, y, size, 'earth'));
      }

      nodes.push(new Node(width * 0.15, height * 0.5, 6, 'vibe'));
    };

    const initFlowingPaths = () => {
      const vibe = nodes[nodes.length - 1];

      for (let i = 0; i < 12; i++) {
        const endX = width * (0.6 + Math.random() * 0.3);
        const endY = Math.random() * height;

        flowingPaths.push(new FlowingPath(
          vibe.x, vibe.y,
          endX, endY,
          50 + Math.random() * 50,
          0.02 + Math.random() * 0.01
        ));
      }

      flowingPaths.push(new FlowingPath(
        0, height * 0.5,
        width, height * 0.5,
        20,
        0.01
      ));
    };

    const createConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].connections = [];

        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let maxDistance = 80;

            if (i === nodes.length - 1 || j === nodes.length - 1) {
              maxDistance = 200;
            }

            if (distance < maxDistance) {
              nodes[i].connections.push({
                to: j,
                distance: distance,
                opacity: (1 - (distance / maxDistance)) * 0.3
              });
            }
          }
        }
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        for (const conn of node.connections) {
          const targetNode = nodes[conn.to];

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);

          const midX = (node.x + targetNode.x) / 2;
          const midY = (node.y + targetNode.y) / 2;

          const flowOffsetX = Math.sin(time * 0.02 + i * 0.1) * 10;
          const flowOffsetY = Math.cos(time * 0.02 + i * 0.1) * 10;

          ctx.quadraticCurveTo(
            midX + flowOffsetX,
            midY + flowOffsetY,
            targetNode.x,
            targetNode.y
          );

          ctx.strokeStyle = `rgba(20, 20, 20, ${conn.opacity + 0.1})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      time += 0.5;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      for (const path of flowingPaths) {
        path.update();
        path.draw();
      }

      for (const node of nodes) {
        node.update();
      }

      if (time % 30 === 0) {
        createConnections();
      }

      drawConnections();

      for (const node of nodes) {
        node.draw();
      }

      const vibe = nodes[nodes.length - 1];

      ctx.save();
      ctx.translate(vibe.x, vibe.y);

      const numLines = 20;
      for (let i = 0; i < numLines; i++) {
        const angle = i / numLines * Math.PI * 2;
        const length = 20 + Math.sin(angle * 3 + time * 0.05) * 10;

        ctx.strokeStyle = `rgba(20, 20, 20, 0.1)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(angle) * length,
          Math.sin(angle) * length
        );
        ctx.stroke();
      }

      ctx.restore();

      animationFrame = requestAnimationFrame(animate);
    };

    initNodes();
    initFlowingPaths();
    createConnections();
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      nodes.length = 0;
      flowingPaths.length = 0;

      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    };
  }, []);

  return (
    <div style={{
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#F0EEE6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <canvas
        ref={canvasRef}
        width={1200}
        height={900}
      />
    </div>
  );
};

export default TetheredFlow;
