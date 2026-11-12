# Lleva el dulce de leche (que en las tomas sale verdoso/amarillo) a color caramelo, sin tocar el resto.
import sys, numpy as np
from PIL import Image
def caramelo(src, dst, tono=27, fuerza=1.0, osc=0.88, sat=1.15):
    im = Image.open(src).convert('HSV'); a = np.asarray(im).astype(np.float32)
    h, s, v = a[...,0]*360/255, a[...,1]/255, a[...,2]/255
    # máscara suave: tonos amarillo-oliva (32°-75°) con saturación media/alta
    mh = np.clip(1 - np.abs(h - 52) / 26, 0, 1) ** 0.6
    ms = np.clip((s - 0.18) / 0.2, 0, 1)
    m = mh * ms * fuerza
    h2 = h + (tono - h) * m
    s2 = np.clip(s * (1 + (sat - 1) * m), 0, 1)
    v2 = v * (1 - (1 - osc) * m)
    out = np.stack([h2*255/360, s2*255, v2*255], -1).clip(0,255).astype(np.uint8)
    Image.fromarray(out, 'HSV').convert('RGB').save(dst)
if __name__ == '__main__':
    caramelo(sys.argv[1], sys.argv[2], *map(float, sys.argv[3:]))
