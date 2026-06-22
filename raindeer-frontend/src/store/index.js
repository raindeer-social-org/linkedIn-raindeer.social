import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBrandStore = create(
  persist(
    (set) => ({
      brandId: null,
      token: null,
      isAuthenticated: false,
      brandName: '',
      logoUrl: '',
      linkedinPersonalConnected: false,
      linkedinCompanyConnected: false,
      industry: '',
      businessType: '',
      category: '',
      website: '',
      product: '',
      usp: '',
      audience: '',
      audiencePainPoints: '',
      audienceInterests: '',
      campaignObjective: '',
      tone: { formal: 50, serious: 50, minimal: 50 },
      theme: 'dark',

      setBrand: (data) => set((state) => ({ ...state, ...data })),
      setTone: (tone) => set({ tone }),
      setTheme: (theme) => set({ theme }),
      reset: () => set({
        brandId: null, token: null, isAuthenticated: false,
        brandName: '', logoUrl: '', linkedinPersonalConnected: false, linkedinCompanyConnected: false, industry: '', businessType: '', category: '',
        website: '', product: '', usp: '', audience: '',
        audiencePainPoints: '', audienceInterests: '', campaignObjective: '',
        tone: { formal: 50, serious: 50, minimal: 50 }, theme: 'dark',
      }),
    }),
    { name: 'raindeer-brand' }
  )
)

export const useCampaignStore = create(
  persist(
    (set) => ({
      productToPromote: '',
      coreMessage: '',
      goal: 'Awareness',
      platforms: ['Instagram'],
      startDate: '',
      endDate: '',
      avatar: null,
      mood: 'Dark/Premium',
      selectedModel: 'balanced',
      postItems: [],

      setCampaign: (data) => set((state) => ({ ...state, ...data })),
      togglePlatform: (platform) => set((state) => ({
        platforms: state.platforms.includes(platform)
          ? state.platforms.filter(p => p !== platform)
          : [...state.platforms, platform]
      })),
      setModel: (model) => set({ selectedModel: model }),
      reset: () => set({
        productToPromote: '', coreMessage: '', goal: 'Awareness',
        platforms: ['Instagram'], startDate: '', endDate: '',
        avatar: null, mood: 'Dark/Premium', selectedModel: 'balanced', postItems: [],
      }),
    }),
    { name: 'raindeer-campaign' }
  )
)

export const useUIStore = create((set) => ({
  currentStep: 1,
  agentStatuses: {},
  isGenerating: false,
  notifications: [],

  setStep: (step) => set({ currentStep: step }),
  setAgentStatus: (agentId, status) => set((state) => ({
    agentStatuses: { ...state.agentStatuses, [agentId]: status }
  })),
  setGenerating: (val) => set({ isGenerating: val }),
  addNotification: (notif) => set((state) => ({
    notifications: [...state.notifications, { id: Date.now(), ...notif }]
  })),
  clearNotifications: () => set({ notifications: [] }),
}))
