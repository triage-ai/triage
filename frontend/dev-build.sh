cd build
npm run build:env
aws s3 sync . s3://dev.triage-ai.com --delete
aws cloudfront create-invalidation --distribution-id E3RRVLRPNEGPGS --paths "/*"