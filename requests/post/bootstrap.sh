curl -X PUT -H "Content-Type: application/json" \
     -d '{
       "owner": "evergreen-ci",
       "repo": "evergreen",
       "branch": "main",
       "prs": 50
     }' \
     http://localhost:4321/api/bootstrap