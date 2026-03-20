import React, { useEffect, useRef } from 'react';

// Using Vanilla Three.js from CDN to avoid npm dependency issues while meeting the user's specific request.
const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically inject three.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;

    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const THREE = (window as any).THREE;
      if (!mountRef.current || !THREE) return;
      
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0f0f11, 0.0015);
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
      camera.position.z = 1000;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x0f0f11, 1);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const particles = Math.min(3000, window.innerWidth * 2);
      const positions = new Float32Array(particles * 3);
      const colors = new Float32Array(particles * 3);
      
      const color1 = new THREE.Color(0xFF5421); // Neon orange
      const color2 = new THREE.Color(0x2A5BFC); // Neon blue

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = Math.random() * 2000 - 1000;
        positions[i + 1] = Math.random() * 2000 - 1000;
        positions[i + 2] = Math.random() * 2000 - 1000;

        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Circular texture for glowing glowing dots
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext('2d');
      if (context) {
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);

      const material = new THREE.PointsMaterial({
        size: 15,
        map: texture,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      let mouseX = 0;
      let mouseY = 0;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      const onPointerMove = (event: PointerEvent) => {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
      };
      window.addEventListener('pointermove', onPointerMove);

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize);

      const animate = () => {
        requestAnimationFrame(animate);
        
        // Mouse inertia parallax
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        // Slow constant rotation
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;
        
        renderer.render(scene, camera);
      };
      animate();
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      // cleanup canvas manually deleted
      if(mountRef.current) {
         mountRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }} />;
};

export default ThreeBackground;
