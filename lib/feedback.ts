/**
 * Serviço de Feedback
 * Gerencia feedbacks dos usuários
 */

export interface Feedback {
  id: string;
  userId?: string;
  userName: string;
  userRole?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isPublic: boolean; // true para ratings >= 4, false para < 4
  approved: boolean; // true quando aprovado pelo admin, false quando pendente
  approvedAt?: string; // Data de aprovação
  rejected?: boolean; // true quando rejeitado pelo admin
  rejectedAt?: string; // Data de rejeição
}

class FeedbackService {
  private storageKey = "quantedge_feedbacks";

  /**
   * Salva um novo feedback
   * Todos os feedbacks começam como não aprovados (precisam de aprovação do admin)
   */
  save(feedback: Omit<Feedback, "id" | "createdAt" | "isPublic" | "approved" | "rejected">): Feedback {
    const feedbacks = this.getAll();
    const newFeedback: Feedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isPublic: feedback.rating >= 4, // Apenas ratings >= 4 podem ser públicos
      approved: false, // Todos começam como não aprovados
      rejected: false,
    };

    feedbacks.push(newFeedback);
    this.saveAll(feedbacks);
    return newFeedback;
  }

  /**
   * Retorna todos os feedbacks
   */
  getAll(): Feedback[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Retorna apenas feedbacks públicos e aprovados pelo admin
   */
  getPublic(): Feedback[] {
    return this.getAll()
      .filter((f) => f.isPublic && f.approved && !f.rejected)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retorna feedbacks pendentes de aprovação
   */
  getPending(): Feedback[] {
    return this.getAll()
      .filter((f) => !f.approved && !f.rejected)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retorna feedbacks negativos (rating < 4) para análise
   */
  getNegative(): Feedback[] {
    return this.getAll()
      .filter((f) => !f.isPublic)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Salva todos os feedbacks
   */
  private saveAll(feedbacks: Feedback[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(feedbacks));
    } catch (error) {
      console.error("Erro ao salvar feedbacks:", error);
    }
  }

  /**
   * Aprova um feedback
   */
  approve(feedbackId: string): boolean {
    const feedbacks = this.getAll();
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    
    if (!feedback) return false;

    feedback.approved = true;
    feedback.approvedAt = new Date().toISOString();
    feedback.rejected = false;
    feedback.rejectedAt = undefined;

    this.saveAll(feedbacks);
    return true;
  }

  /**
   * Rejeita um feedback
   */
  reject(feedbackId: string): boolean {
    const feedbacks = this.getAll();
    const feedback = feedbacks.find((f) => f.id === feedbackId);
    
    if (!feedback) return false;

    feedback.rejected = true;
    feedback.rejectedAt = new Date().toISOString();
    feedback.approved = false;
    feedback.approvedAt = undefined;

    this.saveAll(feedbacks);
    return true;
  }

  /**
   * Retorna estatísticas de feedback
   */
  getStats() {
    const all = this.getAll();
    const publicFeedbacks = all.filter((f) => f.isPublic && f.approved && !f.rejected);
    const negativeFeedbacks = all.filter((f) => !f.isPublic);
    const pendingFeedbacks = all.filter((f) => !f.approved && !f.rejected);

    const avgRating =
      all.length > 0
        ? all.reduce((sum, f) => sum + f.rating, 0) / all.length
        : 0;

    return {
      total: all.length,
      public: publicFeedbacks.length,
      negative: negativeFeedbacks.length,
      pending: pendingFeedbacks.length,
      averageRating: avgRating.toFixed(1),
    };
  }
}

export const feedbackService = new FeedbackService();

