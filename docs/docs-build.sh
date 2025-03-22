make clean
make html
cd _build/html
aws s3 sync . s3://docs.triage-ai.com --delete
aws cloudfront create-invalidation --distribution-id E20RQ0RIMD324U --paths "/*"