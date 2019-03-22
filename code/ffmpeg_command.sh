ffmpeg -framerate 15 -f image2 -i frames/LaplacianOnCube.%04d.png -c:v libvpx-vp9 -crf 31 -b:v 0 -pix_fmt yuva420p LaplacianOnCube.webm

ffmpeg -framerate 15 -f image2 -i frames/LaplacianOnCube.%04d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p LaplacianOnCube.mp4
