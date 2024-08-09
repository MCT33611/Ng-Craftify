export interface ISubscription {
    userId: string
    planId: string
    paymentId: string
    certificationUrl?: string
    skills: string
    serviceTitle: string
    perHourPrice: number
    description: string
}
