#!/bin/sh -e
#
# 画像のパスと中心座標（123x456 形式）を与えると、丸をつけた新しい画像を生成して、
# 生成した画像のパスを返す


# 丸の色
color=${COLOR:=red}
# 丸の半径が長辺の何分の1か
circle_factor=${CIRCLE_FACTOR:=16}
# 円周の線が半径の何分の1か
stroke_factor=${STROKE_FACTOR:=6}


if [ $# -ne 2 ]; then
  echo "Usage: $0 IMAGE_PATH TARGET_COORDINATE" >&2
  exit 1
fi

image_path=$1
target_coordinate=$2

target_x=$(echo ${target_coordinate} | tr 'X' 'x' | cut -f 1 -d 'x')
target_y=$(echo ${target_coordinate} | tr 'X' 'x' | cut -f 2 -d 'x')

image_size=$(identify ${image_path} | cut -f 3 -d ' ')
image_x=$(echo ${image_size} | tr 'X' 'x' | cut -f 1 -d 'x')
image_y=$(echo ${image_size} | tr 'X' 'x' | cut -f 2 -d 'x')


if [ ${image_x} -gt ${image_y} ]; then
  circle_size=$(((${image_x} + ${circle_factor} - 1) / ${circle_factor}))
else
  circle_size=$(((${image_y} + ${circle_factor} - 1) / ${circle_factor}))
fi

boundary_x=$((${target_x} + ${circle_size}))
stroke_size=$(((${circle_size} + ${stroke_factor} - 1) / ${stroke_factor}))


file_ext=${image_path##*.}
path_prefix=${image_path%.${file_ext}}
suffix=0
while true; do
  output_image_path=${path_prefix}_${suffix}.${file_ext}
  if ! [ -e ${output_image_path} ]; then
    break
  fi
  suffix=$((${suffix} + 1))
done

convert ${image_path} \
        -fill none \
        -stroke ${color} \
        -strokewidth ${stroke_size} \
        -draw "circle ${target_x},${target_y} ${boundary_x},${target_y}" \
        ${output_image_path}

echo ${output_image_path}