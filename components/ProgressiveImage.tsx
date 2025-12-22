"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  sizes?: string;
  quality?: number;
  transparent?: boolean;
}

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  objectFit = "cover",
  objectPosition = "center",
  sizes,
  quality = 85,
  transparent = false,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Simple shimmer placeholder
  const shimmerDataURL =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2ZlY2RkMyIvPjwvc3ZnPg==";

  // ✅ FIX: Proper wrapper for fill prop
  if (fill) {
    return (
      <>
        {/* Loading State */}
        <AnimatePresence>
          {isLoading && !hasError && !transparent && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-[5] bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50 animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* Main Image */}
        {!hasError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              quality={quality}
              placeholder={transparent ? "empty" : "blur"}
              blurDataURL={transparent ? undefined : shimmerDataURL}
              sizes={sizes || "100vw"}
              className={className}
              style={{
                objectFit: objectFit,
                objectPosition: objectPosition,
              }}
              onLoad={() => {
                console.log("✅ Image loaded:", src);
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error("❌ Image error:", src, e);
                setIsLoading(false);
                setHasError(true);
              }}
            />
          </motion.div>
        ) : (
          /* Error State */
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
            <div className="text-center text-rose-400 p-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <p className="text-sm font-medium">Failed to load</p>
              <p className="text-xs text-rose-300 mt-1 break-all">{src}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // ✅ Non-fill images (with width/height)
  return (
    <div className="relative inline-block">
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && !hasError && !transparent && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50 animate-pulse rounded-inherit"
          />
        )}
      </AnimatePresence>

      {/* Main Image */}
      {!hasError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            quality={quality}
            placeholder={transparent ? "empty" : "blur"}
            blurDataURL={transparent ? undefined : shimmerDataURL}
            sizes={sizes}
            className={className}
            onLoad={() => {
              console.log("✅ Image loaded:", src);
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("❌ Image error:", src, e);
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </motion.div>
      ) : (
        /* Error State */
        <div
          className="bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-center text-rose-400 p-4">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <p className="text-xs font-medium">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}
