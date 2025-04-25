FROM python:latest

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \ 
    build-essential \
    libpq-dev \ 
    && rm -rf /var/lib/apt/lists/*

WORKDIR /project

COPY requirements.txt .

RUN pip install update pip

#RUN pip install reportlab=3.6.8

RUN set -eux; \
    while IFS= read -r pkg; do \
      if [ -z "$pkg" ] || echo "$pkg" | grep -qE '^\s*#'; then \
        continue; \
      fi; \
      pip install --no-cache-dir "$pkg" || echo "Skipping $pkg"; \
    done < requirements.txt

COPY . . 



EXPOSE 8000

CMD [ "gunicorn", "LicenseRenew.wsgi:application", "0.0.0.0:8000" ]
