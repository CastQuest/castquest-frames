'use client';

import { useState } from 'react';
import { Save, Eye, Settings, Plus, Trash2 } from 'lucide-react';

export default function BuilderPage() {
  const [frameName, setFrameName] = useState('');
  const [frameDescription, setFrameDescription] = useState('');
  const [template, setTemplate] = useState('poll');
  const [buttons, setButtons] = useState([
    { id: '1', label: 'Option 1', action: 'post' },
    { id: '2', label: 'Option 2', action: 'post' },
  ]);

  const handleAddButton = () => {
    const newButton = {
      id: Date.now().toString(),
      label: `Option ${buttons.length + 1}`,
      action: 'post',
    };
    setButtons([...buttons, newButton]);
  };

  const handleRemoveButton = (id: string) => {
    setButtons(buttons.filter((btn) => btn.id !== id));
  };

  const handlePublish = () => {
    alert('Frame published successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Frame Builder</h1>
        <p className="mt-2 text-neutral-400">
          Create and configure interactive frames
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Frame Name
                </label>
                <input
                  type="text"
                  value={frameName}
                  onChange={(e) => setFrameName(e.target.value)}
                  placeholder="Enter frame name..."
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={frameDescription}
                  onChange={(e) => setFrameDescription(e.target.value)}
                  placeholder="Enter frame description..."
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="poll">Interactive Poll</option>
                  <option value="quiz">Quiz</option>
                  <option value="info">Information Card</option>
                  <option value="cta">Call to Action</option>
                </select>
              </div>
            </div>
          </div>

          {/* Button Configuration */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Buttons</h2>
              <button
                onClick={handleAddButton}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Add Button
              </button>
            </div>
            <div className="space-y-3">
              {buttons.map((button, index) => (
                <div
                  key={button.id}
                  className="flex items-center gap-3 p-3 bg-neutral-900 rounded-lg"
                >
                  <span className="text-neutral-400 text-sm w-6">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={button.label}
                    onChange={(e) => {
                      const updated = buttons.map((btn) =>
                        btn.id === button.id
                          ? { ...btn, label: e.target.value }
                          : btn
                      );
                      setButtons(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <select
                    value={button.action}
                    onChange={(e) => {
                      const updated = buttons.map((btn) =>
                        btn.id === button.id
                          ? { ...btn, action: e.target.value }
                          : btn
                      );
                      setButtons(updated);
                    }}
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="post">Post</option>
                    <option value="link">Link</option>
                    <option value="mint">Mint</option>
                  </select>
                  <button
                    onClick={() => handleRemoveButton(button.id)}
                    className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePublish}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Save size={18} />
              Publish Frame
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 border border-neutral-800 text-white rounded-lg hover:border-neutral-700 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-white">Live Preview</h2>
          </div>
          <div className="space-y-4">
            {/* Frame Preview */}
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800">
              <div className="text-center text-neutral-500">
                <p className="text-lg font-medium">
                  {frameName || 'Your Frame Name'}
                </p>
                <p className="text-sm mt-2">
                  {frameDescription || 'Frame description will appear here'}
                </p>
              </div>
            </div>

            {/* Buttons Preview */}
            <div className="space-y-2">
              {buttons.map((button) => (
                <div
                  key={button.id}
                  className="w-full px-4 py-3 bg-primary text-black rounded-lg font-medium text-center"
                >
                  {button.label}
                </div>
              ))}
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-sm font-medium text-neutral-300 mb-2">
                Frame Metadata
              </h3>
              <div className="space-y-1 text-xs text-neutral-500">
                <p>Template: {template}</p>
                <p>Buttons: {buttons.length}</p>
                <p>Status: Draft</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
