#pull repo
git clone --filter=blob:none --no-checkout https://github.com/supabase/supabase.git other/supabase-docker
cd other/supabase-docker
git sparse-checkout set --cone
git checkout master
git sparse-checkout set docker

#update
cd other/supabase-docker
git fetch origin master
git sparse-checkout reapply
git checkout master