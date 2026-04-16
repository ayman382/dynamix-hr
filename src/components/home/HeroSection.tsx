import { useCallback, useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useTheme } from '@/hooks/useTheme';
import { buildWhatsAppUrl } from '@/lib/contact';
import { HERO_BACKGROUND_SVGS } from '@/lib/hero-background-svgs';
import { smoothScrollToElement } from '@/lib/smoothScroll';
import { cn } from '@/lib/utils';

interface HeroDecorativeIconProps {
  src: string;
  positionClassName: string;
  size: string;
  baseRotation: number;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  xFactor: number;
  yFactor: number;
  theme: 'dark' | 'light';
  shouldReduceMotion: boolean;
  animation: {
    animate: Record<string, number[]>;
    transition: {
      delay?: number;
      duration: number;
      ease: 'easeInOut';
      repeat: number;
    };
  };
}

function TypingText({ text, shouldReduceMotion }: { text: string; shouldReduceMotion: boolean }) {
  const [visibleLength, setVisibleLength] = useState(shouldReduceMotion ? text.length : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setVisibleLength(text.length);
      return;
    }

    setVisibleLength(0);

    let characterIndex = 0;
    let intervalId = 0;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        characterIndex += 1;
        setVisibleLength(Math.min(text.length, characterIndex));

        if (characterIndex >= text.length) {
          window.clearInterval(intervalId);
        }
      }, 38);
    }, 160);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [shouldReduceMotion, text]);

  const visibleText = shouldReduceMotion ? text : text.slice(0, visibleLength);

  return (
    <span className="relative inline-block max-w-full align-top" aria-label={text}>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block">
        {visibleText}
        {!shouldReduceMotion && <span aria-hidden="true" className="hero-typing-caret" />}
      </span>
    </span>
  );
}

function HeroDecorativeIcon({
  src,
  positionClassName,
  size,
  baseRotation,
  parallaxX,
  parallaxY,
  xFactor,
  yFactor,
  theme,
  shouldReduceMotion,
  animation,
}: HeroDecorativeIconProps) {
  const x = useTransform(parallaxX, (value) => value * xFactor);
  const y = useTransform(parallaxY, (value) => value * yFactor);
  const rotate = useTransform(parallaxX, (value) => baseRotation + value * xFactor * 0.2);
  const scale = useTransform(() => 1 + (Math.abs(parallaxX.get()) + Math.abs(parallaxY.get())) * 0.08);

  return (
    <motion.div
      aria-hidden="true"
      className={cn('pointer-events-none absolute select-none transform-gpu will-change-transform', positionClassName)}
      style={{ x, y, rotate, scale, width: size }}
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={cn(
          'block h-auto w-full select-none object-contain will-change-transform',
          theme === 'dark' ? 'opacity-[0.14] brightness-0 invert' : 'opacity-[0.12]',
        )}
        animate={shouldReduceMotion ? undefined : animation.animate}
        transition={shouldReduceMotion ? undefined : animation.transition}
      />
    </motion.div>
  );
}

const seededUnit = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453123;
  return value - Math.floor(value);
};

const decorationBlueprints = [
  {
    src: HERO_BACKGROUND_SVGS[0],
    positionClassName: 'left-[3%] top-[17%] sm:left-[5%] sm:top-[19%] lg:left-[4%] lg:top-[22%]',
    xFactor: -18,
    yFactor: -12,
    duration: 8.8,
    delay: 0,
    driftX: 0,
  },
  {
    src: HERO_BACKGROUND_SVGS[1],
    positionClassName: 'right-[5%] top-[12%] sm:right-[7%] sm:top-[15%] lg:right-[8%] lg:top-[16%]',
    xFactor: 15,
    yFactor: -10,
    duration: 9.4,
    delay: 0.3,
    driftX: 0,
  },
  {
    src: HERO_BACKGROUND_SVGS[2],
    positionClassName: 'left-[2%] bottom-[22%] sm:left-[8%] sm:bottom-[18%] lg:left-[10%] lg:bottom-[16%]',
    xFactor: -16,
    yFactor: 14,
    duration: 10.2,
    delay: 0.5,
    driftX: 0,
  },
  {
    src: HERO_BACKGROUND_SVGS[3],
    positionClassName: 'right-[3%] bottom-[17%] sm:right-[10%] sm:bottom-[20%] lg:right-[11%] lg:bottom-[22%]',
    xFactor: 15,
    yFactor: 12,
    duration: 8.6,
    delay: 0.1,
    driftX: 0,
  },
  {
    src: HERO_BACKGROUND_SVGS[4],
    positionClassName: 'right-[34%] top-[7%] sm:right-[31%] sm:top-[8%] lg:right-[30%] lg:top-[8%]',
    xFactor: 12,
    yFactor: -8,
    duration: 7.9,
    delay: 0.2,
    driftX: 4,
  },
] as const;

const floatingDecorations = decorationBlueprints.map((decoration, index) => {
  const sizeSeed = seededUnit(index + 1.37);
  const tiltSeed = seededUnit(index * 3.11 + 4.23);
  const floatSeed = seededUnit(index * 5.71 + 7.91);

  const mobileWidth = Math.round(22 + sizeSeed * 8);
  const fluidWidth = (5 + sizeSeed * 2.2).toFixed(2);
  const desktopWidth = Math.round(46 + sizeSeed * 18);
  const baseRotation = Math.round(-15 + tiltSeed * 30);
  const driftY = Math.round(9 + floatSeed * 5);
  const driftX = Math.max(2, decoration.driftX || Math.round(2 + sizeSeed * 2));
  const rotateOffset = Math.round(5 + tiltSeed * 5);
  const microScale = Number((1.03 + floatSeed * 0.03).toFixed(3));

  return {
    ...decoration,
    size: `clamp(${mobileWidth}px, ${fluidWidth}vw, ${desktopWidth}px)`,
    baseRotation,
    animation: {
      animate: {
        y: [-driftY, driftY, -driftY],
        x: [-driftX, driftX, -driftX],
        rotate: [-rotateOffset * 0.55, rotateOffset, -rotateOffset * 0.55],
        scale: [1, microScale, 1],
      },
      transition: {
        duration: decoration.duration,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay: decoration.delay,
      },
    },
  };
});

export default function HeroSection() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const heroTypingLabel = t('hero.headline_ar');

  const whatsappUrl = buildWhatsAppUrl(data?.whatsapp_number, t('whatsapp.generic'));
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 48, damping: 18, mass: 0.45 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 48, damping: 18, mass: 0.45 });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (shouldReduceMotion || event.pointerType === 'touch') {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const nextX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const nextY = (event.clientY - bounds.top) / bounds.height - 0.5;

      pointerX.set(nextX);
      pointerY.set(nextY);
    },
    [pointerX, pointerY, shouldReduceMotion],
  );

  const resetMouseInteraction = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const scrollToCountries = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    smoothScrollToElement('country-selector', { offset: 88, duration: 760 });
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetMouseInteraction}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          theme === 'dark' ? 'hero-gradient-dark' : 'hero-gradient-light'
        }`}
      />

      <motion.div
        animate={
          shouldReduceMotion ? undefined : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-[15%] top-[10%] h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px] will-change-transform"
      />
      <motion.div
        animate={
          shouldReduceMotion ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px] will-change-transform"
      />
      <motion.div
        animate={
          shouldReduceMotion ? undefined : { scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px] will-change-transform"
      />

      {floatingDecorations.map((decoration) => (
        <HeroDecorativeIcon
          key={decoration.src}
          src={decoration.src}
          positionClassName={decoration.positionClassName}
          size={decoration.size}
          baseRotation={decoration.baseRotation}
          xFactor={decoration.xFactor}
          yFactor={decoration.yFactor}
          animation={decoration.animation}
          parallaxX={smoothPointerX}
          parallaxY={smoothPointerY}
          shouldReduceMotion={shouldReduceMotion}
          theme={theme}
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <div className="relative container mx-auto px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          dir="ltr"
          lang="en"
          className="mb-4 font-body text-lg font-semibold text-primary"
        >
          <TypingText text={heroTypingLabel} shouldReduceMotion={shouldReduceMotion} />
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl whitespace-pre-line font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-7xl"
        >
          {t('hero.headline')}
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-lg text-muted-foreground sm:text-xl"
        >
          {t('hero.subheadline')}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 backdrop-blur-sm"
        >
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-semibold text-primary">{t('hero.badge')}</span>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={scrollToCountries}
            className="inline-flex items-center gap-2 rounded-button bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all gold-glow hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            {t('hero.cta_home')}
            <ArrowRight size={18} />
          </button>
          <Link
            to="/transfer"
            className="inline-flex items-center gap-2 rounded-button border border-border bg-card px-8 py-4 text-base font-semibold text-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-secondary hover:shadow-md active:scale-[0.98]"
          >
            {t('hero.cta_transfer')}
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-button px-6 py-4 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle size={18} />
            {t('hero.cta_whatsapp')}
          </a>
        </motion.div>

        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown size={24} className="text-muted-foreground" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
