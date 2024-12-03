"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SketchPicker } from "react-color";
import useWritingStore from "@/store/customStoreForm";
import { generateTextureSVG } from "@/lib/clientTextureGenerator";


const PreviewComponent = ({ formData, customSettings }) => {
    console.log({formData})
    const getStyles = () => {
      const { colors, fonts, position } = customSettings;
      const { textAlign, lineHeight } = formData.style;
      const { textureType, themeMode } = formData;
  
      // Base container style
      const containerStyle = {
        width: customSettings.canvas.width || 1200,
        height: customSettings.canvas.height || 1200,
        backgroundColor: colors.background || '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      };
  
      // Add texture effect if enabled
      if (formData.effects.backgroundTexture) {
        const textureSvg = generateTextureSVG(
          textureType,
          containerStyle.width,
          containerStyle.height
        );
        
        if (textureSvg) {
          const encodedSVG = encodeURIComponent(textureSvg)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
          
          containerStyle.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${encodedSVG}")`;
        } else {
          containerStyle.backgroundImage = `url(/textures/${textureType}.png)`;
        }
        containerStyle.backgroundBlend = 'multiply';
        containerStyle.backgroundSize = 'cover';
        containerStyle.backgroundPosition = 'center';
      }
  
      // Add gradient if in gradient mode
      if (themeMode === 'gradient' && formData.gradient) {
        const { type, angle, colors: gradientColors = [] } = formData.gradient;
        if (type === 'radial') {
          containerStyle.background = `radial-gradient(circle, ${gradientColors.join(', ')})`;
        } else {
          containerStyle.background = `linear-gradient(${angle}deg, ${gradientColors.join(', ')})`;
        }
      }
  
      // Global text container style
      const textContainerStyle = {
        position: 'relative',
        width: '80%',
        maxWidth: '1000px',
        margin: '60px auto',
        padding: '20px',
        transition: 'all 0.3s ease',
        transform: position.global ? 
          `translate(${position.global.x}px, ${position.global.y}px)` : 
          'none'
      };
  
      // Title style
      const titleStyle = {
        position: 'relative',
        fontFamily: fonts.title.family || '"Noto Serif Tamil Slanted"',
        fontSize: `${fonts.title.size || 48}px`,
        fontWeight: fonts.title.weight || 800,
        color: colors.title || '#000000',
        textAlign: textAlign || 'center',
        marginBottom: '20px',
        transform: position.title ?
          `translate(${position.title.x}px, ${position.title.y}px)` :
          'none',
        transition: 'all 0.3s ease',
        opacity: 1,
        visibility: 'visible',
        zIndex: 2
      };
  
      // Content style
      const contentStyle = {
        position: 'relative',
        fontFamily: fonts.body.family || '"Annai MN"',
        fontSize: `${fonts.body.size || 32}px`,
        fontWeight: fonts.body.weight || 400,
        color: colors.text || '#000000',
        lineHeight: lineHeight || 1.5,
        textAlign: textAlign || 'center',
        transform: position.content ?
          `translate(${position.content.x}px, ${position.content.y}px)` :
          'none',
        transition: 'all 0.3s ease',
        whiteSpace: 'pre-line',
        zIndex: 2
      };
  
      // Apply text effects
      if (formData.effects.textShadow) {
        const shadowStyle = '2px 2px 4px rgba(0,0,0,0.3)';
        titleStyle.textShadow = shadowStyle;
        contentStyle.textShadow = shadowStyle;
      }
  
      if (formData.effects.glow) {
        const glowStyle = `
          0 0 5px rgba(255,255,255,0.5),
          0 0 10px rgba(255,255,255,0.3),
          0 0 15px rgba(255,255,255,0.2)
        `;
        titleStyle.filter = `drop-shadow(${glowStyle})`;
        contentStyle.filter = `drop-shadow(${glowStyle})`;
      }
  
      // Branding style
      const brandingStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        padding: '20px',
        backgroundColor: colors.branding?.background || 'transparent',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        zIndex: 3
      };
  
      // Branding element style
      const brandingElementStyle = (type) => ({
        fontFamily: customSettings.branding.font || '"Tamil Sangam MN"',
        fontSize: '24px',
        fontWeight: 500,
        color: customSettings.branding.colors?.[type] || '#FFFFFF',
        transition: 'all 0.3s ease'
      });
  
      return {
        containerStyle,
        textContainerStyle,
        titleStyle,
        contentStyle,
        brandingStyle,
        brandingElementStyle
      };
    };
  
    const styles = getStyles();
  
    // Debug logging
    console.log('Preview Styles:', {
      titleColor: styles.titleStyle.color,
      contentColor: styles.contentStyle.color,
      backgroundColor: styles.containerStyle.backgroundColor,
      gradient: formData.themeMode === 'gradient' ? formData.gradient : null
    });
  
    return (
      <div className="preview-container relative" style={styles.containerStyle}>
        {/* Main Content Container */}
        <div style={styles.textContainerStyle}>
          {/* Title */}
          <h1 style={styles.titleStyle}>
            {formData.title || 'Your Title Here'}
          </h1>
  
          {/* Content */}
          <div style={styles.contentStyle}>
            {formData.body || 'Your content here...'}
          </div>
        </div>
  
        {/* Decorative Elements */}
        {formData.effects.decorativeElements && (
          <div className="decorative-elements absolute inset-0 pointer-events-none">
            {/* Add your decorative SVG elements here */}
          </div>
        )}
  
        {/* Branding Section */}
        <div style={styles.brandingStyle}>
          <div style={styles.brandingElementStyle('name')}>
            {customSettings.branding.name || 'Brand Name'}
          </div>
          <div style={styles.brandingElementStyle('web')}>
            {customSettings.branding.website || 'website.com'}
          </div>
          <div style={styles.brandingElementStyle('phone')}>
            {customSettings.branding.phone || '123-456-7890'}
          </div>
          <div style={styles.brandingElementStyle('social')}>
            {customSettings.branding.social || '@social'}
          </div>
        </div>
  
        {/* Optional Overlay for Effects */}
        {(formData.effects.textShadow || formData.effects.glow) && (
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: 'linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.05))',
              mixBlendMode: 'multiply',
              zIndex: 1
            }}
          />
        )}
      </div>
    );
  };
  
// Components
const GradientControls = ({ gradientSettings, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Gradient Type</label>
        <select
          value={gradientSettings.type}
          onChange={(e) => onChange({ ...gradientSettings, type: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Angle</label>
        <input
          type="number"
          value={gradientSettings.angle}
          onChange={(e) => onChange({ ...gradientSettings, angle: parseInt(e.target.value) })}
          className="p-2 border rounded w-24"
          min="0"
          max="360"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Colors</label>
        {gradientSettings.colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-8 h-8 border rounded cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => onChange({
                ...gradientSettings,
                selectedColorIndex: index
              })}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const newColors = [...gradientSettings.colors];
                newColors[index] = e.target.value;
                onChange({ ...gradientSettings, colors: newColors });
              }}
              className="p-2 border rounded flex-1"
            />
            {index > 1 && (
              <button
                type="button"
                onClick={() => {
                  const newColors = gradientSettings.colors.filter((_, i) => i !== index);
                  onChange({ ...gradientSettings, colors: newColors });
                }}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {gradientSettings.colors.length < 5 && (
          <button
            type="button"
            onClick={() => onChange({
              ...gradientSettings,
              colors: [...gradientSettings.colors, '#FFFFFF']
            })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Color Stop
          </button>
        )}
      </div>
    </div>
  );
};

const TextPositionControls = ({ position, onChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Text Position</h4>
      
      {/* Global Position Controls */}
      <div className="space-y-2">
        <label className="block text-sm">Whole Text Block</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">X Offset</label>
            <input
              type="number"
              value={position.global.x}
              onChange={(e) => onChange({
                ...position,
                global: { ...position.global, x: parseInt(e.target.value) }
              })}
              className="w-full p-2 border rounded"
              min="-500"
              max="500"
            />
          </div>
          <div>
            <label className="block text-xs">Y Offset</label>
            <input
              type="number"
              value={position.global.y}
              onChange={(e) => onChange({
                ...position,
                global: { ...position.global, y: parseInt(e.target.value) }
              })}
              className="w-full p-2 border rounded"
              min="-500"
              max="500"
            />
          </div>
        </div>
      </div>

      {/* Title Position */}
      <div className="space-y-2">
        <label className="block text-sm">Title Position</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">X Position</label>
            <input
              type="number"
              value={position.title.x}
              onChange={(e) => onChange({
                ...position,
                title: { ...position.title, x: parseInt(e.target.value) }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Y Position</label>
            <input
              type="number"
              value={position.title.y}
              onChange={(e) => onChange({
                ...position,
                title: { ...position.title, y: parseInt(e.target.value) }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Content Position */}
      <div className="space-y-2">
        <label className="block text-sm">Content Position</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs">X Position</label>
            <input
              type="number"
              value={position.content.x}
              onChange={(e) => onChange({
                ...position,
                content: { ...position.content, x: parseInt(e.target.value) }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-xs">Y Position</label>
            <input
              type="number"
              value={position.content.y}
              onChange={(e) => onChange({
                ...position,
                content: { ...position.content, y: parseInt(e.target.value) }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Constants (existing ones remain the same)
const CATEGORIES = ['poem', 'article', 'short story', 'philosophy', 'letter'];
const TEXTURES = [
  "vintagePaper", "denim", "watercolor", "concrete", "canvas", 
  "filmGrain", "marble", "rustedMetal", "parchment", "chalkBoard",
  "lacePattern", "waterDrops", "flyingBirds", "starrySky"
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

  // Initial gradient settings
  const defaultGradient = {
    type: 'linear',
    angle: 45,
    colors: ['#FF512F', '#F09819', '#DD2476'],
    selectedColorIndex: null
  };

  const [gradientSettings, setGradientSettings] = useState(defaultGradient);

  // Handler for color picker visibility
  const toggleColorPicker = (type) => {
    setShowColorPicker(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Handler for color changes
  const handleColorChange = (color, type) => {
    setCustomSetting('colors', type, color.hex);
  };

  // Handler for branding color changes
  const handleBrandingColorChange = (color, element) => {
    setCustomSetting('branding', 'colors', {
      ...customSettings.branding.colors,
      [element]: color.hex
    });
  };

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
        gradient: formData.themeMode === 'gradient' ? gradientSettings : undefined
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
    <div className="max-w-[90rem] mx-auto p-6 bg-background">
      <div className="grid grid-cols-[2fr,1fr] gap-8">
        {/* Form Column */}
        <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
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

            {/* Theme Mode and Gradient Settings */}
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

              {formData.themeMode === 'gradient' && (
                <GradientControls
                  gradientSettings={gradientSettings}
                  onChange={setGradientSettings}
                />
              )}
            </div>

            {/* Text Position Controls */}
            <TextPositionControls
              position={customSettings.position}
              onChange={(newPosition) => setCustomSetting('position', null, newPosition)}
            />

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

            {/* Branding Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Branding Settings</h3>
              
              {/* Branding Font */}
              <div>
                <label className="block text-sm">Branding Font</label>
                <select
                  value={customSettings.branding.font}
                  onChange={(e) => setCustomSetting('branding', 'font', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {FONT_FAMILIES.map(font => (
                    <option key={font} value={font}>
                      {font.replace(/"/g, '')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branding Colors */}
              {['name', 'web', 'phone', 'social'].map(element => (
                <div key={element} className="space-y-2">
                  <label className="block text-sm capitalize">{element} Color</label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 border rounded cursor-pointer"
                      style={{ backgroundColor: customSettings.branding.colors[element] }}
                      onClick={() => toggleColorPicker(`branding_${element}`)}
                    />
                    <input
                      type="text"
                      value={customSettings.branding.colors[element]}
                      onChange={(e) => handleBrandingColorChange(e.target.value, element)}
                      className="flex-1 p-2 border rounded"
                    />
                    {showColorPicker[`branding_${element}`] && (
                      <div className="absolute z-10">
                        <div
                          className="fixed inset-0"
                          onClick={() => toggleColorPicker(`branding_${element}`)}
                        />
                        <SketchPicker
                          color={customSettings.branding.colors[element]}
                          onChange={(color) => handleBrandingColorChange(color, element)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Branding Text */}
              {Object.entries(customSettings.branding).map(([key, value]) => (
                key !== 'colors' && key !== 'font' && (
                  <div key={key}>
                    <label className="block text-sm capitalize">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setCustomSetting('branding', key, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )
              ))}
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
        </div>

        {/* Preview Column */}
        <div className="sticky top-6 space-y-6">
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          <div className="border rounded bg-white overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: '100%' }}>
              <div className="absolute inset-0">
                <PreviewComponent 
                  formData={formData}
                  customSettings={customSettings}
                />
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Preview updates automatically as you make changes
          </div>
        </div>
      </div>
    </div>
  );
}