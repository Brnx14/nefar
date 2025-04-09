'use client';
import { useSearchParams } from 'next/navigation';

export default function ARViewer() {
  const searchParams = useSearchParams();
  const modelUrl = searchParams.get('model');

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      {modelUrl ? (
        <model-viewer
          src={modelUrl}
          alt="Model Kaos"
          auto-rotate
          camera-controls
          ar
          ar-modes="scene-viewer webxr quick-look"
          style={{ width: '100%', height: '100%' }}
        ></model-viewer>
      ) : (
        <p className="text-white">Model tidak ditemukan.</p>
      )}
    </div>
  );
}