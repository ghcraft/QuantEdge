"use client";

import { useState, useEffect } from "react";
import { feedbackService, Feedback } from "@/lib/feedback";
import { AuthService } from "@/lib/auth";

interface FeedbackWidgetProps {
  minimal?: boolean;
}

export default function FeedbackWidget({ minimal = false }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserName(user.name || "Usuário");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const feedback = feedbackService.save({
      userName: userName || "Usuário",
      rating,
      comment: comment.trim() || "",
      isPublic: rating >= 4,
    });

    setSubmitted(true);
    setRating(0);
    setComment("");
    setHoverRating(0);

    // Fecha após 2 segundos
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2000);
  };

  if (minimal) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 hover:from-dark-accent/30 hover:to-dark-info/30 border border-dark-border/50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group backdrop-blur-sm"
          >
            <svg
              className="w-6 h-6 text-dark-accent group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ) : (
          <div className="bg-dark-card/95 backdrop-blur-xl border border-dark-border/50 rounded-2xl p-6 shadow-2xl w-80">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-dark-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-dark-success" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-light text-dark-text-primary mb-1">Obrigado pelo feedback!</p>
                <p className="text-xs text-dark-text-muted font-light">
                  {rating >= 4 
                    ? "Seu feedback será analisado e, se aprovado, será exibido publicamente." 
                    : "Analisaremos seu feedback para melhorias."}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light text-dark-text-primary">Como foi sua experiência?</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setRating(0);
                      setComment("");
                    }}
                    className="text-dark-text-muted hover:text-dark-text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <svg
                          className={`w-6 h-6 ${
                            star <= (hoverRating || rating)
                              ? "text-dark-warning fill-dark-warning"
                              : "text-dark-text-muted"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {rating < 4 && rating > 0 && (
                    <div className="mb-4 p-3 bg-dark-warning/10 border border-dark-warning/30 rounded-lg">
                      <p className="text-xs text-dark-text-muted font-light mb-2">
                        O que podemos melhorar? Seu feedback nos ajuda a evoluir.
                      </p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Conte-nos o que podemos melhorar..."
                        className="w-full bg-dark-bg-secondary/50 border border-dark-border/30 rounded-lg px-3 py-2 text-sm text-dark-text-primary placeholder-dark-text-muted/50 focus:outline-none focus:border-dark-warning/50 resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  {rating >= 4 && (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Compartilhe sua experiência (opcional)..."
                      className="w-full mb-4 bg-dark-bg-secondary/50 border border-dark-border/30 rounded-lg px-3 py-2 text-sm text-dark-text-primary placeholder-dark-text-muted/50 focus:outline-none focus:border-dark-accent/50 resize-none"
                      rows={3}
                    />
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={rating === 0}
                      className="flex-1 px-4 py-2 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-lg text-sm font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enviar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setRating(0);
                        setComment("");
                      }}
                      className="px-4 py-2 text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-card border border-dark-border rounded-lg text-sm font-light transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

