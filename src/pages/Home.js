import React from 'react'
import CameraCapture from '../components/CameraCapture';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            <div className="flex-1 container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-white">Détection de texte</h1>
                <CameraCapture />
            </div>
        </div>
    )
}
