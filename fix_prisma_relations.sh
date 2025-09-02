#!/usr/bin/env bash
set -euo pipefail
SCHEMA="prisma/schema.prisma"

# 0) Backup
cp "$SCHEMA" "prisma/schema.prisma.bak.$(date +%s)"

# 1) Удаляем случайные кавычки/точки в строках notes/reports внутри модели User
#    - убираем любую кавычку после [] 
#    - чиним комментарий у notes
perl -0777 -pe '
  # normalize spaces
  s/\r\n/\n/g;

  # remove stray quotes after [] for notes/reports
  s/(\bnotes\s+BlackBoxNote\[\])["\.]+/$1/g;
  s/(\breports\s+Report\[\])["\.]+/$1/g;

  # optional: fix comment quote in notes line if осталось
  s/(back relation for BlackBoxNote\.user)"\./$1./g;
  s/(back relation for BlackBoxNote\.user)"$/$1/g;
' -i "$SCHEMA"

# 2) Проверим/добавим объявления полей, если вдруг их нет
if ! grep -qE '^\s*notes\s+BlackBoxNote\[\]' "$SCHEMA"; then
  # Вставим в конец модели User перед закрывающей скобкой
  perl -0777 -pe '
    s/(model\s+User\s*\{[\s\S]*?)(\n\})/$1\n  notes         BlackBoxNote[]\n$2/;
  ' -i "$SCHEMA"
fi

if ! grep -qE '^\s*reports\s+Report\[\]' "$SCHEMA"; then
  perl -0777 -pe '
    s/(model\s+User\s*\{[\s\S]*?)(\n\})/$1\n  reports       Report[]\n$2/;
  ' -i "$SCHEMA"
fi

echo "✓ schema cleaned: prisma/schema.prisma"

# 3) prisma format / generate / db push (для dev/SQLite)
npx prisma format
npx prisma generate
npx prisma db push

echo "✓ prisma db pushed"
