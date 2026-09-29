/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GrainGradient } from "@paper-design/shaders-react"

export function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full">
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack="hsl(244, 45%, 4%)"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={["hsl(245, 85%, 65%)", "hsl(260, 85%, 70%)", "hsl(220, 85%, 60%)"]}
      />
    </div>
  )
}
