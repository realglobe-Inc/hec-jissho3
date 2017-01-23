#!/bin/sh
#
# VM の CPU とメモリ使用状況を監視する

cd `dirname $0`/..
mkdir -p var/log
vmstat -n 3 | gawk '{ print strftime("%Y/%m/%d %H:%M:%S"), $0 } { fflush() }' >> var/log/vmstat.log