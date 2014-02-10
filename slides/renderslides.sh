#!/bin/sh

FILENAME=three.pdf

convert -density 300x300 -resize 1024x576 $FILENAME slide-%03d.png

# Create the list of images

(
    echo -en "define([], function(){\n    return [\n        "
    ls -1b slide-*.png | sed 's/\(.*\)/"\1"/'  | paste -sd ","
    echo -e "    ];\n})"
) > ../src/Slides.js


