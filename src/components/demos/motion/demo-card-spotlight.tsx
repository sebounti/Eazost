"use client";

import type { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import {
  CardSpotlightContent,
  CardSpotlightDescription,
  CardSpotlightHeading,
  CardSpotlightTitle,
  CardSpotlightTrigger,
} from "@/components/card-spotlight";

export default function CardSpotlightDemo() {
  return <CardSpotlight />;
}

function CardSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const MOTION_STYLES =
    "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100";

  return (
    <CardSpotlightTrigger onMouseMove={handleMouseMove}>
      <motion.div
        className={MOTION_STYLES}
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(220, 227, 230, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <CardSpotlightContent>
        <CardSpotlightHeading>My Property</CardSpotlightHeading>
        <CardSpotlightTitle>Hero</CardSpotlightTitle>
        <CardSpotlightDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit, facilis illum eum ullam
          nostrum atque quam.
        </CardSpotlightDescription>
      </CardSpotlightContent>
    </CardSpotlightTrigger>
  );
}
