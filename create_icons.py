#!/usr/bin/env python3
import base64
import os

# Minimal valid PNG files (solid colors)
# This is a 48x48 yellow square PNG
png_48_base64 = """
iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8yOC8yNK/PjXkAAAAcdEVYdFNv
ZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAAApklEQVRoge3XMQ6AIAxAUQZvwwl0dffe
hJu4OTg4aEJpU/6DGJeP/KQppQAAAAAAAADwFXOtBVxR5loLuKLMtRZwRZlrLeCKMtdawBVlrrWA
K8pcawFXlLnWAq4oc60FXFHmWgu4osy1FnBFmWst4Ioy11rAFWWutYArylxrAVeUudYCrihzrQVc
UeZaC7iizLUWcEWZay3gijLXWsAVZa61gCvKXGsBAAAAAPADL8rIEjE7ylE4AAAAAElFTkSuQmCC
""".strip()

# This is a 96x96 yellow square PNG (same pattern, different size)
png_96_base64 = """
iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNy8yOC8yNK/PjXkAAAAcdEVYdFNv
ZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAAAxElEQVR4nO3VQQqAIBRAwfvf3MFFLfwm
hLZqZhbvBwIKAAAAAAAAAAAAAPAVY+8FrGLsvYBVjL0XsIqx9wJWMfZewCrG3gtYxdh7AasYey9g
FWPvBaxi7L2AVYy9F7CKsfcCVjH2XsAqxt4LWMXYewGrGHsvYBVj7wWsYuy9gFWMvRewirH3AlYx
9l7AKsbeC1jF2HsBqxh7L2AVY+8FrGLsvYBVjL0XsIqx9wJWMfZewCrG3gtYxdh7AasYey9gFWPv
BaxiAAAAAPiBCy+CCzFRlnJVAAAAAElFTkSuQmCC
""".strip()

# Create icons directory
os.makedirs('icons', exist_ok=True)

# Decode and write the PNG files
with open('icons/icon-48.png', 'wb') as f:
    f.write(base64.b64decode(png_48_base64))
print('Created icons/icon-48.png')

with open('icons/icon-96.png', 'wb') as f:
    f.write(base64.b64decode(png_96_base64))
print('Created icons/icon-96.png')

print('Icon files created successfully!')
