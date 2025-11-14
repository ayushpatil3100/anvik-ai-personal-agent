import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './HomeBackground.css'

function HomeBackground() {
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Create particle system
    const particleCount = 2000
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const color1 = new THREE.Color('#c084fc') // Purple
    const color2 = new THREE.Color('#4cc9f0') // Cyan
    const color3 = new THREE.Color('#f472b6') // Pink

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Position
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 200

      // Color - mix between colors
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.33) {
        color = color1
      } else if (colorChoice < 0.66) {
        color = color2
      } else {
        color = color3
      }

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Size
      sizes[i] = Math.random() * 3 + 1
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add some movement
          mvPosition.x += sin(time * 0.5 + position.y * 0.01) * 2.0;
          mvPosition.y += cos(time * 0.3 + position.x * 0.01) * 2.0;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particles, particleMaterial)
    scene.add(particleSystem)

    // Create floating orbs
    const orbs = []
    const orbGeometry = new THREE.SphereGeometry(1, 32, 32)
    
    for (let i = 0; i < 8; i++) {
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#4cc9f0' : '#f472b6',
        transparent: true,
        opacity: 0.3,
        emissive: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#4cc9f0' : '#f472b6',
        emissiveIntensity: 0.5,
      })

      const orb = new THREE.Mesh(orbGeometry, orbMaterial)
      orb.position.set(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 100,
      )
      orb.scale.setScalar(Math.random() * 15 + 10)
      orb.userData = {
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.02 + 0.01,
        amplitude: Math.random() * 20 + 10,
      }
      scene.add(orb)
      orbs.push(orb)
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add point lights
    const light1 = new THREE.PointLight('#c084fc', 1, 200)
    light1.position.set(50, 50, 50)
    scene.add(light1)

    const light2 = new THREE.PointLight('#4cc9f0', 1, 200)
    light2.position.set(-50, -50, 50)
    scene.add(light2)

    const light3 = new THREE.PointLight('#f472b6', 1, 200)
    light3.position.set(0, 0, 100)
    scene.add(light3)

    // Create connecting lines between particles
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(particleCount * 3)
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      // Update particles
      particleMaterial.uniforms.time.value = elapsed

      // Rotate particle system
      particleSystem.rotation.y = elapsed * 0.1
      particleSystem.rotation.x = Math.sin(elapsed * 0.1) * 0.1

      // Animate orbs
      orbs.forEach((orb, index) => {
        orb.position.y += Math.sin(elapsed * orb.userData.speed + index) * 0.1
        orb.position.x += Math.cos(elapsed * orb.userData.speed * 0.7 + index) * 0.1
        orb.rotation.x += orb.userData.rotationSpeed
        orb.rotation.y += orb.userData.rotationSpeed * 0.7

        // Pulsing effect
        const scale = orb.userData.amplitude + Math.sin(elapsed * 2 + index) * 2
        orb.scale.setScalar(scale)
      })

      // Animate lights
      light1.position.x = Math.sin(elapsed * 0.5) * 50
      light1.position.y = Math.cos(elapsed * 0.5) * 50
      light2.position.x = Math.cos(elapsed * 0.3) * 50
      light2.position.y = Math.sin(elapsed * 0.3) * 50
      light3.position.z = 100 + Math.sin(elapsed * 0.4) * 30

      // Update connecting lines
      const positions = lineGeometry.attributes.position.array
      const particlePositions = particles.attributes.position.array
      
      let lineIndex = 0
      for (let i = 0; i < particleCount; i += 10) {
        const i3 = i * 3
        if (lineIndex < positions.length - 3) {
          positions[lineIndex] = particlePositions[i3]
          positions[lineIndex + 1] = particlePositions[i3 + 1]
          positions[lineIndex + 2] = particlePositions[i3 + 2]
          lineIndex += 3
        }
      }
      lineGeometry.attributes.position.needsUpdate = true

      // Rotate camera slightly
      camera.position.x = Math.sin(elapsed * 0.1) * 5
      camera.position.y = Math.cos(elapsed * 0.1) * 5
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      particleMaterial.dispose()
      particles.dispose()
      lineMaterial.dispose()
      lineGeometry.dispose()
      orbs.forEach(orb => {
        orb.geometry.dispose()
        orb.material.dispose()
      })
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div className="home-background" aria-hidden="true" ref={containerRef} />
}

export default HomeBackground

