import config from "@/../tailwind.config.js";
import NextImage, { ImageProps } from "next/image";

const { theme } = config.theme.colors;

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="${theme[300]}" offset="20%" />
      <stop stop-color="${theme[200]}" offset="50%" />
      <stop stop-color="${theme[300]}" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${theme[300]}" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function Image(props: ImageProps) {
  const { src, width, height, ...rest } = props;
  return (
    <NextImage
      src={src}
      width={width}
      height={height}
      placeholder={`data:image/svg+xml;base64,${toBase64(
        shimmer(width as number, height as number),
      )}`}
      {...rest}
    />
  );
}
