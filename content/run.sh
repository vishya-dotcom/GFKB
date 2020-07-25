# GFKB website update for v2.6
# - remove extra pages that are not used
# - add notes pages for GFKB v2.6 and HGDB v2.6
# - add sym links for GFKB v2.6 and HGDB v2.6

rm /hive/prd/html/gfkb/content/page.abt.html
rm /hive/prd/html/gfkb/content/page.info.html
rm /hive/prd/html/gfkb/content/page.tutorials.html
cp /hive/tst/html/gfkb/content/* /hive/prd/html/gfkb/content/.
ln -s /hive/prd/html/gfkb/content/HumanGutDB-v2.6.fasta /hive/net3/Knowledgebases/Gut_Feeling_KB/HumanGutDB-v2.6.fasta
ln -s /hive/prd/html/gfkb/content/HumanGutDB-v2.6.fasta /hive/net3/Knowledgebases/Gut_Feeling_KB/GutFeelingKnowledgeBase-v2.6.csv
