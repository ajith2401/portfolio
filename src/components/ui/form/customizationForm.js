"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SketchPicker } from "react-color";
import useWritingStore from "@/store/customStoreForm";

// Custom Preview Component
const PreviewComponent = ({ formData, customSettings }) => {
  const getStyles = () => {
    const { colors, fonts, position } = customSettings;
    const { textAlign, lineHeight } = formData.style;
    const { textureType, themeMode } = formData;

    // Base container style
    const containerStyle = {
      width: customSettings.canvas.width || 1200,
      height: customSettings.canvas.height || 1200,
      backgroundColor: colors.background,
      position: 'relative',
      overflow: 'hidden'
    };

    // Add texture effect if enabled
    if (formData.effects.backgroundTexture) {
      containerStyle.backgroundImage = `url(/textures/${textureType}.png)`;
      containerStyle.backgroundBlend = 'multiply';
      containerStyle.backgroundOpacity = 0.8;
    }

    // Add gradient if in gradient mode
    if (themeMode === 'gradient') {
      containerStyle.background = `linear-gradient(${formData.gradient?.angle || 45}deg, ${colors.background}, ${colors.text})`;
    }

    // Text container style
    const textContainerStyle = {
      padding: '40px',
      position: 'absolute',
      top: position.content.y,
      left: position.content.x,
      transform: 'translate(-50%, -50%)',
      textAlign,
      color: colors.text,
      width: '80%',
      fontFamily: fonts.body.family,
      fontSize: `${fonts.body.size}px`,
      fontWeight: fonts.body.weight,
      lineHeight
    };

    // Title style
    const titleStyle = {
      fontFamily: fonts.title.family,
      fontSize: `${fonts.title.size}px`,
      fontWeight: fonts.title.weight,
      color: colors.title,
      marginBottom: '20px'
    };

    // Apply text effects
    if (formData.effects.textShadow) {
      textContainerStyle.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
    }
    if (formData.effects.glow) {
      textContainerStyle.filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.5))';
    }

    // Branding style
    const brandingStyle = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '20px',
      backgroundColor: colors.branding,
      color: colors.text,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    return { containerStyle, textContainerStyle, titleStyle, brandingStyle };
  };

  const styles = getStyles();

  return (
    <div className="preview-container" style={styles.containerStyle}>
      <div style={styles.textContainerStyle}>
        <h1 style={styles.titleStyle}>{formData.title}</h1>
        <div style={{ whiteSpace: 'pre-line' }}>{formData.body}</div>
      </div>
      <div style={styles.brandingStyle}>
        <div>{customSettings.branding.name}</div>
        <div>{customSettings.branding.website}</div>
        <div>{customSettings.branding.phone}</div>
        <div>{customSettings.branding.social}</div>
      </div>
    </div>
  );
};

// Constants
const CATEGORIES = ['poem', 'article', 'short story', 'philosophy', 'letter'];
const TEXTURES = [
  "vintagePaper", "denim", "watercolor", "concrete", "canvas", 
  "filmGrain", "marble", "rustedMetal", "parchment", "chalkBoard"
];
const TEXT_ALIGN_OPTIONS = ["left", "center", "right"];
const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"];
const FONT_FAMILIES = [
  '"Noto Serif Tamil Slanted"',
  '"Annai MN"',
  '"Tamil Sangam MN"',
  '"Noto Sans Tamil"'
];

const THEME_MODES = {
  backgroundImage: "Background Image",
  solidColor: "Solid Color",
  gradient: "Gradient"
};

// Main Form Component
export default function CustomizationForm() {
  const router = useRouter();
  const {
    formData,
    customSettings,
    isLoading,
    error,
    setFormField,
    setEffects,
    setStyle,
    setCustomSetting,
    createWriting
  } = useWritingStore();

  const [showColorPicker, setShowColorPicker] = useState({
    background: false,
    text: false,
    title: false,
    branding: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submissionData = {
      title: formData.title,
      body: formData.body,
      category: formData.category,
      textureType: formData.textureType,
      themeMode: formData.themeMode,
      theme: formData.theme,
      effects: {
        ...formData.effects,
        shadow: customSettings.effects?.shadow || {
          blur: 4,
          opacity: 0.4,
          offset: { x: 2, y: 2 }
        }
      },
      style: {
        ...formData.style,
        position: customSettings.position || "top-right",
        titleSize: customSettings.fonts.title.size,
        bodySize: customSettings.fonts.body.size,
        lineHeight: formData.style.lineHeight,
        textAlign: formData.style.textAlign
      },
      customSettings: {
        ...customSettings,
        colors: {
          background: customSettings.colors.background,
          text: customSettings.colors.text,
          title: customSettings.colors.title,
          branding: {
            background: customSettings.colors.branding,
            name: { color: customSettings.colors.text },
            web: { color: customSettings.colors.text },
            phone: { color: customSettings.colors.text },
            social: { color: customSettings.colors.text }
          }
        },
        fonts: {
          title: {
            family: customSettings.fonts.title.family,
            size: customSettings.fonts.title.size,
            weight: customSettings.fonts.title.weight
          },
          body: {
            family: customSettings.fonts.body.family,
            size: customSettings.fonts.body.size,
            weight: customSettings.fonts.body.weight
          }
        },
        branding: customSettings.branding,
        canvas: customSettings.canvas,
        gradient: formData.themeMode === 'gradient' ? {
          type: 'linear',
          angle: 45,
          colors: [customSettings.colors.background, customSettings.colors.text]
        } : undefined
      }
    };

    try {
      const writing = await createWriting(submissionData);
      router.push(`/quill/${writing._id}`);
    } catch (error) {
      console.error("Failed to create writing:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background">
      <div className="grid grid-cols-2 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormField("title", e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormField("body", e.target.value)}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Category</h3>
            <div className="flex flex-wrap gap-4">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={formData.category === category}
                    onChange={(e) => setFormField("category", e.target.value)}
                    className="mr-2"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Theme Mode Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme Mode</h3>
            <select
              value={formData.themeMode}
              onChange={(e) => setFormField("themeMode", e.target.value)}
              className="w-full p-2 border rounded"
            >
              {Object.entries(THEME_MODES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Texture Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Texture</h3>
            <select
              value={formData.textureType}
              onChange={(e) => setFormField("textureType", e.target.value)}
              className="w-full p-2 border rounded"
            >
              {TEXTURES.map(texture => (
                <option key={texture} value={texture}>
                  {texture.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Effects */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Effects</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.effects).map(([effect, value]) => (
                <label key={effect} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setEffects({ [effect]: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="capitalize">{effect.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Style Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Style Settings</h3>
            
            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium">Text Alignment</label>
              <select
                value={formData.style.textAlign}
                onChange={(e) => setStyle({ textAlign: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {TEXT_ALIGN_OPTIONS.map(align => (
                  <option key={align} value={align}>{align}</option>
                ))}
              </select>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-sm font-medium">Line Height</label>
              <input
                type="number"
                value={formData.style.lineHeight}
                onChange={(e) => setStyle({ lineHeight: parseFloat(e.target.value) })}
                step="0.1"
                min="1"
                max="3"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium">Position</label>
              <select
                value={formData.style.position}
                onChange={(e) => setStyle({ position: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {POSITIONS.map(position => (
                  <option key={position} value={position}>
                    {position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Settings */}
          <div className="space-y-6">
            {/* Canvas Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Canvas Size</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Width (px)</label>
                  <input
                    type="number"
                    value={customSettings.canvas.width}
                    onChange={(e) => setCustomSetting('canvas', 'width', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="200"
                    max="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm">Height (px)</label>
                  <input
                    type="number"
                    value={customSettings.canvas.height}
                    onChange={(e) => setCustomSetting('canvas', 'height', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="200"
                    max="3000"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Colors</h3>
              {Object.entries(customSettings.colors).map(([key, value]) => (
                <div key={key} className="relative">
                  <label className="block text-sm capitalize">{key} Color</label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 border rounded cursor-pointer"
                      style={{ backgroundColor: value }}
                      onClick={() => setShowColorPicker(prev => ({ ...prev, [key]: !prev[key] }))}
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setCustomSetting('colors', key, e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                  {showColorPicker[key] && (
                    <div className="absolute z-10">
                      <div
                        className="fixed inset-0"
                        onClick={() => setShowColorPicker(prev => ({ ...prev, [key]: false }))}
                      />
                      <SketchPicker
                        color={value}
                        onChange={(color) => setCustomSetting('colors', key, color.hex)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Font Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Font Settings</h3>
              {['title', 'body'].map((type) => (
                <div key={type} className="space-y-2">
                  <label className="block text-sm capitalize">{type} Font</label>
                  <select
                    value={customSettings.fonts[type].family}
                    onChange={(e) => setCustomSetting('fonts', type, {
                      ...customSettings.fonts[type],
                      family: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font}>{font.replace(/"/g, '')}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm">Size</label>
                      <input
                        type="number"
                        value={customSettings.fonts[type].size}
                        onChange={(e) => setCustomSetting('fonts', type, {
                          ...customSettings.fonts[type],
                          size: parseInt(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                        min="12"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Weight</label>
                      <input
                        type="number"
                        value={customSettings.fonts[type].weight}
                        onChange={(e) => setCustomSetting('fonts', type, {
                          ...customSettings.fonts[type],
                          weight: parseInt(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                        min="100"
                        max="900"
                        step="100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Branding Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Branding</h3>
              {Object.entries(customSettings.branding).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm capitalize">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setCustomSetting('branding', key, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>

        {/* Preview Column */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
            <div className="border rounded p-4 bg-white">
              <PreviewComponent 
                formData={formData}
                customSettings={customSettings}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Preview updates automatically as you make changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}