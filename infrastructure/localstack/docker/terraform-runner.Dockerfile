FROM hashicorp/terraform

RUN apk add --no-cache python3 py3-pip curl unzip \
 && python3 -m ensurepip \
 && pip3 install --no-cache-dir --upgrade pip

COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt \
 && rm /tmp/requirements.txt

WORKDIR /workspace

ENTRYPOINT ["sh", "-c", "exec tflocal \"$@\"", "--"]
CMD ["--help"]
