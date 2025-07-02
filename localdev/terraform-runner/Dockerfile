FROM hashicorp/terraform
RUN apk add --no-cache python3 py3-pip curl unzip jq
COPY requirements.txt /tmp/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt \
    && rm /tmp/requirements.txt
ENV PATH="/opt/venv/bin:$PATH"
WORKDIR /workspace
CMD ["--help"]