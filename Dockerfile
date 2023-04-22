FROM steebchen/nginx-spa:stable

COPY dist/ /app

EXPOSE 80
EXPOSE 443

CMD ["nginx"]