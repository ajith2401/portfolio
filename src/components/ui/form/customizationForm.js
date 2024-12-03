"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SketchPicker } from "react-color";
import useWritingStore from "@/store/customStoreForm";
import { generateTextureSVG } from "@/lib/clientTextureGenerator";

// Custom Preview Component
const PreviewComponent = ({ formData, customSettings }) => {
  const getStyles = () => {
    const { colors, fonts, position } = customSettings;
    const { textAlign, lineHeight } = formData.style;
    const { textureType, themeMode } = formData;
    // Base container style
    const containerStyle = {
    width: customSettings.canvas.width || 1200 ,
    height: customSettings.canvas.height  || 1200 ,
    backgroundColor: colors.background || '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
    };
    // Add texture effect if enabled
      if (formData.effects.backgroundTexture) {
        const textureSvg = generateTextureSVG(
          textureType,
          containerStyle.width ,
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

    // Text container style
    const textContainerStyle = {
      padding: '20px',
      position: 'absolute',
      top: position.content.y ,
      left: position.content.x ,
      transform: 'translate(-50%, -50%)',
      textAlign,
      color: colors.text,
      width: '80%',
      fontFamily: fonts.body.family,
      fontSize: `${fonts.body.size }px`,
      fontWeight: fonts.body.weight ,
      lineHeight
    };

    // Title style
    const titleStyle = {
      fontFamily: fonts.title.family,
      fontSize: `${fonts.title.size }px`,
      fontWeight: fonts.title.weight ,
      color: colors.title,
      marginBottom: '10px'
    };

    // Apply text effects
    if (formData.effects.textShadow) {
      textContainerStyle.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
    }
    if (formData.effects.glow) {
      textContainerStyle.filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.5))';
    }

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
console.log('====================================');
console.log(colors.branding?.background);
console.log('====================================');
      // Branding style
      const brandingStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        padding: '40px',
        backgroundColor: colors.branding || 'transparent',
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
  // Initial gradient settings
  const defaultGradient = {
    type: 'linear',
    angle: 45,
    colors: ['#FF512F', '#F09819', '#DD2476'],
    selectedColorIndex: null
  };


// Constants
const CATEGORIES = ['poem', 'article', 'short story', 'philosophy', 'letter'];
const TEXTURES = [
  "vintagePaper", "denim", "watercolor", "concrete", "canvas", 
  "filmGrain", "marble", "rustedMetal", "parchment", "chalkBoard"
];
const TEXT_ALIGN_OPTIONS = ["left", "center", "right"];

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
  

// Main Form Component
export default function CustomizationForm() {
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
  const router = useRouter();
  const [gradientSettings, setGradientSettings] = useState(defaultGradient);
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
        position: {
            global: {
                x:  customSettings.position.global.x , 
                 y: customSettings.position.global.y , 
                },
            title: { 
                x:  customSettings.position.title.x , 
                y: customSettings.position.title.y , 

             },
            content: { 
                x:  customSettings.position.content.x , 
                y: customSettings.position.content.y , 
            }
        },
        titleSize: customSettings.fonts.title.size ,
        bodySize: customSettings.fonts.body.size ,
        lineHeight: formData.style.lineHeight ,
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
            size: customSettings.fonts.title.size ,
            weight: customSettings.fonts.title.weight
          },
          body: {
            family: customSettings.fonts.body.family,
            size: customSettings.fonts.body.size ,
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

                      <TextPositionControls
              position={customSettings.position}
              onChange={(newPosition) => setCustomSetting('position', null, newPosition)}
            />

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
            <div className="bg-white">
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