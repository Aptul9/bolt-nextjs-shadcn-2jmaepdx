curl -X POST http://localhost:3000/api/supabase/access-logs \
  -H "Content-Type: application/json" \
  -d '{
    "accessKey": "662961d1-d56e-4ba0-af03-10c7daf7779b",
    "cardid": "abb72b6d-994b-4318-99ec-f2065bc0b016",
    "door": 0
  }' -k
