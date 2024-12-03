import { create } from 'zustand';

const DEFAULT_CANVAS = {
  width: 1200,
  height: 1200,
  brandingHeight:150
};

const DEFAULT_COLORS = {
  background: "#FFFFFF",
  text: "#000000",
  title: "#000000",
  branding: "#095086"
};

const DEFAULT_FONTS = {
  title: {
    family: '"Noto Serif Tamil Slanted"',
    size: 48,
    weight: 800
  },
  body: {
    family: '"Annai MN"',
    size: 32,
    weight: 400
  }
};

const DEFAULT_BRANDING = {
  name: "அஜித்குமார்",
  website: "www.ajithkumar.dev",
  phone: "9944154823",
  social: "@vaanawill",
  font: '"Tamil Sangam MN"',
  colors: {
    name: "#FFFFFF",
    web: "#FFFFFF",
    phone: "#FFFFFF",
    social: "#FFFFFF"
  }
};

const DEFAULT_POSITION = {
  global: { x: 400, y: 400 },
  title: { x: 400, y: 400 },
  content: { x: 400, y: 200}
};

const useWritingStore = create((set, get) => ({
  formData: {
    title: "தனிமையில்..!",
    body: "யாருமற்ற தனிமையில்\nநான் யாராகவும்\nவாழ முடிவதே\nயாருமற்ற தனிமை\nஎனக்கு தந்த\nயாரும் தர முடியாத\nபெருஞ் சுதந்திரம்.",
    category: 'article',
    themeMode: "gradient",
    textureType: "starrySky",
    theme: 'etherealDream',
    effects: {
      textShadow: true,
      glow: false,
      decorativeElements: true,
      backgroundTexture: true
    },
    style: {
      textAlign: 'center',
      titleSize: 36,
      bodySize: 24,
      lineHeight: 2,
    }
  },

  customSettings: {
    canvas: { ...DEFAULT_CANVAS },
    colors: { ...DEFAULT_COLORS },
    fonts: { ...DEFAULT_FONTS },
    branding: { ...DEFAULT_BRANDING },
    position: { ...DEFAULT_POSITION },
    effects: {
      shadow: {
        blur: 4,
        opacity: 0.4,
        offset: { x: 2, y: 2 }
      }
    }
  },

  isLoading: false,
  error: null,
  createdWriting: null,

  setFormField: (field, value) => 
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),

  setEffects: (effects) =>
    set((state) => ({
      formData: {
        ...state.formData,
        effects: { ...state.formData.effects, ...effects }
      }
    })),

  setStyle: (style) =>
    set((state) => ({
      formData: {
        ...state.formData,
        style: { ...state.formData.style, ...style }
      }
    })),

  setCustomSetting: (category, subcategory, value) => 
    set((state) => ({
      customSettings: {
        ...state.customSettings,
        [category]: subcategory 
          ? { ...state.customSettings[category], [subcategory]: value }
          : value
      }
    })),

  resetCustomSettings: () =>
    set({
      customSettings: {
        canvas: { ...DEFAULT_CANVAS },
        colors: { ...DEFAULT_COLORS },
        fonts: { ...DEFAULT_FONTS },
        branding: { ...DEFAULT_BRANDING },
        position: { ...DEFAULT_POSITION }
      }
    }),

  resetForm: () =>
    set({
      formData: {
        title: '',
        body: '',
        category: 'article',
        theme: 'default',
        effects: {
          textShadow: true,
          glow: false,
          decorativeElements: true,
          backgroundTexture: true
        },
        style: {
          textAlign: 'right',
          titleSize: 48,
          bodySize: 32,
          lineHeight: 1.6,
        }
      },
      customSettings: {
        canvas: { ...DEFAULT_CANVAS },
        colors: { ...DEFAULT_COLORS },
        fonts: { ...DEFAULT_FONTS },
        branding: { ...DEFAULT_BRANDING },
        position: { ...DEFAULT_POSITION }
      },
      error: null,
      createdWriting: null
    }),

  createWriting: async (formData, isPreview = false) => {
    set({ isLoading: true, error: null });
    try {
      const combinedData = {
        ...formData,
        customSettings: get().customSettings,
        isPreview
      };

      const response = await fetch('/api/writings/with-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create writing');
      }

      const writing = await response.json();
      if (!isPreview) {
        set({ createdWriting: writing, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return writing;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useWritingStore;