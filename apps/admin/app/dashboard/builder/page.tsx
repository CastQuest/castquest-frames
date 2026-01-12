'use client';

import { useState } from 'react';

export default function BuilderPage() {
  const [_frameName, _setFrameName] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Frame Builder</h1>
        <p className="mt-2 text-neutral-400">
          Create and configure interactive frames
        </p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Frame builder coming soon...</p>
      </div>
    </div>
  );
}
