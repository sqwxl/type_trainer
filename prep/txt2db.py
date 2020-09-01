#f = open("dict_english", "a")
import json
import re

j = []

with open("eff_large_wordlist.txt") as dict:
  for line in dict:
    match = re.search(r"[a-z]+", line)
    j.append(match.group())


with open("english_words_array.json", 'w') as file:
  json.dump(j, file)
