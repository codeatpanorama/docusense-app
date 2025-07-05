FROM steebchen/nginx-spa:stable

# Install envsubst utility
RUN apk add --no-cache gettext

# Copy the built app
COPY dist/ /app

# Copy env template
COPY env.js /app/env.js.template 

# Create entrypoint script properly
RUN printf '#!/bin/sh\nenvsubst < /app/env.js.template > /app/env.js\nnginx\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80
EXPOSE 443

CMD ["/docker-entrypoint.sh"]