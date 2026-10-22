'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { FlaskConical, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

type Props = { cityName: string };

type Errors = {
  name?: string;
  email?: string;
  rating?: string;
  strengths?: string;
  consent?: string;
  honeypot?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DemoReviewForm({ cityName }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(3);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Indiquez au moins 2 caractères.';
    if (email.trim() && !EMAIL_RE.test(email.trim()))
      next.email = 'Adresse e-mail invalide.';
    if (rating < 1) next.rating = 'Choisissez une note.';
    if (strengths.trim().length < 10)
      next.strengths = 'Décrivez un point fort en 10 caractères minimum.';
    if (!consent) next.consent = 'Le consentement à la publication est requis.';
    return next;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot silencieusement ignoré
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-xl border border-success/40 bg-success/10 p-5 text-sm"
      >
        Merci ! Votre avis de démonstration a bien été pris en compte. Dans la
        version finale, il serait soumis à modération avant publication — jamais
        présenté comme vérifié.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground" role="note">
        <FlaskConical className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
        Fonctionnalité de démonstration : ce formulaire n’enregistre pas encore
        les avis. Une future version y ajoutera persistance, modération et
        protection anti-spam complète.
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="review-name">Pseudonyme ou prénom *</Label>
          <Input
            id="review-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'review-name-error' : undefined}
          />
          {errors.name && (
            <p id="review-name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="review-email">
            E-mail (optionnel, jamais publié)
          </Label>
          <Input
            id="review-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'review-email-error' : undefined}
          />
          {errors.email && (
            <p id="review-email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-rating">Votre note : {rating}/5</Label>
        <Slider
          id="review-rating"
          min={1}
          max={5}
          step={1}
          value={[rating]}
          onValueChange={(v) => setRating(v[0] ?? 3)}
          aria-label="Note de 1 à 5"
          aria-valuetext={`${rating} sur 5`}
        />
        <p aria-live="polite" className="text-xs text-muted-foreground">
          Note sélectionnée : {rating} sur 5.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-strengths">Points forts *</Label>
        <Textarea
          id="review-strengths"
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          rows={3}
          placeholder="Ce que vous appréciez dans votre commune…"
          aria-invalid={!!errors.strengths}
          aria-describedby={errors.strengths ? 'review-strengths-error' : undefined}
        />
        {errors.strengths && (
          <p id="review-strengths-error" className="text-xs text-destructive">
            {errors.strengths}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-improvements">Axes d’amélioration (optionnel)</Label>
        <Textarea
          id="review-improvements"
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          rows={3}
          placeholder="Ce qui pourrait être mieux…"
        />
      </div>

      {/* Champ anti-spam invisible pour les humains */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="review-website">Site web</Label>
        <Input
          id="review-website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Checkbox
            id="review-consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'review-consent-error' : undefined}
          />
          <Label htmlFor="review-consent" className="text-sm font-normal leading-snug">
            J’accepte que mon avis soit publié après modération sur la fiche de{' '}
            {cityName}, avec mon pseudonyme. *
          </Label>
        </div>
        {errors.consent && (
          <p id="review-consent-error" className="text-xs text-destructive">
            {errors.consent}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Consultez notre{' '}
          <Link href="/politique-confidentialite" className="underline hover:text-foreground">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>

      <Button type="submit" className="gap-2">
        <Send className="h-4 w-4" aria-hidden="true" />
        Envoyer mon avis (démonstration)
      </Button>
    </form>
  );
}
