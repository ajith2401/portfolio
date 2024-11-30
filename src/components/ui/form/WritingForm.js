"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useWritingStore from "@/store/seWritingStore.js";


// Constants for form options
const CATEGORIES = ["article", "poem", "philosophy", "short story"];
const THEME_CATEGORIES = {
  backgroundImage: {
    label: "Background Image Themes",
    themes: [
      "default", "red", "blue", "green", "black", "navyBlue", "midnightBlue", 
      "blackDustyRose", "oceanBlue", "peacockFeather", "eveningSky", "starSky", 
      "creamTan", "jetBlack", "limeGreen", "tealGray", "softGreen", "vintage", 
      "flower", "blackCloth", "gradient", "waterColor", "textile", "foggyForest", 
      "greenLeaf", "paperFlower", "pinkFlower", "leafRose", "greenishBrown", 
      "lightBlack", "oldPaper", "redFlower", "redTexture", "pinkBlueWater", 
      "lightBluePaint", "ancientStone", "darkNight", "pureBlack", "warmToneFlower"
    ]
  },
  solidColor: {
    label: "Solid Color Themes",
    themes: [
      "bluePastelHarmony", "charcoalSunrise", "coralSunset", "cherryElegance", 
      "skySerenity", "oceanDepths", "skyCandy", "natureMist", "royalMystic", 
      "earthTones", "oliveBloom", "mysticLavender", "oceanBreeze", "mintLagoon", 
      "autumnSunset", "vintageMauve", "rusticCharm", "glacierMist", 
      "autumnHarmony", "industrialChic", "dustyRoseHarmony", "berryBurst", 
      "mistyMorning", "seafoamDream", "sunsetGlow", "desertSage", "moonlitNight", 
      "sageGarden","dawnHarmony","velvetDesire","graniteWisdom","festiveFlare",
      "emeraldSerenity","bharatanatyam","bayOfBengal","kanchipuram"
    ]
  },
  gradient: {
    label: "Gradient Themes",
    themes: [
      "sunsetGradient", "purpleDream", "oceanGradient", "midnightOcean", 
      "roseMist", "emeraldDream", "goldenHour", "lavenderMist", "cosmicFusion", 
      "arcticAurora", "cherryBlossom", "desertSunrise", "forestDepths", 
      "twilightHaze", "sunsetSerenade", "mysticDawn", "crystalline", 
      "moonlightSonata", "plumSunset", "mintLeaf", "polarLight", "roseQuartz", 
      "celestialNight", "retroWave", "pastelSunrise", "aquaMarine", "soulfulNight", 
      "innerPeace", "serenityFlow", "tranquilDawn", "mindfulMist", "innerCalm", 
      "soulfulSunset", "moonlessNight", "peacefulAutumn", "gentleDusk", 
      "meditativeSpace", "etherealDream", "silentRain", "mysticTwilight", 
      "morningSerenity", "riverDream", "templewWisdom", "pearlMist", 
      "kovilSanctuary", "oceanWhisper", "silkDream", "tamaraiBloom", 
      "moonlightRaga", "velvetHeaven", "mistyMemories", "blissfulDawn", 
      "heartSong", "wisdomPath", "dawnHarmony", "velvetDesire", "graniteWisdom", 
      "festiveFlare", "emeraldSerenity","morningPastel","gentleLavender","freshMint",
      "pinkClouds","softLemonCream","skyBloom","peachSorbet","lilacBreeze","seaPearl",
      "roseGarden", "morningBliss", "peachHarmony", "mintyFresh", "lavenderDream",
      "skyWhisper","cottonCandy","softSpring","sunsetGlow","oceanMist","dewDrop",
      "blossomPink","citrusBreeze","citrusBreeze","serenityBlue","lemonFrost","frostyLilac",
      "softCoral","paleGold","powderBlue","morningMist","peachGlow"
    ]
  }
};
  
const TEXT_ALIGN_OPTIONS = ["left", "center", "right"];
const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"];

// Replace the Theme selection section in your form with this:
const ThemeSelector = ({ formData, setFormField }) => {
const [themeMode, setThemeMode] = useState('gradient'); // Default to gradient

const handleThemeModeChange = (mode) => {
  setThemeMode(mode);
  // Set the first theme of the selected category as default
  setFormField("theme", THEME_CATEGORIES[mode].themes[0]);
};

return (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Theme Mode</label>
      <select
        value={themeMode}
        onChange={(e) => handleThemeModeChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="backgroundImage">Background Image Themes</option>
        <option value="solidColor">Solid Color Themes</option>
        <option value="gradient">Gradient Themes</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Select Theme</label>
      <select
        value={formData.theme}
        onChange={(e) => setFormField("theme", e.target.value)}
        className="w-full p-2 border rounded"
      >
        {THEME_CATEGORIES[themeMode].themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1).replace(/([A-Z])/g, ' $1')}
          </option>
        ))}
      </select>
    </div>
  </div>
);

};


export default function WritingForm() {
  const router = useRouter();
  const {
    formData,
    isLoading,
    error,
    createdWriting,
    setFormField,
    setEffects,
    setStyle,
    createWriting
  } = useWritingStore();

  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const writing = await createWriting(formData);
      setPreview(writing.imageUrl); // Assuming "imageUrl" is part of the response
      router.push(`/quill/${writing._id}`);
    } catch (error) {
      console.error("Failed to create writing:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormField("title", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormField("body", e.target.value)}
            className="w-full p-2 border rounded h-40"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="flex gap-4">
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
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Theme */}
        <ThemeSelector formData={formData} setFormField={setFormField} />

        {/* Effects */}
        <div>
          <label className="block text-sm font-medium mb-2">Effects</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.effects.textShadow}
                onChange={(e) => setEffects({ textShadow: e.target.checked })}
                className="mr-2"
              />
              Text Shadow
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.effects.glow}
                onChange={(e) => setEffects({ glow: e.target.checked })}
                className="mr-2"
              />
              Glow
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.effects.decorativeElements}
                onChange={(e) => setEffects({ decorativeElements: e.target.checked })}
                className="mr-2"
              />
              Decorative Elements
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.effects.backgroundTexture}
                onChange={(e) => setEffects({ backgroundTexture: e.target.checked })}
                className="mr-2"
              />
              Background Texture
            </label>
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Text Align</label>
              <select
                value={formData.style.textAlign}
                onChange={(e) => setStyle({ textAlign: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {TEXT_ALIGN_OPTIONS.map((align) => (
                  <option key={align} value={align}>
                    {align}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Position</label>
              <select
                value={formData.style.position}
                onChange={(e) => setStyle({ position: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Title Size</label>
              <input
                type="number"
                value={formData.style.titleSize}
                onChange={(e) => setStyle({ titleSize: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min="24"
                max="72"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Body Size</label>
              <input
                type="number"
                value={formData.style.bodySize}
                onChange={(e) => setStyle({ bodySize: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min="16"
                max="48"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Line Height</label>
              <input
                type="number"
                value={formData.style.lineHeight}
                onChange={(e) => setStyle({ lineHeight: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                min="1"
                max="2"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Writing"}
        </button>
      </form>

      {/* Preview */}
      {preview && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="border rounded p-4">
            <img src={preview} alt="Preview" className="max-w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
