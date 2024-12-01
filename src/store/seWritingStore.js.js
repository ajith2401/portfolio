import { create } from 'zustand';

const useWritingStore = create((set) => ({
  // Form data
  formData: {
    title: "தனிமையில்..!",
    body: "யாருமற்ற தனிமையில்\nநான் யாராகவும்\nவாழ முடிவதே\nயாருமற்ற தனிமை\nஎனக்கு தந்த\nயாரும் தர முடியாத\nபெருஞ் சுதந்திரம்.",
    category: 'article',
    themeMode :"gradient",
    theme: 'velvetHeaven',
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
      position: 'top-right'
    }
  },
  
  // Loading and error states
  isLoading: false,
  error: null,
  createdWriting: null,

  // Actions
  setFormField: (field, value) => 
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
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

  resetForm: () =>
    set((state) => ({
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
          position: 'top-right'
        }
      },
      error: null,
      createdWriting: null
    })),

  createWriting: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/writings/with-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create writing');
      }

      const writing = await response.json();
      set({ createdWriting: writing, isLoading: false });
      return writing;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useWritingStore;