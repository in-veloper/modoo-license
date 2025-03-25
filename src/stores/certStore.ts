import { create } from 'zustand'

export interface Cert {
    id: string
    title: string
    date: string
}

interface CertStore {
    certs: Cert[]
    setCerts: (data: Cert[]) => void
}

export const useCertStore = create<CertStore>((set) => ({
    certs: [],
    setCerts: (certs) => set({ certs })
}))
