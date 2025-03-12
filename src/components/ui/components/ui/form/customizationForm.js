"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { SketchPicker } from "react-color";
import useWritingStore from "@/store/customStoreForm";
import { generateTextureSVG } from "@/lib/clientTextureGenerator";

const PreviewComponent = ({ formData, customSettings }) => {
    const [scale, setScale] = useState(1);
    const containerRef = React.useRef(null);
  
    useEffect(() => {
      const updateScale = () => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const canvasWidth = customSettings.canvas.width;
          const newScale = containerWidth / canvasWidth;
          setScale(newScale);
        }
      };
  
      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, [customSettings.canvas.width]);
  
    const getStyles = () => {
      const { colors, fonts, position } = customSettings;
      const { textAlign, lineHeight } = formData.style;
      const { textureType, themeMode } = formData;
  
      // Outer container style
      const outerContainerStyle = {
        width: '100%',
        height: 0,
        paddingBottom: `${(customSettings.canvas.height / customSettings.canvas.width) * 100}%`,
        position: 'relative',
        overflow: 'hidden'
      };
  
      // Scale container style
      const scaleContainerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
        transform: `scale(${scale})`,
        transformOrigin: '0 0'
      };
  
      // Main container style
      const containerStyle = {
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        position: 'relative',
        transition: 'all 0.3s ease'
      };
  
      // Apply gradient if in gradient mode
      if (themeMode === 'gradient' && formData.gradient) {
        const { type, angle, colors: gradientColors } = formData.gradient;
        containerStyle.background = type === 'radial'
          ? `radial-gradient(circle, ${gradientColors.join(', ')})`
          : `linear-gradient(${angle}deg, ${gradientColors.join(', ')})`;
      }
  
      // Apply texture if enabled
      if (formData.effects.backgroundTexture) {
        const textureSvg = generateTextureSVG(
          textureType,
          customSettings.canvas.width,
          customSettings.canvas.height
        );
        
        if (textureSvg) {
          const encodedSVG = encodeURIComponent(textureSvg)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
          
          containerStyle.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${encodedSVG}")`;
          containerStyle.backgroundBlendMode = 'multiply';
          containerStyle.backgroundSize = 'cover';
          containerStyle.backgroundPosition = 'center';
        }
      }
  
      // Content wrapper style
      const contentWrapperStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '80%',
        transform: `translate(-50%, -50%) translate(${position.global.x}px, ${position.global.y}px)`,
        textAlign,
        zIndex: 2
      };
  
      // Title style
      const titleStyle = {
        position: 'relative',
        fontFamily: fonts.title.family,
        fontSize: `${fonts.title.size}px`,
        fontWeight: fonts.title.weight,
        color: colors.title,
        marginBottom: '10px',
        transform: `translate(${position.title.x}px, ${position.title.y}px)`,
        transition: 'all 0.3s ease'
      };
  
      // Content style
      const contentStyle = {
        position: 'relative',
        fontFamily: fonts.body.family,
        fontSize: `${fonts.body.size}px`,
        fontWeight: fonts.body.weight,
        color: colors.text,
        lineHeight,
        transform: `translate(${position.content.x}px, ${position.content.y}px)`,
        transition: 'all 0.3s ease',
        whiteSpace: 'pre-line'
      };
  
      // Branding section style
      const brandingStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: `${customSettings.canvas.brandingHeight}px`,
        backgroundColor: colors.branding,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 3
      };
  
      // Branding element style generator
      const getBrandingElementStyle = (type) => ({
        fontFamily: customSettings.branding.font,
        fontSize: '24px',
        fontWeight: 500,
        color: customSettings.branding.colors[type],
        transition: 'all 0.3s ease'
      });
  
      // Effects
      if (formData.effects.textShadow) {
        titleStyle.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        contentStyle.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
      }
  
      if (formData.effects.glow) {
        contentWrapperStyle.filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.5))';
      }
  
      return {
        outerContainerStyle,
        scaleContainerStyle,
        containerStyle,
        contentWrapperStyle,
        titleStyle,
        contentStyle,
        brandingStyle,
        getBrandingElementStyle
      };
    };
  
    const styles = getStyles();
  
    return (
      <div ref={containerRef} style={styles.outerContainerStyle}>
        <div style={styles.scaleContainerStyle}>
          <div style={styles.containerStyle}>
            {/* Main content */}
            <div style={styles.contentWrapperStyle}>
              <h1 style={styles.titleStyle}>
                {formData.title || 'Your Title Here'}
              </h1>
              <div style={styles.contentStyle}>
                {formData.body || 'Your content here...'}
              </div>
            </div>
  
            {/* Decorative elements */}
            {formData.effects.decorativeElements && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Add your decorative elements here */}
              </div>
            )}
  
            {/* Branding section */}
            <div style={styles.brandingStyle}>
              <div style={styles.getBrandingElementStyle('name')}>
                {customSettings.branding.name}
              </div>
              <div style={styles.getBrandingElementStyle('web')}>
                {customSettings.branding.website}
              </div>
              <div style={styles.getBrandingElementStyle('phone')}>
                {customSettings.branding.phone}
              </div>
              <div style={styles.getBrandingElementStyle('social')}>
                {customSettings.branding.social}
              </div>
            </div>
  
            {/* Effects overlay */}
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
        </div>
      </div>
    );
  };
  
  const TextPositionControls = ({ position, onChange }) => {
    const handleChange = (type, axis, value) => {
      const numValue = parseInt(value) || 0;
      onChange({
        ...position,
        [type]: {
          ...position[type],
          [axis]: numValue
        }
      });
    };
  
    const PositionInput = ({ type, axis, label, value, min = -500, max = 500, step = 10 }) => (
      <div>
        <label className="block text-xs">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            value={value}
            onChange={(e) => handleChange(type, axis, e.target.value)}
            className="w-full"
            min={min}
            max={max}
            step={step}
          />
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(type, axis, e.target.value)}
            className="w-20 p-2 border rounded"
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
    );
  
    return (
      <div className="space-y-6">
        <h4 className="text-sm font-medium">Text Position</h4>
        
        {/* Global Position Controls */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Whole Text Block</label>
          <div className="space-y-4">
            <PositionInput
              type="global"
              axis="x"
              label="Horizontal Offset"
              value={position.global.x}
              min={-300}
              max={300}
              step={5}
            />
            <PositionInput
              type="global"
              axis="y"
              label="Vertical Offset"
              value={position.global.y}
              min={-300}
              max={300}
              step={5}
            />
          </div>
        </div>
  
        {/* Title Position
        <div className="space-y-3">
          <label className="block text-sm font-medium">Title Position</label>
          <div className="space-y-4">
            <PositionInput
              type="title"
              axis="x"
              label="Horizontal Position"
              value={position.title.x}
              min={-200}
              max={200}
              step={5}
            />
            <PositionInput
              type="title"
              axis="y"
              label="Vertical Position"
              value={position.title.y}
              min={-200}
              max={200}
              step={5}
            />
          </div>
        </div>
  

        <div className="space-y-3">
          <label className="block text-sm font-medium">Content Position</label>
          <div className="space-y-4">
            <PositionInput
              type="content"
              axis="x"
              label="Horizontal Position"
              value={position.content.x}
              min={-200}
              max={200}
              step={5}
            />
            <PositionInput
              type="content"
              axis="y"
              label="Vertical Position"
              value={position.content.y}
              min={-200}
              max={200}
              step={5}
            />
          </div>
        </div>
        */}
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
    "filmGrain", "marble", "rustedMetal", "parchment", "chalkBoard",
    "lacePattern", "waterDrops", "flyingBirds", "starrySky"
  ];
const TEXT_ALIGN_OPTIONS = ["left", "center", "right"];

const FONT_FAMILIES = [
  '"Noto Serif Tamil Slanted"',
  '"Annai MN"',
  '"Tamil Sangam MN"',
  '"Noto Sans Tamil"'
];

const THEME_MODES = {
  solidColor: "Solid Color",
  gradient: "Gradient"
};

// Components
const GradientControls = ({ gradientSettings, onChange, formData, setFormField }) => {
    const handleChange = (newSettings) => {
      onChange(newSettings);
      setFormField('gradient', newSettings);
      setFormField('themeMode', 'gradient');
    };
  
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Gradient Type</label>
          <select
            value={gradientSettings.type}
            onChange={(e) => handleChange({ ...gradientSettings, type: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
  
        {gradientSettings.type === 'linear' && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Angle</label>
            <input
              type="number"
              value={gradientSettings.angle}
              onChange={(e) => handleChange({ 
                ...gradientSettings, 
                angle: parseInt(e.target.value) 
              })}
              className="p-2 border rounded w-24"
              min="0"
              max="360"
            />
          </div>
        )}
  
        <div className="space-y-2">
          <label className="block text-sm font-medium">Colors</label>
          {gradientSettings.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-8 h-8 border rounded cursor-pointer"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const newColors = [...gradientSettings.colors];
                  newColors[index] = e.target.value;
                  handleChange({ ...gradientSettings, colors: newColors });
                }}
                className="flex-1"
              />
              {gradientSettings.colors.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const newColors = gradientSettings.colors.filter((_, i) => i !== index);
                    handleChange({ ...gradientSettings, colors: newColors });
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
              onClick={() => handleChange({
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
        console.log('====================================');
        console.log({submissionData});
        console.log('====================================');
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
                    formData={formData}
                    setFormField={setFormField}
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