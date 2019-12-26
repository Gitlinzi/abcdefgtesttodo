#!/bin/sh

#version file name
fileName="version.html"

#read custom file name
if [ -n "$1" ];then
        fileName="$1"
fi

info="git branch: $GIT_BRANCH \ngit url: $GIT_URL \nbuild url: $BUILD_URL \nbuild id: $BUILD_ID \n"

echo "============= SAVE VERSION INFO =============="
echo -e $info > $fileName
cat $fileName
