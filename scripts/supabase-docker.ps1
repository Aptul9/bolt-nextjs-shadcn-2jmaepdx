#pull repo
git clone --filter=blob:none --no-checkout https://github.com/supabase/supabase.git supabase-docker
cd supabase-docker
git sparse-checkout set --cone
git checkout master
git sparse-checkout set docker

#update
cd supabase-docker
git fetch origin master
git sparse-checkout reapply
git checkout master