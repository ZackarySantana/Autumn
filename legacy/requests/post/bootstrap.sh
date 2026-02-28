curl -X PUT -H "Content-Type: application/json" -H "Authorization: Basic key" -d '{
   "owner": "evergreen-ci",
   "repo": "evergreen",
   "branch": "dev",
   "prs": 1
 }' http://localhost:4321/api/bootstrap
