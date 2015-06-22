
set -e

i=0
tests=''
browsers=(chrome firefox safari ie:11 ie:10 ie:9 ie:8)
index=${CIRCLE_NODE_INDEX:-0}
total=${CIRCLE_NODE_TOTAL:-7}

for name in ${browsers[@]}; do
  if [ $(($i % $total)) -eq $index ]; then
    tests+=&& (BROWSER=$name make test-sauce)
  fi
  ((i+=1))
done

${tests}